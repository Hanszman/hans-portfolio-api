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
JWT_SECRET
JWT_EXPIRES_IN
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
ADMIN_BOOTSTRAP_NAME
ADMIN_BOOTSTRAP_EMAIL
ADMIN_BOOTSTRAP_PASSWORD
```

Important notes:

- Nest runtime can derive `DATABASE_URL` from the `PG*` variables
- Prisma CLI commands expect `DATABASE_URL` to exist in `.env`
- `JWT_SECRET` secures the admin JWT flow
- `ADMIN_BOOTSTRAP_*` variables are used by the first-admin bootstrap script

## 🚀 API Routes

Current routes:

- `GET /`
- `GET /system`
- `GET /system/ping`
- `GET /system/database`
- `GET /system/health`
- `GET /health`
- `POST /auth/login`
- `GET /admin/session`
- `GET /projects`
- `GET /projects/:slug`
- `GET /experiences`
- `GET /experiences/:slug`
- `GET /technologies`
- `GET /technologies/:slug`
- `GET /formations`
- `GET /formations/:slug`
- `GET /spoken-languages`
- `GET /spoken-languages/:code`
- `GET /customers`
- `GET /customers/:slug`
- `GET /jobs`
- `GET /jobs/:slug`
- `GET /links`
- `GET /links/:id`
- `GET /image-assets`
- `GET /image-assets/:id`
- `GET /tags`
- `GET /tags/:slug`
- `GET /portfolio-settings`
- `GET /portfolio-settings/:key`
- `POST /admin/<resource>`
- `PUT /admin/<resource>/:id`
- `DELETE /admin/<resource>/:id`
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
- `http://localhost:3000/auth/login`
- `http://localhost:3000/admin/session`
- `http://localhost:3000/projects`
- `http://localhost:3000/tags`
- `http://localhost:3000/admin/tags`

Public collection routes now support pagination query parameters:

- `page`
- `pageSize`
- `search`
- resource-specific optional filters such as `featured`, `highlight`, `context`, `status`, `environment`, `category`, `degreeType`, `proficiency`, `type`, `kind`, `folder`, `companyName`, `institution`, `url`, and `fileName`

Example:

```bash
GET /projects?page=1&pageSize=12
GET /projects?page=1&pageSize=12&featured=true&environment=FULLSTACK
GET /technologies?search=type&category=LANGUAGE
```

Current CRUD coverage:

- public read endpoints exist for `projects`, `experiences`, `technologies`, `formations`, `spoken-languages`, `customers`, `jobs`, `links`, `image-assets`, `tags`, and `portfolio-settings`
- protected admin mutation endpoints exist for `POST`, `PUT`, and `DELETE` under `/admin/<resource>`
- all public collection reads are paginated
- all public collection reads support optional property filters through query string
- admin `create` and `update` payloads can now carry relationship arrays for the supported joins of each entity
- public reads return only published records for entities that support `isPublished`
- the admin area still has a protected session endpoint at `GET /admin/session`

## Content CRUD Abstraction

The `content` module uses a shared CRUD abstraction for portfolio entities that follow the same read/write pattern.

The practical flow is:

- each entity still has its own controller
- each entity still has its own request DTOs in `contracts/`
- those controllers delegate to generic content services instead of duplicating Prisma CRUD logic
- the generic services receive a resource key such as `projects`, `technologies`, or `tags`
- a central registry resolves the per-entity behavior
- a dedicated mutation payload service translates admin request bodies into Prisma nested writes for relationship tables
- public collection reads are wrapped as `{ data, pagination }`
- public collection reads also resolve resource-specific search/filter rules through the same central resource config

Main files involved:

- [content-read.service.ts](/.../hans-portfolio-api/src/modules/content/services/content-read/content-read.service.ts)
- [content-admin.service.ts](/.../hans-portfolio-api/src/modules/content/services/content-admin/content-admin.service.ts)
- [content-resource-registry.service.ts](/.../hans-portfolio-api/src/modules/content/services/content-resource-registry/content-resource-registry.service.ts)
- [content-resource.config.ts](/.../hans-portfolio-api/src/modules/content/content-resource.config.ts)

The resource config defines, per entity:

- the Prisma delegate name such as `project`, `experience`, or `tag`
- the public lookup field such as `slug`, `code`, `key`, or `id`
- the route path and Swagger tag
- the default ordering
- whether the entity supports `isPublished`
- the Prisma `include` graph used by reads
- the DTO classes used by `create` and `update`
- the default ordering that pagination applies on top of
- the searchable fields and allowed collection filters of each public route

The CRUD flow is structurally very similar across entities, but it is not a blind copy. The generic services are the engine, and the resource config is the per-entity customization layer.

Current public collection response shape:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 12,
    "totalItems": 0,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

Current admin mutation behavior:

- `PUT` already behaves as a partial update because the update DTOs are `PartialType(...)`
- you can send only the fields you want to change
- if you send a relationship array such as `tagIds`, `imageAssetIds`, `projectIds`, or `technologyRelations`, that relation set is replaced
- if you omit a relationship field entirely, the existing relation set stays untouched

This means the API does not need `PATCH` right now to support partial property updates. The current `PUT` already supports partial bodies in practice.

What `content-mutation-payload.service.ts` does:

- it receives the validated admin DTO body
- it separates scalar properties from relation arrays such as `tagIds`, `imageAssetIds`, `projectIds`, and `technologyRelations`
- it converts those relation arrays into Prisma nested write payloads for join tables
- it keeps `content-admin.service.ts` generic instead of duplicating entity-specific relation-building logic inline
- in short, it is the adapter between the HTTP mutation payload and the Prisma nested mutation shape

Current relationship-table status:

- relationship tables such as `experience_customer`, `project_tag`, and `project_technology` are already modeled in Prisma
- image relationship tables such as `technology_image_asset`, `spoken_language_image_asset`, `customer_image_asset`, and `job_image_asset` are also modeled explicitly
- they already appear in reads through the configured Prisma includes of the main entities
- It still does **not** expose dedicated admin CRUD endpoints for those relationship tables
- Admin CRUD remains focused on the top-level entities
- relationship writes now happen through nested payloads in the owning entity endpoints instead of separate join-table endpoints

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
- `src/modules/auth` for admin authentication and authorization
- `src/modules/content` for the portfolio content CRUD layer
- `src/prisma` for shared database infrastructure
- `src/config` for runtime configuration
- `src/routing` for route path constants

And the route handlers are defined in:

- [system.controller.ts](/.../hans-portfolio-api/src/modules/system/controllers/system/system.controller.ts)
- [ping.controller.ts](/.../hans-portfolio-api/src/modules/system/controllers/ping/ping.controller.ts)
- [database-diagnostics.controller.ts](/.../hans-portfolio-api/src/modules/system/controllers/database/database-diagnostics.controller.ts)
- [health.controller.ts](/.../hans-portfolio-api/src/modules/system/controllers/health/health.controller.ts)
- [auth.controller.ts](/.../hans-portfolio-api/src/modules/auth/controllers/auth/auth.controller.ts)
- [admin-session.controller.ts](/.../hans-portfolio-api/src/modules/auth/controllers/admin-session/admin-session.controller.ts)
- [projects.controller.ts](/.../hans-portfolio-api/src/modules/content/controllers/projects/projects.controller.ts)
- [tags.controller.ts](/.../hans-portfolio-api/src/modules/content/controllers/tags/tags.controller.ts)

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

## 🔐 Authorization Rules

The CRUD authorization rule for this project is intentionally simple:

- `Read` operations are public across all entities
- `Create`, `Update`, and `Delete` operations are restricted to the authenticated admin user only

In practice, this means:

- public portfolio consumption endpoints can be accessed without login
- `POST /auth/login` remains public so the admin can authenticate
- administrative mutation endpoints must require admin authentication and authorization
- `GET /admin/session` is the first protected admin endpoint and already requires a valid bearer token
- all `/admin/<resource>` content mutation routes use the same admin bearer token rule
- the expected admin operator of the system is Victor

Current access matrix:

- `GET /projects`, `GET /projects/:slug`, `GET /experiences`, `GET /experiences/:slug`, and the equivalent read endpoints for the other content entities are public
- `POST /admin/<resource>`, `PUT /admin/<resource>/:id`, and `DELETE /admin/<resource>/:id` are protected
- this means the only unauthenticated CRUD operation in the entire API is `Read`

## 📁 Code Organization Standards

This API follows a feature-first NestJS structure.

Each feature must live under `src/modules/<feature-name>`, for example:

- `src/modules/system`
- `src/modules/auth`
- `src/modules/content`

Inside each feature, the default folders are:

- `controllers/` for HTTP handlers
- `services/` for business and orchestration logic
- `contracts/` for API request/response DTOs
- `types/` for internal TypeScript-only shapes used by the implementation

Current examples:

- [ping.controller.ts](/.../hans-portfolio-api/src/modules/system/controllers/ping/ping.controller.ts)
- [health.controller.ts](/.../hans-portfolio-api/src/modules/system/controllers/health/health.controller.ts)
- [projects.controller.ts](/.../hans-portfolio-api/src/modules/content/controllers/projects/projects.controller.ts)
- [projects.request.ts](/.../hans-portfolio-api/src/modules/content/contracts/projects/projects.request.ts)
- [database-diagnostics.response.ts](/.../hans-portfolio-api/src/modules/system/contracts/database/database-diagnostics.response.ts)
- [database-diagnostics.types.ts](/.../hans-portfolio-api/src/modules/system/types/database-diagnostics.types.ts)

Naming rules adopted for the project:

- one feature folder per domain/capability under `modules`
- one umbrella feature folder is acceptable when it groups one coherent bounded context with many small entities, as in `src/modules/content`
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
- shared or meaningful internal `type` declarations should not stay embedded inside service/controller/spec files when they can be named and reused cleanly; they should live in `*.types.ts`

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
- controllers with real delegation behavior should receive unit tests even when they are excluded from the measured coverage target
- controller files are currently excluded from the measured coverage target because Nest decorator metadata introduces synthetic branch noise that is not a good quality signal for this project
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

Prisma is used here in two complementary layers:

- the schema layer in `prisma/schema.prisma`, where you describe models, enums, and relations
- the generated client layer, where Prisma produces a typed TypeScript API based on that schema

That is why `format` and `generate` are different commands.

Format the Prisma schema:

```bash
npm run prisma:format
```

What `prisma:format` does:

- rewrites `prisma/schema.prisma` using Prisma's standard formatting rules
- keeps indentation, field alignment, attributes, and blocks organized
- does not connect to the database
- does not create migrations
- does not regenerate the Prisma client by itself

In practice, this is similar to running Prettier for the Prisma schema file.

Generate the Prisma client:

```bash
npm run prisma:generate
```

What `prisma:generate` does:

- reads `prisma/schema.prisma`
- interprets your current models, enums, and relations
- generates the typed Prisma Client inside `node_modules/@prisma/client`
- makes TypeScript autocomplete and typed database access match the current schema

This is needed because changing the schema does not automatically change the generated TypeScript client unless `generate` runs.

When `prisma:generate` runs in this project:

- automatically after `npm install`, through `postinstall`
- automatically after some Prisma flows such as migrations
- manually whenever you want to force-regenerate the client after schema changes

Workspace note:

- this project is currently pinned to Prisma ORM 6 in [.vscode/settings.json](/.../hans-portfolio-api/.vscode/settings.json) through `prisma.pinToPrisma6`
- this avoids false VS Code diagnostics caused by the Prisma extension validating the schema with Prisma 7 rules while the project is intentionally on Prisma `6.19.2`

Validate the Prisma schema:

```bash
npm run prisma:validate
```

What `prisma:validate` does:

- checks whether the schema is valid
- verifies model definitions, attributes, relations, enums, and datasource/generator config
- does not create migrations
- does not change the database

Create a development migration:

```bash
npm run prisma:migrate:dev -- --name your_migration_name
```

What `prisma:migrate:dev` does:

- compares the current schema with the migration history
- creates a new migration folder when needed
- applies the new migration to the target database locally
- usually regenerates the Prisma client too

Use this when you changed `schema.prisma` and want to evolve the database structure during development.

Apply existing migrations on the database:

```bash
npm run prisma:migrate:deploy
```

What `prisma:migrate:deploy` does:

- applies migrations that already exist in `prisma/migrations` on the database
- does not create a new migration
- is the safe command for deployed/shared environments

Check migration status:

```bash
npm run prisma:migrate:status
```

What `prisma:migrate:status` does:

- shows whether the database is aligned with the migrations stored in the repository
- helps confirm whether the schema is up to date before seeding or deploying

Open Prisma Studio:

```bash
npm run prisma:studio
```

Bootstrap or update the first admin user:

```bash
npm run prisma:admin:bootstrap
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

- `npm run prisma:seed` applies pending migrations, clears the current portfolio content tables, reinserts the versioned snapshot stored in `prisma/data/portfolio-seed.snapshot.json`, and re-runs the admin bootstrap when `ADMIN_BOOTSTRAP_*` is configured
- `npm run prisma:seed:reset` clears the current portfolio content tables without reseeding and does not touch the `user` table
- `npm run prisma:seed:snapshot` exports the current database state into the versioned snapshot file
- the frontend media lives in `../hans-portfolio-app/src/assets/img` as normal versioned project files
- the snapshot keeps the normalized `imageAssets` catalog plus the join rows that connect those files to `projects`, `experiences`, `formations`, `technologies`, `spokenLanguages`, `customers`, and `jobs`

Current admin bootstrap flow:

- fill `ADMIN_BOOTSTRAP_NAME`, `ADMIN_BOOTSTRAP_EMAIL`, and `ADMIN_BOOTSTRAP_PASSWORD` in `.env`
- run `npm run prisma:admin:bootstrap`
- log in through `POST /auth/login`
- validate the authenticated admin session through `GET /admin/session`
- if you perform a full schema reset and then run `npm run prisma:seed`, the admin user is recreated automatically as long as the same `ADMIN_BOOTSTRAP_*` variables are still present

Recommended Prisma workflow in this project:

1. update `prisma/schema.prisma`
2. run `npm run prisma:format`
3. run `npm run prisma:validate`
4. run `npm run prisma:migrate:dev -- --name your_migration_name`
5. run `npm run test`
6. run `npm run test:coverage`
7. if the change affects initial content, update the data and run `npm run prisma:seed:snapshot`
8. in deployed/shared environments, use `npm run prisma:migrate:deploy`

More details live in:

- [seed-snapshot.md](/.../hans-portfolio-api/docs/database/seed-snapshot.md)

## 🗃️ Current Database Schema

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
- `technology_image_asset`
- `spoken_language_image_asset`
- `customer_image_asset`
- `job_image_asset`

Schema notes:

- Prisma model names stay in PascalCase
- Prisma fields stay in camelCase
- physical database table names stay in snake_case singular form through `@@map(...)`
- technology usage join tables already support metadata such as `level`, `frequency`, and `contexts`
- Also added optional `icon` fields to `Project`, `Experience`, `Formation`, `SpokenLanguage`, `Customer`, and `Job`
- imported icon and media paths are stored as frontend-ready URLs under `/assets/img/...`
- `image_asset` stores the normalized media catalog with:
  - `fileName`
  - `filePath`
  - `folder`
  - `kind`
- `kind` tells the frontend whether the asset behaves like an `ICON`, `SCREENSHOT`, `LOGO`, `PROFILE`, or `OTHER`
- public content reads include image relations for `technologies`, `spoken-languages`, `customers`, and `jobs` in addition to the existing `projects`, `experiences`, and `formations`

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
