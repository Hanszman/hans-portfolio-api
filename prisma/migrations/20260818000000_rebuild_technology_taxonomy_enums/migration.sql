-- Rebuild the Technology taxonomy enums (stack, type, level, frequency) with
-- their final member sets and display order. Mirrors the create-new-type /
-- backfill / guard / drop-old-type pattern used by
-- 20260817140000_normalize_technology_taxonomy_and_sort_order.

CREATE TYPE "TechnologyStack_new" AS ENUM ('FRONT_END', 'BACK_END', 'MOBILE', 'GAMES', 'DATABASES', 'TESTING', 'DEVOPS', 'CONCEPTS', 'OTHERS');
CREATE TYPE "TechnologyType_new" AS ENUM ('PROGRAMMING_LANGUAGES', 'WEB_LANGUAGES', 'LIBRARIES', 'FRAMEWORKS', 'RELATIONAL_DATABASES', 'NON_RELATIONAL_DATABASES', 'DATABASES_MANAGEMENT_SYSTEMS', 'ORMS', 'PACKAGES', 'PACKAGE_MANAGERS', 'VERSIONING_PLATFORMS', 'CLOUD_HOSTING_PLATFORMS', 'DEPLOYMENT_TOOLS', 'DEVELOPMENT_PLATFORMS', 'RUNTIME_ENVIRONMENTS', 'TESTING_TOOLS', 'BUILD_TOOLS', 'DOCUMENTATION_TOOLS', 'PREPROCESSORS', 'MARKUP_AND_FORMAT_SYNTAXES', 'PROTOCOLS', 'CODE_EDITORS', 'ARTIFICIAL_INTELLIGENCES', 'DESIGN_PATTERNS', 'PROGRAMMING_PARADIGMS', 'ARCHITECTURES', 'PRINCIPLES', 'TECHNIQUES', 'METHODOLOGIES', 'OTHERS');
CREATE TYPE "TechnologyLevel_new" AS ENUM ('ADVANCED', 'INTERMEDIATE', 'BASIC', 'STUDYING');
CREATE TYPE "TechnologyUsageFrequency_new" AS ENUM ('FREQUENT', 'OCCASIONAL', 'RARE');

ALTER TABLE "technology" ADD COLUMN "stack_new" "TechnologyStack_new";
ALTER TABLE "technology" ADD COLUMN "type_new" "TechnologyType_new";
ALTER TABLE "technology" ADD COLUMN "level_new" "TechnologyLevel_new";
ALTER TABLE "technology" ADD COLUMN "frequency_new" "TechnologyUsageFrequency_new";

-- stack keeps the same member names, only reordered/extended.
UPDATE "technology" SET "stack_new" = "stack"::text::"TechnologyStack_new";

-- type keeps every member name except OBJECT_NOTATIONS, renamed to
-- MARKUP_AND_FORMAT_SYNTAXES.
UPDATE "technology" SET "type_new" = (
  CASE WHEN "type"::text = 'OBJECT_NOTATIONS' THEN 'MARKUP_AND_FORMAT_SYNTAXES' ELSE "type"::text END
)::"TechnologyType_new";

-- level: existing BASIC/INTERMEDIATE/ADVANCED values keep their meaning.
-- Rows whose CURRENT (pre-backfill) frequency is STUDYING must get
-- level = STUDYING regardless of their previous level value. This must run
-- before the frequency column itself is rewritten below.
UPDATE "technology" SET "level_new" = (
  CASE
    WHEN "frequency" = 'STUDYING' THEN 'STUDYING'
    WHEN "level" IS NOT NULL THEN "level"::text
    ELSE NULL
  END
)::"TechnologyLevel_new";

-- frequency: FREQUENT/OCCASIONAL keep their meaning, PREVIOUSLY_USED becomes
-- RARE, and STUDYING becomes OCCASIONAL (its level was already preserved as
-- STUDYING above).
UPDATE "technology" SET "frequency_new" = (
  CASE "frequency"::text
    WHEN 'FREQUENT' THEN 'FREQUENT'
    WHEN 'OCCASIONAL' THEN 'OCCASIONAL'
    WHEN 'PREVIOUSLY_USED' THEN 'RARE'
    WHEN 'STUDYING' THEN 'OCCASIONAL'
    ELSE NULL
  END
)::"TechnologyUsageFrequency_new";

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM "technology" WHERE "stack_new" IS NULL OR "type_new" IS NULL) THEN
    RAISE EXCEPTION 'Technology stack/type backfill is incomplete; migration aborted.';
  END IF;
  IF EXISTS (SELECT 1 FROM "technology" WHERE "level" IS NOT NULL AND "level_new" IS NULL) THEN
    RAISE EXCEPTION 'Technology level backfill lost an existing value; migration aborted.';
  END IF;
  IF EXISTS (SELECT 1 FROM "technology" WHERE "frequency" = 'STUDYING' AND "level_new" IS DISTINCT FROM 'STUDYING') THEN
    RAISE EXCEPTION 'Technology studying level backfill is incomplete; migration aborted.';
  END IF;
  IF EXISTS (SELECT 1 FROM "technology" WHERE "frequency" IS NOT NULL AND "frequency_new" IS NULL) THEN
    RAISE EXCEPTION 'Technology frequency backfill is incomplete; migration aborted.';
  END IF;
END $$;

ALTER TABLE "technology" ALTER COLUMN "stack_new" SET NOT NULL;
ALTER TABLE "technology" ALTER COLUMN "type_new" SET NOT NULL;

DROP INDEX IF EXISTS "technology_stack_idx";
DROP INDEX IF EXISTS "technology_type_idx";

ALTER TABLE "technology" DROP COLUMN "stack";
ALTER TABLE "technology" DROP COLUMN "type";
ALTER TABLE "technology" DROP COLUMN "level";
ALTER TABLE "technology" DROP COLUMN "frequency";

ALTER TABLE "technology" RENAME COLUMN "stack_new" TO "stack";
ALTER TABLE "technology" RENAME COLUMN "type_new" TO "type";
ALTER TABLE "technology" RENAME COLUMN "level_new" TO "level";
ALTER TABLE "technology" RENAME COLUMN "frequency_new" TO "frequency";

CREATE INDEX "technology_stack_idx" ON "technology"("stack");
CREATE INDEX "technology_type_idx" ON "technology"("type");

DROP TYPE "TechnologyStack";
DROP TYPE "TechnologyType";
DROP TYPE "TechnologyLevel";
DROP TYPE "TechnologyUsageFrequency";

ALTER TYPE "TechnologyStack_new" RENAME TO "TechnologyStack";
ALTER TYPE "TechnologyType_new" RENAME TO "TechnologyType";
ALTER TYPE "TechnologyLevel_new" RENAME TO "TechnologyLevel";
ALTER TYPE "TechnologyUsageFrequency_new" RENAME TO "TechnologyUsageFrequency";
