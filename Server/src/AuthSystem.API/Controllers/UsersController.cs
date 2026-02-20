using AuthSystem.API.DTOs;
using AuthSystem.Core.Interfaces;
using AuthSystem.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace AuthSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
// [Authorize(Roles = "Admin")] // Uncomment in production to protect all user management routes
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>Gets all users.</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userService.GetAllUsersAsync();
        var dtos = users.Select(u => new UserDto(u.Id, u.Email, u.FirstName, u.LastName, u.Role));
        return Ok(dtos);
    }

    /// <summary>Gets a user by ID.</summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
            return NotFound(new { message = "User not found" });

        return Ok(new UserDto(user.Id, user.Email, user.FirstName, user.LastName, user.Role));
    }

    /// <summary>Creates a new user (Admin only).</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var model = new CreateUserModel(dto.Email, dto.Password, dto.FirstName, dto.LastName, dto.Role);
        var user = await _userService.CreateUserAsync(model);

        if (user == null)
            return Conflict(new { message = "A user with this email already exists." });

        return CreatedAtAction(nameof(GetById), new { id = user.Id },
            new UserDto(user.Id, user.Email, user.FirstName, user.LastName, user.Role));
    }

    /// <summary>Updates a user's profile details and role.</summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var model = new UpdateUserModel(dto.FirstName, dto.LastName, dto.Role);
        var result = await _userService.UpdateUserAsync(id, model);

        if (!result)
            return NotFound(new { message = "User not found or update failed" });

        return Ok(new { message = "User updated successfully" });
    }

    /// <summary>Updates a user's role only.</summary>
    [HttpPut("{id}/role")]
    public async Task<IActionResult> UpdateRole(int id, [FromBody] string newRole)
    {
        var result = await _userService.UpdateUserRoleAsync(id, newRole);
        if (!result)
            return NotFound(new { message = "User not found or update failed" });

        return Ok(new { message = "Role updated successfully" });
    }

    /// <summary>Deletes a user by ID.</summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _userService.DeleteUserAsync(id);
        if (!result)
            return NotFound(new { message = "User not found" });

        return Ok(new { message = "User deleted successfully" });
    }
}