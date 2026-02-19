using AuthSystem.Core.Entities;

namespace AuthSystem.Core.Interfaces;

public interface IUserService
{
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task<User?> GetUserByIdAsync(int id);
    Task<bool> UpdateUserRoleAsync(int id, string newRole);
    Task<bool> DeleteUserAsync(int id);
}