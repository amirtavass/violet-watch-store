using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Violet.Api.Data;
using Violet.Api.Models;

namespace Violet.Api.Endpoints;

public static class ProductEndpoints
{
    private static readonly string[] AllowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    private const long MaxImageBytes = 5 * 1024 * 1024;

    public static void MapProductEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/products");

        group.MapGet("/", async (VioletDbContext db, string? name, string? case_, string? strap, string? glasp, string? gender, int page = 1, int pageSize = 6) =>
        {
            page = Math.Max(page, 1);
            pageSize = Math.Clamp(pageSize, 1, 50);

            var query = db.Products.AsNoTracking().AsQueryable();
            if (!string.IsNullOrWhiteSpace(name)) query = query.Where(p => p.Name.Contains(name));
            if (!string.IsNullOrWhiteSpace(case_)) query = query.Where(p => p.Case.Contains(case_));
            if (!string.IsNullOrWhiteSpace(strap)) query = query.Where(p => p.Strap.Contains(strap));
            if (!string.IsNullOrWhiteSpace(glasp)) query = query.Where(p => p.Glasp.Contains(glasp));
            if (!string.IsNullOrWhiteSpace(gender)) query = query.Where(p => p.Gender == gender);

            var total = await query.CountAsync();
            var items = await query
                .OrderBy(p => p.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductDto(p.Id, p.Name, p.Case, p.Strap, p.Glasp, p.PicUrl, p.Gender))
                .ToListAsync();

            var totalPages = (int)Math.Ceiling(total / (double)pageSize);
            return Results.Ok(new PagedProducts(items, page, pageSize, total, totalPages));
        });

        group.MapGet("/{id:int}", async (int id, VioletDbContext db) =>
        {
            var product = await db.Products.AsNoTracking()
                .Where(p => p.Id == id)
                .Select(p => new ProductDto(p.Id, p.Name, p.Case, p.Strap, p.Glasp, p.PicUrl, p.Gender))
                .FirstOrDefaultAsync();

            return product is null ? Results.NotFound() : Results.Ok(product);
        });

        group.MapPost("/", async (HttpRequest request, VioletDbContext db, IWebHostEnvironment env) =>
        {
            var form = await ReadProductForm(request);
            if (form is null)
                return Results.BadRequest(new { error = "invalid_form" });

            var product = new Product
            {
                Name = form.Name,
                Case = form.Case,
                Strap = form.Strap,
                Glasp = form.Glasp,
                Gender = form.Gender
            };

            var file = request.Form.Files.GetFile("pic");
            if (file is not null)
            {
                var saved = await SaveImage(file, env);
                if (saved is null)
                    return Results.BadRequest(new { error = "invalid_image" });
                product.PicUrl = saved;
            }

            db.Products.Add(product);
            await db.SaveChangesAsync();

            var dto = new ProductDto(product.Id, product.Name, product.Case, product.Strap, product.Glasp, product.PicUrl, product.Gender);
            return Results.Created($"/api/products/{product.Id}", dto);
        }).RequireAuthorization();

        group.MapPut("/{id:int}", async (int id, HttpRequest request, VioletDbContext db, IWebHostEnvironment env) =>
        {
            var product = await db.Products.FindAsync(id);
            if (product is null)
                return Results.NotFound();

            var form = await ReadProductForm(request);
            if (form is null)
                return Results.BadRequest(new { error = "invalid_form" });

            product.Name = form.Name;
            product.Case = form.Case;
            product.Strap = form.Strap;
            product.Glasp = form.Glasp;
            product.Gender = form.Gender;

            var file = request.Form.Files.GetFile("pic");
            if (file is not null)
            {
                var saved = await SaveImage(file, env);
                if (saved is null)
                    return Results.BadRequest(new { error = "invalid_image" });
                DeleteImage(product.PicUrl, env);
                product.PicUrl = saved;
            }

            await db.SaveChangesAsync();

            var dto = new ProductDto(product.Id, product.Name, product.Case, product.Strap, product.Glasp, product.PicUrl, product.Gender);
            return Results.Ok(dto);
        }).RequireAuthorization();

        group.MapDelete("/{id:int}", async (int id, VioletDbContext db, IWebHostEnvironment env) =>
        {
            var product = await db.Products.FindAsync(id);
            if (product is null)
                return Results.NotFound();

            db.Products.Remove(product);
            await db.SaveChangesAsync();
            DeleteImage(product.PicUrl, env);

            return Results.Ok(new { deleted = true });
        }).RequireAuthorization();
    }

    private static async Task<ProductForm?> ReadProductForm(HttpRequest request)
    {
        if (!request.HasFormContentType)
            return null;

        var form = await request.ReadFormAsync();
        var name = form["name"].ToString().Trim();
        var case_ = form["case_"].ToString().Trim();
        var strap = form["strap"].ToString().Trim();
        var glasp = form["glasp"].ToString().Trim();
        var gender = form["gender"].ToString().Trim();

        if (name.Length == 0 || gender.Length == 0)
            return null;

        return new ProductForm(name, case_, strap, glasp, gender);
    }

    private static async Task<string?> SaveImage(IFormFile file, IWebHostEnvironment env)
    {
        if (file.Length == 0 || file.Length > MaxImageBytes)
            return null;

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
            return null;

        var webRoot = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
        var folder = Path.Combine(webRoot, "images", "products");
        Directory.CreateDirectory(folder);

        var fileName = $"{Guid.NewGuid():N}{extension}";
        await using var stream = File.Create(Path.Combine(folder, fileName));
        await file.CopyToAsync(stream);

        return $"images/products/{fileName}";
    }

    private static void DeleteImage(string? picUrl, IWebHostEnvironment env)
    {
        if (string.IsNullOrWhiteSpace(picUrl))
            return;

        if (!picUrl.StartsWith("images/products/", StringComparison.OrdinalIgnoreCase))
            return;

        var webRoot = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
        var path = Path.Combine(webRoot, picUrl.Replace('/', Path.DirectorySeparatorChar));
        if (File.Exists(path))
            File.Delete(path);
    }
}
