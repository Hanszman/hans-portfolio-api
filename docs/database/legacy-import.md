# Legacy Import Strategy

This document describes the legacy import pipeline introduced in Sprint `B3`.

## Source repositories

- Legacy content source: `../victor_hanszman_portfolio-old`
- New backend: `hans-portfolio-api`
- New frontend asset target: `../hans-portfolio-app/src/assets/img`

## Imported legacy datasets

The seed reads the following files from the old portfolio:

- `src/db/projects.json`
- `src/db/experiences.json`
- `src/db/skills.json`
- `src/db/options.json`
- `src/assets/i18n/locales/pt/pt-br.json`
- `src/assets/i18n/locales/en/en-us.json`

## Imported legacy assets

The seed copies the entire legacy image tree into the new Angular app:

- `src/assets/img/experiences`
- `src/assets/img/logo`
- `src/assets/img/profile`
- `src/assets/img/projects`
- `src/assets/img/skills`

The Angular app was configured to publish `src/assets` during build and test, so these files are now available from `/assets/img/...`.

## Current B3 behavior

`npm run prisma:seed` does all of this in one flow:

1. apply pending Prisma migrations
2. read the legacy JSON and translation files
3. copy the legacy assets to the Angular app
4. reset the portfolio content tables
5. insert the imported portfolio content again

## Entity mapping highlights

- `Project` receives legacy descriptions, links, contexts, statuses, and optional icon paths
- `Experience` is created from the legacy professional company timeline
- `Technology` imports level, category, stack tags, and icon paths
- `Formation`, `SpokenLanguage`, `Customer`, and `Job` now also carry optional icon paths
- `PortfolioSetting` stores imported branding, profile copy, and legacy filter options

## Asset path convention

The API now stores frontend-friendly paths such as:

- `/assets/img/skills/angular.png`
- `/assets/img/experiences/stefanini.jpg`
- `/assets/img/projects/github-consumer.png`
- `/assets/img/logo/vh_logo_blue.svg`

This keeps the deployment simple on Vercel while the project does not yet use external object storage.
