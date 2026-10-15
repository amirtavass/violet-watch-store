namespace Violet.Api.Models;

public record ProductDto(int Id, string Name, string Case, string Strap, string Glasp, string PicUrl, string Gender);

public record PagedProducts(IReadOnlyList<ProductDto> Items, int Page, int PageSize, int TotalCount, int TotalPages);

public record LoginRequest(string Username, string Password);

public record LoginResponse(string Token, string Username);

public record ChangePasswordRequest(string OldPassword, string NewPassword, string RepeatedPassword);

public record ProductForm(string Name, string Case, string Strap, string Glasp, string Gender);
