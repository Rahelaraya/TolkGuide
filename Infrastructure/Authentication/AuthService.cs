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

    public AuthService(UserDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public AuthService(UserDbContext context)
    {
        _context = context;
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
        // 1. Kolla om användarnamnet redan finns
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            return null;

        // 2. Skapa user-objekt
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Role = string.IsNullOrWhiteSpace(request.Role) ? "Customer" : request.Role
        };

        // 3. Hasha lösenordet
        var hasher = new PasswordHasher<User>();
        user.PasswordHash = hasher.HashPassword(user, request.Password);

        // 4. Spara användaren först (måste finnas innan vi kan sätta UserId i Customer/Interpreter)
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // 5. Skapa Customer eller Interpreter beroende på roll
        if (user.Role == "Customer")
        {
            var customer = new Customer
            {
                UserId = user.Id,
                Name = request.Username,              // tills du har mer detaljer
                ContactPerson = request.Username,
                PhoneNumber = "N/A",
                Email = "N/A",
                Address = "N/A"
            };

            _context.Customers.Add(customer);
        }
        else if (user.Role == "Interpreter")
        {
            var interpreter = new Interpreter
            {
                UserId = user.Id,
                FirstName = request.Username,         // tills du har FirstName/LastName i UserDto
                LastName = "N/A",
                PhoneNumber = "N/A",
                Email = "N/A",
                City = "N/A",
                IsActive = true
            };

            _context.Interpreters.Add(interpreter);
        }

        // 6. Spara kopplad profil
        await _context.SaveChangesAsync();

        return user;
    }

    // -------------------- REFRESH TOKEN --------------------
    public async Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken);

        if (user is null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            return null; // ogiltig eller utgången token

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

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role ?? "Customer")
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

