# Initial Portfolio Schema

This document describes the first Prisma schema created in Sprint `B2`.

## Database target

- Database: `hans-portfolio-db`
- Active schema: `portfolio`
- ORM: `Prisma`
- Migrations applied:
  - `20260325153138_initial_portfolio_schema`
  - `20260325162000_use_singular_table_names`
  - `20260325203000_add_icon_columns_for_legacy_import`

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

## Relationship metadata already supported

Technology usage relationships already support metadata on the join table:

- `level`
- `frequency`
- `contexts`

This keeps the schema ready for future dashboard, filtering, and analytics work without redesigning the database later.

## Asset-friendly fields added in Sprint B3

To support the one-time bootstrap import and the frontend-local media strategy, the following entities now also expose optional icon paths:

- `Project.icon`
- `Experience.icon`
- `Formation.icon`
- `SpokenLanguage.icon`
- `Customer.icon`
- `Job.icon`

These fields point to frontend-served assets such as `/assets/img/skills/...` and `/assets/img/experiences/...`.

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
- database tables use snake_case singular names through `@@map(...)`
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
