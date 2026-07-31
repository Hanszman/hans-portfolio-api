ALTER TABLE "project"
  ADD COLUMN "titleEs" TEXT,
  ADD COLUMN "shortDescriptionEs" TEXT,
  ADD COLUMN "fullDescriptionEs" TEXT;

ALTER TABLE "experience"
  ADD COLUMN "titleEs" TEXT,
  ADD COLUMN "summaryEs" TEXT,
  ADD COLUMN "descriptionEs" TEXT;

ALTER TABLE "formation"
  ADD COLUMN "titleEs" TEXT,
  ADD COLUMN "summaryEs" TEXT;

ALTER TABLE "spoken_language"
  ADD COLUMN "nameEs" TEXT;

ALTER TABLE "customer"
  ADD COLUMN "summaryEs" TEXT;

ALTER TABLE "job"
  ADD COLUMN "nameEs" TEXT,
  ADD COLUMN "summaryEs" TEXT;

ALTER TABLE "link"
  ADD COLUMN "labelEs" TEXT,
  ADD COLUMN "descriptionEs" TEXT;

ALTER TABLE "image_asset"
  ADD COLUMN "altEs" TEXT,
  ADD COLUMN "captionEs" TEXT;

ALTER TABLE "tag"
  ADD COLUMN "nameEs" TEXT;

-- Keep this migration deployable against populated databases. The curated
-- Spanish snapshot backfill replaces these compatibility values immediately.
UPDATE "project"
SET
  "titleEs" = "titleEn",
  "shortDescriptionEs" = "shortDescriptionEn",
  "fullDescriptionEs" = "fullDescriptionEn";

UPDATE "experience"
SET
  "titleEs" = "titleEn",
  "summaryEs" = "summaryEn",
  "descriptionEs" = "descriptionEn";

UPDATE "formation"
SET "titleEs" = "titleEn", "summaryEs" = "summaryEn";

UPDATE "spoken_language" SET "nameEs" = "nameEn";
UPDATE "customer" SET "summaryEs" = "summaryEn";
UPDATE "job" SET "nameEs" = "nameEn", "summaryEs" = "summaryEn";
UPDATE "link" SET "labelEs" = "labelEn", "descriptionEs" = "descriptionEn";
UPDATE "image_asset" SET "altEs" = "altEn", "captionEs" = "captionEn";
UPDATE "tag" SET "nameEs" = "nameEn";
