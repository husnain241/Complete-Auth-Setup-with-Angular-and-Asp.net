using AuthSystem.Core.Common;
using AuthSystem.Core.Entities;

namespace AuthSystem.Core.Interfaces;

/// <summary>
/// Authentication result with user details.
/// </summary>
public record AuthResult(
    AuthResultType Result,
    ApplicationUser? User = null,
    IEnumerable<string>? Roles = null,
    string? ErrorMessage = null
);

/// <summary>
/// Interface for authentication operations.
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Authenticates a user with email and password.
    /// </summary>
    /// <param name="email">The user's email.</param>
    /// <param name="password">The user's password.</param>
    /// <returns>Authentication result.</returns>
    Task<AuthResult> LoginAsync(string email, string password);
    
    /// <summary>
    /// Registers a new user.
    /// </summary>
    /// <param name="email">The user's email.</param>
    /// <param name="password">The user's password.</param>
    /// <param name="firstName">The user's first name.</param>
    /// <param name="lastName">The user's last name.</param>
    /// <returns>Authentication result.</returns>
    Task<AuthResult> RegisterAsync(string email, string password, string? firstName = null, string? lastName = null);
    
    /// <summary>
    /// Gets a user by ID.
    /// </summary>
    /// <param name="userId">The user ID.</param>
    /// <returns>The user if found, null otherwise.</returns>
    Task<ApplicationUser?> GetUserByIdAsync(string userId);
    
    /// <summary>
    /// Gets user roles.
    /// </summary>
    /// <param name="user">The user.</param>
    /// <returns>List of role names.</returns>
    Task<IEnumerable<string>> GetUserRolesAsync(ApplicationUser user);
}
