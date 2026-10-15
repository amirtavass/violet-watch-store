using Microsoft.EntityFrameworkCore;
using Violet.Api.Models;

namespace Violet.Api.Data;

public class VioletDbContext(DbContextOptions<VioletDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<AdminUser> Admins => Set<AdminUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(e =>
        {
            e.ToTable("Products");
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(100).IsRequired();
            e.Property(x => x.Case).HasColumnName("CaseSpec").HasMaxLength(255).IsRequired();
            e.Property(x => x.Strap).HasMaxLength(255).IsRequired();
            e.Property(x => x.Glasp).HasMaxLength(255).IsRequired();
            e.Property(x => x.PicUrl).HasMaxLength(255).IsRequired();
            e.Property(x => x.Gender).HasMaxLength(10).IsRequired();
        });

        modelBuilder.Entity<AdminUser>(e =>
        {
            e.ToTable("Admins");
            e.HasKey(x => x.Username);
            e.Property(x => x.Username).HasMaxLength(50);
            e.Property(x => x.PasswordHash).HasMaxLength(255).IsRequired();
        });
    }
}
