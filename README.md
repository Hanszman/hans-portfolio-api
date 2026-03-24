# Hans Portfolio API

Backend for Victor Hanszman's personal portfolio, built with ASP.NET Core Web API on .NET 10.

The project is organized in layers so the backend can grow in a clean way as new domain models, migrations, admin endpoints, authentication, and dashboard features are added.

## Current stack

- ASP.NET Core Web API (.NET 10)
- Controllers-based API
- OpenAPI document generation
- Swagger UI
- Entity Framework Core
- PostgreSQL / Neon
- xUnit integration tests

## Current solution structure

```txt
hans-portfolio-api/
  src/
    HansPortfolio.Api/
    HansPortfolio.Application/
    HansPortfolio.Domain/
    HansPortfolio.Infrastructure/
  tests/
    HansPortfolio.Api.Tests/
  docs/
    api/
    database/
  scripts/
    db/
    setup/
```

## What is already implemented

- the default `WeatherForecast` template was removed
- the solution was reorganized into `Api`, `Application`, `Domain`, and `Infrastructure`
- a first `DbContext` setup for PostgreSQL is in place
- database configuration can be loaded from `ConnectionStrings__PortfolioDatabase` or `PG*` environment variables
- `.env` loading is supported during application startup and EF Core design-time operations
- the initial portfolio schema and first EF Core migration were created in Sprint B2
- the initial migration was already applied to `hans-portfolio-db`
- the local tool manifest now includes `dotnet-ef` and `reportgenerator`
- Swagger UI is available at `/swagger`
- the OpenAPI document is available at `/openapi/v1.json`
- the health endpoint is available at `/health`
- the ping endpoint is available at `/api/system/ping`
- the database diagnostics endpoint is available at `/api/system/database`
- automated tests exist for the currently exposed system endpoints
- model validation tests now exist for the Sprint B2 schema

## Layer overview

This is the beginner-friendly meaning of each project in the solution.

### `HansPortfolio.Api`

This is the HTTP layer.

It is responsible for:

- controllers and routes
- request and response contracts
- Swagger / OpenAPI exposure
- application startup and dependency wiring
- translating HTTP requests into application calls

If you think in frontend terms, this is the layer that exposes the backend interface to the outside world.

### `HansPortfolio.Application`

This is the use-case layer.

It is responsible for:

- orchestrating business flows
- defining service interfaces
- defining DTOs used between layers
- keeping application logic independent from HTTP and database details

In simple terms: this layer says what the system should do, without caring yet if the implementation uses PostgreSQL, files, queues, or something else.

### `HansPortfolio.Domain`

This is the core business layer.

It is responsible for:

- entities
- value objects
- enums
- domain rules
- business concepts that should remain valid regardless of framework or database

In simple terms: this is where the real portfolio concepts will live, such as project, experience, skill, timeline item, certification, and so on.

### `HansPortfolio.Infrastructure`

This is the technical implementation layer.

It is responsible for:

- database access
- Entity Framework Core
- `DbContext`
- migrations
- repositories or service implementations
- external integrations
- environment/configuration helpers

Yes: this is the layer currently responsible for connecting to PostgreSQL and implementing the database-related behavior declared by the `Application` layer.

## How routing works in this API

The standard ASP.NET Core Web API pattern is controller routing with route attributes.

That means:

- route registration is activated globally with `MapControllers()`
- each controller declares its own route with attributes such as `[Route(...)]` and `[HttpGet(...)]`
- ASP.NET Core automatically matches the incoming URL to the controller action

In this project, the route activation happens through the endpoint registration flow in `WebApplicationExtensions`, and the route strings themselves are centralized in `src/HansPortfolio.Api/Routing/ApiRoutes.cs`.

Examples:

- `/api/system/ping` is defined by `SystemController`
- `/api/system/database` is defined by `DatabaseDiagnosticsController`
- `/health` is defined by `HealthController`

So the answer is: yes, .NET automatically routes requests to controllers once `MapControllers()` is enabled, and no, a giant Express-style routes file is not the most common pattern for APIs in ASP.NET Core.

Still, to make the project easier to navigate, this repository now has a dedicated route catalog file where the route strings are centralized.

## Current database status

Sprint B2 is complete.

Right now:

- the API can open a PostgreSQL connection
- the health check can verify the EF Core database dependency
- the database diagnostics endpoint can execute a real SQL query
- the initial portfolio schema exists in the `portfolio` PostgreSQL schema
- the first migration was applied to the `hans-portfolio-db` database
- the schema documentation is available in `docs/database/initial-schema.md`

That means the database connection is ready and the first real portfolio tables now exist.

## How database configuration works

This repository supports a local `.env` file, similar to what you usually do in frontend projects.

The API loads `.env` automatically during startup, and the design-time EF Core factory also loads it for migrations.

Files in the repository root:

- `.env.example` -> template you can copy after cloning
- `.env` -> local file with your real values, ignored by Git

Recommended flow after cloning:

```powershell
Copy-Item .env.example .env
```

Then edit `.env` with your real database values.

You can configure the database in one of two ways.

### Option 1: Single connection string

```env
ConnectionStrings__PortfolioDatabase=Host=...;Port=5432;Database=...;Username=...;Password=...;Ssl Mode=Require;Channel Binding=Require
```

### Option 2: Separate `PG*` variables

```env
PGHOST=...
PGDATABASE=...
PGUSER=...
PGPASSWORD=...
PGPORT=5432
PGSSLMODE=Require
PGCHANNELBINDING=Require
```

If `.env` already exists and has valid values, you do not need to run `$env:...` commands every time.

## How to prove the `.env` and database connection are working

There are now three quick ways to validate the database setup.

### 1. Open Swagger

Run the API and open:

- `http://localhost:5254/swagger`
- or `https://localhost:7099/swagger`

You should see:

- `GET /api/system/ping`
- `GET /api/system/database`
- `GET /health`

### 2. Call the health endpoint

```powershell
curl.exe http://localhost:5254/health
```

If the database dependency is healthy, the payload should show a healthy status.

### 3. Call the database diagnostics endpoint

```powershell
curl.exe http://localhost:5254/api/system/database
```

This endpoint runs a real SQL query against PostgreSQL and returns values such as:

- `databaseName`
- `currentSchema`
- `serverVersion`
- `executedAtUtc`

If this endpoint returns `200 OK`, then:

- the API started correctly
- `.env` was read correctly
- the connection string was built correctly
- the app was able to connect to PostgreSQL
- the SQL query executed successfully

Important: this endpoint does not depend on portfolio tables. It uses built-in PostgreSQL functions, so it remains safe even if future schema work is still in progress.

## Prerequisites

- .NET SDK 10
- access to a PostgreSQL database
- a trusted local HTTPS development certificate if you want to use the `https` profile

If needed, trust the local .NET certificate with:

```powershell
dotnet dev-certs https --trust
```

## Quick start

Run the following commands from the repository root:

```powershell
cd C:\VictorLocal\Projects\Personal\hans-portfolio-api
Copy-Item .env.example .env
# edit .env if needed
dotnet restore
dotnet build
```

After that, use the helper script for daily work.

### Run with HTTP

```powershell
.\dev.ps1 run
```

### Run with HTTPS

```powershell
.\dev.ps1 run:https
```

### Stop a previously running API process

```powershell
.\dev.ps1 stop
```

### Run tests

```powershell
.\dev.ps1 test
```

### Run tests with coverage

```powershell
.\dev.ps1 test:coverage
```

## Recommended commands

These are the commands I recommend using from now on.

### Native .NET commands

```powershell
dotnet restore
dotnet build
```

### Repository helper commands

```powershell
.\dev.ps1 run
.\dev.ps1 run:https
.\dev.ps1 stop
.\dev.ps1 test
.\dev.ps1 test:coverage
.\dev.ps1 migrations:list
.\dev.ps1 db:update
```

Why the helper script exists:

- `dotnet run:https` and `dotnet test:coverage` do not exist as native .NET CLI commands
- the helper script avoids retyping the project path and launch profile
- the helper script stops an older running API process before build/test/run, which helps avoid DLL lock errors on Windows

If PowerShell blocks the script, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\dev.ps1 run
```

## Exact local URLs

When the API is running:

- HTTP base URL: `http://localhost:5254/`
- HTTPS base URL: `https://localhost:7099/`
- HTTP Swagger UI: `http://localhost:5254/swagger`
- HTTPS Swagger UI: `https://localhost:7099/swagger`
- HTTP OpenAPI JSON: `http://localhost:5254/openapi/v1.json`
- HTTPS OpenAPI JSON: `https://localhost:7099/openapi/v1.json`
- HTTP ping endpoint: `http://localhost:5254/api/system/ping`
- HTTPS ping endpoint: `https://localhost:7099/api/system/ping`
- HTTP database diagnostics endpoint: `http://localhost:5254/api/system/database`
- HTTPS database diagnostics endpoint: `https://localhost:7099/api/system/database`
- HTTP health endpoint: `http://localhost:5254/health`
- HTTPS health endpoint: `https://localhost:7099/health`

## What opens at the base URL

At this stage, this repository is API-only. It does not serve the frontend application.

That means:

- opening `http://localhost:5254/` redirects to Swagger
- opening `https://localhost:7099/` redirects to Swagger

## Terminal verification commands

After the API is running, use these commands in another terminal:

```powershell
curl.exe http://localhost:5254/api/system/ping
curl.exe http://localhost:5254/api/system/database
curl.exe http://localhost:5254/health
curl.exe http://localhost:5254/openapi/v1.json
```

If you are using HTTPS:

```powershell
curl.exe https://localhost:7099/api/system/ping
curl.exe https://localhost:7099/api/system/database
curl.exe https://localhost:7099/health
curl.exe https://localhost:7099/openapi/v1.json
```

## Current automated test coverage

Automated tests currently validate:

- `GET /api/system/ping`
- `GET /api/system/database`
- `GET /health`
- OpenAPI documentation for those routes

Current focused coverage target:

- `DatabaseDiagnosticsController`: 100%
- `HealthController`: 100%
- `SystemController`: 100%

Additional B2 model validation tests now verify:

- registered EF Core tables
- schema name
- unique indexes
- enum conversions
- composite keys for join tables

Coverage output is generated here:

- `coverage-report/index.html`
- `coverage-report/Summary.txt`

## Normal Entity Framework Core workflow for this project

This is the usual flow we will follow when we start creating real portfolio data structures.

### Step 1: create the domain model

Add the business entities to `HansPortfolio.Domain`.

Examples for future steps:

- `Project`
- `Experience`
- `Skill`
- `Certification`
- `Education`

### Step 2: define application contracts and use cases

Add DTOs, commands, queries, interfaces, and use-case services to `HansPortfolio.Application`.

Examples:

- create project command
- list experiences query
- public portfolio summary DTO

### Step 3: map the entities in infrastructure

Add or update EF Core configuration in `HansPortfolio.Infrastructure`.

Typical work here:

- add `DbSet<TEntity>` properties to `PortfolioDbContext`
- create entity type configuration classes
- define schema, table names, indexes, and relationships

### Step 4: create a migration

After the model is mapped, generate a migration:

```powershell
.\dev.ps1 migrations:add AddSomeNewChange
```

This creates the C# migration files that describe how to create or change the database schema.

### Step 5: apply the migration to the database

```powershell
.\dev.ps1 db:update
```

This is the step that actually creates or updates tables in PostgreSQL.

### Step 6: add seed data when needed

If we need initial or legacy data, we can add seed logic later.

Typical seed options:

- EF Core `HasData` for very static data
- startup seed service for more dynamic scenarios
- one-off migration or import script for legacy portfolio data

### Step 7: expose CRUD or query endpoints

Once the schema exists and the application services are ready, the API layer exposes the endpoints that read or write that data.

## Entity Framework Core commands

The repository already uses a local tool manifest, so you do not need a global EF CLI installation.

```powershell
dotnet tool restore
```

### List migrations

```powershell
.\dev.ps1 migrations:list
```

### Create a migration

```powershell
.\dev.ps1 migrations:add AddSomeNewChange
```

### Apply migrations

```powershell
.\dev.ps1 db:update
```

### Remove the last migration before it is applied

```powershell
dotnet dotnet-ef migrations remove --project src/HansPortfolio.Infrastructure/HansPortfolio.Infrastructure.csproj --startup-project src/HansPortfolio.Api/HansPortfolio.Api.csproj
```

## Maintenance commands

### Check outdated packages

```powershell
dotnet list HansPortfolioApi.sln package --outdated
```

### Rebuild everything

```powershell
dotnet build
```

## Troubleshooting

- if `dotnet build` fails with a DLL lock error on Windows, stop the running API first with `.\dev.ps1 stop`
- if `.\dev.ps1 run` fails, make sure `.env` exists and contains valid database values
- if `.\dev.ps1 run` fails because PowerShell blocks scripts, use `powershell -ExecutionPolicy Bypass -File .\dev.ps1 run`
- if `/api/system/database` fails, the API reached PostgreSQL but the connection or query did not complete correctly
- if `/health` fails, verify the PostgreSQL credentials in `.env`
- if the HTTPS profile fails, run `dotnet dev-certs https --trust`
- if you are using Neon, keep `Ssl Mode=Require`
- the default EF Core schema is currently `portfolio`

## Language note

Repository files are now standardized in English.

If the terminal still prints Portuguese messages such as `Compilação com êxito` or `Falha da compilação`, that comes from the local .NET SDK / Windows language settings on your machine, not from the codebase itself.

## Next backend steps

- Sprint B3: legacy data seed
- Sprint B4: authentication and authorization
- Sprint B5 and beyond: admin CRUD endpoints and aggregated dashboard endpoints
