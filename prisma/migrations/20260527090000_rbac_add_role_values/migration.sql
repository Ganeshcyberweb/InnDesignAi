-- Phase 2 RBAC (step 1 of 2): add the new role values to the existing enum.
-- This is additive and non-breaking: the legacy CLIENT/DESIGNER/ADMIN values are
-- retained so currently-deployed code and existing rows keep working. The new
-- values must be committed in their own migration before they can be used
-- (e.g. as a column default or in data updates) in the next migration.
ALTER TYPE "public"."UserRole" ADD VALUE IF NOT EXISTS 'GUEST';
ALTER TYPE "public"."UserRole" ADD VALUE IF NOT EXISTS 'USER';
ALTER TYPE "public"."UserRole" ADD VALUE IF NOT EXISTS 'SUPER_ADMIN';
