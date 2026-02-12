using AuthSystem.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuthSystem.Infrastructure.Data;

/// <summary>
/// Application database context — plain DbContext, no Identity.
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
        : base(options)
    {
    }
    
    /// <summary>
    /// Users table.
    /// </summary>
    public DbSet<User> Users => Set<User>();
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        builder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(256);
            
            entity.HasIndex(e => e.Email)
                .IsUnique();
            
            entity.Property(e => e.PasswordHash)
                .IsRequired();
            
            entity.Property(e => e.FirstName)
                .HasMaxLength(100);
            
            entity.Property(e => e.LastName)
                .HasMaxLength(100);
            
            entity.Property(e => e.Role)
                .IsRequired()
                .HasMaxLength(50);
        });
    }
}
