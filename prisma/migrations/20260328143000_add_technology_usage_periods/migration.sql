-- AlterTable
ALTER TABLE "project_technology"
ADD COLUMN     "startedAt" DATE,
ADD COLUMN     "endedAt" DATE;

-- AlterTable
ALTER TABLE "experience_technology"
ADD COLUMN     "startedAt" DATE,
ADD COLUMN     "endedAt" DATE;

-- AlterTable
ALTER TABLE "formation_technology"
ADD COLUMN     "startedAt" DATE,
ADD COLUMN     "endedAt" DATE;

-- Backfill periods from parent entities
UPDATE "project_technology" AS pt
SET
  "startedAt" = COALESCE(p."startDate", CURRENT_DATE),
  "endedAt" = COALESCE(p."endDate", CURRENT_DATE)
FROM "project" AS p
WHERE p."id" = pt."projectId"
  AND pt."startedAt" IS NULL
  AND pt."endedAt" IS NULL;

UPDATE "experience_technology" AS et
SET
  "startedAt" = e."startDate",
  "endedAt" = COALESCE(e."endDate", CURRENT_DATE)
FROM "experience" AS e
WHERE e."id" = et."experienceId"
  AND et."startedAt" IS NULL
  AND et."endedAt" IS NULL;

UPDATE "formation_technology" AS ft
SET
  "startedAt" = f."startDate",
  "endedAt" = COALESCE(f."endDate", CURRENT_DATE)
FROM "formation" AS f
WHERE f."id" = ft."formationId"
  AND ft."startedAt" IS NULL
  AND ft."endedAt" IS NULL;

-- Backfill contexts when legacy rows do not declare them explicitly
UPDATE "project_technology" AS pt
SET "contexts" = ARRAY[p."context"::TEXT]::"TechnologyUsageContext"[]
FROM "project" AS p
WHERE p."id" = pt."projectId"
  AND COALESCE(array_length(pt."contexts", 1), 0) = 0;

UPDATE "experience_technology"
SET "contexts" = ARRAY['PROFESSIONAL']::"TechnologyUsageContext"[]
WHERE COALESCE(array_length("contexts", 1), 0) = 0;

UPDATE "formation_technology"
SET "contexts" = ARRAY['ACADEMIC']::"TechnologyUsageContext"[]
WHERE COALESCE(array_length("contexts", 1), 0) = 0;
