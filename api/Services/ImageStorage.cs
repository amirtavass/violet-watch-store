using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Violet.Api.Services;

public static class ImageStorage
{
    private static readonly string[] ImageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

    public static string ResolveProductsDirectory(IConfiguration configuration, IWebHostEnvironment env)
    {
        var configured = configuration["Storage:ProductsPath"];
        if (!string.IsNullOrWhiteSpace(configured))
            return configured;

        if (OperatingSystem.IsLinux() && Directory.Exists("/home"))
            return "/home/site/uploads/products";

        return DefaultDirectory(env);
    }

    public static string DefaultDirectory(IWebHostEnvironment env)
    {
        var webRoot = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
        return Path.Combine(webRoot, "images", "products");
    }

    public static void EnsureSeededImages(IWebHostEnvironment env, string productsDirectory)
    {
        var seedDirectory = DefaultDirectory(env);
        if (string.Equals(
                Path.GetFullPath(seedDirectory),
                Path.GetFullPath(productsDirectory),
                StringComparison.Ordinal))
            return;

        Directory.CreateDirectory(productsDirectory);
        if (!Directory.Exists(seedDirectory))
            return;

        foreach (var file in Directory.GetFiles(seedDirectory))
        {
            var extension = Path.GetExtension(file).ToLowerInvariant();
            if (!ImageExtensions.Contains(extension))
                continue;

            var destination = Path.Combine(productsDirectory, Path.GetFileName(file));
            if (!File.Exists(destination))
                File.Copy(file, destination);
        }
    }
}
