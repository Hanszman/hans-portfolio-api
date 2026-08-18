-- Simplify ImageAsset: drop folder, per-locale captions, and mimeType.
-- filePath already stores the full path (including filename), so it is
-- left untouched.

ALTER TABLE "image_asset"
  DROP COLUMN "folder",
  DROP COLUMN "captionPt",
  DROP COLUMN "captionEn",
  DROP COLUMN "captionEs",
  DROP COLUMN "mimeType";
