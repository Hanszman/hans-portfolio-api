---
name: create-api-contract
description: Create or refactor public HTTP request and response contracts in hans-portfolio-api using class-validator, class-transformer, Swagger decorators, shared validators, and contract tests. Use when adding DTOs, query parameters, mutation payloads, response models, localized fields, relation payloads, or API validation rules.
---

# Create an API Contract

## Prepare

1. Read `.agents/AGENTS.md`, `README.md`, the target controller/service, neighboring request and response DTOs, shared contract validators, Prisma schema, and frontend consumer types.
2. Inspect `git status --short` and preserve unrelated work.
3. Decide whether the shape is a public HTTP DTO or an internal TypeScript type. Put only HTTP contracts in `contracts/`; put internal/raw/helper shapes in `types/`.

## Place the contract

- Use `src/modules/<feature>/contracts/<resource>/`.
- Use `<resource>.request.ts` for request/query/mutation DTOs.
- Use `<resource>.response.ts` for response DTOs.
- Add adjacent `*.spec.ts` files for validation, transformation, defaults, nested shapes, and Swagger-relevant construction behavior.
- Reuse `contracts/shared/` for validators and nested relation DTOs used by multiple entities.

## Implement request DTOs

- Use classes with `class-validator` and `class-transformer`; do not use interfaces as runtime DTOs.
- Add precise Swagger decorators, examples, nullable/required flags, enums, array types, and nested DTO metadata.
- Use `@ValidateNested()` and `@Type(() => ChildDto)` for nested objects.
- Distinguish omitted, nullable, empty, and optional values deliberately.
- Reuse shared date-range and image/relation validators rather than duplicating decorators.
- Validate `endDate >= startDate` whenever both exist.
- Keep enum values identical to Prisma/backend contracts.
- For localized database content, add and document `Pt`, `En`, and `Es` fields consistently unless the field is intentionally language-neutral.

## Implement response DTOs

- Describe the actual serialized HTTP shape, including relation collections, localized fields, dates, pagination, and nullability.
- Do not expose raw join-table or secret/authentication fields accidentally.
- Keep response names and types aligned with frontend contracts and Swagger.

## Test and coordinate

- When the frontend must change, follow `../hans-portfolio-app/.agents/skills/create-portfolio-service/SKILL.md` from the API repository root.
- Use `plainToInstance` and `validate` for valid/invalid payloads, nested validation, coercion, optionality, enums, arrays, and cross-field rules.
- Test response construction/default behavior when meaningful.
- Update controller Swagger metadata, service mappings, e2e tests, frontend types, and docs for every public contract change.
- Consider migration, seed, and snapshot updates when the contract reflects a schema/content change.

## Validate

```powershell
rtk npm run lint
rtk npm run format:check
rtk npm run test:coverage
rtk npm run build
```

Run Prisma checks as well when the contract accompanies a schema change.
