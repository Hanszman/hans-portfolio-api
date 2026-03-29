CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE "technology"
ADD COLUMN "level" "TechnologyLevel",
ADD COLUMN "frequency" "TechnologyUsageFrequency";

CREATE TABLE "technology_context" (
    "id" UUID NOT NULL,
    "technologyId" UUID NOT NULL,
    "context" "TechnologyUsageContext" NOT NULL,
    "startedAt" DATE NOT NULL,
    "endedAt" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "technology_context_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "technology_context_technologyId_context_startedAt_idx"
ON "technology_context"("technologyId", "context", "startedAt");

ALTER TABLE "technology_context"
ADD CONSTRAINT "technology_context_technologyId_fkey"
FOREIGN KEY ("technologyId")
REFERENCES "technology"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

WITH ranked_levels AS (
    SELECT
        usage_rows."technologyId",
        usage_rows."level",
        ROW_NUMBER() OVER (
            PARTITION BY usage_rows."technologyId"
            ORDER BY
                CASE usage_rows."level"
                    WHEN 'ADVANCED' THEN 3
                    WHEN 'INTERMEDIATE' THEN 2
                    WHEN 'BASIC' THEN 1
                    ELSE 0
                END DESC
        ) AS rank_position
    FROM (
        SELECT "technologyId", "level"
        FROM "project_technology"
        WHERE "level" IS NOT NULL

        UNION ALL

        SELECT "technologyId", "level"
        FROM "experience_technology"
        WHERE "level" IS NOT NULL

        UNION ALL

        SELECT "technologyId", "level"
        FROM "formation_technology"
        WHERE "level" IS NOT NULL
    ) AS usage_rows
),
ranked_frequencies AS (
    SELECT
        usage_rows."technologyId",
        usage_rows."frequency",
        ROW_NUMBER() OVER (
            PARTITION BY usage_rows."technologyId"
            ORDER BY
                CASE usage_rows."frequency"
                    WHEN 'FREQUENT' THEN 4
                    WHEN 'OCCASIONAL' THEN 3
                    WHEN 'STUDYING' THEN 2
                    WHEN 'PREVIOUSLY_USED' THEN 1
                    ELSE 0
                END DESC
        ) AS rank_position
    FROM (
        SELECT "technologyId", "frequency"
        FROM "project_technology"
        WHERE "frequency" IS NOT NULL

        UNION ALL

        SELECT "technologyId", "frequency"
        FROM "experience_technology"
        WHERE "frequency" IS NOT NULL

        UNION ALL

        SELECT "technologyId", "frequency"
        FROM "formation_technology"
        WHERE "frequency" IS NOT NULL
    ) AS usage_rows
)
UPDATE "technology" AS technology
SET
    "level" = ranked_levels."level",
    "frequency" = ranked_frequencies."frequency"
FROM ranked_levels
FULL OUTER JOIN ranked_frequencies
    ON ranked_levels."technologyId" = ranked_frequencies."technologyId"
WHERE technology."id" = COALESCE(
    ranked_levels."technologyId",
    ranked_frequencies."technologyId"
)
AND (ranked_levels.rank_position = 1 OR ranked_levels.rank_position IS NULL)
AND (
    ranked_frequencies.rank_position = 1
    OR ranked_frequencies.rank_position IS NULL
);

INSERT INTO "technology_context" (
    "id",
    "technologyId",
    "context",
    "startedAt",
    "endedAt"
)
SELECT
    gen_random_uuid(),
    usage_rows."technologyId",
    usage_rows."context",
    usage_rows."startedAt",
    usage_rows."endedAt"
FROM (
    SELECT
        project_usage."technologyId",
        UNNEST(project_usage."contexts") AS "context",
        project_usage."startedAt",
        project_usage."endedAt"
    FROM "project_technology" AS project_usage
    WHERE
        project_usage."startedAt" IS NOT NULL
        AND CARDINALITY(project_usage."contexts") > 0

    UNION ALL

    SELECT
        experience_usage."technologyId",
        UNNEST(experience_usage."contexts") AS "context",
        experience_usage."startedAt",
        experience_usage."endedAt"
    FROM "experience_technology" AS experience_usage
    WHERE
        experience_usage."startedAt" IS NOT NULL
        AND CARDINALITY(experience_usage."contexts") > 0

    UNION ALL

    SELECT
        formation_usage."technologyId",
        UNNEST(formation_usage."contexts") AS "context",
        formation_usage."startedAt",
        formation_usage."endedAt"
    FROM "formation_technology" AS formation_usage
    WHERE
        formation_usage."startedAt" IS NOT NULL
        AND CARDINALITY(formation_usage."contexts") > 0
) AS usage_rows;

ALTER TABLE "project_technology"
DROP COLUMN "level",
DROP COLUMN "frequency",
DROP COLUMN "contexts",
DROP COLUMN "startedAt",
DROP COLUMN "endedAt";

ALTER TABLE "experience_technology"
DROP COLUMN "level",
DROP COLUMN "frequency",
DROP COLUMN "contexts",
DROP COLUMN "startedAt",
DROP COLUMN "endedAt";

ALTER TABLE "formation_technology"
DROP COLUMN "level",
DROP COLUMN "frequency",
DROP COLUMN "contexts",
DROP COLUMN "startedAt",
DROP COLUMN "endedAt";
