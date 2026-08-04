---
name: create-api-controller
description: Create or refactor a NestJS controller in hans-portfolio-api with centralized routes, Swagger metadata, authentication policy, thin delegation, and controller tests. Use when adding public reads, protected admin endpoints, system/auth/dashboard routes, aliases, or changing HTTP handler behavior.
---

# Create an API Controller

## Prepare

1. Read `.agents/AGENTS.md`, `README.md`, `src/routing/api-routes.ts`, the target module, contracts, service, neighboring controller, and related e2e tests.
2. Inspect `git status --short` and preserve unrelated changes.
3. Determine whether the endpoint is public, authenticated admin, a hidden alias, or part of the shared content CRUD abstraction.

## Place and route

- Create controllers under `src/modules/<feature>/controllers/<resource>/`.
- Create `<resource>.controller.ts` and `<resource>.controller.spec.ts`.
- Declare canonical route segments in `src/routing/api-routes.ts`; do not scatter path literals.
- Keep public reads unauthenticated and protect admin session/mutations with the existing JWT and role guards.
- Hide convenience aliases from Swagger when they are not canonical API operations.

## Implement a thin controller

- Use Nest route decorators and explicit parameter/body/query DTOs.
- Add `@ApiTags`, `@ApiOperation`, success response metadata, relevant error responses, and request body/query/parameter metadata.
- Delegate immediately to a focused service. Do not query Prisma, map complex payloads, calculate aggregates, or encode business rules in the controller.
- Reuse shared Swagger decorators and content services when the content abstraction already supports the resource.
- Preserve public response contracts and status codes unless a contract change is explicitly in scope.
- Do not expose protected mutation routes publicly or weaken guards for convenience.

## Wire the module

- Register the controller in its feature module.
- Import only modules required by injected providers/guards.
- Update frontend guidance and Swagger-facing docs when the endpoint contract changes.

## Test

- Unit-test route handler delegation, arguments, return values/promises, and exceptional propagation.
- Assert guards/decorators through e2e behavior when framework metadata is the meaningful contract.
- Add or update e2e coverage for routing, validation, authentication/authorization, response shape, and status codes.
- Keep controller specs even when framework glue is excluded from measured coverage.

## Validate

```powershell
rtk npm run lint
rtk npm run format:check
rtk npm run test:coverage
rtk npm run build
```

Fix every warning or formatting error in scope.
