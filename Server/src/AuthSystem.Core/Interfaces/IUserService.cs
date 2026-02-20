using AuthSystem.Core.Entities;
using AuthSystem.Core.Models;

namespace AuthSystem.Core.Interfaces;

public interface IUserService
{
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task<User?> GetUserByIdAsync(int id);
    Task<bool> UpdateUserRoleAsync(int id, string newRole);
    Task<bool> DeleteUserAsync(int id);
    Task<User?> CreateUserAsync(CreateUserModel model);
    Task<bool> UpdateUserAsync(int id, UpdateUserModel model);
}