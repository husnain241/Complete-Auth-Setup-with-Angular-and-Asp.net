using AuthSystem.Core.Entities;
using AuthSystem.Core.Interfaces;
using AuthSystem.Core.Models;

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

        await _userRepository.DeleteAsync(id);
        return true;
    }

    public async Task<User?> CreateUserAsync(CreateUserModel model)
    {
        var existing = await _userRepository.GetByEmailAsync(model.Email);
        if (existing != null) return null;

        var user = new User
        {
            Email = model.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
            FirstName = model.FirstName,
            LastName = model.LastName,
            Role = model.Role
        };

        await _userRepository.AddAsync(user);
        return user;
    }

    public async Task<bool> UpdateUserAsync(int id, UpdateUserModel model)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return false;

        user.FirstName = model.FirstName;
        user.LastName = model.LastName;
        user.Role = model.Role;

        await _userRepository.UpdateAsync(user);
        return true;
    }
}