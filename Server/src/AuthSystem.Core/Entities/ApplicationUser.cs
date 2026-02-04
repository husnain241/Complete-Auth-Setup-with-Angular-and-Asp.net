using Microsoft.AspNetCore.Identity;

namespace AuthSystem.Core.Entities;

/// <summary>
/// Application user extending ASP.NET Core Identity user.
/// </summary>
public class ApplicationUser : IdentityUser
{
    /// <summary>
    /// User's first name.
    /// </summary>
    public string? FirstName { get; set; }
    
    /// <summary>
    /// User's last name.
    /// </summary>
    public string? LastName { get; set; }
    
    /// <summary>
    /// Date and time when the user was created.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Date and time when the user was last updated.
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
    
    /// <summary>
    /// Navigation property for refresh tokens.
    /// </summary>
    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
}
