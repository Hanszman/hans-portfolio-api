# AGENTS.md - hans-portfolio-api

## Project purpose

`hans-portfolio-api` is the NestJS backend that powers the Hans Portfolio remake.

It provides:

- public read endpoints for portfolio content
- protected admin mutation endpoints
- authentication for the admin operator
- dashboard aggregate endpoints
- Prisma-backed PostgreSQL/Neon persistence
- Swagger/OpenAPI documentation
- deterministic seed snapshot tooling

The frontend consumer is `hans-portfolio-app`.

## Tech stack

- NestJS `11.1.17`
- TypeScript `5.9.3`
- Express adapter
- Prisma `6.19.2`
- PostgreSQL / Neon
- Swagger / OpenAPI
- JWT auth with Passport
- bcrypt
- class-validator + class-transformer
- Jest + Supertest
- ESLint + Prettier

Use Node `24.14.1` and npm `11.11.0`.

## Mandatory quality bar

Every change must follow:

- Clean Code
- DRY
- KISS
- YAGNI
- SRP
- SOLID
- clear naming
- small services
- focused controllers
- explicit contracts
- testable helpers/services
- no duplicated CRUD logic when the content abstraction can handle it

Required validation before a task is done:

- `npm run lint`
- `npm run format:check`
- `npm run test:coverage`
- `npm run build`

When Prisma schema or seed data changes, also run the relevant Prisma validation scripts:

- `npm run prisma:format`
- `npm run prisma:validate`
- `npm run prisma:generate`
- `npm run prisma:migrate:status`

Coverage target is `100%` for relevant files. `test:coverage` runs unit coverage and then e2e tests. Lint uses `--max-warnings 0`, so warnings are failures.

## Environment

Create `.env` from `.env.example`.

Important variables:

- `APP_NAME`
- `NODE_ENV`
- `PORT`
- `SWAGGER_PATH`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `DATABASE_URL`
- `DIRECT_URL`
- `PGHOST`
- `PGDATABASE`
- `PGUSER`
- `PGPASSWORD`
- `PGPORT`
- `PGSSLMODE`
- `PGCHANNELBINDING`
- `PGSCHEMA`
- `ADMIN_BOOTSTRAP_NAME`
- `ADMIN_BOOTSTRAP_EMAIL`
- `ADMIN_BOOTSTRAP_PASSWORD`
- `PORTFOLIO_APP_BASE_URL`
- `PORTFOLIO_API_BASE_URL`
- `CORS_ALLOWED_ORIGINS` when extra origins are needed

Local defaults:

- app: `http://localhost:4200`
- API: `http://localhost:3000`

Production defaults:

- app: `https://hans-portfolio-app.vercel.app`
- API: `https://hans-portfolio-api.vercel.app`

## Folder structure

Use the feature-first NestJS structure:

- `src/main.ts` - bootstrap, Swagger, global validation, CORS.
- `src/app.module.ts` - root module.
- `src/config/` - runtime environment config and tests.
- `src/routing/api-routes.ts` - centralized route path constants.
- `src/prisma/` - Prisma module and shared Prisma service.
- `src/modules/system/` - system, ping, health, and database diagnostics.
- `src/modules/auth/` - login, JWT strategy, admin session, guards, password service.
- `src/modules/content/` - portfolio content CRUD abstraction and entity controllers.
- `src/modules/dashboard/` - public dashboard aggregate reads.
- `prisma/` - schema, migrations, seed/reset/snapshot/admin bootstrap scripts.
- `prisma/data/portfolio-seed.snapshot.json` - versioned portfolio data snapshot.
- `docs/database/` - schema and seed strategy docs.
- `test/` - e2e tests.

Each module should use these folders when needed:

- `controllers/` - HTTP handlers, route decorators, Swagger decorators.
- `services/` - business logic and orchestration.
- `contracts/` - request and response DTOs.
- `types/` - internal TypeScript-only implementation shapes.
- `decorators/` - reusable Nest decorators.
- `guards/` - auth/authorization guards.
- `strategies/` - Passport strategies.
- `helpers/` - pure helpers when a feature needs them.

## Controllers, services, contracts, and types

Controllers should:

- stay thin
- declare routes and Swagger metadata
- delegate to services
- avoid business logic
- avoid Prisma queries directly

Services should:

- contain business logic
- orchestrate Prisma, config, auth, mappings, and aggregations
- remain focused by responsibility
- be covered by unit tests

Contracts should:

- live in `contracts/`
- describe public HTTP request and response DTOs
- use class-validator/class-transformer when needed
- use Swagger decorators when relevant

Types should:

- live in `types/`
- contain internal shapes, raw query types, helper inputs, mapper outputs, and spec-only shared types
- not be mixed into services/controllers/specs when reusable or meaningful

If a helper/service/controller grows too large, split responsibility into a focused service or helper rather than adding more branches to one file.

## Content module conventions

The content module uses a shared CRUD abstraction.

Main pieces:

- `content-resource.config.ts` defines per-entity behavior.
- `content-resource-registry.service.ts` resolves resource configuration.
- `content-read.service.ts` handles public reads.
- `content-admin.service.ts` handles protected admin mutations.
- `content-mutation-payload.service.ts` maps admin payloads into Prisma nested writes.

When adding or changing a content entity:

1. update Prisma schema if needed
2. update contracts
3. update `content-resource.config.ts`
4. update nested mutation payload logic when relations change
5. update read include graphs and filters/sortable fields
6. update controller if a new route is needed
7. add or update unit tests and e2e tests
8. update seed snapshot/docs when content shape changes

Do not duplicate entity CRUD logic in individual controllers if the shared content services can support the behavior.

## Routing conventions

Nest routes are declared in controllers through decorators. Route path constants live in `src/routing/api-routes.ts`.

Canonical operational routes:

- `GET /system`
- `GET /system/ping`
- `GET /system/database`
- `GET /system/health`

Aliases:

- `GET /`
- `GET /health`

Aliases should stay hidden from Swagger when they are only convenience endpoints.

Public reads are unauthenticated. Admin mutations are protected under `/admin/<resource>`.

## Auth and authorization

Rules:

- `POST /auth/login` is public.
- `GET /admin/session` is protected.
- `POST /admin/<resource>`, `PUT /admin/<resource>/:id`, and `DELETE /admin/<resource>/:id` are protected.
- Public content reads are not protected.
- The expected admin operator is Victor.

Use JWT auth and the existing guards/strategy. Do not weaken auth behavior or expose mutation endpoints publicly.

## Prisma and database conventions

Prisma schema lives at `prisma/schema.prisma`.

Naming:

- Prisma models use PascalCase.
- Prisma fields use camelCase.
- Physical database tables use snake_case singular names through `@@map(...)`.
- Explicit join tables are preferred for inspectable relationships and metadata.

Core entities:

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

Media and links are normalized:

- images/icons/logos/screenshots live in `image_asset`
- URLs live in `link`
- entities connect to them through explicit join tables
- frontend media files live in `../hans-portfolio-app/src/assets/img`

Technology experience durations are stored in `technology_context` and calculated with overlap-safe month merging.

## Seed snapshot

The deterministic content source is:

- `prisma/data/portfolio-seed.snapshot.json`

Scripts:

- `npm run prisma:seed` - applies pending migrations, clears portfolio content, inserts snapshot, bootstraps admin when configured.
- `npm run prisma:seed:reset` - clears portfolio content only and keeps users.
- `npm run prisma:seed:snapshot` - exports current DB content into the snapshot.
- `npm run prisma:admin:bootstrap` - creates or updates the first admin user.

If schema or content changes affect initial portfolio data, update the snapshot intentionally and keep docs accurate.

## Dashboard conventions

Dashboard endpoints expose aggregate data so the frontend does not recalculate everything in the browser.

Routes:

- `GET /dashboard`
- `GET /dashboard/stack-distribution`
- `GET /dashboard/project-contexts`
- `GET /dashboard/technology-usage`
- `GET /dashboard/professional-timeline`
- `GET /dashboard/highlights`

Dashboard reads must filter unpublished content before aggregation. Keep aggregate logic in dashboard services and covered by tests.

## Testing standards

- Unit tests stay close to code as `*.spec.ts`.
- E2E tests live in `test/`.
- Use one e2e file per large feature/module when practical.
- `npm run test:coverage` must remain green and includes e2e.
- Controllers with real delegation behavior should be tested even if excluded from measured coverage.
- Excluded files are allowed only when coverage would not add meaningful signal, such as DTOs, decorators, modules, generated files, and framework glue already listed in Jest config.

## Important scripts

- `npm run start` - start Nest.
- `npm run start:dev` - watch mode.
- `npm run start:debug` - debug watch mode.
- `npm run start:prod` - run built app.
- `npm run build` - Nest build.
- `npm run lint` - ESLint with zero warnings.
- `npm run lint:fix` - ESLint fix with zero warnings.
- `npm run format` - Prettier write.
- `npm run format:check` - Prettier check.
- `npm run test` - unit tests.
- `npm run test:e2e` - e2e tests.
- `npm run test:coverage:unit` - unit coverage.
- `npm run test:coverage` - unit coverage plus e2e.
- `npm run prisma:format` - format schema.
- `npm run prisma:generate` - generate Prisma Client.
- `npm run prisma:validate` - validate schema.
- `npm run prisma:migrate:dev -- --name <name>` - create/apply dev migration.
- `npm run prisma:migrate:deploy` - apply existing migrations.
- `npm run prisma:migrate:status` - migration status.
- `npm run prisma:studio` - Prisma Studio.
- `npm run prisma:seed` - deterministic seed.
- `npm run prisma:seed:reset` - reset content tables.
- `npm run prisma:seed:snapshot` - refresh seed snapshot.
- `npm run prisma:admin:bootstrap` - bootstrap admin user.

## Collaboration rules

- Read the module, contracts, types, service, tests, Prisma schema, and docs before changing behavior.
- Do not modify database schema without Prisma validation and migration/seed consideration.
- Do not change public API contracts without updating Swagger/contracts/tests/frontend guidance.
- Keep CORS, environment, and auth behavior centralized.
- Update README/docs when routes, schema, seed flow, env vars, or scripts change.
- Keep frontend compatibility in mind because `hans-portfolio-app` consumes these contracts directly.
