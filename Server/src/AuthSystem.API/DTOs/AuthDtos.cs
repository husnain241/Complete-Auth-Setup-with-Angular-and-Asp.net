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
    string Id,
    string Email,
    string? FirstName,
    string? LastName,
    string Role
);
