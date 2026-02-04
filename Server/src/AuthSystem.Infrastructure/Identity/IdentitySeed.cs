using AuthSystem.Core.Common;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace AuthSystem.Infrastructure.Identity;

/// <summary>
/// Seeds default roles and admin user.
/// </summary>
public static class IdentitySeed
{
    /// <summary>
    /// Seeds roles and optionally an admin user.
    /// </summary>
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<RoleManager<IdentityRole>>>();
        
        foreach (var role in AppRoles.AllRoles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                var result = await roleManager.CreateAsync(new IdentityRole(role));
                if (result.Succeeded)
                {
                    logger.LogInformation("Created role: {Role}", role);
                }
                else
                {
                    logger.LogError("Failed to create role {Role}: {Errors}", 
                        role, 
                        string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
        }
    }
}
