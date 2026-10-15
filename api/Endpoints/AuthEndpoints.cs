using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Violet.Api.Data;
using Violet.Api.Models;
using Violet.Api.Services;

namespace Violet.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth");

        group.MapPost("/login", async (LoginRequest request, VioletDbContext db, TokenService tokens) =>
        {
            var admin = await db.Admins.FirstOrDefaultAsync(a => a.Username == request.Username);
            if (admin is null)
                return Results.Json(new { error = "invalid_credentials" }, statusCode: StatusCodes.Status401Unauthorized);

            var hasher = new PasswordHasher<AdminUser>();
            var result = hasher.VerifyHashedPassword(admin, admin.PasswordHash, request.Password);
            if (result == PasswordVerificationResult.Failed)
                return Results.Json(new { error = "invalid_credentials" }, statusCode: StatusCodes.Status401Unauthorized);

            return Results.Ok(new LoginResponse(tokens.CreateToken(admin.Username), admin.Username));
        });

        group.MapPost("/change-password", async (ChangePasswordRequest request, HttpContext http, VioletDbContext db) =>
        {
            var username = http.User.Identity?.Name;
            if (username is null)
                return Results.Unauthorized();

            if (request.NewPassword != request.RepeatedPassword)
                return Results.BadRequest(new { error = "password_mismatch" });

            if (request.NewPassword.Length < 8)
                return Results.BadRequest(new { error = "password_too_short" });

            var admin = await db.Admins.FirstOrDefaultAsync(a => a.Username == username);
            if (admin is null)
                return Results.Unauthorized();

            var hasher = new PasswordHasher<AdminUser>();
            if (hasher.VerifyHashedPassword(admin, admin.PasswordHash, request.OldPassword) == PasswordVerificationResult.Failed)
                return Results.BadRequest(new { error = "wrong_old_password" });

            admin.PasswordHash = hasher.HashPassword(admin, request.NewPassword);
            await db.SaveChangesAsync();

            return Results.Ok(new { message = "password_changed" });
        }).RequireAuthorization();
    }
}
