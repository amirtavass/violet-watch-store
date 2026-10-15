# Progress

## ✅ Done

### Discovery & planning
- Full stack / host / database audit of the legacy project and the droplet.
- SSH access confirmed to the droplet.
- Azure account connected; region constraint discovered; resources provisioned.

### Azure infrastructure
- Resource group `rg-violet-prod`.
- F1 (Free) Linux App Service plan `plan-violet-free`.
- .NET 10 web app `violet-watch-store-api` (running).
- Azure SQL server `sql-violet-prod` + database `amirSiteDb` (firewall configured).

### Backend (`api/`)
- Scaffolded ASP.NET Core Minimal API (`net10.0`) with EF Core SqlServer.
- Initial migration applied to Azure SQL.
- JWT auth (HS256, 12h expiry) + `PasswordHasher` for admins.
- Endpoints implemented and verified (write endpoints return 401 without token).
- `/health` endpoint.
- **Seed complete:** 24 products + admin (`admin`/`123` hashed, parity with old
  login) inserted into Azure SQL — Persian text intact; 5 unique product images
  copied to `api/wwwroot/images/products/`.

### Frontend (`web/`)
- Vite + TypeScript multi-page setup (`vite.config.ts` with dev proxy).
- Assets copied (css/fonts/pictures), `index.html` + `admin.html` transformed to
  load `/src/main.ts` and `/src/admin.ts`.
- Modules written: `api.ts`, `i18n.ts`, `theme.ts`, `modal.ts`, `products.ts`,
  `main.ts`, `admin.ts`.
- Translations extracted UTF-8-safe (`translations.ts` — fa/en, 25 keys) and
  admin labels (`admin-text.ts` — 8 named keys).
- Fixed `main.ts` language-toggle so it only reloads products when the grid is
  populated (matches old behaviour).
- `npm install` complete (esbuild install script approved).
- **`npm run build` succeeds** (tsc + vite), output in `web/dist`.

### Deployment prep
- Frontend build copied into `api/wwwroot`.
- `dotnet publish -c Release` succeeds; `appsettings.Development.json` excluded
  from publish output.

## ⏳ In progress / To do

### Immediate
- [ ] **Fix Azure zip deploy** — `az webapp deploy --type zip` currently fails
      with `Kudu Status: 400`. Zip already recreated with forward-slash paths;
      still debugging via the SCM deployment log.
- [ ] Set Azure App Settings from the secrets file:
      `ConnectionStrings__DefaultConnection`, `Jwt__Secret`, `Jwt__Issuer`,
      `Jwt__Audience`, `ASPNETCORE_ENVIRONMENT=Production`.
- [ ] Verify the deployed site at
      `https://violet-watch-store-api.azurewebsites.net` (storefront + admin +
      login).

### Cutover
- [ ] DNS cutover: point `violetwatch.tech` (CNAME/A) at Azure.
- [ ] Retire the DigitalOcean droplet once verified.
- [ ] Add the $50 budget alert manually in the portal.

### Follow-ups
- [ ] Persistent storage for admin-uploaded images (App Service `/home`).
- [ ] ParsSwim hosting migration (Next.js + Express + MongoDB → Atlas M0 /
      Azure); needs SSH access to the parsswim droplet.
- [ ] Consider Angular migration (deferred until the above works).

## Known issues / notes

- The `todowrite` tool was failing with a schema error
  (`Missing key at ["todos"][5]["status"]`), so the in-session todo list is out
  of sync. This document is the source of truth.
