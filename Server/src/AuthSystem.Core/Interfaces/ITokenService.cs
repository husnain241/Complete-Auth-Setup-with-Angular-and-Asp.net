using AuthSystem.Core.Entities;

namespace AuthSystem.Core.Interfaces;

/// <summary>
/// Token generation and validation result.
/// </summary>
public record TokenResult(
    string AccessToken,
    DateTime AccessTokenExpiry,
    RefreshToken RefreshToken
);

/// <summary>
/// Interface for JWT and refresh token operations.
/// </summary>
public interface ITokenService
{
    /// <summary>
    /// Generates a new JWT access token and refresh token for a user.
    /// </summary>
    /// <param name="user">The user to generate tokens for.</param>
    /// <param name="roles">The user's roles.</param>
    /// <param name="ipAddress">The IP address of the request.</param>
    /// <returns>Token result containing access and refresh tokens.</returns>
    Task<TokenResult> GenerateTokensAsync(ApplicationUser user, IEnumerable<string> roles, string? ipAddress);
    
    /// <summary>
    /// Validates and rotates a refresh token, issuing new tokens.
    /// </summary>
    /// <param name="token">The refresh token to validate.</param>
    /// <param name="ipAddress">The IP address of the request.</param>
    /// <returns>Token result if valid, null otherwise.</returns>
    Task<TokenResult?> RefreshTokenAsync(string token, string? ipAddress);
    
    /// <summary>
    /// Revokes a refresh token.
    /// </summary>
    /// <param name="token">The token to revoke.</param>
    /// <param name="ipAddress">The IP address of the request.</param>
    /// <param name="reason">The reason for revocation.</param>
    Task RevokeTokenAsync(string token, string? ipAddress, string? reason = null);
    
    /// <summary>
    /// Revokes all refresh tokens for a user.
    /// </summary>
    /// <param name="userId">The user ID.</param>
    /// <param name="ipAddress">The IP address of the request.</param>
    /// <param name="reason">The reason for revocation.</param>
    Task RevokeAllUserTokensAsync(string userId, string? ipAddress, string? reason = null);
}
