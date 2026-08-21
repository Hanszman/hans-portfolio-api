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
  - `20260327112832_normalize_image_asset_relations`
  - `20260328143000_add_technology_usage_periods`
  - `20260329130000_refactor_technology_context_model`
  - `20260731120000_add_spanish_content_columns`
  - `20260731121000_require_spanish_content_columns`
  - `20260811100000_add_job_date_range`
  - `20260812150000_make_job_summaries_optional`
  - `20260817140000_normalize_technology_taxonomy_and_sort_order`
  - `20260817170000_remove_technology_category`
  - `20260818000000_rebuild_technology_taxonomy_enums`
  - `20260818010000_simplify_image_asset`
  - `20260818020000_make_customer_summary_optional`
  - `20260818030000_remove_job_image_assets_and_context_links`
  - `20260818040000_add_project_status_abandoned`
  - `20260818050000_project_environment_and_field_renames`
  - `20260819190000_add_project_id_to_technology_context`

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

## Localized columns

Localized content follows explicit sibling columns rather than a translation
table. Projects, experiences, formations, spoken languages, customers, jobs,
links, image assets and tags expose `Pt`, `En` and `Es` variants for every
localized property. Spanish is required wherever Pt/En are required;
`Link.descriptionEs` and `ImageAsset.altEs` remain nullable to match their
existing variants, and `Customer.summaryPt/En/Es` are now all optional. The
`profile` portfolio setting also stores `introEs` inside its JSON value.

`Project` renamed its localized fields for clarity:
`shortDescriptionPt/En/Es` became `summaryPt/En/Es`, and
`fullDescriptionPt/En/Es` became `descriptionPt/En/Es` (data-preserving column
renames, no content change).

The Spanish migration was deliberately split in two: the first migration added
nullable columns so existing rows remained valid during backfill, and the second
applied required constraints only after all translations had been persisted.

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
- `project_image_asset`
- `experience_image_asset`
- `formation_image_asset`
- `technology_image_asset`
- `spoken_language_image_asset`
- `customer_image_asset`

`formation_link`, `technology_link`, `experience_link`, and `job_image_asset`
were dropped: `Formation`, `Technology`, and `Experience` no longer relate to
`Link`, and `Job` no longer relates to `ImageAsset`. `Project.links` and every
other entity's `imageAssets` relation are unaffected.

## Technology metadata model

Technology proficiency metadata now lives in two places:

- `technology.level`
- `technology.frequency`

Those fields represent the current global state of the technology itself.

## Precise technology time tracking

Precise technology usage periods now live in the dedicated `technology_context` table:

- `technology_context.technologyId`
- `technology_context.projectId` (optional; set when the row was derived automatically from a
  `Project`'s technology relations, `startDate`/`endDate` and `context` — see below)
- `technology_context.context`
- `technology_context.startedAt`
- `technology_context.endedAt`

That table supports multiple rows per technology and per context. This allows exact totals by context, exact totals across all contexts, and overlap-safe merged totals when different contexts happen during the same calendar period.

### Project-derived technology contexts

Every `Project` create/update flow (`ContentAdminService`, via `ProjectTechnologyContextSyncService`)
automatically mirrors the project's technology relations into `technology_context`, tagging each
generated row with `projectId`:

- On create: one `technology_context` row is created per related technology, using the project's
  `context`, `startDate` and `endDate`.
- On update: whenever the payload touches `technologyRelations`, `startDate`, `endDate` or
  `context`, every `technology_context` row tagged with that `projectId` is deleted and recreated
  from the project's current state. Updates that touch none of those fields leave
  `technology_context` untouched.
- On delete: the `projectId` foreign key uses `onDelete: Cascade`, so deleting a `Project`
  automatically removes every `technology_context` row it generated, with no application code
  needed.

Manually curated `technology_context` rows (created directly through
`POST /admin/technology-contexts` without a `projectId`) are never touched by this sync, since it
only ever targets rows matching a specific `projectId`.

`Project.startDate` is required (not nullable) precisely so every project-derived
`technology_context` row always has a valid `startedAt`.

The backend merges overlapping months before computing the total duration, so periods that happen in parallel across different contexts are not double-counted.

## Asset normalization

The backend no longer stores direct icon or URL columns inside the main content entities.

Instead:

- images/icons/logos/screenshots are stored in `image_asset`
- projects, experiences, formations, technologies, spoken languages, and customers connect to those assets through explicit join tables (`Job` no longer has an image relation)
- URLs are stored in `link`
- only projects connect to links through an explicit join table (`project_link`)

## Image catalog normalization added after B5

The image strategy is now fully normalized:

- `image_asset` stores the versioned media catalog
- every image asset now stores:
  - `fileName`
  - `filePath` (already the full path, including the file name)
  - `kind`
  - optional alt metadata
- `folder`, `captionPt/En/Es`, and `mimeType` were removed: `filePath` already
  encodes the full path, and the captions/mime type had no real read usage
- `kind` distinguishes how the frontend should interpret the asset, for example:
  - `ICON`
  - `SCREENSHOT`
  - `LOGO`
  - `PROFILE`

This allows the public API to return rich `imageAssets` relations with metadata for rendering, while keeping the database free of duplicated direct media fields.

The following first-class entities now have explicit image joins:

- `Project`
- `Experience`
- `Formation`
- `Technology`
- `SpokenLanguage`
- `Customer`

`Job` no longer has an `imageAssets` relation; the frontend reads job imagery
from the related `Experience.imageAssets` instead.

The only first-class entity with an explicit link join is now:

- `Project`

## Enums created in the first migration

- `UserRole`
- `ProjectContext`
- `ProjectStatus`
- `ProjectEnvironment`
- `TechnologyCategory` (removed in `20260817170000_remove_technology_category`)
- `TechnologyLevel`
- `TechnologyUsageFrequency`
- `TechnologyUsageContext`
- `DegreeType`
- `SpokenLanguageProficiency`
- `LinkType`
- `TagType`
- `ImageAssetKind`

## Technology taxonomy rebuild (`20260818000000_rebuild_technology_taxonomy_enums`)

`TechnologyStack`, `TechnologyType`, `TechnologyLevel`, and
`TechnologyUsageFrequency` were rebuilt with their final member sets and
display order:

- `TechnologyStack`: `FRONT_END, BACK_END, MOBILE, GAMES, DATABASES, TESTING, DEVOPS, CONCEPTS, OTHERS`
  (`TESTING`, `DEVOPS`, `CONCEPTS` are new; existing members kept their name)
- `TechnologyType`: existing members were reordered and kept their name except
  `OBJECT_NOTATIONS`, renamed to `MARKUP_AND_FORMAT_SYNTAXES`; new members with
  no existing data were added: `ORMS`, `RUNTIME_ENVIRONMENTS`, `TESTING_TOOLS`,
  `BUILD_TOOLS`, `DOCUMENTATION_TOOLS`, `PREPROCESSORS`,
  `ARTIFICIAL_INTELLIGENCES`, `DESIGN_PATTERNS`, `PROGRAMMING_PARADIGMS`,
  `ARCHITECTURES`, `PRINCIPLES`
- `TechnologyLevel`: `ADVANCED, INTERMEDIATE, BASIC, STUDYING` (`STUDYING` is
  new; rows whose old `frequency` was `STUDYING` were backfilled to
  `level = STUDYING`)
- `TechnologyUsageFrequency`: `FREQUENT, OCCASIONAL, RARE`
  (`PREVIOUSLY_USED` was renamed to `RARE`; rows whose old frequency was
  `STUDYING` were backfilled to `frequency = OCCASIONAL`, keeping their new
  `level = STUDYING`)

## Project enum and field changes (`20260818040000_add_project_status_abandoned`, `20260818050000_project_environment_and_field_renames`)

- `ProjectStatus` gained a new value, `ABANDONED`, added additively
  (`ALTER TYPE ... ADD VALUE`)
- `ProjectEnvironment.DASHBOARD` was replaced by `OTHER` (full enum rebuild
  with a `DASHBOARD -> OTHER` backfill)
- `Project.shortDescriptionPt/En/Es` were renamed to `summaryPt/En/Es`, and
  `Project.fullDescriptionPt/En/Es` were renamed to `descriptionPt/En/Es`
  (data-preserving `RENAME COLUMN`)

## Portfolio settings CRUD removal

The application-layer CRUD surface for `portfolio_setting` (controllers,
contracts, and the `/portfolio-settings` routes) was removed. The
`PortfolioSetting` model and its `portfolio_setting` table remain in the
schema and database for historical purposes; no migration touched them.

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
