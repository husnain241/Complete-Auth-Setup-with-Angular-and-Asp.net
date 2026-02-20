using System.ComponentModel.DataAnnotations;

namespace AuthSystem.Core.Models;

/// <summary>Create user model passed from service layer.</summary>
public record CreateUserModel(string Email, string Password, string? FirstName, string? LastName, string Role);

/// <summary>Update user model passed from service layer.</summary>
public record UpdateUserModel(string? FirstName, string? LastName, string Role);
