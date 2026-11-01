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
- **Database SKU moved to Standard S0** (10 DTU, 250 GB max) to match the
  Azure for Students 12-month free meter (was GeneralPurpose serverless
  `GP_S_Gen5_1`).

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
- Missing legacy hero image `pictures/products/m2.jpg` copied into
  `web/public/pictures/products/` (referenced by `index.html`, 404 before).

### Deployment (done)
- **UI/CSS fixes (post-deploy):**
  - Modals were invisible (opacity stuck at 0): `modal.ts` now restores the
    legacy `opacity` handling (`showModal` sets opacity 1, `closeModal` fades
    then hides after 500 ms) and uses `display:flex` for the about-us/contact
    modals like the old `script/modules/modal.js`.
  - Admin panel was unstyled because `admin.html` referenced a non-existent
    `/css/style.css` (404 on legacy too). It now loads the shared stylesheets
    (`base.css`, `components/header.css`, `components/modal.css`) plus
    `adminpage.css`, and `adminpage.css` gained the layout rules it depended
    on: `main`/`.backgroundImage` sizing, `zoomIn`/`enterFromRight` keyframes,
    and pagination (`.products nav`) styles.
- Production App Settings set from the secrets file:
  `ASPNETCORE_ENVIRONMENT=Production`, `ConnectionStrings__DefaultConnection`,
  `Jwt__Secret`, `Jwt__Issuer=violet-api`, `Jwt__Audience=violet-web`,
  and **`SCM_DO_BUILD_DURING_DEPLOYMENT=false`**.
- Linux startup command set: `dotnet Violet.Api.dll`.
- **Azure zip deploy fixed.** `az webapp deploy --type zip --clean true` now
  returns `RuntimeSuccessful` (no Kudu 400). Root cause and fix in
  [challenges.md](challenges.md#6-azure-zip-deployment-failing-resolved).
- Publish zip built with a `ZipArchive` loop that normalises every entry to
  forward slashes (verified `backslash_entries=0`).

### Post-deployment hardening (done)
- **Persistent image storage:** uploads now go to
  `/home/site/uploads/products` (auto when `/home` exists; overridable with
  `Storage__ProductsPath`). Seeded images are copied there on startup if
  missing, and `/images/products` is served from that folder via
  `PhysicalFileProvider`. Verified by removing the `wwwroot` copy (image still
  200) and by an authenticated upload landing in `/home`.
  `WEBSITES_ENABLE_APP_SERVICE_STORAGE=true` is set.
- **Cloudflare compatibility:** `UseHttpsRedirection` is absent from
  `Program.cs`, so a Cloudflare Flexible-SSL proxy will not hit a redirect loop;
  direct HTTPS on `*.azurewebsites.net` still works.
- **Admin password rotated:** the seeded `admin`/`123` no longer works (401).
  A strong 20-character password is stored as `ADMIN_PASSWORD` in the secrets
  file; login with it returns 200. Rotation used the real
  `POST /api/auth/change-password` flow after resetting an invalid pre-existing
  hash (see [challenges.md](challenges.md#10-admin-password-was-not-123)).
- **Custom domain prep:** `customDomainVerificationId`
  `22C741EBE8607C9FD6F57453F06B7179371413A740F4AF1E9C2B4BE6B2558CF4` captured;
  exact Cloudflare TXT/CNAME table is in
  [deployment.md](deployment.md#8-dns-cutover-cloudflare--azure).
- **Hostname bindings:** `violetwatch.tech` and `www.violetwatch.tech` were
  added, showed `Verified`, then were **removed** — F1 (Free) never serves
  custom domains (front end returns `404 Site Not Found`; the names stay out of
  `enabledHostNames`). Azure now only answers
  `violet-watch-store-api.azurewebsites.net`; the custom domain is served by the
  free Cloudflare Worker proxy in
  [deployment.md §8b](deployment.md#8b-cloudflare-worker-free-plan). No B1
  upgrade.

### Live verification (production)
Base: `https://violet-watch-store-api.azurewebsites.net`

| Check | Result |
| --- | --- |
| `GET /health` | 200 `{"status":"ok"}` |
| `GET /api/products?page=1&pageSize=6` | 200 — `totalCount=24`, UTF-8 Persian intact |
| `GET /` and `/admin.html` | 200 HTML |
| `/images/products/{m1,m2,w1,w2,m4}.jpg` | 200 `image/jpeg` (served from `/home`) |
| `/pictures/products/m2.jpg`, `/fonts/Sans a4fran3.woff` | 200 |
| `POST /api/auth/login` (`ADMIN_PASSWORD`) | 200 with JWT |
| `POST /api/auth/login` (`123`) | 401 |
| `POST /api/products` without token | 401 |

> `/css/style.css` was a dead link in `admin.html` (404 on the legacy site as
> well). It has been replaced with the real shared stylesheets.

## ⏳ In progress / To do

### Cutover
- [x] Cloudflare DNS records verified (`asuid`/`asuid.www` TXT, `@`/`www`
      proxied to the Azure host).
- [x] F1 custom-domain bindings removed from App Service (they can conflict with
      routing/SNI and cannot serve on Free).
- [x] Cloudflare Worker proxy deployed with routes `violetwatch.tech/*` +
      `www.violetwatch.tech/*`; it rewrites `Host` and strips
      `x-forwarded-host`/`x-original-host`.
- [x] Verified via the Cloudflare edge (bypassing the stale local resolver):
      `https://violetwatch.tech` and `https://www.violetwatch.tech` return 200
      for `/health`, `/`, `/admin.html`, `/api/products` (`totalCount=24`) and
      `/images/products/*.jpg` on both Cloudflare IPs.
- [x] DNS cutover complete; DigitalOcean droplet destroyed.
- [ ] Add the $50 budget alert manually in the portal.

> **Client DNS note:** the local Windows resolver uses Virgin Media
> (`194.168.4.100/8`) which still served the dead `138.68.154.176` with ~7.4 h
> TTL after the cutover — `ipconfig /flushdns` does not clear the ISP cache.
> Public DNS (1.1.1.1) and the edge were already correct. Use `1.1.1.1` /
> `1.0.0.1` on the adapter (or wait out the TTL) and clear browser DNS.

### Follow-ups
- [ ] ParsSwim hosting migration (Next.js + Express + MongoDB → Atlas M0 /
      Azure); needs SSH access to the parsswim droplet.
- [ ] Consider Angular migration (deferred until the above works).

## Known issues / notes

- The `todowrite` tool was failing with a schema error
  (`Missing key at ["todos"][5]["status"]`), so the in-session todo list is out
  of sync. This document is the source of truth.
