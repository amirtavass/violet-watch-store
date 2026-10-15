# Local Development

## Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| .NET SDK | 10.0.x | Installed per-user at `%USERPROFILE%\.dotnet` |
| dotnet-ef | 10.0.x | `dotnet tool` (at `%USERPROFILE%\.dotnet\tools`) |
| Node.js | 24.x | Includes npm 11 |

Because .NET is installed **per-user**, every new PowerShell shell must set:

```powershell
$env:DOTNET_ROOT = "$env:USERPROFILE\.dotnet"
$env:Path = "$env:DOTNET_ROOT;$env:DOTNET_ROOT\tools;$env:Path"
```

## Configuration / secrets

The API reads config from `appsettings.json`, `appsettings.Development.json`
(git-ignored), environment variables, and user-secrets.

`api/appsettings.json` ships with empty placeholders:

```json
{
  "ConnectionStrings": { "DefaultConnection": "" },
  "Jwt": { "Secret": "", "Issuer": "violet-api", "Audience": "violet-web" }
}
```

Set the real values via **user-secrets** (recommended for local dev):

```powershell
dotnet user-secrets init --project api
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<azure-sql-conn>" --project api
dotnet user-secrets set "Jwt:Secret" "<jwt-secret>" --project api
```

> Canonical secret values are stored **outside the repo** at
> `C:\Users\Pc Dayan\.azure\violet-mysql.env`. Never commit them.
> In Production these are supplied as App Service **App Settings** with the
> double-underscore form: `ConnectionStrings__DefaultConnection`, `Jwt__Secret`,
> `Jwt__Issuer`, `Jwt__Audience`.

## Run the backend

```powershell
dotnet run --project api --urls http://localhost:5099
```

- The DB **migrates and seeds automatically on startup** (only seeds when empty).
- Health check: <http://localhost:5099/health>

> **Port note:** `api/Properties/launchSettings.json` defaults to port **5238**,
> but the Vite dev proxy targets **5099**. Either run with
> `--urls http://localhost:5099` (as above) or update the proxy in
> `web/vite.config.ts` to match the launch profile.

## Run the frontend (dev)

```powershell
cd web
npm install      # first time only
npm run dev
```

- Vite dev server: <http://localhost:5173>
- Proxy: `/api` and `/images` → `http://localhost:5099` (see `web/vite.config.ts`).
- Storefront: `/index.html` · Admin: `/admin.html`

## Build / verify

```powershell
# Frontend: typecheck + production build → web/dist
cd web; npm run build

# Backend: compile/publish → publish/
dotnet publish api -c Release -o publish
```

`npm run build` runs `tsc --noEmit` first, so type errors fail the build.

## Tests

There is **no automated test suite yet**. Verification is currently manual:

1. Start the API, hit `/health`.
2. Start the frontend, load the storefront — confirm products render and
   pagination/search work.
3. Open `/admin.html` — confirm login, product create/edit/delete, and
   change-password.
4. Confirm a write endpoint returns **401** without a Bearer token.

## Useful commands

| Task | Command |
| --- | --- |
| Add a migration | `dotnet ef migrations add <Name> --project api` |
| Apply migrations | `dotnet ef database update --project api` |
| Reset seed (empty DB) | Drop rows / recreate DB, then restart the API |
| Type-check only | `cd web; npx tsc --noEmit` |

## Common pitfalls

- **esbuild install script blocked:** if `npm install` warns about scripts, run
  `npm approve-scripts esbuild`.
- **Persian text:** the console shows mojibake but files are valid UTF-8 — edit
  through tooling, never paste console-recovered Persian.
- **Zip creation (Windows):** `Compress-Archive` writes backslash paths that
  Linux rejects — use `[System.IO.Compression.ZipFile]::CreateFromDirectory`.
