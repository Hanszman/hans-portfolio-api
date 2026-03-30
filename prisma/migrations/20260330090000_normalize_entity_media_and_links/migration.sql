CREATE TABLE "technology_link" (
    "technologyId" UUID NOT NULL,
    "linkId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "technology_link_pkey" PRIMARY KEY ("technologyId","linkId")
);

ALTER TABLE "technology_link"
ADD CONSTRAINT "technology_link_technologyId_fkey"
FOREIGN KEY ("technologyId") REFERENCES "technology"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "technology_link"
ADD CONSTRAINT "technology_link_linkId_fkey"
FOREIGN KEY ("linkId") REFERENCES "link"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "project"
DROP COLUMN "repositoryUrl",
DROP COLUMN "deployUrl",
DROP COLUMN "docsUrl",
DROP COLUMN "npmUrl",
DROP COLUMN "icon";

ALTER TABLE "experience"
DROP COLUMN "icon";

ALTER TABLE "technology"
DROP COLUMN "icon",
DROP COLUMN "officialUrl";

ALTER TABLE "formation"
DROP COLUMN "icon";

ALTER TABLE "spoken_language"
DROP COLUMN "icon";

ALTER TABLE "customer"
DROP COLUMN "icon";

ALTER TABLE "job"
DROP COLUMN "icon";
