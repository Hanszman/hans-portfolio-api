-- ProjectEnvironment: replace DASHBOARD with OTHER (value removal requires a
-- full new-enum + backfill + drop-old-enum rebuild, mirroring the Technology
-- taxonomy migration).

CREATE TYPE "ProjectEnvironment_new" AS ENUM ('FRONTEND', 'BACKEND', 'FULLSTACK', 'MOBILE', 'LIBRARY', 'OTHER');

ALTER TABLE "project" ADD COLUMN "environment_new" "ProjectEnvironment_new";

UPDATE "project" SET "environment_new" = (
  CASE WHEN "environment"::text = 'DASHBOARD' THEN 'OTHER' ELSE "environment"::text END
)::"ProjectEnvironment_new";

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM "project" WHERE "environment_new" IS NULL) THEN
    RAISE EXCEPTION 'Project environment backfill is incomplete; migration aborted.';
  END IF;
END $$;

ALTER TABLE "project" ALTER COLUMN "environment_new" SET NOT NULL;
ALTER TABLE "project" DROP COLUMN "environment";
ALTER TABLE "project" RENAME COLUMN "environment_new" TO "environment";

DROP TYPE "ProjectEnvironment";
ALTER TYPE "ProjectEnvironment_new" RENAME TO "ProjectEnvironment";

-- Data-preserving field renames on Project.
ALTER TABLE "project" RENAME COLUMN "shortDescriptionPt" TO "summaryPt";
ALTER TABLE "project" RENAME COLUMN "shortDescriptionEn" TO "summaryEn";
ALTER TABLE "project" RENAME COLUMN "shortDescriptionEs" TO "summaryEs";
ALTER TABLE "project" RENAME COLUMN "fullDescriptionPt" TO "descriptionPt";
ALTER TABLE "project" RENAME COLUMN "fullDescriptionEn" TO "descriptionEn";
ALTER TABLE "project" RENAME COLUMN "fullDescriptionEs" TO "descriptionEs";
