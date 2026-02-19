// AuthSystem.Core/Services/UserService.cs
using AuthSystem.Core.Entities;
using AuthSystem.Core.Interfaces;

namespace AuthSystem.Core.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        return await _userRepository.GetAllAsync();
    }

    public async Task<User?> GetUserByIdAsync(int id)
    {
        return await _userRepository.GetByIdAsync(id);
    }

    public async Task<bool> UpdateUserRoleAsync(int userId, string newRole)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return false;

        user.Role = newRole;
        await _userRepository.UpdateAsync(user);
        return true;
    }
    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return false;
        // Assuming you have a method to delete a user in your repository
        await _userRepository.DeleteAsync(id);
        return true;
    }
}