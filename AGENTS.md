# AGENTS.md

Guidance for AI agents working in this repository. Read this first, then the
`docs/` folder.

## What this project is

Migration of **Violet Watch Store** from legacy vanilla JS + PHP + MySQL on a
DigitalOcean droplet to **Vite + TypeScript** frontend + **ASP.NET Core (.NET 10)**
backend on **Azure**, without breaking the live site (`violetwatch.tech`).

## Repository layout

| Path | What it is |
| --- | --- |
| `api/` | ASP.NET Core Minimal API (.NET 10) + EF Core → Azure SQL. Also serves the built frontend from `wwwroot/`. |
| `web/` | Vite + TypeScript frontend (`index.html`, `admin.html`). |
| `docs/` | **Read these** — objectives, details, architecture, progress, challenges, deployment. |
| `publish/` | Local publish output (generated, git-ignored). |
| `index.html`, `pages/`, `script/`, `css/`, `pictures/`, `*.sql` | **Legacy reference only** — do not extend. Removed after DNS cutover. |

## Docs to read

- [docs/README.md](docs/README.md) — index
- [docs/objectives.md](docs/objectives.md) — goals / non-goals
- [docs/important-details.md](docs/important-details.md) — infra, secrets, conventions
- [docs/architecture.md](docs/architecture.md) — components, API, data model
- [docs/development.md](docs/development.md) — local setup & commands
- [docs/progress.md](docs/progress.md) — done / to-do
- [docs/challenges.md](docs/challenges.md) — problems & fixes
- [docs/deployment.md](docs/deployment.md) — Azure deploy runbook

## Quick commands

```powershell
# .NET is per-user — set this in every shell
$env:DOTNET_ROOT = "$env:USERPROFILE\.dotnet"
$env:Path = "$env:DOTNET_ROOT;$env:DOTNET_ROOT\tools;$env:Path"

# Backend (dev) — must match the Vite proxy port 5099
dotnet run --project api --urls http://localhost:5099

# Frontend (dev)
cd web; npm install; npm run dev      # http://localhost:5173

# Verify before finishing work
cd web; npm run build                  # tsc --noEmit && vite build
dotnet publish api -c Release -o publish
```

## Rules & conventions

- **Never commit secrets.** They live outside the repo at
  `C:\Users\Pc Dayan\.azure\violet-mysql.env`; Production values go into Azure
  App Settings (`ConnectionStrings__DefaultConnection`, `Jwt__Secret`, …).
- **No automated tests yet** — verify manually (health check, storefront render,
  admin CRUD, 401 on unauthenticated writes).
- **Encoding:** files are UTF-8; the PowerShell console mangles Persian. Never
  paste console-recovered text into files — use Node scripts to read/write UTF-8.
- **Zip on Windows:** use `[System.IO.Compression.ZipFile]::CreateFromDirectory`,
  not `Compress-Archive` (backslash paths break Linux deploys).
- **No comments in code** unless explicitly requested.
- **Do not touch legacy files** except as reference; all new work goes in `api/`
  and `web/`.
- **Region is fixed** to `germanywestcentral` (student subscription restriction).
- **Open blocker:** Azure zip deploy returns Kudu 400 — see
  [docs/challenges.md](docs/challenges.md#6-azure-zip-deployment-failing-open).
