# Deployment Runbook (Azure)

Target: **Azure App Service** `violet-watch-store-api` in `rg-violet-prod`
(region `germanywestcentral`), serving the API + compiled frontend, backed by
**Azure SQL** `sql-violet-prod` / `amirSiteDb`.

## 0. Shell setup

```powershell
$env:DOTNET_ROOT = "$env:USERPROFILE\.dotnet"
$env:Path = "$env:DOTNET_ROOT;$env:DOTNET_ROOT\tools;$env:Path"
$az = 'C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\wbin\az.cmd'
```

## 1. Build the frontend

```powershell
cd web
npm install
npm run build          # tsc --noEmit && vite build  → web/dist
```

## 2. Bundle the frontend into the API

Copy the build output into `api/wwwroot` (this preserves the seeded
`images/products/` folder, which `dist/` does not contain):

```powershell
Copy-Item -Recurse -Force web\dist\* api\wwwroot\
```

## 3. Publish the API

```powershell
dotnet publish api -c Release -o publish
```

`appsettings.Development.json` is excluded from publish output via the
`<Content Update ... CopyToPublishDirectory="Never" />` item in
`api/Violet.Api.csproj`, so dev secrets are not shipped.

## 4. Zip the publish output

> Use .NET's zip writer — `Compress-Archive` writes backslash paths that Linux
> Kudu rejects (HTTP 400).

```powershell
Remove-Item "$env:TEMP\violet-publish.zip" -Force -ErrorAction SilentlyContinue
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory(
  "$PWD\publish", "$env:TEMP\violet-publish.zip")
```

## 5. Configure App Settings (Production)

Source the values from `C:\Users\Pc Dayan\.azure\violet-mysql.env` and set:

```powershell
& $az webapp config appsettings set -g rg-violet-prod -n violet-watch-store-api --settings `
  ASPNETCORE_ENVIRONMENT=Production `
  ConnectionStrings__DefaultConnection="<azure-sql-connection-string>" `
  Jwt__Secret="<jwt-secret>" `
  Jwt__Issuer="violet-api" `
  Jwt__Audience="violet-web"
```

## 6. Deploy

```powershell
& $az webapp deploy -g rg-violet-prod -n violet-watch-store-api `
  --src-path "$env:TEMP\violet-publish.zip" --type zip --clean true
```

> ⚠️ **Known blocker:** this step currently fails with
> `DeploymentFailed / Kudu Status: 400`. See
> [challenges.md](challenges.md#6-azure-zip-deployment-failing-open) for the
> investigation. Fallbacks to try: `az webapp up`, run-from-package, or a Kudu
> zip-push after reading the full deployment log at
> `https://violet-watch-store-api.scm.azurewebsites.net/api/deployments/latest`.

## 7. Verify

- Health: `https://violet-watch-store-api.azurewebsites.net/health`
- Storefront + admin load and product CRUD works with the seeded `admin`/`123`.

## 8. DNS cutover

1. Point `violetwatch.tech` (CNAME or A record) at the App Service.
2. Add the custom domain in App Service and bind an SSL certificate.
3. Verify the domain serves the new app end-to-end.
4. **Retire the DigitalOcean droplet** (`violet-watch-store-prod`,
   `138.68.154.176`) once verified.

## Post-deploy

- Add the **$50 budget alert** manually (Cost Management → Budgets).
- Note: admin-uploaded images live in `wwwroot` and are **lost on redeploy**.
  Persistent `/home` storage is a planned improvement.
