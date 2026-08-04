---
name: create-api-service
description: Create or refactor a focused NestJS service in hans-portfolio-api with Prisma orchestration, business rules, mappings, aggregation, dependency injection, and unit coverage. Use when adding backend business behavior, authentication logic, content operations, dashboard calculations, persistence orchestration, or splitting an oversized service.
---

# Create an API Service

## Prepare

1. Read `.agents/AGENTS.md`, `README.md`, the target module, controller, contracts, internal types, Prisma schema, neighboring service, and tests.
2. Inspect `git status --short` and preserve unrelated changes.
3. Check whether `content-read`, `content-admin`, `content-resource-registry`, or `content-mutation-payload` already owns the requested behavior before creating entity-specific CRUD logic.

## Place and scope

- Create services under `src/modules/<feature>/services/<service>/`.
- Create `<service>.service.ts` and `<service>.service.spec.ts`.
- Put reusable implementation shapes, raw query records, mapper inputs/outputs, and spec-shared types in the module `types/` folder.
- Put pure mapping, date, range, sorting, filtering, or normalization logic in a focused helper when it can be tested independently.
- Split by responsibility when a service grows broad; do not split merely by method count.

## Implement

- Mark the class `@Injectable()` and use explicit constructor injection consistent with neighboring Nest services.
- Keep controllers free of business logic and Prisma access.
- Use `PrismaService` through the runtime database module; do not instantiate Prisma clients.
- Select/include only required data, apply stable ordering, and filter unpublished content before public aggregates.
- Use transactions when a multi-write invariant must be atomic.
- Keep mapping and relation writes aligned with explicit join tables and shared mutation services.
- Preserve half-open month ranges and overlap-merging rules for technology experience metrics.
- Keep password operations in `PasswordService` with Argon2id and secrets in environment variables.
- Avoid `any`, hidden global state, swallowed exceptions, and duplicated CRUD branches.

## Wire and test

- Register the provider in its module and export it only when another module consumes it.
- Mock injected boundaries rather than framework internals.
- Cover success, empty data, failures, sorting/filtering, mapping, deduplication, transaction behavior, and every conditional branch.
- Test pure helpers separately and keep relevant files at 100% coverage.
- Update e2e tests when observable endpoint behavior changes.

## Validate

```powershell
rtk npm run lint
rtk npm run format:check
rtk npm run test:coverage
rtk npm run build
```

When Prisma usage requires schema changes, also follow `$create-api-feature` and run the complete Prisma validation workflow.
