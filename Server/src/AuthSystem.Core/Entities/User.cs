namespace AuthSystem.Core.Entities;

/// <summary>
/// Simple user entity — no Identity framework dependency.
/// </summary>
public class User
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    public required string Email { get; set; }
    
    public required string PasswordHash { get; set; }
    
    public string? FirstName { get; set; }
    
    public string? LastName { get; set; }
    
    /// <summary>
    /// Single role string, e.g. "User" or "Admin".
    /// </summary>
    public string Role { get; set; } = "User";
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
