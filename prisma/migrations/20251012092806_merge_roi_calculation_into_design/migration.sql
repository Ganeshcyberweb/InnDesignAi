/*
  Warnings:

  - You are about to drop the `roi_calculations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."roi_calculations" DROP CONSTRAINT "roi_calculations_design_id_fkey";

-- AlterTable
ALTER TABLE "public"."designs" ADD COLUMN     "cost_breakdown" JSONB,
ADD COLUMN     "estimated_cost" DOUBLE PRECISION,
ADD COLUMN     "payback_timeline" TEXT,
ADD COLUMN     "roi_notes" TEXT,
ADD COLUMN     "roi_percentage" DOUBLE PRECISION;

-- DropTable
DROP TABLE "public"."roi_calculations";
