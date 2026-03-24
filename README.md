# Hans Portfolio API

Backend for Victor Hanszman's personal portfolio, built with ASP.NET Core Web API on .NET 10 and organized in layers so it can grow cleanly during the backend implementation phase.

## Current stack

- ASP.NET Core Web API (.NET 10)
- Controllers-based API
- OpenAPI document generation
- Swagger UI
- Entity Framework Core
- PostgreSQL / Neon

## Current solution structure

```txt
hans-portfolio-api/
  src/
    HansPortfolio.Api/
    HansPortfolio.Application/
    HansPortfolio.Domain/
    HansPortfolio.Infrastructure/
  tests/
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
- the first `DbContext` setup for PostgreSQL is in place
- database configuration can be loaded from `ConnectionStrings__PortfolioDatabase` or `PG*` environment variables
- a health check endpoint is available at `/health`
- a basic status endpoint is available at `/api/system/ping`
- the OpenAPI document is exposed at `/openapi/v1.json`
- Swagger UI is exposed at `/swagger`

## Prerequisites

- .NET SDK 10
- access to a PostgreSQL database
- a trusted local HTTPS development certificate if you want to use the `https` profile

If needed, trust the local .NET certificate with:

```powershell
dotnet dev-certs https --trust
```

## Important note before running the API

The API currently requires a valid database configuration during startup.

This means:

- `dotnet build` works without a database connection
- `dotnet run` will fail if database environment variables are missing
- if configuration is missing, startup will stop with a clear error saying database configuration was not provided

## Database configuration

You can configure the database in one of two ways.

### Option 1: Single connection string

```powershell
$env:ConnectionStrings__PortfolioDatabase = "Host=...;Port=5432;Database=...;Username=...;Password=...;Ssl Mode=Require;Channel Binding=Require"
```

### Option 2: Separate `PG*` environment variables

```powershell
$env:PGHOST = "..."
$env:PGDATABASE = "..."
$env:PGUSER = "..."
$env:PGPASSWORD = "..."
$env:PGPORT = "5432"
$env:PGSSLMODE = "Require"
$env:PGCHANNELBINDING = "Require"
```

## Quick start

Run the following commands from the API repository root:

```powershell
cd C:\VictorLocal\Projects\Personal\hans-portfolio-api
dotnet restore HansPortfolioApi.slnx
dotnet build HansPortfolioApi.slnx
```

After configuring the database environment variables, start the API in one of these modes.

### Run with HTTP

```powershell
dotnet run --project src/HansPortfolio.Api/HansPortfolio.Api.csproj --launch-profile http
```

### Run with HTTPS

```powershell
dotnet run --project src/HansPortfolio.Api/HansPortfolio.Api.csproj --launch-profile https
```

### Run with file watching

```powershell
dotnet watch --project src/HansPortfolio.Api/HansPortfolio.Api.csproj run --launch-profile https
```

## Exact local URLs

When the API is running:

- HTTP base URL: `http://localhost:5254/`
- HTTPS base URL: `https://localhost:7099/`
- HTTP Swagger UI: `http://localhost:5254/swagger`
- HTTPS Swagger UI: `https://localhost:7099/swagger`
- HTTP OpenAPI JSON: `http://localhost:5254/openapi/v1.json`
- HTTPS OpenAPI JSON: `https://localhost:7099/openapi/v1.json`
- HTTP health check: `http://localhost:5254/health`
- HTTPS health check: `https://localhost:7099/health`
- HTTP ping endpoint: `http://localhost:5254/api/system/ping`
- HTTPS ping endpoint: `https://localhost:7099/api/system/ping`

## What opens when you access the running API

At this stage, this repository is an API only. It does not serve the frontend application.

That means:

- opening `http://localhost:5254/` redirects to Swagger
- opening `https://localhost:7099/` redirects to Swagger
- the main visual page you should expect to see is Swagger UI

## Commands you can use to verify everything in the terminal

After the API is running, use these commands in another terminal:

```powershell
curl.exe http://localhost:5254/api/system/ping
curl.exe http://localhost:5254/health
curl.exe http://localhost:5254/openapi/v1.json
```

If you are using HTTPS:

```powershell
curl.exe https://localhost:7099/api/system/ping
curl.exe https://localhost:7099/health
curl.exe https://localhost:7099/openapi/v1.json
```

## Build commands

### Restore packages

```powershell
dotnet restore HansPortfolioApi.slnx
```

### Build the solution

```powershell
dotnet build HansPortfolioApi.slnx
```

### Build a single project

```powershell
dotnet build src/HansPortfolio.Api/HansPortfolio.Api.csproj
```

## Test commands

### Run tests

```powershell
dotnet test HansPortfolioApi.slnx
```

### Run tests with code coverage

```powershell
dotnet test HansPortfolioApi.slnx --collect:"XPlat Code Coverage"
```

Important:

- the `tests/` folder is still empty right now
- no automated test projects have been created yet in this sprint
- so the command above is documented for the project standard, but there are no real tests to execute yet

## Entity Framework Core commands

### Install the EF CLI tool

```powershell
dotnet tool install --global dotnet-ef
```

### Create a migration

```powershell
dotnet ef migrations add InitialFoundation --project src/HansPortfolio.Infrastructure/HansPortfolio.Infrastructure.csproj --startup-project src/HansPortfolio.Api/HansPortfolio.Api.csproj --output-dir Data/Migrations
```

### Apply migrations

```powershell
dotnet ef database update --project src/HansPortfolio.Infrastructure/HansPortfolio.Infrastructure.csproj --startup-project src/HansPortfolio.Api/HansPortfolio.Api.csproj
```

## Maintenance commands

### Check outdated packages

```powershell
dotnet list HansPortfolioApi.slnx package --outdated
```

### Restore again

```powershell
dotnet restore HansPortfolioApi.slnx
```

### Rebuild everything

```powershell
dotnet build HansPortfolioApi.slnx
```

## Setup history for this foundation

This repository already existed when the current backend implementation started, but it only contained the default Web API template.

Commands used to shape the current foundation:

```powershell
dotnet new classlib -n HansPortfolio.Application -o src/HansPortfolio.Application --framework net10.0 --no-restore
dotnet new classlib -n HansPortfolio.Domain -o src/HansPortfolio.Domain --framework net10.0 --no-restore
dotnet new classlib -n HansPortfolio.Infrastructure -o src/HansPortfolio.Infrastructure --framework net10.0 --no-restore
dotnet add src/HansPortfolio.Api/HansPortfolio.Api.csproj package Swashbuckle.AspNetCore
dotnet add src/HansPortfolio.Infrastructure/HansPortfolio.Infrastructure.csproj package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add src/HansPortfolio.Infrastructure/HansPortfolio.Infrastructure.csproj package Microsoft.EntityFrameworkCore.Design
dotnet add src/HansPortfolio.Infrastructure/HansPortfolio.Infrastructure.csproj package Microsoft.Extensions.Diagnostics.HealthChecks.EntityFrameworkCore
dotnet add src/HansPortfolio.Infrastructure/HansPortfolio.Infrastructure.csproj package Microsoft.Extensions.Configuration.Json
dotnet add src/HansPortfolio.Infrastructure/HansPortfolio.Infrastructure.csproj package Microsoft.Extensions.Configuration.EnvironmentVariables
```

## Troubleshooting

- if `dotnet build` succeeds but `dotnet run` fails immediately, the most likely cause is missing database configuration
- if `/health` fails, verify your PostgreSQL connection details first
- if the HTTPS profile fails, run `dotnet dev-certs https --trust`
- if you are using Neon, keep `Ssl Mode=Require`
- the default EF Core schema is currently `portfolio`

## Next backend steps

- Sprint B2: domain modeling and migrations
- Sprint B3: legacy data seed
- Sprint B4: authentication and authorization
- Sprint B5 and beyond: admin CRUD endpoints and aggregated dashboard endpoints
