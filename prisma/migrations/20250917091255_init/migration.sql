-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('CLIENT', 'DESIGNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."DesignStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."FeedbackType" AS ENUM ('GENERAL', 'QUALITY', 'ACCURACY', 'USABILITY', 'FEATURE_REQUEST', 'BUG_REPORT');

-- CreateTable
CREATE TABLE "public"."profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT,
    "company" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'CLIENT',
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."designs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "input_prompt" TEXT NOT NULL,
    "uploaded_image_url" TEXT,
    "ai_model_used" TEXT NOT NULL,
    "status" "public"."DesignStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "designs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."preferences" (
    "id" UUID NOT NULL,
    "design_id" UUID NOT NULL,
    "room_type" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "style_preference" TEXT NOT NULL,
    "budget" DOUBLE PRECISION,
    "color_scheme" TEXT,
    "material_preferences" TEXT,
    "other_requirements" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."design_outputs" (
    "id" UUID NOT NULL,
    "design_id" UUID NOT NULL,
    "output_image_url" TEXT NOT NULL,
    "variation_name" TEXT,
    "generation_parameters" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "design_outputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roi_calculations" (
    "id" UUID NOT NULL,
    "design_id" UUID NOT NULL,
    "estimated_cost" DOUBLE PRECISION NOT NULL,
    "roi_percentage" DOUBLE PRECISION NOT NULL,
    "payback_timeline" TEXT,
    "cost_breakdown" JSONB,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roi_calculations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."feedback" (
    "id" UUID NOT NULL,
    "design_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "rating" SMALLINT NOT NULL,
    "comments" TEXT,
    "type" "public"."FeedbackType" NOT NULL DEFAULT 'GENERAL',
    "helpful" BOOLEAN,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "public"."profiles"("user_id");

-- CreateIndex
CREATE INDEX "designs_user_id_idx" ON "public"."designs"("user_id");

-- CreateIndex
CREATE INDEX "designs_status_idx" ON "public"."designs"("status");

-- CreateIndex
CREATE INDEX "designs_created_at_idx" ON "public"."designs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "preferences_design_id_key" ON "public"."preferences"("design_id");

-- CreateIndex
CREATE INDEX "design_outputs_design_id_idx" ON "public"."design_outputs"("design_id");

-- CreateIndex
CREATE UNIQUE INDEX "roi_calculations_design_id_key" ON "public"."roi_calculations"("design_id");

-- CreateIndex
CREATE INDEX "feedback_design_id_idx" ON "public"."feedback"("design_id");

-- CreateIndex
CREATE INDEX "feedback_user_id_idx" ON "public"."feedback"("user_id");

-- CreateIndex
CREATE INDEX "feedback_rating_idx" ON "public"."feedback"("rating");

-- AddForeignKey
ALTER TABLE "public"."designs" ADD CONSTRAINT "designs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."preferences" ADD CONSTRAINT "preferences_design_id_fkey" FOREIGN KEY ("design_id") REFERENCES "public"."designs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."design_outputs" ADD CONSTRAINT "design_outputs_design_id_fkey" FOREIGN KEY ("design_id") REFERENCES "public"."designs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."roi_calculations" ADD CONSTRAINT "roi_calculations_design_id_fkey" FOREIGN KEY ("design_id") REFERENCES "public"."designs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feedback" ADD CONSTRAINT "feedback_design_id_fkey" FOREIGN KEY ("design_id") REFERENCES "public"."designs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."feedback" ADD CONSTRAINT "feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
