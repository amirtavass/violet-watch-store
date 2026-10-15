using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Violet.Api.Models;

namespace Violet.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(VioletDbContext db, IWebHostEnvironment env)
    {
        if (!await db.Admins.AnyAsync())
        {
            var hasher = new PasswordHasher<AdminUser>();
            var admin = new AdminUser { Username = "admin" };
            admin.PasswordHash = hasher.HashPassword(admin, "123");
            db.Admins.Add(admin);
            await db.SaveChangesAsync();
        }

        if (await db.Products.AnyAsync())
            return;

        var seedPath = Path.Combine(env.ContentRootPath, "seed", "products.json");
        if (!File.Exists(seedPath))
            return;

        var products = JsonSerializer.Deserialize<List<Product>>(await File.ReadAllTextAsync(seedPath), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        if (products is { Count: > 0 })
        {
            db.Products.AddRange(products);
            await db.SaveChangesAsync();
        }
    }
}
