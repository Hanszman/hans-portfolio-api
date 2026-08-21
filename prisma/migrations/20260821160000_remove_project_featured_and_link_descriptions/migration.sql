-- Project.featured is redundant with Project.highlight, which is already the
-- single source of truth for highlighting/ordering projects across the app.
ALTER TABLE "project" DROP COLUMN "featured";

-- Link.descriptionPt/En/Es were never rendered publicly and are not needed.
ALTER TABLE "link" DROP COLUMN "descriptionPt";
ALTER TABLE "link" DROP COLUMN "descriptionEn";
ALTER TABLE "link" DROP COLUMN "descriptionEs";
