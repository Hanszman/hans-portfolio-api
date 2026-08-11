ALTER TABLE "job"
ADD COLUMN "startDate" DATE,
ADD COLUMN "endDate" DATE;

UPDATE "job" AS job
SET
  "startDate" = experience_span."startDate",
  "endDate" = experience_span."endDate"
FROM (
  SELECT
    relation."jobId",
    MIN(experience."startDate") AS "startDate",
    CASE
      WHEN BOOL_OR(experience."endDate" IS NULL) THEN NULL
      ELSE MAX(experience."endDate")
    END AS "endDate"
  FROM "experience_job" AS relation
  INNER JOIN "experience" AS experience
    ON experience."id" = relation."experienceId"
  GROUP BY relation."jobId"
) AS experience_span
WHERE job."id" = experience_span."jobId";

ALTER TABLE "job"
ALTER COLUMN "startDate" SET NOT NULL;
