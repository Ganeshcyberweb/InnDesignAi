-- AlterTable
ALTER TABLE "public"."designs" ADD COLUMN     "generation_number" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "parent_design_id" UUID;

-- CreateIndex
CREATE INDEX "designs_parent_design_id_idx" ON "public"."designs"("parent_design_id");

-- AddForeignKey
ALTER TABLE "public"."designs" ADD CONSTRAINT "designs_parent_design_id_fkey" FOREIGN KEY ("parent_design_id") REFERENCES "public"."designs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
