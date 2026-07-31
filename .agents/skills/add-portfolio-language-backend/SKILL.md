---
name: add-portfolio-language-backend
description: Add or extend a persisted content language in hans-portfolio-api, including Prisma schema and safe migrations, translated backfill data, DTOs, queries, search and sorting, seed snapshots, tests, and coordination with hans-portfolio-app. Use whenever a new locale or localized database-backed field is introduced in the portfolio Back-End.
---

# Add a portfolio language in the Back-End

Coordinate this work with the Front-End skill at `../../../../hans-portfolio-app/.agents/skills/add-portfolio-language-frontend/SKILL.md`. Read that skill before finalizing response and mutation contracts.

## Inventory and protect the existing data

1. Choose the canonical BCP 47 locale and Prisma field suffix, such as `fr-fr` and `Fr`.
2. Inventory every Prisma model and DTO field with existing `Pt`, `En`, or `Es` variants. Include labels, names, titles, summaries, descriptions, alt text, SEO content, and other user-visible content.
3. Export and normalize the current seed snapshot before changing the schema. Never use `prisma migrate reset`, destructive seeding, or a source database replacement to introduce a language.
4. Record row counts, null counts, relation counts, and stable identifiers so the post-migration state can be compared.

## Migrate additively and translate

1. Add the new fields next to their language siblings in `prisma/schema.prisma`. This is the authoritative logical order; do not rebuild PostgreSQL tables merely to change physical column ordinal positions.
2. Generate and review an additive migration that first creates nullable columns.
3. Create a temporary, versioned translation manifest or backfill script with explicit translations for every existing row. Translate meaningfully; do not copy another language as a final value.
4. Run the backfill transactionally and validate identifiers, row counts, non-empty required translations, relation counts, and representative text.
5. Add required constraints only after validation, using a follow-up migration when necessary.
6. Export and normalize the new seed snapshot so it contains the old data, the new translations, and unchanged relationships.
7. Remove the one-off backfill command and script after the migration, snapshot, and constraints become the durable sources of truth. Keep only reusable normalization/export tooling.

## Extend the application contract

1. Add localized fields to create and update DTOs, validation decorators, Swagger schemas, response serializers, service selections, and test factories.
2. Update public and protected reads, search, sorting, dashboard metrics, relation expansion, and any code that explicitly enumerates localized columns.
3. Keep the API naming consistent with Prisma and the Front-End types.
4. Update seed snapshot types and normalization helpers so generated Prisma inputs contain every required localized property.
5. Test create, update, read, pagination, search, sorting, validation, and fallback behavior for the new language across every affected entity.

## Verify database integrity

Run from `hans-portfolio-api`:

```text
npm run lint
npx tsc --noEmit -p tsconfig.json
npx tsc --noEmit -p tsconfig.scripts.json
npm run prisma:validate
npm run prisma:migrate:status
npm run test:coverage
npm run test:e2e
npm run build
```

Compare the post-change invariants with the pre-change inventory. Inspect the generated migration SQL, current schema, migration status, snapshot diff, and representative API responses. Confirm that only expected localized columns and data changed and that no relationships or historical content were lost.

Do not declare the Back-End complete until the linked Front-End skill has implemented every affected admin form and locale-aware Read view.
