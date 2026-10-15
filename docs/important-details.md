# Important Details

## Legacy environment (still live — do not break)

- **Host:** DigitalOcean droplet `violet-watch-store-prod`, IP `138.68.154.176`
- **OS / stack:** Ubuntu 24.04, Apache 2.4.58, PHP 8.3.6, MySQL 8.0.46 (localhost only)
- **Site root:** `/var/www/violet-watch-store`
- **Domain / SSL:** `violetwatch.tech` with certbot (auto-renewing)
- **Data:** 24 products in `amirSiteDb.t1`
- **Admin login:** `admin` / `123` (plaintext — this is why we are rewriting)
- **Access:** root SSH via `~/.ssh/id_ed25519`
- **Known issue:** SQL injection throughout the PHP codebase.

## Azure environment

- **Subscription:** "Azure for Students" — `3a142661-97a1-4d0b-a52b-1a861d6741a6`
- **Tenant:** `dea51c67-ef23-4343-9d6c-6eb04d3029de`
- **User:** `at7crt@bolton.ac.uk` (role: Owner)
- **Region:** `germanywestcentral` — **forced**, see [challenges.md](challenges.md)
- **CLI path:** `C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\wbin\az.cmd`

### Provisioned resources

| Resource | Name | Notes |
| --- | --- | --- |
| Resource group | `rg-violet-prod` | |
| App Service plan | `plan-violet-free` | F1 (Free) Linux |
| Web app | `violet-watch-store-api` | .NET 10, `violet-watch-store-api.azurewebsites.net` |
| SQL server | `sql-violet-prod` | `sql-violet-prod.database.windows.net` |
| SQL database | `amirSiteDb` | GeneralPurpose serverless, max 1 vCore |
| SQL admin user | `violetadmin` | |
| Firewall rules | `AllowAllAzureIPs` (0.0.0.0), `AllowLocalAdmin` (dev IP) | |

> **Budget alert:** creating it via CLI was RBAC-blocked. Add manually in the
> portal: **Cost Management → Budgets → $50**.

## Secrets

All secrets live **outside the repo** in:

```
C:\Users\Pc Dayan\.azure\violet-mysql.env
```

Contains: SQL credentials, `JWT_SECRET` (61 chars), and `AZURE_WEBAPP`.
These values are injected into Azure App Settings at deploy time and are **never
committed**. (Note: the MySQL password was briefly exposed in a CLI debug log
during provisioning — acceptable, but do not re-print it.)

## Tooling (local dev machine)

- **.NET SDK:** 10.0.402 at `%USERPROFILE%\.dotnet` (per-user — requires
  `$env:DOTNET_ROOT` and PATH to be set in each shell)
- **dotnet-ef:** 10.0.13 (global tool at `%USERPROFILE%\.dotnet\tools`)
- **Node:** v24.18.0, npm 11.16.0
- No winget, no Docker.

## Application structure

### Backend — `api/`

ASP.NET Core Minimal API (`net10.0`), EF Core + SqlServer.

- Migration: `20261015212156_InitialCreate`
- Endpoints:
  - `GET/POST /api/products`
  - `GET/PUT/DELETE /api/products/{id}` — multipart form (`name, case_, strap, glasp, gender` + file `pic`)
  - `POST /api/auth/login` → `{ token, username }`
  - `POST /api/auth/change-password` (authenticated)
  - `GET /health`
  - All write endpoints require a `Bearer` token (401 without).
- Key files: `Program.cs`, `Models/`, `Data/VioletDbContext.cs`,
  `Data/DbSeeder.cs`, `Services/TokenService.cs`, `Endpoints/AuthEndpoints.cs`,
  `Endpoints/ProductEndpoints.cs`, `Migrations/`, `seed/products.json`,
  `wwwroot/images/products/`

### Frontend — `web/`

Vite + vanilla TypeScript, multi-page (`index.html` + `admin.html`).

- Dev proxy: `/api` and `/images` → `localhost:5099`
- Modules: `main.ts`, `admin.ts`, `api.ts`, `i18n.ts`, `theme.ts`,
  `modal.ts`, `products.ts`, `translations.ts` (fa/en, 25 keys),
  `admin-text.ts` (admin UI labels)
- Static assets under `web/public/` (`css/`, `fonts/`, `pictures/`)

## Conventions / gotchas

- **Persian text / encoding:** PowerShell console shows Persian as mojibake, but
  files are valid UTF-8. Never paste console-recovered Persian back into files —
  transform via Node scripts reading/writing UTF-8.
- **SSH scripting:** pipe scripts with
  `Get-Content file -Raw | ssh root@138.68.154.176 "bash -s"` and normalise line
  endings with `-replace "\r\n","\n"`.
- **Inline `node -e`:** breaks on quotes — use script files in `%TEMP%\opencode\`.
- **PowerShell `Compress-Archive`** writes backslash paths that Linux Kudu
  rejects — use `[System.IO.Compression.ZipFile]::CreateFromDirectory` instead.
- **`.gitignore`** excludes: `api/bin/`, `api/obj/`,
  `api/appsettings.Development.json`, `api/wwwroot/images/products/*`
  (keep `.gitkeep`), `api/seed/products.json`.
- **Known caveat:** images uploaded through the admin panel live in
  `api/wwwroot` and may be lost on redeploy. Persistent `/home` storage is a
  future improvement.
