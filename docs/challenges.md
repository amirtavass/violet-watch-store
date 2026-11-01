# Challenges Faced

## 1. Azure Database for MySQL not available on the student account

**Problem:** The plan was to use Azure Database for MySQL to mirror the legacy
MySQL database. However, on the Azure for Students subscription, every
`Microsoft.DBforMySQL` call failed — the capabilities API returned **HTTP 500**
for all SKUs, and no MySQL server could be provisioned.

**Resolution:** Switched to **Azure SQL**. A `GeneralPurpose` **serverless**
server (max 1 vCore) fits within the always-free student grant. The database is
`sql-violet-prod.database.windows.net` / `amirSiteDb` (user `violetadmin`). The
schema and 24-product seed were migrated to Azure SQL with Persian text intact.

## 2. Region restrictions on the student subscription

**Problem:** The student subscription only allows a fixed set of regions:
`switzerlandnorth`, `germanywestcentral`, `polandcentral`, `italynorth`,
`austriaeast`. **UK regions were blocked** (despite the account being a UK
university account), which initially blocked resource creation.

**Resolution:** All resources were provisioned in **`germanywestcentral`**.
Latency from the UK is acceptable for this application.

## 3. Budget alert creation blocked by RBAC

**Problem:** Creating a Cost Management budget via the CLI was denied by RBAC,
even though the account has the Owner role.

**Resolution:** Deferred — the $50 budget alert must be added manually in the
portal: **Cost Management → Budgets → $50**.

## 4. Legacy security problems (the reason for the rewrite)

**Problem:** The PHP app used string-concatenated SQL queries (SQL injection
throughout) and stored the admin password in plaintext (`admin`/`123`).

**Resolution:** The new API uses EF Core parameterised queries, `PasswordHasher`
for credentials, and JWT bearer tokens on all write endpoints. The seed keeps the
same `admin`/`123` login for parity, but it is now stored as a hash.

## 5. Toolchain / environment friction

- **.NET SDK is per-user** at `%USERPROFILE%\.dotnet` — every shell must set
  `$env:DOTNET_ROOT` and add it to PATH.
- **No winget and no Docker** on the dev machine — installs done manually.
- **npm blocked esbuild's install script** (npm 11 script approval). Fixed with
  `npm approve-scripts esbuild`.
- **PowerShell `Compress-Archive` produces backslash zip paths** that Linux Kudu
  rejects (400). Workaround: build the zip with
  `[System.IO.Compression.ZipFile]::CreateFromDirectory` (forward-slash paths).
- **Persian text / encoding:** the console renders Persian as mojibake while the
  files are valid UTF-8. All text extraction was done through Node scripts that
  read/write UTF-8, never by copy-pasting from the console.
- **Strict HTML parsing:** Vite's HTML parser rejected legacy markup such as
  `type="radio"name="gender"` (missing whitespace between attributes). Fixed in
  `admin.html`.
- **Font Awesome script** could not be bundled by Vite without `type="module"` —
  left as an external reference (warning only, not fatal).

## 6. Azure zip deployment failing (resolved)

**Problem:** `az webapp deploy --type zip` failed with
`Error Code: DeploymentFailed / Kudu Status: 400`. The generic CLI message hid
the real Kudu error, and the SCM deployment log required basic-auth credentials.

**Root cause:** Linux App Service ran **Oryx** on deploy. Because
`SCM_DO_BUILD_DURING_DEPLOYMENT` was unset, Kudu tried to build a zip that
already contained pre-compiled `dotnet publish` output, which failed the
deployment with HTTP 400. The backslash-path theory from `Compress-Archive`
was a red herring here; the zip paths were rebuilt deliberately anyway.

**Resolution (working):**
1. Set `SCM_DO_BUILD_DURING_DEPLOYMENT=false` in App Settings.
2. Set the Linux startup command: `dotnet Violet.Api.dll`.
3. Build the zip with a `System.IO.Compression.ZipArchive` loop that normalises
   every entry name with `.Replace('\', '/')` (verified `backslash_entries=0`).
4. `az webapp deploy --type zip --clean true` → `RuntimeSuccessful`.

No Kudu REST/AAD-token fallback was needed. For future debugging, the deployment
status is available through
`az webapp log deployment show` and the ARM `deploymentStatus` resource.

## 7. Missing legacy static assets

**Problem:** After the deploy, `/pictures/products/m2.jpg` (hero image on
`index.html`) returned 404 — the asset existed in the legacy tree but was never
copied into `web/public/pictures/products/`.

**Resolution:** Copied the legacy file into `web/public/pictures/products/` and
redeployed. `/css/style.css` also 404s on `admin.html`, but it 404s on the live
legacy site too (stale markup) — kept for parity.

## 8. Modals rendered invisible after the rewrite

**Problem:** Every modal (product detail, about us, contact us, admin login,
admin edit forms) opened "transparent" — no visible content.

**Root cause:** `.modal { opacity: 0 }` in the component CSS was designed for
the legacy JS, which explicitly set `modal.style.opacity = 1` on open
(`script/modules/modal.js:82`) and faded back to 0 on close. The rewritten
`modal.ts` only toggled `display`, so the modal was always fully transparent.
`@keyframes zoomIn` only animates `scale` and does not persist opacity.

**Secondary cause (admin only):** `admin.html` styles came from `/css/style.css`,
a file that never existed (404 on legacy as well), so the admin page had none of
the CSS variables, header, or modal base styles. `aboutUs`/`contactUs` were also
shown with `display:block` instead of `flex`.

**Resolution:** `modal.ts` restores the legacy opacity lifecycle (with a
guard so a pending close-hider cannot hide a re-opened modal) and uses `flex`
for about-us/contact modals. `admin.html` now loads `base.css`,
`components/header.css`, `components/modal.css` + `adminpage.css`, and
`adminpage.css` gained the layout rules it silently depended on: `main`
height/background, `.backgroundImage` positioning, `zoomIn`/`enterFromRight`
keyframes, and `.products nav` pagination styling.

## 9. SQL tier switch to Standard S0 rejected by max size

**Problem:** `az sql db update --edition Standard --service-objective S0` failed
with `InvalidMaxSizeTierCombination`: the database still had the
GeneralPurpose 32 GB `maxSizeBytes`, which Standard does not support.

**Resolution:** Pass an explicit size accepted by the tier:
`--max-size 250GB`. The database is now Standard S0 (10 DTU, 250 GB, Online).

## 10. Admin password was not `123`

**Problem:** Login with the documented `admin`/`123` returned 401 even though
the `Admins` row existed. The stored Identity hash did not verify against `123`
— the password had been changed outside this runbook, and no replacement was
recorded in the secrets file.

**Resolution:** Generated a valid ASP.NET Identity v3 hash with the real
`PasswordHasher` (a hand-rolled PBKDF2 hash in PowerShell was **not** accepted;
the PRF/format mapping must come from the framework), updated the row, logged in,
then rotated through `POST /api/auth/change-password` to a strong 20-character
password. That password is stored as `ADMIN_PASSWORD` in the secrets file; `123`
now returns 401 and the new password returns 200. Manual retry note: if the hash
is ever reset directly, use `dotnet`/`PasswordHasher`, never a custom encoder.

## 11. Cloudflare Flexible SSL vs HTTPS redirects

**Problem:** Cloudflare Flexible SSL proxies HTTPS visitors to App Service over
plain HTTP. If the app calls `UseHttpsRedirection()` (or relies on an HTTP-only
binding redirect), every request becomes a 307/308 that Cloudflare re-proxies to
HTTP, producing a redirect loop.

**Resolution:** `Program.cs` intentionally has no `UseHttpsRedirection`. TLS for
end users terminates at Cloudflare; `*.azurewebsites.net` still serves HTTPS
directly because App Service terminates TLS itself. If the origin is later
switched to Cloudflare **Full (strict)**, a certificate must be bound in App
Service first (F1 does not support App Service Managed Certificates).

## 12. Uploads lost on redeploy

**Problem:** Admin uploads were written under `wwwroot/images/products`, which a
`--clean true` zip deploy wipes.

**Resolution:** Uploads are written to the persistent `/home` volume
(`/home/site/uploads/products`), seeded images are copied there on startup, and
`/images/products` is served from that directory via `PhysicalFileProvider`.
`WEBSITES_ENABLE_APP_SERVICE_STORAGE=true` is set. Verified by deleting the
`wwwroot` copy of `m1.jpg` and still receiving 200 from `/images/products/m1.jpg`,
and by an authenticated upload landing in `/home`.

## 13. Custom domains bind but return 404 on F1

**Problem:** `az webapp config hostname add` succeeded for `violetwatch.tech`
and `www.violetwatch.tech` (both show `Verified`), DNS checks passed, but
`http://violetwatch.tech/health` returned Azure's `404 Site Not Found`. The
site's `hostNames` listed both, while `hostNameSslStates`/`enabledHostNames`
never did, even after delete/re-add, restart, and a direct ARM PATCH. The
default `*.azurewebsites.net` host served 200 from the same IP.

**Root cause:** App Service **Free (F1)** does not serve custom domains.
Microsoft's docs state custom domains are disabled on Free/Shared plans, and the
tutorial requires a paid tier. The control plane accepts the binding, but the
front end never enables it.

**Resolution:** Stay on F1 ($0). A free Cloudflare Worker fronts the app and
rewrites `Host` to `violet-watch-store-api.azurewebsites.net` while preserving
method, headers, body, path and query, and stripping `host`,
`x-forwarded-host` and `x-original-host` (code in
[deployment.md](deployment.md#8b-cloudflare-worker-free-plan)). Cloudflare
Origin Rules Host-rewrites are Enterprise-only, so a Worker is the free option.
The two App Service bindings were **removed** so Azure only serves its default
hostname. Worker logic was validated against the live app: `/health` 200,
`/api/products` 200 (`totalCount=24`), product image 200, `/admin.html` 200,
unauthenticated `POST /api/products` 401.

## 14. `violetwatch.tech` timed out after the droplet was destroyed

**Problem:** After configuring the Cloudflare Worker and deleting the
DigitalOcean droplet, `https://violetwatch.tech` did not load.

**Diagnosis:**
- NS for the zone: `alan.ns.cloudflare.com`, `norah.ns.cloudflare.com` (correct).
- Public DNS via `1.1.1.1`: apex and `www` both resolve to Cloudflare proxy IPs
  `104.21.93.173` / `172.67.213.69` (correct).
- The **local** resolver (`Resolve-DnsName` without `-Server`) still returned
  `138.68.154.176` for A with **TTL 26622 s (~7.4 h)**; the adapter uses Virgin
  Media DNS (`194.168.4.100`, `194.168.8.100`). `curl -Iv` therefore timed out
  connecting to the destroyed droplet (`curl: (28) Connection timeout`).
- Bypassing local DNS with
  `curl --resolve violetwatch.tech:443:104.21.93.173 https://violetwatch.tech/health`
  returned **200 `{"status":"ok"}`**, and every path (/, /admin.html,
  /api/products, images) returned 200 on both edge IPs. Azure origin `/health`
  also returned 200.

**Root cause:** stale DNS cache at the ISP resolver. Cloudflare, the Worker and
Azure were all correct; `ipconfig /flushdns` only clears the Windows cache, not
the upstream resolver.

**Resolution:** Set the adapter DNS to `1.1.1.1` / `1.0.0.1` (or wait for the
ISP TTL to expire) and clear the browser's DNS cache. No Cloudflare change was
needed — the zone was already proxied and the Worker route was serving.
