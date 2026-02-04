using AuthSystem.API.DTOs;
using AuthSystem.Core.Common;
using AuthSystem.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthSystem.API.Controllers;

/// <summary>
/// Authentication controller for login, registration, and token refresh.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ITokenService _tokenService;
    private readonly ILogger<AuthController> _logger;
    
    public AuthController(
        IAuthService authService,
        ITokenService tokenService,
        ILogger<AuthController> logger)
    {
        _authService = authService;
        _tokenService = tokenService;
        _logger = logger;
    }
    
    /// <summary>
    /// Authenticates a user and returns JWT access token.
    /// Refresh token is set in HttpOnly cookie.
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var authResult = await _authService.LoginAsync(request.Email, request.Password);
        
        if (authResult.Result != AuthResultType.Success || authResult.User is null)
        {
            return Problem(
                detail: authResult.ErrorMessage ?? "Authentication failed.",
                statusCode: StatusCodes.Status401Unauthorized,
                title: "Authentication Failed"
            );
        }
        
        var ipAddress = GetIpAddress();
        var tokenResult = await _tokenService.GenerateTokensAsync(
            authResult.User, 
            authResult.Roles ?? [], 
            ipAddress);
        
        SetRefreshTokenCookie(tokenResult.RefreshToken.Token, tokenResult.RefreshToken.ExpiresAt);
        
        var response = new AuthResponseDto(
            tokenResult.AccessToken,
            tokenResult.AccessTokenExpiry,
            new UserDto(
                authResult.User.Id,
                authResult.User.Email ?? "",
                authResult.User.FirstName,
                authResult.User.LastName,
                authResult.Roles ?? []
            )
        );
        
        return Ok(response);
    }
    
    /// <summary>
    /// Registers a new user.
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        var authResult = await _authService.RegisterAsync(
            request.Email, 
            request.Password, 
            request.FirstName, 
            request.LastName);
        
        if (authResult.Result != AuthResultType.Success || authResult.User is null)
        {
            return Problem(
                detail: authResult.ErrorMessage ?? "Registration failed.",
                statusCode: StatusCodes.Status400BadRequest,
                title: "Registration Failed"
            );
        }
        
        var ipAddress = GetIpAddress();
        var tokenResult = await _tokenService.GenerateTokensAsync(
            authResult.User, 
            authResult.Roles ?? [], 
            ipAddress);
        
        SetRefreshTokenCookie(tokenResult.RefreshToken.Token, tokenResult.RefreshToken.ExpiresAt);
        
        var response = new AuthResponseDto(
            tokenResult.AccessToken,
            tokenResult.AccessTokenExpiry,
            new UserDto(
                authResult.User.Id,
                authResult.User.Email ?? "",
                authResult.User.FirstName,
                authResult.User.LastName,
                authResult.Roles ?? []
            )
        );
        
        return CreatedAtAction(nameof(Register), response);
    }
    
    /// <summary>
    /// Refreshes the access token using the refresh token from cookie.
    /// </summary>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Refresh()
    {
        var refreshToken = Request.Cookies[AuthConstants.RefreshTokenCookieName];
        
        if (string.IsNullOrEmpty(refreshToken))
        {
            return Problem(
                detail: "Refresh token not found.",
                statusCode: StatusCodes.Status401Unauthorized,
                title: "Token Refresh Failed"
            );
        }
        
        var ipAddress = GetIpAddress();
        var tokenResult = await _tokenService.RefreshTokenAsync(refreshToken, ipAddress);
        
        if (tokenResult is null)
        {
            // Clear the invalid cookie
            Response.Cookies.Delete(AuthConstants.RefreshTokenCookieName);
            
            return Problem(
                detail: "Invalid or expired refresh token.",
                statusCode: StatusCodes.Status401Unauthorized,
                title: "Token Refresh Failed"
            );
        }
        
        // Get user info
        var user = await _authService.GetUserByIdAsync(tokenResult.RefreshToken.UserId);
        if (user is null)
        {
            return Problem(
                detail: "User not found.",
                statusCode: StatusCodes.Status401Unauthorized,
                title: "Token Refresh Failed"
            );
        }
        
        var roles = await _authService.GetUserRolesAsync(user);
        
        SetRefreshTokenCookie(tokenResult.RefreshToken.Token, tokenResult.RefreshToken.ExpiresAt);
        
        var response = new AuthResponseDto(
            tokenResult.AccessToken,
            tokenResult.AccessTokenExpiry,
            new UserDto(
                user.Id,
                user.Email ?? "",
                user.FirstName,
                user.LastName,
                roles
            )
        );
        
        return Ok(response);
    }
    
    /// <summary>
    /// Revokes the current refresh token (logout).
    /// </summary>
    [Authorize]
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Logout()
    {
        var refreshToken = Request.Cookies[AuthConstants.RefreshTokenCookieName];
        
        if (!string.IsNullOrEmpty(refreshToken))
        {
            var ipAddress = GetIpAddress();
            await _tokenService.RevokeTokenAsync(refreshToken, ipAddress, "User logout");
        }
        
        Response.Cookies.Delete(AuthConstants.RefreshTokenCookieName);
        
        return NoContent();
    }
    
    /// <summary>
    /// Gets the current user's information.
    /// </summary>
    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        var user = await _authService.GetUserByIdAsync(userId);
        if (user is null)
        {
            return NotFound();
        }
        
        var roles = await _authService.GetUserRolesAsync(user);
        
        return Ok(new UserDto(
            user.Id,
            user.Email ?? "",
            user.FirstName,
            user.LastName,
            roles
        ));
    }
    
    private void SetRefreshTokenCookie(string token, DateTime expires)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = expires
        };
        
        Response.Cookies.Append(AuthConstants.RefreshTokenCookieName, token, cookieOptions);
    }
    
    private string? GetIpAddress()
    {
        // Check for forwarded header first (behind proxy/load balancer)
        if (Request.Headers.TryGetValue("X-Forwarded-For", out var forwardedFor))
        {
            return forwardedFor.FirstOrDefault()?.Split(',').FirstOrDefault()?.Trim();
        }
        
        return HttpContext.Connection.RemoteIpAddress?.ToString();
    }
}
