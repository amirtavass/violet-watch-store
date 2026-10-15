# Objectives

## Primary goal

Replace the legacy **vanilla JS + PHP + MySQL** application running on a paid
DigitalOcean droplet with a modern, maintainable stack hosted on **Azure**
(covered by the GitHub Student Pack / Azure for Students credit), **without
breaking the live site** (`violetwatch.tech`).

## Target stack

| Layer | Legacy | Target |
| --- | --- | --- |
| Frontend | Vanilla JS + HTML + CSS | Vite + vanilla TypeScript (Angular deferred) |
| Backend | PHP 8.3 (procedural) | ASP.NET Core Minimal API (.NET 10) |
| Database | MySQL 8.0 | Azure SQL |
| Hosting | DigitalOcean droplet (paid) | Azure App Service (student credit) |
| Auth | Plaintext passwords, no real auth | JWT (HS256) + hashed passwords |

## Specific objectives

1. **Eliminate SQL injection** — the legacy PHP built queries by string
   concatenation. The rewrite uses EF Core with parameterised queries.
2. **Real authentication** — replace `admin/123` plaintext login with hashed
   passwords (`PasswordHasher`) and signed JWT bearer tokens.
3. **Zero-cost hosting** — move off the paid droplet onto the Azure for Students
   credit, staying within the always-free App Service and SQL grant.
4. **Preserve behaviour** — the public storefront and admin panel must look and
   behave the same (Persian/English i18n, product grid, pagination, search,
   admin CRUD with image upload).
5. **Preserve data** — all 24 existing products (including Persian text) and
   product images must be migrated intact.

## Non-goals (for now)

- **Angular** — explicitly deferred; will be discussed only after the current
  migration works end-to-end.
- **Re-hosting PHP** — the PHP app will not be redeployed; we cut straight to
  .NET and retire the droplet.
- **ParsSwim** — a second project on another droplet; its hosting migration
  (Next.js + Express + MongoDB → Atlas M0 / Azure) is tracked separately.
