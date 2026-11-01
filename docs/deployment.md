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

Build the zip with an explicit `ZipArchive` loop so every entry uses POSIX
forward slashes (Windows `Compress-Archive` and, in some runtimes, `ZipFile`
emit backslashes, which Linux Kudu rejects):

```powershell
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$source = "$PWD\publish"
$zipPath = "$env:TEMP\violet-publish.zip"
Remove-Item $zipPath -Force -ErrorAction SilentlyContinue

$zipStream = [System.IO.File]::Open($zipPath, 'CreateNew', 'Write', 'None')
$archive = New-Object System.IO.Compression.ZipArchive($zipStream, 'Create', $false)
try {
  Get-ChildItem -LiteralPath $source -Recurse -File -Force | ForEach-Object {
    $entryName = $_.FullName.Substring($source.Length).TrimStart('\', '/').Replace('\', '/')
    $entryStream = $archive.CreateEntry($entryName, 'Optimal').Open()
    try { [System.IO.File]::OpenRead($_.FullName).CopyTo($entryStream) }
    finally { $entryStream.Dispose() }
  }
}
finally { $archive.Dispose(); $zipStream.Dispose() }
```

Verify before deploying: no entry name may contain `\`.

## 5. Configure App Settings (Production)

Source the values from `C:\Users\Pc Dayan\.azure\violet-mysql.env` (never echo
them) and set:

```powershell
& $az webapp config appsettings set -g rg-violet-prod -n violet-watch-store-api --settings `
  ASPNETCORE_ENVIRONMENT=Production `
  ConnectionStrings__DefaultConnection="<azure-sql-connection-string>" `
  Jwt__Secret="<jwt-secret>" `
  Jwt__Issuer="violet-api" `
  Jwt__Audience="violet-web" `
  SCM_DO_BUILD_DURING_DEPLOYMENT=false `
  WEBSITES_ENABLE_APP_SERVICE_STORAGE=true `
  -o none
```

> **Critical:** `SCM_DO_BUILD_DURING_DEPLOYMENT=false` stops Linux Oryx from
> trying to build the pre-compiled publish output. Leaving it unset was the
> cause of the Kudu HTTP 400 deployment failure.

Optional override for the upload directory (defaults to
`/home/site/uploads/products` when `/home` exists on Linux):

```powershell
& $az webapp config appsettings set -g rg-violet-prod -n violet-watch-store-api `
  --settings "Storage__ProductsPath=/home/site/uploads/products" -o none
```

Set the startup command:

```powershell
& $az webapp config set -g rg-violet-prod -n violet-watch-store-api `
  --startup-file "dotnet Violet.Api.dll" -o none
```

## 6. Deploy

```powershell
& $az webapp deploy -g rg-violet-prod -n violet-watch-store-api `
  --src-path "$env:TEMP\violet-publish.zip" --type zip --clean true -o json
```

Expected: `"numberOfInstancesSuccessful": 1`, `"status": "RuntimeSuccessful"`.

Fallback (only if basic-auth ever breaks again): push the zip with an Azure AD
token to the Kudu endpoint.

```powershell
$token = (& $az account get-access-token --query accessToken -o tsv)
curl.exe -X POST -H "Authorization: Bearer $token" `
  --data-binary "@$env:TEMP\violet-publish.zip" `
  "https://violet-watch-store-api.scm.azurewebsites.net/api/zipdeploy"
```

## 7. Verify

- Health: `https://violet-watch-store-api.azurewebsites.net/health` → 200
  `{"status":"ok"}`.
- Products: `/api/products?page=1&pageSize=6` → 200, `totalCount=24`, Persian
  UTF-8 intact.
- Storefront `/` and `/admin.html` → 200; product images
  `/images/products/*.jpg` → 200.
- Login: `POST /api/auth/login` with the current `ADMIN_PASSWORD` from the
  secrets file → 200 + JWT; the old `123` password → 401; unauthenticated
  `POST /api/products` → 401.

## 7a. Persistent images (App Service `/home`)

Uploaded images are **not** written to `wwwroot` any more:

- `ImageStorage.ResolveProductsDirectory` uses, in order:
  1. `Storage:ProductsPath` configuration (App Setting `Storage__ProductsPath`),
  2. `/home/site/uploads/products` when running on Linux with `/home`,
  3. `wwwroot/images/products` (local development).
- On startup the seeded images in `wwwroot/images/products` are copied into the
  persistent directory if missing (existing uploads are never overwritten).
- `/images/products` is served from the persistent directory with
  `UseStaticFiles` + `PhysicalFileProvider`, so seeded and uploaded images share
  one URL space. A `--clean true` zip deploy no longer deletes uploads.

## 7b. Cloudflare / proxy HTTPS compatibility

`Program.cs` deliberately does **not** call `UseHttpsRedirection()`. With
Cloudflare Flexible SSL the edge talks HTTP to App Service; an app-level HTTPS
redirect would cause an infinite 307/308 loop. Direct HTTPS to
`*.azurewebsites.net` still works because App Service terminates TLS itself.

## 8. DNS cutover (Cloudflare → Azure)

Custom domain verification ID for `violet-watch-store-api`:

```
22C741EBE8607C9FD6F57453F06B7179371413A740F4AF1E9C2B4BE6B2558CF4
```

### Records to create in Cloudflare (`violetwatch.tech`)

| # | Type | Name (host) | Content / value | Proxy | TTL |
| --- | --- | --- | --- | --- | --- |
| 1 | TXT | `asuid` | `22C741EBE8607C9FD6F57453F06B7179371413A740F4AF1E9C2B4BE6B2558CF4` | DNS only | Auto |
| 2 | TXT | `asuid.www` | `22C741EBE8607C9FD6F57453F06B7179371413A740F4AF1E9C2B4BE6B2558CF4` | DNS only | Auto |
| 3 | CNAME | `@` | `violet-watch-store-api.azurewebsites.net` | Proxied (orange) | Auto |
| 4 | CNAME | `www` | `violet-watch-store-api.azurewebsites.net` | Proxied (orange) | Auto |

> Cloudflare flattens the apex `@` CNAME automatically. **Delete** the existing
> apex `A` record pointing at the DigitalOcean droplet (`138.68.154.176`) and any
> old `www` record first, otherwise the new records will conflict.

### 8a. F1 limitation — why a Worker is required

App Service **Free (F1) does not serve custom domains.** The binding is accepted
and shows `Verified`, but the hostname is never added to the site's
`hostNameSslStates`/`enabledHostNames`, so the front end replies
`404 Site Not Found`. Microsoft's docs state that custom domains are disabled on
Free/Shared plans. We stay on F1 ($0) and front the app with a free Cloudflare
Worker (Workers cost $0 within the 100,000 requests/day free allowance).

The F1 bindings were **removed** (keeping them while the front end does not
enable them can cause routing/SNI confusion); Azure now only sees requests for
the default hostname:

```powershell
& $az webapp config hostname delete -g rg-violet-prod --webapp-name violet-watch-store-api --hostname violetwatch.tech
& $az webapp config hostname delete -g rg-violet-prod --webapp-name violet-watch-store-api --hostname www.violetwatch.tech
```

> `az webapp config hostname delete` has no `--yes` flag (passing one exits with
> code 2); run it as shown.

### 8b. Cloudflare Worker (free plan)

Create **Workers & Pages → Create → Worker**, paste this code, deploy, then add
the two routes below. It preserves method, headers, body, path and query string,
rewrites `Host` to the Azure default hostname, and strips the proxy host headers
that App Service may treat as the effective hostname:

```js
export default { async fetch(request) {
  const url = new URL(request.url);
  const target = new URL(url.pathname + url.search, "https://violet-watch-store-api.azurewebsites.net");
  const headers = new Headers(request.headers);
  for (const h of ["host", "x-forwarded-host", "x-original-host"]) headers.delete(h);
  const hasBody = !["GET", "HEAD"].includes(request.method);
  return fetch(new Request(target, { method: request.method, headers,
    body: hasBody ? request.body : undefined, redirect: "manual" }));
} };
```

| Route | Zone |
| --- | --- |
| `violetwatch.tech/*` | `violetwatch.tech` |
| `www.violetwatch.tech/*` | `violetwatch.tech` |

- DNS records 3–4 must be **Proxied** (orange) for a Worker route to run.
- Set **SSL/TLS → Overview → Flexible**: Cloudflare serves HTTPS to visitors;
  the Worker always fetches Azure over HTTPS (valid `*.azurewebsites.net` cert),
  so no redirect loop and no origin certificate is needed.
- Keep `UseHttpsRedirection` out of the app (see 7b).

### 8c. Cutover order

1. Add records 1–4 (TXT as shown; CNAMEs proxied). Delete the old droplet records.
2. Make sure no custom hostname bindings remain on the F1 app (see 8a).
3. Deploy the Worker and add both routes.
4. Verify `https://violetwatch.tech/health` → 200, `/api/products` → 200
   (`totalCount=24`), a product image → 200, and unauthenticated
   `POST /api/products` → 401.
5. Verify `https://www.violetwatch.tech` serves the storefront and admin.
6. **Retire the DigitalOcean droplet** (`violet-watch-store-prod`,
   `138.68.154.176`, site root `/var/www/violet-watch-store`) once verified.

> **Local DNS cache gotcha:** after the cutover, `ipconfig /flushdns` only clears
> the Windows cache — the ISP resolver can still serve the dead droplet IP for
> the remainder of its TTL (observed: Virgin Media `194.168.4.100` serving
> `138.68.154.176` with ~7.4 h TTL, causing `curl: (28) Connection timeout`).
> Verify with `curl --resolve violetwatch.tech:443:104.21.93.173 ...` (Cloudflare
> edge). Fix locally by setting the adapter DNS to `1.1.1.1` / `1.0.0.1` (or wait
> for the TTL) and clearing the browser's DNS cache.

## Post-deploy

- Add the **$50 budget alert** manually (Cost Management → Budgets).
- Admin credential: the seeded `admin`/`123` was rotated to a strong 20-character
  password stored as `ADMIN_PASSWORD` in
  `C:\Users\Pc Dayan\.azure\violet-mysql.env`. Never re-print it; rotate again
  through `POST /api/auth/change-password` if needed.

