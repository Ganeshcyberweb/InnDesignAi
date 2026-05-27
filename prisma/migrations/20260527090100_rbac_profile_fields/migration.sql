-- Phase 2 RBAC (step 2 of 2): default new profiles to USER and add admin/RBAC fields.
-- Runs in a separate migration so the 'USER' enum value added in the previous
-- migration is already committed and usable here.

-- New signups become regular USERs by default.
ALTER TABLE "public"."profiles" ALTER COLUMN "role" SET DEFAULT 'USER';

-- Admin / RBAC support columns (all additive: defaulted or nullable).
ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "last_login" TIMESTAMP(3);
ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "permissions" JSONB;
ALTER TABLE "public"."profiles" ADD COLUMN IF NOT EXISTS "created_by_admin" UUID;
