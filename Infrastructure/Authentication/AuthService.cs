using Application.Dtos;
using Domain.Models;
using Infrastructure.Database;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Infrastructure.Authentication;

public class AuthService : IAuthService
{
    private readonly UserDbContext _context;
    private readonly IConfiguration _configuration;

    // ✅ Behåll bara EN constructor (så _configuration aldrig blir null)
    public AuthService(UserDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    // -------------------- LOGIN --------------------
    public async Task<TokenResponseDto?> LoginAsync(UserDto request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username);

        if (user is null)
            return null;

        var hasher = new PasswordHasher<User>();
        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

        if (result == PasswordVerificationResult.Failed)
            return null;

        return await CreateTokenResponse(user);
    }

    // -------------------- REGISTER --------------------
    public async Task<User?> RegisterAsync(UserDto request)
    {
        // 1) Kolla om användarnamnet redan finns
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            return null;

        // 2) Normalisera roll (och ta höjd för stavfel "Cusomer")
        var roleInput = (request.Role ?? "Customer").Trim();
        var normalizedRole =
            roleInput.Equals("Interpreter", StringComparison.OrdinalIgnoreCase) ? "Interpreter" :
            roleInput.Equals("Customer", StringComparison.OrdinalIgnoreCase) ? "Customer" :
            roleInput.Equals("Cusomer", StringComparison.OrdinalIgnoreCase) ? "Customer" : // ✅ temporärt stöd
            "Customer";

        // 3) Skapa user-objekt
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Role = normalizedRole
        };

        // 4) Hasha lösenordet
        var hasher = new PasswordHasher<User>();
        user.PasswordHash = hasher.HashPassword(user, request.Password);

        // 5) Spara user först
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // 6) Skapa profil beroende på roll (bara om den inte finns)
        if (normalizedRole == "Customer")
        {
            var exists = await _context.Customers.AnyAsync(c => c.UserId == user.Id);
            if (!exists)
            {
                _context.Customers.Add(new Customer
                {
                    UserId = user.Id,
                    Name = request.Username,
                    ContactPerson = request.Username,
                    PhoneNumber = "N/A",
                    Email = "N/A",
                    Address = "N/A"
                });
            }
        }
        else // Interpreter
        {
            var exists = await _context.Interpreters.AnyAsync(i => i.UserId == user.Id);
            if (!exists)
            {
                _context.Interpreters.Add(new Interpreter
                {
                    UserId = user.Id,
                    FirstName = request.Username,
                    LastName = "N/A",
                    PhoneNumber = "N/A",
                    Email = "N/A",
                    City = "N/A",
                    IsActive = true
                });
            }
        }

        await _context.SaveChangesAsync();
        return user;
    }

    // -------------------- REFRESH TOKEN --------------------
    public async Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken);

        if (user is null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            return null;

        return await CreateTokenResponse(user);
    }

    // -------------------- TOKEN-HJÄLPARE --------------------
    private async Task<TokenResponseDto> CreateTokenResponse(User user)
    {
        return new TokenResponseDto
        {
            AccessToken = CreateToken(user),
            RefreshToken = await GenerateAndSaveRefreshTokenAsync(user)
        };
    }

    private string CreateToken(User user)
    {
        var key = _configuration["AppSettings:Token"]
                  ?? throw new InvalidOperationException("AppSettings:Token saknas");

        var issuer = _configuration["AppSettings:Issuer"];
        var audience = _configuration["AppSettings:Audience"];

        // ✅ Se till att rollen aldrig blir fel i token
        var role = (user.Role ?? "Customer").Trim();
        if (role.Equals("Cusomer", StringComparison.OrdinalIgnoreCase)) role = "Customer";

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, role)
        };

        var creds = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(30),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task<string> GenerateAndSaveRefreshTokenAsync(User user)
    {
        var refreshToken = Guid.NewGuid().ToString("N");

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        await _context.SaveChangesAsync();
        return refreshToken;
    }
}
