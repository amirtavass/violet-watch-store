# Violet Watch Store — Project Documentation

This folder documents the migration of the **Violet Watch Store** from its legacy
vanilla JS + PHP + MySQL stack on a DigitalOcean droplet to a modern
**TypeScript frontend + ASP.NET Core (.NET 10) backend** hosted on **Azure**.

## Index

| Document | Contents |
| --- | --- |
| [objectives.md](objectives.md) | Why we are doing this, goals and non-goals |
| [important-details.md](important-details.md) | Stack, infrastructure, credentials, and environment facts |
| [architecture.md](architecture.md) | Components, data flow, API reference, data model, frontend modules |
| [development.md](development.md) | Local setup, run/build commands, configuration, pitfalls |
| [deployment.md](deployment.md) | Azure deploy runbook and DNS cutover |
| [progress.md](progress.md) | What is done and what still needs to be done |
| [challenges.md](challenges.md) | Problems faced and how they were resolved |

See also the repository-root [AGENTS.md](../AGENTS.md) — the entry point for AI
agents (quick commands, conventions, and links back to this folder).

## At a glance

- **Live site (legacy):** `violetwatch.tech` on DigitalOcean droplet `violet-watch-store-prod` (IP `138.68.154.176`)
- **New API:** `https://violet-watch-store-api.azurewebsites.net` (Azure App Service, Linux, .NET 10)
- **New database:** Azure SQL (`sql-violet-prod.database.windows.net`, DB `amirSiteDb`)
- **Region:** `germanywestcentral` (forced by Azure for Students policy)
- **Frontend:** Vite + vanilla TypeScript (Angular deferred to a later phase)
