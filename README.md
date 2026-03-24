# Hans Portfolio API

NestJS backend for the Hans Portfolio remake. This repository now uses `Node.js + NestJS + TypeScript + Prisma + PostgreSQL/Neon` and replaces the previous `.NET` implementation.

This first backend sprint (`B1 - Foundation`) gives us:

- a NestJS API running on the default Express adapter
- automatic `.env` loading
- Prisma client generation
- Swagger / OpenAPI
- system endpoints to prove the API and database are working
- unit tests, e2e tests, and `100%` coverage for the meaningful B1 target

## Stack

- `Node.js 24`
- `NestJS 11`
- `TypeScript`
- `Prisma 6`
- `PostgreSQL / Neon`
- `Jest + Supertest`

## Current Endpoints

- `GET /api/system/ping`
- `GET /api/system/database`
- `GET /health`
- `GET /swagger`
- `GET /swagger-json`

## Project Structure

```text
hans-portfolio-api/
├─ prisma/
│  └─ schema.prisma
├─ src/
│  ├─ app.module.ts
│  ├─ main.ts
│  ├─ config/
│  │  └─ runtime-env.ts
│  ├─ modules/
│  │  └─ system/
│  │     ├─ controllers/
│  │     ├─ contracts/
│  │     ├─ services/
│  │     └─ system.module.ts
│  └─ prisma/
│     ├─ prisma.module.ts
│     └─ prisma.service.ts
└─ test/
   └─ system.e2e-spec.ts
```

## How NestJS Is Organized

If you come from `Node.js + Express`, the mental model is:

- `main.ts`: application bootstrap
- `app.module.ts`: root module that wires the app together
- `module`: groups a feature area
- `controller`: defines routes and HTTP handlers
- `service`: contains application logic
- `prisma.service.ts`: shared database client

Unlike a typical Express project, NestJS usually does not use one central `routes.ts` file. Routes are defined close to each controller.

Examples in this project:

- [system.controller.ts](/c:/VictorLocal/Projects/Personal/hans-portfolio-api/src/modules/system/controllers/system.controller.ts)
- [health.controller.ts](/c:/VictorLocal/Projects/Personal/hans-portfolio-api/src/modules/system/controllers/health.controller.ts)

Those decorators are what connect URLs to handlers:

- `@Controller('api/system')`
- `@Get('ping')`
- `@Get('database')`
- `@Controller('health')`

## Requirements

- `Node.js 24`
- `npm 11+`
- access to the `hans-portfolio-db` PostgreSQL database

## Environment Setup

Create your local env file if needed:

```powershell
Copy-Item .env.example .env
```

Main variables:

- `APP_NAME`
- `NODE_ENV`
- `PORT`
- `SWAGGER_PATH`
- `DATABASE_URL`
- `DIRECT_URL`

This project also supports the legacy `PG*` variables during the transition from the old backend:

- `PGHOST`
- `PGDATABASE`
- `PGUSER`
- `PGPASSWORD`
- `PGPORT`
- `PGSSLMODE`
- `PGCHANNELBINDING`
- `PGSCHEMA`

Important note:

- NestJS runtime can derive `DATABASE_URL` from the `PG*` variables.
- Prisma CLI commands such as migrations and studio expect `DATABASE_URL` to exist in `.env`.
- This repository is already configured locally for the current machine.

## Install and Run

From the root of `hans-portfolio-api`:

```powershell
cd C:\VictorLocal\Projects\Personal\hans-portfolio-api
npm install
npm run start:dev
```

`npm install` already triggers `prisma generate` automatically through `postinstall`.

The API will run at:

- `http://localhost:3000`

Open these URLs in the browser:

- API base: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/swagger`
- Swagger JSON: `http://localhost:3000/swagger-json`
- Health endpoint: `http://localhost:3000/health`
- Ping endpoint: `http://localhost:3000/api/system/ping`
- Database diagnostics endpoint: `http://localhost:3000/api/system/database`

## Build

```powershell
npm run build
```

This command compiles the Nest app only. Prisma client generation happens automatically on `npm install`, and you can rerun it manually whenever `prisma/schema.prisma` changes.

## Tests

Unit tests:

```powershell
npm run test
```

E2E tests:

```powershell
npm run test:e2e
```

Coverage:

```powershell
npm run test:cov
```

Current B1 validation status:

- unit tests: passing
- e2e tests: passing
- meaningful B1 target coverage: `100%`

Coverage exclusions are intentional for files that are mostly framework wiring or declarative metadata, such as:

- Nest module files
- response contract classes
- controller files already validated through e2e
- Prisma infrastructure wrapper

## How To Prove the Database Connection Works

Start the API:

```powershell
npm run start:dev
```

Then call:

```powershell
curl.exe http://localhost:3000/api/system/database
```

That endpoint executes a real PostgreSQL probe and returns values such as:

- `databaseName`
- `currentSchema`
- `serverVersion`
- `executedAtUtc`

You can also check the health endpoint:

```powershell
curl.exe http://localhost:3000/health
```

And the simple ping:

```powershell
curl.exe http://localhost:3000/api/system/ping
```

## Prisma Commands

Generate the client:

```powershell
npm run prisma:generate
```

Create a development migration:

```powershell
npm run prisma:migrate:dev -- --name your_migration_name
```

Apply already-created migrations in deploy mode:

```powershell
npm run prisma:migrate:deploy
```

Open Prisma Studio:

```powershell
npm run prisma:studio
```

## Database Workflow In This Stack

The normal flow for `NestJS + Prisma + PostgreSQL` is:

1. Add or update the data model in `prisma/schema.prisma`.
2. Run `npm run prisma:migrate:dev -- --name your_migration_name`.
3. Prisma generates SQL migrations and updates the Prisma client.
4. Use Prisma inside Nest services to read or write data.
5. Add DTO validation and route handlers in controllers.
6. Add tests for the real behavior of the new code.

For this project:

- `B1` only establishes the foundation and database connectivity.
- `B2` will introduce the first real portfolio models and migrations.
- `B3` will introduce seed/import logic for legacy portfolio data.

At this moment there are no portfolio tables created by Prisma yet. The database was intentionally reset before this remake so that the migration history can start clean in the new Node/Nest/Prisma stack.

## Swagger

Swagger is enabled through Nest:

- UI: `GET /swagger`
- JSON document: `GET /swagger-json`

The current Swagger document includes:

- `/api/system/ping`
- `/api/system/database`
- `/health`

## Notes For Beginners

- `SystemModule` is the first real feature module.
- `SystemDiagnosticsService` contains the logic for ping, health, and database diagnostics.
- `PrismaService` is the shared database client.
- `runtime-env.ts` prepares environment variables before the Nest app starts.

If you want to inspect the most important B1 files first, start here:

- [main.ts](/c:/VictorLocal/Projects/Personal/hans-portfolio-api/src/main.ts)
- [app.module.ts](/c:/VictorLocal/Projects/Personal/hans-portfolio-api/src/app.module.ts)
- [runtime-env.ts](/c:/VictorLocal/Projects/Personal/hans-portfolio-api/src/config/runtime-env.ts)
- [system.module.ts](/c:/VictorLocal/Projects/Personal/hans-portfolio-api/src/modules/system/system.module.ts)
- [system.controller.ts](/c:/VictorLocal/Projects/Personal/hans-portfolio-api/src/modules/system/controllers/system.controller.ts)
- [health.controller.ts](/c:/VictorLocal/Projects/Personal/hans-portfolio-api/src/modules/system/controllers/health.controller.ts)
- [system-diagnostics.service.ts](/c:/VictorLocal/Projects/Personal/hans-portfolio-api/src/modules/system/services/system-diagnostics.service.ts)
- [schema.prisma](/c:/VictorLocal/Projects/Personal/hans-portfolio-api/prisma/schema.prisma)
