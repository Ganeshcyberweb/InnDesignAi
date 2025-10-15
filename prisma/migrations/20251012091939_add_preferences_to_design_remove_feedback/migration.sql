/*
  Warnings:

  - You are about to drop the `feedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `preferences` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."feedback" DROP CONSTRAINT "feedback_design_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."feedback" DROP CONSTRAINT "feedback_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."preferences" DROP CONSTRAINT "preferences_design_id_fkey";

-- AlterTable
ALTER TABLE "public"."designs" ADD COLUMN     "budget" DECIMAL(65,30),
ADD COLUMN     "colorPalette" JSONB,
ADD COLUMN     "color_scheme" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "material_preferences" TEXT,
ADD COLUMN     "mood" TEXT,
ADD COLUMN     "other_requirements" TEXT,
ADD COLUMN     "priority" TEXT,
ADD COLUMN     "roomType" TEXT,
ADD COLUMN     "size" TEXT,
ADD COLUMN     "style" TEXT,
ADD COLUMN     "style_preference" TEXT,
ADD COLUMN     "title" TEXT,
ALTER COLUMN "input_prompt" DROP NOT NULL,
ALTER COLUMN "ai_model_used" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'COMPLETED';

-- DropTable
DROP TABLE "public"."feedback";

-- DropTable
DROP TABLE "public"."preferences";

-- DropEnum
DROP TYPE "public"."FeedbackType";
