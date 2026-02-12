using AuthSystem.Core.Common;
using AuthSystem.Core.Entities;
using AuthSystem.Infrastructure.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace AuthSystem.Infrastructure.Identity;

/// <summary>
/// Seeds a default admin user if none exists.
/// </summary>
public static class DataSeed
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<ApplicationDbContext>>();
        
        // Ensure database is created
        await context.Database.EnsureCreatedAsync();
        
        // Seed admin user if none exists
        if (!context.Users.Any(u => u.Role == AppRoles.Admin))
        {
            var adminUser = new User
            {
                Email = "admin@authsystem.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                FirstName = "System",
                LastName = "Admin",
                Role = AppRoles.Admin
            };
            
            context.Users.Add(adminUser);
            await context.SaveChangesAsync();
            
            logger.LogInformation("Seeded default admin user: {Email}", adminUser.Email);
        }
    }
}
