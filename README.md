# Hans Portfolio API

Backend do portfolio pessoal do Victor Hanszman, iniciado em ASP.NET Core Web API com .NET 10 e estruturado para evoluir em camadas durante a Etapa 1 do plano de implementacao.

## Stack

- ASP.NET Core Web API (.NET 10)
- Controllers-based API
- OpenAPI + Swagger UI
- Entity Framework Core
- PostgreSQL / Neon

## Estrutura atual

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

## O que ja foi entregue na foundation

- remocao do template `WeatherForecast`
- reorganizacao da solution em camadas
- `DbContext` inicial configurado para PostgreSQL
- leitura de conexao por `ConnectionStrings__PortfolioDatabase` ou variaveis `PG*`
- endpoint de health check em `/health`
- endpoint inicial de status em `/api/system/ping`
- OpenAPI em `/openapi/v1.json`
- Swagger UI em `/swagger`

## Pre-requisitos

- .NET SDK 10
- acesso a um banco PostgreSQL
- certificado HTTPS local confiavel para o profile `https`:

```powershell
dotnet dev-certs https --trust
```

## Configuracao do banco

### Opcao 1: connection string unica

Defina a variavel abaixo antes de rodar a API:

```powershell
$env:ConnectionStrings__PortfolioDatabase = "Host=...;Port=5432;Database=...;Username=...;Password=...;Ssl Mode=Require;Channel Binding=Require"
```

### Opcao 2: variaveis `PG*`

```powershell
$env:PGHOST = "..."
$env:PGDATABASE = "..."
$env:PGUSER = "..."
$env:PGPASSWORD = "..."
$env:PGPORT = "5432"
$env:PGSSLMODE = "Require"
$env:PGCHANNELBINDING = "Require"
```

## Como rodar

### Restore e build

```powershell
dotnet restore HansPortfolioApi.slnx
dotnet build HansPortfolioApi.slnx
```

### HTTP

```powershell
dotnet run --project src/HansPortfolio.Api/HansPortfolio.Api.csproj --launch-profile http
```

API: `http://localhost:5254`

### HTTPS

```powershell
dotnet run --project src/HansPortfolio.Api/HansPortfolio.Api.csproj --launch-profile https
```

API: `https://localhost:7099`

### Desenvolvimento com watch

```powershell
dotnet watch --project src/HansPortfolio.Api/HansPortfolio.Api.csproj run --launch-profile https
```

## Swagger e OpenAPI

- Swagger UI HTTP: `http://localhost:5254/swagger`
- Swagger UI HTTPS: `https://localhost:7099/swagger`
- Documento OpenAPI HTTP: `http://localhost:5254/openapi/v1.json`
- Documento OpenAPI HTTPS: `https://localhost:7099/openapi/v1.json`

## Endpoints iniciais

- `GET /api/system/ping`
- `GET /health`

## Entity Framework Core

### Instalar CLI do EF

```powershell
dotnet tool install --global dotnet-ef
```

### Criar migration

```powershell
dotnet ef migrations add InitialFoundation --project src/HansPortfolio.Infrastructure/HansPortfolio.Infrastructure.csproj --startup-project src/HansPortfolio.Api/HansPortfolio.Api.csproj --output-dir Data/Migrations
```

### Aplicar migration

```powershell
dotnet ef database update --project src/HansPortfolio.Infrastructure/HansPortfolio.Infrastructure.csproj --startup-project src/HansPortfolio.Api/HansPortfolio.Api.csproj
```

## Seed

O seed dos dados legados ainda nao foi implementado. Isso entra na Sprint B3.

## Testes e coverage

Os projetos de teste ainda serao adicionados nas proximas sprints. Mesmo assim, estes sao os comandos-alvo que o repositorio deve suportar:

```powershell
dotnet test HansPortfolioApi.slnx
dotnet test HansPortfolioApi.slnx --collect:"XPlat Code Coverage"
```

## Build e manutencao

```powershell
dotnet list HansPortfolioApi.slnx package --outdated
dotnet restore HansPortfolioApi.slnx
dotnet build HansPortfolioApi.slnx
```

## Historico de setup desta base

O repositorio ja existia quando esta implementacao comecou, com um template padrao de Web API.

Comandos executados para reproduzir a foundation atual:

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

## Dicas de setup

- se o Swagger abrir, mas `/health` falhar, normalmente falta configurar a conexao com o PostgreSQL
- se o profile HTTPS falhar, execute `dotnet dev-certs https --trust`
- se for usar Neon, mantenha `Ssl Mode=Require`
- o schema padrao do `DbContext` foi definido como `portfolio`

## Proximos passos da Etapa 1

- Sprint B2: modelagem das entidades e migrations
- Sprint B3: seed dos dados legados
- Sprint B4: autenticacao e autorizacao
- Sprint B5+: CRUDs administrativos e endpoints agregados
