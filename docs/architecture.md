# Architecture

## System overview

```
                     ┌──────────────────────────────┐
   Browser  ──────▶  │  Azure App Service (Linux)   │
                     │  violet-watch-store-api      │
                     │  ┌────────────────────────┐  │
                     │  │ ASP.NET Core (.NET 10) │  │
                     │  │  Minimal API           │  │
                     │  │  - /api/products       │  │
                     │  │  - /api/auth/*         │  │
                     │  │  - static files        │  │
                     │  │    (built frontend)    │  │
                     │  └───────────┬────────────┘  │
                     └──────────────┼───────────────┘
                                    │ EF Core (SqlServer)
                                    ▼
                     ┌──────────────────────────────┐
                     │  Azure SQL                    │
                     │  sql-violet-prod / amirSiteDb │
                     │  - Products                   │
                     │  - Admins                     │
                     └──────────────────────────────┘
```

The API serves **both** the JSON endpoints **and** the compiled frontend
(`wwwroot/`) as static files, so a single App Service hosts the whole app.

## Request / data flow

1. The frontend calls the API under the `/api` prefix (dev: proxied by Vite;
   prod: same origin).
2. Public endpoints (`GET /api/products`) are anonymous.
3. Write endpoints require `Authorization: Bearer <jwt>`.
4. Login returns a JWT (HS256, 12h) which the frontend stores and sends on writes.
5. Product images are stored on disk under `wwwroot/images/products/` and
   referenced by the relative `picUrl` (e.g. `images/products/<guid>.jpg`).

## Backend (`api/`)

**Framework:** ASP.NET Core Minimal API, `net10.0`, EF Core + `Microsoft.EntityFrameworkCore.SqlServer`.

**Startup** (`Program.cs`):
- Registers `VioletDbContext` (SQL Server) and `TokenService` (singleton).
- Configures JWT bearer auth (issuer `violet-api`, audience `violet-web`).
- On boot: runs `db.Database.MigrateAsync()` then `DbSeeder.SeedAsync(...)`.
- Serves static files + default files (`index.html`).
- CORS policy `dev` allows `http://localhost:5173` in Development only.

**Projects / key files:**

| Path | Responsibility |
| --- | --- |
| `Program.cs` | App startup, DI, auth, middleware, endpoint mapping |
| `Data/VioletDbContext.cs` | EF Core context (`Products`, `Admins`) |
| `Data/DbSeeder.cs` | Seeds 24 products + admin if empty |
| `Models/` | `Product`, `Admin`, DTOs (`ProductDto`, `PagedProducts`, `ProductForm`) |
| `Services/TokenService.cs` | Issues JWT tokens |
| `Endpoints/AuthEndpoints.cs` | Login + change-password |
| `Endpoints/ProductEndpoints.cs` | Product CRUD + image handling |
| `Migrations/` | `20261015212156_InitialCreate` |
| `seed/products.json` | Seed data source |
| `wwwroot/` | Compiled frontend + `images/products/` |

### API reference

| Method | Route | Auth | Notes |
| --- | --- | --- | --- |
| GET | `/health` | no | `{ status: "ok" }` |
| GET | `/api/products` | no | Query: `name`, `case_`, `strap`, `glasp`, `gender`, `page` (default 1), `pageSize` (default 6, clamped 1–50). Returns `PagedProducts` |
| GET | `/api/products/{id}` | no | Single `ProductDto` or 404 |
| POST | `/api/products` | **yes** | `multipart/form-data`: `name, case_, strap, glasp, gender`, file `pic` |
| PUT | `/api/products/{id}` | **yes** | Same multipart fields; replaces image if `pic` provided |
| DELETE | `/api/products/{id}` | **yes** | Deletes row + image file |
| POST | `/api/auth/login` | no | Form/JSON `username, password` → `{ token, username }` |
| POST | `/api/auth/change-password` | **yes** | `oldPassword, newPassword, repeated` |

**Image rules** (`ProductEndpoints.cs`): extensions `.jpg .jpeg .png .webp .gif`,
max **5 MB**, saved as `{guid}{ext}` under `wwwroot/images/products/`.
`picUrl` is stored relative (`images/products/<file>`).

### Data model

- **Product**: `Id`, `Name`, `Case` (`case_` in forms), `Strap`, `Glasp`,
  `PicUrl`, `Gender` (`man` / `woman`).
- **Admin**: `Username`, `PasswordHash` (`PasswordHasher`), plus change-password
  fields. Seeded with `admin` / `123` for parity with the legacy login.

## Frontend (`web/`)

**Build tool:** Vite 6 + TypeScript 5.7 (vanilla — no framework yet).
Multi-page build: `index.html` (storefront) + `admin.html` (admin panel).

| Module | Responsibility |
| --- | --- |
| `main.ts` | Storefront entry: i18n init, theme, product grid, modals |
| `admin.ts` | Admin entry: token gate, product table, CRUD, change-password |
| `api.ts` | Typed fetch wrapper (`api.*`), token storage, `ApiError` |
| `i18n.ts` | Language toggle + applies translations |
| `translations.ts` | fa/en strings (25 keys) |
| `admin-text.ts` | Admin UI labels (8 keys) |
| `theme.ts` | Dark/light theme toggle |
| `modal.ts` | Modal show/hide helpers (`showModal`, `closeModal`, `setOnClose`) |
| `products.ts` | Product grid rendering + pagination (storefront) |

Static assets live in `web/public/` (`css/`, `fonts/`, `pictures/`) and are
copied verbatim into `dist/` by Vite. `admin.html` / `index.html` are byte-copies
of the legacy pages with the `<script>` tags rewritten to `/src/main.ts` and
`/src/admin.ts`.

## Legacy → new mapping

| Legacy | New |
| --- | --- |
| `index.html` + `script/script.js` | `web/index.html` + `web/src/main.ts` |
| `pages/admin.html` + `script/adminScript.js` | `web/admin.html` + `web/src/admin.ts` |
| `pages/page2.php` (product API) | `api/Endpoints/ProductEndpoints.cs` |
| PHP login / change-password | `api/Endpoints/AuthEndpoints.cs` |
| MySQL `amirSiteDb.t1` | Azure SQL `Products` table |

The legacy root files (`index.html`, `pages/`, `script/`, `css/`, `pictures/`,
`amirsitedb.sql`, `english_db.sql`) are kept only as a behaviour reference until
DNS cutover, then can be removed.
