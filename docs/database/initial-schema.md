# Initial Portfolio Schema

This document describes the first Prisma schema created in Sprint `B2`.

## Database target

- Database: `hans-portfolio-db`
- Active schema: `portfolio`
- ORM: `Prisma`
- Migration applied: `20260325153138_initial_portfolio_schema`

## Core entities

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

## Join tables

These relations were modeled explicitly to keep the database easier to inspect and to allow metadata on the relationship itself when needed:

- `project_technologies`
- `experience_technologies`
- `formation_technologies`
- `project_experiences`
- `experience_customers`
- `experience_jobs`
- `project_tags`
- `technology_tags`
- `project_links`
- `experience_links`
- `formation_links`
- `project_image_assets`
- `experience_image_assets`
- `formation_image_assets`

## Relationship metadata already supported

Technology usage relationships already support metadata on the join table:

- `level`
- `frequency`
- `contexts`

This keeps the schema ready for future dashboard, filtering, and analytics work without redesigning the database later.

## Enums created in the first migration

- `UserRole`
- `ProjectContext`
- `ProjectStatus`
- `ProjectEnvironment`
- `TechnologyCategory`
- `TechnologyLevel`
- `TechnologyUsageFrequency`
- `TechnologyUsageContext`
- `DegreeType`
- `SpokenLanguageProficiency`
- `LinkType`
- `TagType`

## Naming conventions

- Prisma models use PascalCase
- Prisma fields use camelCase
- database tables use snake_case plural names through `@@map(...)`
- internal TypeScript-only implementation shapes stay in `src/modules/<feature>/types`
- API request/response DTOs stay in `src/modules/<feature>/contracts`

## Useful commands

Generate the Prisma client:

```bash
npm run prisma:generate
```

Validate the schema:

```bash
npm run prisma:validate
```

Create and apply a new development migration:

```bash
npm run prisma:migrate:dev -- --name your_migration_name
```

Check migration status:

```bash
npm run prisma:migrate:status
```

Apply existing migrations:

```bash
npm run prisma:migrate:deploy
```

Open Prisma Studio:

```bash
npm run prisma:studio
```
