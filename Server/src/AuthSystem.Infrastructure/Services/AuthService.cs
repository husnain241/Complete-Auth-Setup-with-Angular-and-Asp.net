using AuthSystem.Core.Common;
using AuthSystem.Core.Entities;
using AuthSystem.Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace AuthSystem.Infrastructure.Services;

/// <summary>
/// Service for user authentication operations.
/// </summary>
public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ILogger<AuthService> _logger;
    
    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        ILogger<AuthService> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _logger = logger;
    }
    
    /// <inheritdoc />
    public async Task<AuthResult> LoginAsync(string email, string password)
    {
        var user = await _userManager.FindByEmailAsync(email);
        
        if (user is null)
        {
            _logger.LogWarning("Login attempt for non-existent user: {Email}", email);
            return new AuthResult(AuthResultType.InvalidCredentials, ErrorMessage: "Invalid email or password.");
        }
        
        if (await _userManager.IsLockedOutAsync(user))
        {
            _logger.LogWarning("Login attempt for locked out user: {Email}", email);
            return new AuthResult(AuthResultType.UserLockedOut, ErrorMessage: "Account is locked. Please try again later.");
        }
        
        var result = await _signInManager.CheckPasswordSignInAsync(user, password, lockoutOnFailure: true);
        
        if (!result.Succeeded)
        {
            _logger.LogWarning("Failed login attempt for user: {Email}", email);
            return new AuthResult(AuthResultType.InvalidCredentials, ErrorMessage: "Invalid email or password.");
        }
        
        var roles = await _userManager.GetRolesAsync(user);
        
        _logger.LogInformation("User logged in: {Email}", email);
        return new AuthResult(AuthResultType.Success, user, roles);
    }
    
    /// <inheritdoc />
    public async Task<AuthResult> RegisterAsync(
        string email, 
        string password, 
        string? firstName = null, 
        string? lastName = null)
    {
        var existingUser = await _userManager.FindByEmailAsync(email);
        if (existingUser is not null)
        {
            return new AuthResult(
                AuthResultType.UnknownError, 
                ErrorMessage: "A user with this email already exists.");
        }
        
        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            EmailConfirmed = true // For now, auto-confirm. In production, implement email verification.
        };
        
        var result = await _userManager.CreateAsync(user, password);
        
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            _logger.LogWarning("Failed to register user {Email}: {Errors}", email, errors);
            return new AuthResult(AuthResultType.UnknownError, ErrorMessage: errors);
        }
        
        // Assign default User role
        await _userManager.AddToRoleAsync(user, AppRoles.User);
        
        var roles = await _userManager.GetRolesAsync(user);
        
        _logger.LogInformation("User registered: {Email}", email);
        return new AuthResult(AuthResultType.Success, user, roles);
    }
    
    /// <inheritdoc />
    public async Task<ApplicationUser?> GetUserByIdAsync(string userId)
    {
        return await _userManager.FindByIdAsync(userId);
    }
    
    /// <inheritdoc />
    public async Task<IEnumerable<string>> GetUserRolesAsync(ApplicationUser user)
    {
        return await _userManager.GetRolesAsync(user);
    }
}
