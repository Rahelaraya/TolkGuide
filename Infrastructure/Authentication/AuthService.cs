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

    public async Task<User?> RegisterAsync(UserDto request)
    {
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            return null;

        var user = new User();
        var hasher = new PasswordHasher<User>();

        user.Username = request.Username;
        user.PasswordHash = hasher.HashPassword(user, request.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    // 🔹 IMPLEMENTATION AV RefreshTokensAsync
    public async Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request)
    {
        // hitta användare på refresh token
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.RefreshToken == request.RefreshToken);

        if (user is null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            return null; // ogiltig eller utgången token

        // generera nytt access + refresh token
        return await CreateTokenResponse(user);
    }

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
            new Claim(ClaimTypes.Name, user.Username)
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

