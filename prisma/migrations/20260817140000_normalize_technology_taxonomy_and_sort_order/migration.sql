CREATE TYPE "TechnologyStack" AS ENUM ('BACK_END', 'DATABASES', 'FRONT_END', 'GAMES', 'MOBILE', 'OTHERS');
CREATE TYPE "TechnologyType" AS ENUM ('CLOUD_HOSTING_PLATFORMS', 'CODE_EDITORS', 'DATABASES_MANAGEMENT_SYSTEMS', 'DEPLOYMENT_TOOLS', 'DEVELOPMENT_PLATFORMS', 'FRAMEWORKS', 'LIBRARIES', 'METHODOLOGIES', 'NON_RELATIONAL_DATABASES', 'OBJECT_NOTATIONS', 'OTHERS', 'PACKAGE_MANAGERS', 'PACKAGES', 'PROGRAMMING_LANGUAGES', 'PROTOCOLS', 'RELATIONAL_DATABASES', 'TECHNIQUES', 'VERSIONING_PLATFORMS', 'WEB_LANGUAGES');

ALTER TABLE "technology" ADD COLUMN "stack" "TechnologyStack", ADD COLUMN "type" "TechnologyType";

UPDATE "technology" AS t SET "stack" = CASE tag."slug"
  WHEN 'stack-back-end' THEN 'BACK_END'::"TechnologyStack" WHEN 'stack-data-bases' THEN 'DATABASES'::"TechnologyStack"
  WHEN 'stack-front-end' THEN 'FRONT_END'::"TechnologyStack" WHEN 'stack-games' THEN 'GAMES'::"TechnologyStack"
  WHEN 'stack-mobile' THEN 'MOBILE'::"TechnologyStack" WHEN 'stack-others' THEN 'OTHERS'::"TechnologyStack" END
FROM "technology_tag" rel JOIN "tag" tag ON tag."id" = rel."tagId"
WHERE rel."technologyId" = t."id" AND tag."type" = 'STACK';

UPDATE "technology" AS t SET "type" = CASE tag."slug"
  WHEN 'type-cloud-hosting-plataforms' THEN 'CLOUD_HOSTING_PLATFORMS'::"TechnologyType"
  WHEN 'type-code-editors' THEN 'CODE_EDITORS'::"TechnologyType" WHEN 'type-databases-management-systems' THEN 'DATABASES_MANAGEMENT_SYSTEMS'::"TechnologyType"
  WHEN 'type-deployment-tools' THEN 'DEPLOYMENT_TOOLS'::"TechnologyType" WHEN 'type-development-plataforms' THEN 'DEVELOPMENT_PLATFORMS'::"TechnologyType"
  WHEN 'type-frameworks' THEN 'FRAMEWORKS'::"TechnologyType" WHEN 'type-libraries' THEN 'LIBRARIES'::"TechnologyType"
  WHEN 'type-methodologies' THEN 'METHODOLOGIES'::"TechnologyType" WHEN 'type-non-relationals' THEN 'NON_RELATIONAL_DATABASES'::"TechnologyType"
  WHEN 'type-object-notations' THEN 'OBJECT_NOTATIONS'::"TechnologyType" WHEN 'type-others' THEN 'OTHERS'::"TechnologyType"
  WHEN 'type-package-managers' THEN 'PACKAGE_MANAGERS'::"TechnologyType" WHEN 'type-packages' THEN 'PACKAGES'::"TechnologyType"
  WHEN 'type-programming-languages' THEN 'PROGRAMMING_LANGUAGES'::"TechnologyType" WHEN 'type-protocols' THEN 'PROTOCOLS'::"TechnologyType"
  WHEN 'type-relationals' THEN 'RELATIONAL_DATABASES'::"TechnologyType" WHEN 'type-techniques' THEN 'TECHNIQUES'::"TechnologyType"
  WHEN 'type-versioning-platforms' THEN 'VERSIONING_PLATFORMS'::"TechnologyType" WHEN 'type-web-languages' THEN 'WEB_LANGUAGES'::"TechnologyType" END
FROM "technology_tag" rel JOIN "tag" tag ON tag."id" = rel."tagId"
WHERE rel."technologyId" = t."id" AND tag."type" = 'DOMAIN';

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM "technology" WHERE "stack" IS NULL OR "type" IS NULL) THEN
    RAISE EXCEPTION 'Technology taxonomy backfill is incomplete; migration aborted.';
  END IF;
  IF EXISTS (
    SELECT rel."technologyId" FROM "technology_tag" rel JOIN "tag" tag ON tag."id" = rel."tagId"
    WHERE tag."type" IN ('STACK', 'DOMAIN') GROUP BY rel."technologyId", tag."type" HAVING COUNT(*) <> 1
  ) THEN RAISE EXCEPTION 'Technology taxonomy has duplicate classifications; migration aborted.'; END IF;
END $$;

ALTER TABLE "technology" ALTER COLUMN "stack" SET NOT NULL, ALTER COLUMN "type" SET NOT NULL;
CREATE INDEX "technology_stack_idx" ON "technology"("stack");
CREATE INDEX "technology_type_idx" ON "technology"("type");

DROP TABLE "project_tag";
DROP TABLE "technology_tag";
DROP TABLE "tag";
DROP TYPE "TagType";

DO $$ DECLARE target_table text; BEGIN
  FOREACH target_table IN ARRAY ARRAY['project', 'experience', 'technology', 'formation', 'spoken_language', 'customer', 'job', 'link', 'image_asset'] LOOP
    EXECUTE format('WITH ranked AS (SELECT "id", ROW_NUMBER() OVER (ORDER BY "sortOrder", "createdAt", "id") - 1 AS position FROM %I) UPDATE %I AS item SET "sortOrder" = ranked.position FROM ranked WHERE item."id" = ranked."id"', target_table, target_table);
  END LOOP;
END $$;
