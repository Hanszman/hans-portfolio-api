-- Additive enum change: PostgreSQL supports adding a new enum value without a
-- full type rebuild. This is the only statement in this migration so that the
-- new value is never referenced inside the same transaction that adds it.

ALTER TYPE "ProjectStatus" ADD VALUE 'ABANDONED';
