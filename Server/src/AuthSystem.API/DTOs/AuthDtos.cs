using System.ComponentModel.DataAnnotations;

namespace AuthSystem.API.DTOs;

/// <summary>
/// Login request DTO.
/// </summary>
public record LoginRequestDto(
    [Required]
    [EmailAddress]
    string Email,
    
    [Required]
    [MinLength(8)]
    string Password
);

/// <summary>
/// Register request DTO.
/// </summary>
public record RegisterRequestDto(
    [Required]
    [EmailAddress]
    string Email,
    
    [Required]
    [MinLength(8)]
    string Password,
    
    [MaxLength(100)]
    string? FirstName,
    
    [MaxLength(100)]
    string? LastName
);

/// <summary>
/// Authentication response DTO.
/// </summary>
public record AuthResponseDto(
    string AccessToken,
    DateTime ExpiresAt,
    UserDto User
);

/// <summary>
/// User information DTO.
/// </summary>
public record UserDto(
    int Id,
    string Email,
    string? FirstName,
    string? LastName,
    string Role
);

/// <summary>
/// Create user request DTO (admin only).
/// </summary>
public record CreateUserDto(
    [Required]
    [EmailAddress]
    string Email,

    [Required]
    [MinLength(8)]
    string Password,

    [MaxLength(100)]
    string? FirstName,

    [MaxLength(100)]
    string? LastName,

    [Required]
    string Role
);

/// <summary>
/// Update user request DTO (admin only) — updates profile details and role.
/// </summary>
public record UpdateUserDto(
    [MaxLength(100)]
    string? FirstName,

    [MaxLength(100)]
    string? LastName,

    [Required]
    string Role
);
