using AuthSystem.Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace AuthSystem.Core.Interfaces
{
  
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByEmailAsync(string email);
        Task<IEnumerable<User>> GetAllAsync();
        Task UpdateAsync(User user);

        // You likely already have something handling user creation for your signup,
        // but we can include it here for completeness. 
        Task AddAsync(User user);

        Task DeleteAsync(int id);
    }
}
