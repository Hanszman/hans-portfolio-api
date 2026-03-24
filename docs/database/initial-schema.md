# Initial Portfolio Schema

This document describes the first database schema created in Sprint B2.

The schema is applied inside the `portfolio` PostgreSQL schema within the `hans-portfolio-db` database.

## Core tables

- `users`
- `projects`
- `experiences`
- `technologies`
- `formations`
- `spoken_languages`
- `customers`
- `jobs`
- `links`
- `image_assets`
- `tags`
- `portfolio_settings`

## Join tables

- `project_technologies`
- `experience_technologies`
- `formation_technologies`
- `project_experiences`
- `experience_customers`
- `experience_jobs`
- `project_tags`
- `technology_tags`
- `project_links`
- `experience_links`
- `formation_links`
- `project_image_assets`
- `experience_image_assets`
- `formation_image_assets`

## Modeling conventions

- all tables live under the `portfolio` schema
- primary keys use `uuid`
- table names are `snake_case`
- many enum properties are stored as strings for readability
- the `UsageContext` flags enum is stored as an integer
- auditable entities include `CreatedAt` and `UpdatedAt`
- many-to-many relationships use explicit join tables with composite keys

## Relationship overview

- a `project` can have many `technologies`, `experiences`, `tags`, `links`, and `image_assets`
- an `experience` can have many `technologies`, `customers`, `jobs`, `links`, and `image_assets`
- a `formation` can have many `technologies`, `links`, and `image_assets`
- a `technology` can belong to many `projects`, `experiences`, `formations`, and `tags`

## Migration files

The initial EF Core migration is stored in:

- `src/HansPortfolio.Infrastructure/Data/Migrations/20260324203631_InitialPortfolioSchema.cs`
- `src/HansPortfolio.Infrastructure/Data/Migrations/PortfolioDbContextModelSnapshot.cs`

## Commands

From the repository root:

```powershell
.\dev.ps1 migrations:list
.\dev.ps1 db:update
```

To create a new migration in the future:

```powershell
.\dev.ps1 migrations:add AddSomeNewTable
```
