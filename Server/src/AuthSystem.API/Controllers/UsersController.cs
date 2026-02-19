using AuthSystem.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AuthSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
// [Authorize(Roles = "Admin")] // Uncomment this later to protect the route!
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);

        if (user == null)
            return NotFound(new { message = "User not found" });

        return Ok(user);
    }

    [HttpPut("{id}/role")]
    public async Task<IActionResult> UpdateRole(int id, [FromBody] string newRole)
    {
        var result = await _userService.UpdateUserRoleAsync(id, newRole);

        if (!result)
            return NotFound(new { message = "User not found or update failed" });

        return Ok(new { message = "Role updated successfully" });
    }
}