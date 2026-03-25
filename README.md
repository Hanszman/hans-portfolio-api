# Hans Portfolio API

A **NestJS + TypeScript Back-End API** that powers the Hans Portfolio remake.

## Features

- **NestJS 11.1.17** with **TypeScript 5.9.3** for a structured and type-safe back-end
- **Prisma 6.19.2** with **PostgreSQL / Neon** for database access and migrations
- **Swagger / OpenAPI** for API documentation
- **Jest 30.3.0 + Supertest 7.0.0** for unit and e2e testing
- **Test Coverage (V8)** with meaningful B1 target at **100%**
- **ESLint 9.39.4 + Prettier 3.8.1** for code quality and formatting
- **Node Version to build this project: 24.14.1 and npm 11.11.0**

## Development

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

When the API starts, the bootstrap now prints the local URLs directly in the terminal:

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

## Environment Variables

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
- `.env.example` and `.env` are now aligned in the same variable order

## API Routes

Current B1 routes:

- `GET /`
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
- `http://localhost:3000/system/ping`
- `http://localhost:3000/system/database`
- `http://localhost:3000/system/health`
- `http://localhost:3000/health`

## Routing Organization

NestJS does **not** usually use one central Express-style `routes.ts` file.

The standard NestJS pattern is:

- routes are declared with decorators inside controllers
- modules load those controllers
- Nest registers everything automatically on top of the Express adapter

In this project, route paths are centralized in:

- [api-routes.ts](/c:/VictorLocal/Projects/Personal/hans-portfolio-api/src/routing/api-routes.ts)

The current source structure now follows the feature-first direction more closely:

- `src/system` for the system feature
- `src/prisma` for shared database infrastructure
- `src/config` for runtime configuration
- `src/routing` for route path constants

And the route handlers are defined in:

- [system.controller.ts](/c:/VictorLocal/Projects/Personal/hans-portfolio-api/src/system/controllers/system.controller.ts)
- [health.controller.ts](/c:/VictorLocal/Projects/Personal/hans-portfolio-api/src/system/controllers/health.controller.ts)

Swagger ordering is currently controlled in:

- [main.ts](/c:/VictorLocal/Projects/Personal/hans-portfolio-api/src/main.ts)

through:

- `tagsSorter: 'alpha'`
- `operationsSorter: 'alpha'`

So there is no single Express route file, but there is now a single file for route path constants plus the standard Nest controller-based registration.

Canonical routes now live under `/system/*`.

Operational aliases:

- `/` is an alias for the ping response
- `/health` is an alias for `/system/health`

Those aliases are intentionally hidden from Swagger so the UI stays cleaner.

## Swagger Documentation

Swagger UI:

```bash
http://localhost:3000/swagger
```

Swagger JSON:

```bash
http://localhost:3000/swagger-json
```

## Prisma

Generate the Prisma client:

```bash
npm run prisma:generate
```

Create a development migration:

```bash
npm run prisma:migrate:dev -- --name your_migration_name
```

Apply existing migrations:

```bash
npm run prisma:migrate:deploy
```

Open Prisma Studio:

```bash
npm run prisma:studio
```

## Database Connection Check

Start the API:

```bash
npm run start:dev
```

Then verify the endpoints:

```bash
curl.exe http://localhost:3000/
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

At the moment, this B1 foundation confirms the connection only. The real portfolio schema and tables will be created by Prisma migrations in B2.

## Tech Stack

- **NestJS 11.1.17**
- **TypeScript 5.9.3**
- **Prisma 6.19.2**
- **PostgreSQL / Neon**
- **Swagger / OpenAPI**
- **Jest 30.3.0**
- **Supertest 7.0.0**
- **ESLint 9.39.4**
- **Prettier 3.8.1**

## History of commands used to build this project:

```bash
npx @nestjs/cli@11.0.10 new hans-portfolio-api --package-manager npm --skip-git --strict

npm install @nestjs/config@4.0.3 @nestjs/swagger@11.2.6 swagger-ui-express@5.0.1 @prisma/client@6.19.2 class-validator@0.14.4 class-transformer@0.5.1

npm install -D prisma@6.19.2

npm install
```
