using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Violet.Api.Data;
using Violet.Api.Endpoints;
using Violet.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<VioletDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSingleton<TokenService>();

var jwtSecret = builder.Configuration["Jwt:Secret"]
    ?? throw new InvalidOperationException("Jwt:Secret is not configured");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "violet-api",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "violet-web",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("dev", policy =>
        policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<VioletDbContext>();
    await db.Database.MigrateAsync();
    await DbSeeder.SeedAsync(db, app.Environment);
}

var productsDirectory = ImageStorage.ResolveProductsDirectory(app.Configuration, app.Environment);
ImageStorage.EnsureSeededImages(app.Environment, productsDirectory);

if (!string.Equals(
        Path.GetFullPath(productsDirectory),
        Path.GetFullPath(ImageStorage.DefaultDirectory(app.Environment)),
        StringComparison.Ordinal))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(productsDirectory),
        RequestPath = "/images/products"
    });
}

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
    app.UseCors("dev");

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapAuthEndpoints();
app.MapProductEndpoints();

app.Run();
