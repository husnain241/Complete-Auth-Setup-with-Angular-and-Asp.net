namespace AuthSystem.Core.Entities;

/// <summary>
/// Refresh token entity for JWT token rotation.
/// </summary>
public class RefreshToken
{
    public int Id { get; set; }
    
    /// <summary>
    /// The refresh token value (hashed for security).
    /// </summary>
    public required string Token { get; set; }
    
    /// <summary>
    /// Token expiry date and time.
    /// </summary>
    public DateTime ExpiresAt { get; set; }
    
    /// <summary>
    /// Date and time when the token was created.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// IP address from which the token was created.
    /// </summary>
    public string? CreatedByIp { get; set; }
    
    /// <summary>
    /// Date and time when the token was revoked.
    /// </summary>
    public DateTime? RevokedAt { get; set; }
    
    /// <summary>
    /// IP address from which the token was revoked.
    /// </summary>
    public string? RevokedByIp { get; set; }
    
    /// <summary>
    /// Replacement token if this token was rotated.
    /// </summary>
    public string? ReplacedByToken { get; set; }
    
    /// <summary>
    /// Reason for revocation.
    /// </summary>
    public string? RevokedReason { get; set; }
    
    /// <summary>
    /// Whether the token is expired.
    /// </summary>
    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    
    /// <summary>
    /// Whether the token is revoked.
    /// </summary>
    public bool IsRevoked => RevokedAt is not null;
    
    /// <summary>
    /// Whether the token is still active.
    /// </summary>
    public bool IsActive => !IsRevoked && !IsExpired;
    
    /// <summary>
    /// Foreign key to the user.
    /// </summary>
    public required string UserId { get; set; }
    
    /// <summary>
    /// Navigation property to the user.
    /// </summary>
    public ApplicationUser? User { get; set; }
}
