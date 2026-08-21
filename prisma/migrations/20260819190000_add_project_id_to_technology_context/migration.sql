-- TechnologyContext gains an optional projectId so contexts derived from a
-- Project's technology relations can be traced back to (and cascaded from)
-- that Project, without confusing them with manually-curated contexts.

ALTER TABLE "technology_context" ADD COLUMN "projectId" UUID;

CREATE INDEX "technology_context_projectId_idx" ON "technology_context"("projectId");

ALTER TABLE "technology_context"
ADD CONSTRAINT "technology_context_projectId_fkey"
FOREIGN KEY ("projectId")
REFERENCES "project"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Project.startDate becomes required: no existing row has it null today, but
-- guard defensively before enforcing NOT NULL, matching prior migrations.
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM "project" WHERE "startDate" IS NULL) THEN
    RAISE EXCEPTION 'Project startDate backfill is incomplete; migration aborted.';
  END IF;
END $$;

ALTER TABLE "project" ALTER COLUMN "startDate" SET NOT NULL;
