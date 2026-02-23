using AuthSystem.API.DTOs;
using AuthSystem.API.Hubs;
using AuthSystem.Core.Common;
using AuthSystem.Core.Entities;
using AuthSystem.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AuthSystem.API.Controllers;

/// <summary>
/// Authentication controller — all auth logic lives here, no abstraction layers.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthController> _logger;
    private readonly IHubContext<NotificationHub> _hubContext;

    public AuthController(
        ApplicationDbContext context,
        IConfiguration configuration,
        ILogger<AuthController> logger,
        IHubContext<NotificationHub> hubContext
        )
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
        _hubContext = hubContext;
    }
    
    /// <summary>
    /// Authenticates a user and returns a JWT access token.
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);
        
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            _logger.LogWarning("Failed login attempt for: {Email}", request.Email);
            return Problem(
                detail: "Invalid email or password.",
                statusCode: StatusCodes.Status401Unauthorized,
                title: "Authentication Failed"
            );
        }
        
        var token = GenerateJwt(user);
        var expiry = DateTime.UtcNow.AddMinutes(AuthConstants.AccessTokenExpiryMinutes);
        
        _logger.LogInformation("User logged in: {Email}", request.Email);
        
        return Ok(new AuthResponseDto(
            token,
            expiry,
            new UserDto(user.Id, user.Email, user.FirstName, user.LastName, user.Role)
        ));
    }
    
    /// <summary>
    /// Registers a new user.
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return Problem(
                detail: "A user with this email already exists.",
                statusCode: StatusCodes.Status400BadRequest,
                title: "Registration Failed"
            );
        }
        
        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Role = AppRoles.User
        };
        
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        
        var token = GenerateJwt(user);
        var expiry = DateTime.UtcNow.AddMinutes(AuthConstants.AccessTokenExpiryMinutes);
        
        _logger.LogInformation("User registered: {Email}", request.Email);

        // Tamam connected clients (Admins) ko notify karein
        // Register method ke andar jahan SignalR call hai:
        await _hubContext.Clients.All.SendAsync("UpdateUserStats", new
        {
            message = $"New user {user.FirstName} registered",
            email = user.Email,
            type = "register",
            time = "Just now"
        });
        return CreatedAtAction(nameof(Register), new AuthResponseDto(
            token,
            expiry,
            new UserDto(user.Id, user.Email, user.FirstName, user.LastName, user.Role)
        ));
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
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst("sub")?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }
        
        var user = await _context.Users.FindAsync(userId);
        if (user is null)
        {
            return NotFound();
        }
        
        return Ok(new UserDto(user.Id, user.Email, user.FirstName, user.LastName, user.Role));
    }
    
    /// <summary>
    /// Logout — client clears localStorage. Server just acknowledges.
    /// </summary>
    [Authorize]
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public IActionResult Logout()
    {
        return NoContent();
    }
    
    /// <summary>
    /// Generates a JWT access token for the given user.
    /// </summary>
    private string GenerateJwt(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] 
            ?? throw new InvalidOperationException("JWT SecretKey is not configured");
        
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var claims = new List<Claim>
        {
            // Yeh line SignalR presence tracking ke liye sab se zaroori hai
new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
new(JwtRegisteredClaimNames.Email, user.Email),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new("firstName", user.FirstName ?? ""),
            new("lastName", user.LastName ?? ""),
            new(ClaimTypes.Role, user.Role)
        };
        
        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(AuthConstants.AccessTokenExpiryMinutes),
            signingCredentials: credentials
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
