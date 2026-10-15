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

## 6. Azure zip deployment failing (open)

**Problem:** `az webapp deploy --type zip` fails with
`Error Code: DeploymentFailed / Kudu Status: 400`. The generic CLI message hides
the real Kudu error, and the SCM deployment log requires basic-auth credentials.

**Status / investigation:**
- Publishing credentials were retrieved via the ARM
  `config/publishingcredentials/list` API.
- The SCM REST call to the deployment log returned **HTTP 401**, so the
  credentials/scheme still need to be validated.
- A likely root cause (backslash paths from `Compress-Archive`) was already
  addressed by rebuilding the zip with .NET's `ZipFile`, but the deploy still
  fails — **under active debugging**.

**Next steps:** authenticate to the SCM endpoint correctly (confirm basic-auth
user format `$violet-watch-store-api`), read the full Kudu log, and/or try an
alternative deploy method (`az webapp up`, run-from-package, or Kudu zip push).
