using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AuthSystem.Core.Common;
using AuthSystem.Core.Entities;
using AuthSystem.Core.Interfaces;
using AuthSystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace AuthSystem.Infrastructure.Services;

/// <summary>
/// Service for generating and validating JWT and refresh tokens.
/// </summary>
public class TokenService : ITokenService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    
    public TokenService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }
    
    /// <inheritdoc />
    public async Task<TokenResult> GenerateTokensAsync(
        ApplicationUser user, 
        IEnumerable<string> roles, 
        string? ipAddress)
    {
        var accessToken = GenerateAccessToken(user, roles);
        var refreshToken = await CreateRefreshTokenAsync(user.Id, ipAddress);
        
        return new TokenResult(
            accessToken,
            DateTime.UtcNow.AddMinutes(AuthConstants.AccessTokenExpiryMinutes),
            refreshToken
        );
    }
    
    /// <inheritdoc />
    public async Task<TokenResult?> RefreshTokenAsync(string token, string? ipAddress)
    {
        var refreshToken = await _context.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.Token == token);
        
        if (refreshToken is null || !refreshToken.IsActive || refreshToken.User is null)
        {
            return null;
        }
        
        // Rotate refresh token
        var newRefreshToken = await RotateRefreshTokenAsync(refreshToken, ipAddress);
        
        // Get user roles
        var userRoles = await _context.UserRoles
            .Where(ur => ur.UserId == refreshToken.UserId)
            .Join(_context.Roles, ur => ur.RoleId, r => r.Id, (ur, r) => r.Name!)
            .ToListAsync();
        
        var accessToken = GenerateAccessToken(refreshToken.User, userRoles);
        
        return new TokenResult(
            accessToken,
            DateTime.UtcNow.AddMinutes(AuthConstants.AccessTokenExpiryMinutes),
            newRefreshToken
        );
    }
    
    /// <inheritdoc />
    public async Task RevokeTokenAsync(string token, string? ipAddress, string? reason = null)
    {
        var refreshToken = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == token);
        
        if (refreshToken is null || !refreshToken.IsActive)
        {
            return;
        }
        
        refreshToken.RevokedAt = DateTime.UtcNow;
        refreshToken.RevokedByIp = ipAddress;
        refreshToken.RevokedReason = reason ?? "Revoked by user";
        
        await _context.SaveChangesAsync();
    }
    
    /// <inheritdoc />
    public async Task RevokeAllUserTokensAsync(string userId, string? ipAddress, string? reason = null)
    {
        var activeTokens = await _context.RefreshTokens
            .Where(rt => rt.UserId == userId && rt.RevokedAt == null && rt.ExpiresAt > DateTime.UtcNow)
            .ToListAsync();
        
        foreach (var token in activeTokens)
        {
            token.RevokedAt = DateTime.UtcNow;
            token.RevokedByIp = ipAddress;
            token.RevokedReason = reason ?? "Revoked all tokens";
        }
        
        await _context.SaveChangesAsync();
    }
    
    private string GenerateAccessToken(ApplicationUser user, IEnumerable<string> roles)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] 
            ?? throw new InvalidOperationException("JWT SecretKey is not configured");
        
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new("firstName", user.FirstName ?? ""),
            new("lastName", user.LastName ?? "")
        };
        
        // Add role claims
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        
        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(AuthConstants.AccessTokenExpiryMinutes),
            signingCredentials: credentials
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
    
    private async Task<RefreshToken> CreateRefreshTokenAsync(string userId, string? ipAddress)
    {
        var refreshToken = new RefreshToken
        {
            Token = GenerateSecureToken(),
            UserId = userId,
            ExpiresAt = DateTime.UtcNow.AddDays(AuthConstants.RefreshTokenExpiryDays),
            CreatedByIp = ipAddress
        };
        
        _context.RefreshTokens.Add(refreshToken);
        await _context.SaveChangesAsync();
        
        return refreshToken;
    }
    
    private async Task<RefreshToken> RotateRefreshTokenAsync(RefreshToken oldToken, string? ipAddress)
    {
        var newToken = new RefreshToken
        {
            Token = GenerateSecureToken(),
            UserId = oldToken.UserId,
            ExpiresAt = DateTime.UtcNow.AddDays(AuthConstants.RefreshTokenExpiryDays),
            CreatedByIp = ipAddress
        };
        
        // Revoke old token
        oldToken.RevokedAt = DateTime.UtcNow;
        oldToken.RevokedByIp = ipAddress;
        oldToken.RevokedReason = "Rotated";
        oldToken.ReplacedByToken = newToken.Token;
        
        _context.RefreshTokens.Add(newToken);
        await _context.SaveChangesAsync();
        
        return newToken;
    }
    
    private static string GenerateSecureToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }
}
