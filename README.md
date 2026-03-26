# Hans Portfolio API

A **NestJS + TypeScript Back-End API** that powers the Hans Portfolio and show all the projects I've already worked.

## Features

- ⚛️ **NestJS 11.1.17** with **TypeScript 5.9.3** for a structured and type-safe back-end
- 🔍 **Prisma** with **PostgreSQL / Neon** for database access and migrations
- 📖 **Swagger / OpenAPI** for API documentation
- ✅ **Jest + Supertest** for unit and e2e testing
- 📊 **Test Coverage (V8)** with meaningful target at **100%**
- 🧹 **ESLint + Prettier** for code quality and formatting
- ♾️ Deployed by **Vercel** at https://hans-portfolio-api.vercel.app/
- **Node Version to build this project: 24.14.1 and npm 11.11.0**

## 🧑‍💻 Development

Clone the repo and install dependencies:

```bash
git clone https://github.com/Hanszman/hans-portfolio-api.git
cd hans-portfolio-api
npm install
```

Start the dev server:

```bash
npm run start:dev
```

Start the server:

```bash
npm run start
```

When the API starts, the bootstrap prints the local URLs directly in the terminal:

- `Application is running on: http://localhost:3000`
- `Swagger is running on: http://localhost:3000/swagger`
- `Health endpoint is available at: http://localhost:3000/health`

Run tests:

```bash
npm run test
```

Run e2e tests:

```bash
npm run test:e2e
```

Run tests with coverage:

```bash
npm run test:coverage
```

`test:coverage` runs:

- the unit test suite with coverage
- the e2e test suite right after

Lint code:

```bash
npm run lint
```

Lint and auto-fix:

```bash
npm run lint:fix
```

Format files:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

Build the project:

```bash
npm run build
```

## 🛠️ Environment Variables

Create your local env file:

```bash
Copy-Item .env.example .env
```

This project currently supports both:

- Prisma-style connection variables
- legacy `PG*` variables kept during the migration from the previous backend

The variables are organized in this order:

```bash
APP_NAME
NODE_ENV
PORT
SWAGGER_PATH
DATABASE_URL
DIRECT_URL
PGHOST
PGDATABASE
PGUSER
PGPASSWORD
PGPORT
PGSSLMODE
PGCHANNELBINDING
PGSCHEMA
```

Important notes:

- Nest runtime can derive `DATABASE_URL` from the `PG*` variables
- Prisma CLI commands expect `DATABASE_URL` to exist in `.env`

## 🚀 API Routes

Current routes:

- `GET /`
- `GET /system`
- `GET /system/ping`
- `GET /system/database`
- `GET /system/health`
- `GET /health`
- `GET /swagger`
- `GET /swagger-json`

Useful local URLs:

- `http://localhost:3000`
- `http://localhost:3000/swagger`
- `http://localhost:3000/swagger-json`
- `http://localhost:3000/system`
- `http://localhost:3000/system/ping`
- `http://localhost:3000/system/database`
- `http://localhost:3000/system/health`
- `http://localhost:3000/health`

## 🔀 Routing Organization

NestJS does **not** usually use one central Express-style `routes.ts` file.

The standard NestJS pattern is:

- routes are declared with decorators inside controllers
- modules load those controllers
- Nest registers everything automatically on top of the Express adapter

In this project, route paths are centralized in:

- [api-routes.ts](/.../hans-portfolio-api/src/routing/api-routes.ts)

The current source structure follows a feature-first direction:

- `src/modules/system` for the system feature
- `src/prisma` for shared database infrastructure
- `src/config` for runtime configuration
- `src/routing` for route path constants

And the route handlers are defined in:

- [system.controller.ts](/.../hans-portfolio-api/src/modules/system/controllers/system/system.controller.ts)
- [ping.controller.ts](/.../hans-portfolio-api/src/modules/system/controllers/ping/ping.controller.ts)
- [database-diagnostics.controller.ts](/.../hans-portfolio-api/src/modules/system/controllers/database/database-diagnostics.controller.ts)
- [health.controller.ts](/.../hans-portfolio-api/src/modules/system/controllers/health/health.controller.ts)

Swagger ordering is currently controlled in:

- [main.ts](/.../hans-portfolio-api/src/main.ts)

through:

- `tagsSorter: 'alpha'`
- `operationsSorter: 'alpha'`

So there is no single Express route file, but there is a single file for route path constants plus the standard Nest controller-based registration.

Canonical routes live under `/system/*`.

Operational aliases:

- `/` is an alias for the ping response
- `/health` is an alias for `/system/health`

Those aliases are intentionally hidden from Swagger so the UI stays cleaner.

Service responsibilities are split by concern:

- `PingService`
- `DatabaseDiagnosticsService`
- `HealthService`
- `SystemService` as the aggregator for the `system` feature

## 📁 Code Organization Standards

This API follows a feature-first NestJS structure.

Each feature must live under `src/modules/<feature-name>`, for example:

- `src/modules/system`
- `src/modules/auth`
- `src/modules/project`
- `src/modules/experience`

Inside each feature, the default folders are:

- `controllers/` for HTTP handlers
- `services/` for business and orchestration logic
- `contracts/` for API request/response DTOs
- `types/` for internal TypeScript-only shapes used by the implementation

Current examples:

- [ping.controller.ts](/.../hans-portfolio-api/src/modules/system/controllers/ping/ping.controller.ts)
- [health.controller.ts](/.../hans-portfolio-api/src/modules/system/controllers/health/health.controller.ts)
- [database-diagnostics.response.ts](/.../hans-portfolio-api/src/modules/system/contracts/database/database-diagnostics.response.ts)
- [database-diagnostics.types.ts](/.../hans-portfolio-api/src/modules/system/types/database-diagnostics.types.ts)

Naming rules adopted for the project:

- one feature folder per domain/capability under `modules`
- one controller/service pair per responsibility when the concern is distinct
- one contracts file group per responsibility when the HTTP payloads are distinct
- one types file per responsibility using the pattern `<feature-or-responsibility>.types.ts`

Examples of the adopted types pattern:

- `database-diagnostics.types.ts`
- `project.types.ts`
- `experience.types.ts`

When a feature needs multiple internal types, they should stay together in the same `*.types.ts` file for that feature or responsibility instead of being split into many tiny type files too early.

Contracts vs types:

- `contracts/` describe the HTTP contract of the API
- request DTOs belong in `contracts/`
- response DTOs belong in `contracts/`
- `types/` are for internal implementation details, such as raw query rows, mapper inputs, helper shapes, and non-public structures

Route conventions adopted for the project:

- canonical routes should live under the feature base path whenever possible
- operational aliases are allowed when they improve usability
- aliases should stay hidden from Swagger when they are only convenience endpoints

Current examples:

- canonical ping route: `GET /system/ping`
- canonical health route: `GET /system/health`
- alias ping route: `GET /`
- alias health route: `GET /health`

Test conventions adopted for the project:

- unit tests stay close to the code they validate as `*.spec.ts`
- e2e tests stay in the top-level `test/` folder
- usually one e2e file per feature or module, for example `test/system.e2e-spec.ts`
- `npm run test:coverage` must validate the coverage target and also run the e2e suite
- generated files, trivial contracts, and internal `types` files may be excluded from coverage when direct execution-based measurement adds no value

## 📖 Swagger Documentation

Swagger UI:

```bash
http://localhost:3000/swagger
```

Swagger JSON:

```bash
http://localhost:3000/swagger-json
```

## 🔍 Prisma

Generate the Prisma client:

```bash
npm run prisma:generate
```

Workspace note:

- this project is currently pinned to Prisma ORM 6 in [.vscode/settings.json](/.../hans-portfolio-api/.vscode/settings.json) through `prisma.pinToPrisma6`
- this avoids false VS Code diagnostics caused by the Prisma extension validating the schema with Prisma 7 rules while the project is intentionally on Prisma `6.19.2`

Format the Prisma schema:

```bash
npm run prisma:format
```

Validate the Prisma schema:

```bash
npm run prisma:validate
```

Create a development migration:

```bash
npm run prisma:migrate:dev -- --name your_migration_name
```

Apply existing migrations:

```bash
npm run prisma:migrate:deploy
```

Check migration status:

```bash
npm run prisma:migrate:status
```

Open Prisma Studio:

```bash
npm run prisma:studio
```

Apply the versioned seed snapshot:

```bash
npm run prisma:seed
```

Reset the portfolio content tables only:

```bash
npm run prisma:seed:reset
```

Refresh the versioned snapshot from the current database state:

```bash
npm run prisma:seed:snapshot
```

Current seed flow:

- `npm run prisma:seed` applies pending migrations, clears the current portfolio content tables, and reinserts the versioned snapshot stored in `prisma/data/portfolio-seed.snapshot.json`
- `npm run prisma:seed:reset` clears the current portfolio content tables without reseeding
- `npm run prisma:seed:snapshot` exports the current database state into the versioned snapshot file
- the frontend media lives in `../hans-portfolio-app/src/assets/img` as normal versioned project files

More details live in:

- [seed-snapshot.md](/.../hans-portfolio-api/docs/database/seed-snapshot.md)

## 🗃️ Current Database Schema

Sprint `B2` introduced the first real portfolio schema in Prisma and applied it to the `portfolio` schema inside `hans-portfolio-db`.

Core entities currently modeled:

- `User`
- `Project`
- `Experience`
- `Technology`
- `Formation`
- `SpokenLanguage`
- `Customer`
- `Job`
- `Link`
- `ImageAsset`
- `Tag`
- `PortfolioSetting`

Important relationship tables currently modeled:

- `project_technology`
- `experience_technology`
- `formation_technology`
- `project_experience`
- `experience_customer`
- `experience_job`
- `project_tag`
- `technology_tag`
- `project_link`
- `experience_link`
- `formation_link`
- `project_image_asset`
- `experience_image_asset`
- `formation_image_asset`

Schema notes:

- Prisma model names stay in PascalCase
- Prisma fields stay in camelCase
- physical database table names stay in snake_case singular form through `@@map(...)`
- technology usage join tables already support metadata such as `level`, `frequency`, and `contexts`
- Sprint `B3` also added optional `icon` fields to `Project`, `Experience`, `Formation`, `SpokenLanguage`, `Customer`, and `Job`
- imported icon and media paths are stored as frontend-ready URLs under `/assets/img/...`

Detailed schema notes live in:

- [initial-schema.md](/.../hans-portfolio-api/docs/database/initial-schema.md)
- [seed-snapshot.md](/.../hans-portfolio-api/docs/database/seed-snapshot.md)

## 🔍 Database Connection Check

Start the API:

```bash
npm run start:dev
```

Then verify the endpoints:

```bash
curl.exe http://localhost:3000/
curl.exe http://localhost:3000/system
curl.exe http://localhost:3000/system/ping
curl.exe http://localhost:3000/system/database
curl.exe http://localhost:3000/system/health
curl.exe http://localhost:3000/health
```

The database diagnostics endpoint runs a real PostgreSQL probe and confirms:

- database name
- active schema returned by PostgreSQL
- server version
- execution timestamp

The backend uses a versioned seed snapshot, so the database can be reset and repopulated without depending on the old legacy repository anymore.

## 🛠️ Tech Stack

- **NestJS 11.1.17**
- **TypeScript 5.9.3**
- **Prisma 6.19.2**
- **PostgreSQL / Neon**
- **Swagger / OpenAPI**
- **Jest 30.3.0**
- **Supertest 7.0.0**
- **ESLint 9.39.4**
- **Prettier 3.8.1**

## 📜 History of commands used to build this project:

```bash
npx @nestjs/cli@11.0.10 new hans-portfolio-api --package-manager npm --skip-git --strict

npm i @nestjs/config@4.0.3 @nestjs/swagger@11.2.6 swagger-ui-express@5.0.1 @prisma/client@6.19.2 class-validator@0.14.4 class-transformer@0.5.1

npm i -D prisma@6.19.2

npm i
```
