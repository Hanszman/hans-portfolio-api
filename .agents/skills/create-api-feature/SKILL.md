---
name: create-api-feature
description: Create or extend a complete feature/module in hans-portfolio-api, coordinating Nest modules, controllers, services, contracts, internal types, helpers, decorators, guards, routes, Prisma changes, tests, Swagger, seed snapshots, and frontend compatibility. Use for new backend resources or multi-artifact changes that span more than one controller/service/contract.
---

# Create an API Feature

## Prepare and scope

1. Read `.agents/AGENTS.md`, `README.md`, relevant plans/docs, `src/app.module.ts`, `src/routing/api-routes.ts`, the closest feature module, Prisma schema, seed strategy, and frontend consumer.
2. Inspect `git status --short` and preserve unrelated work.
3. List the required artifacts and decide whether the request extends `content`, `dashboard`, `auth`, `system`, or needs a genuinely new feature module.
4. Prefer extending the shared content CRUD abstraction over adding duplicate per-entity CRUD infrastructure.

Use the focused skills for included artifacts:

- `$create-api-controller`
- `$create-api-service`
- `$create-api-contract`

## Structure

Use `src/modules/<feature>/` with only the folders the feature needs:

- `controllers/`
- `services/`
- `contracts/`
- `types/`
- `helpers/`
- `decorators/`
- `guards/`
- `strategies/`
- `<feature>.module.ts`

Keep runtime database integration in `src/database/` and Prisma CLI/schema/migration/seed work in root `prisma/`.

## Implement the module boundary

- Register controllers/providers and import required modules explicitly.
- Export providers only for real cross-module consumers.
- Add the feature module to `src/app.module.ts` only when it is new.
- Keep route constants centralized.
- Keep public reads open and protect admin mutations/session routes with existing auth guards.
- Keep helpers pure and types internal; use contracts only for public HTTP shapes.
- Add reusable decorators/guards only when more than one handler benefits.

## Handle content and Prisma changes

For a content entity, inspect and update as applicable:

1. `prisma/schema.prisma`
2. request/response contracts
3. `content-resource.config.ts`
4. mutation payload mapping for nested relations
5. public read include graphs, filters, sortable/searchable fields
6. controllers/routes
7. unit and e2e tests
8. migration, seed snapshot, and database docs

Never edit a deployed schema without a migration and data-preservation plan. Keep users out of destructive content resets and never place admin credentials in snapshots.

## Test and document

- Add focused unit specs beside implementation files and feature e2e tests under `test/`.
- Cover validation, auth, routing, service behavior, persistence orchestration, errors, empty data, and response shape.
- Update Swagger/contracts, README/docs, environment examples, seed documentation, and frontend guidance when their contracts change.

## Validate

Always run:

```powershell
rtk npm run lint
rtk npm run format:check
rtk npm run test:coverage
rtk npm run build
```

When Prisma/schema/seed is touched, also run:

```powershell
rtk npm run prisma:format
rtk npm run prisma:validate
rtk npm run prisma:generate
rtk npm run prisma:migrate:status
```

Run the appropriate migration, snapshot, and seed verification steps for the exact change. Fix warnings and never normalize away unrelated user changes.
