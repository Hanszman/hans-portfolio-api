# Seed Snapshot Strategy

This document describes the finalized B3 data strategy after the one-time bootstrap import.

## Goal

The project no longer depends on `victor_hanszman_portfolio-old` to repopulate the database.

Instead, the current portfolio content now lives in a versioned snapshot file:

- `prisma/data/portfolio-seed.snapshot.json`

That file is the fixed backup of the current portfolio state.

## Current scripts

- `npm run prisma:seed`
  - applies pending Prisma migrations
  - clears the current portfolio content tables
  - reinserts the full versioned snapshot
  - recreates or updates the admin user automatically when `ADMIN_BOOTSTRAP_*` is configured
- `npm run prisma:seed:reset`
  - clears the current portfolio content tables only
  - keeps the `user` table untouched
- `npm run prisma:seed:snapshot`
  - exports the current database state into `prisma/data/portfolio-seed.snapshot.json`

## Data source of truth

The current source of truth for the initial portfolio content is now:

- `prisma/data/portfolio-seed.snapshot.json`

The old portfolio repo was used only once to bootstrap the initial import. After that, the snapshot became the versioned backup that can be replayed at any time.

## Asset strategy

The static media is also versioned locally now:

- `hans-portfolio-app/src/assets/img/experiences`
- `hans-portfolio-app/src/assets/img/logo`
- `hans-portfolio-app/src/assets/img/profile`
- `hans-portfolio-app/src/assets/img/projects`
- `hans-portfolio-app/src/assets/img/skills`

This means the backend seed no longer needs to copy files from the old repo on each run.

The snapshot also stores the normalized image catalog:

- `imageAssets` contains every file currently versioned under `hans-portfolio-app/src/assets/img`
- each image record keeps `fileName`, `filePath`, `folder`, and `kind`
- relation arrays connect those files to the portfolio entities that use them as icons or screenshots:
  - `projectImageAssets`
  - `experienceImageAssets`
  - `formationImageAssets`
  - `technologyImageAssets`
  - `spokenLanguageImageAssets`
  - `customerImageAssets`
  - `jobImageAssets`

This keeps the database replayable while also preserving the rendering metadata the frontend needs.

The snapshot also stores explicit technology usage periods in:

- `projectTechnologies`
- `experienceTechnologies`
- `formationTechnologies`

Each row can now persist:

- `level`
- `frequency`
- `contexts`
- `startedAt`
- `endedAt`

This means reseeding the database also restores the exact date windows used by the API to calculate `experienceMetrics` for each technology.

When a legacy row is still missing those dates, the seed/export flow now normalizes it automatically from the owning entity:

- `project_technology` falls back to the project date range and project context
- `experience_technology` falls back to the experience date range and `PROFESSIONAL`
- `formation_technology` falls back to the formation date range and `ACADEMIC`

That keeps the replayable snapshot aligned with the current database model while still allowing manual refinement later.

## Why this is safer

- the seed is deterministic
- the repo contains the backup of the current content
- reset and reseed can be tested at any time
- the portfolio no longer depends on legacy JSON files staying available
