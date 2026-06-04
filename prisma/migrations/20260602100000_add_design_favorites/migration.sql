-- CreateTable: theme-level favourites, one row per (user, design, theme).
CREATE TABLE "design_favorites" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "design_id" UUID NOT NULL,
    "theme_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "design_favorites_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "design_favorites_user_id_design_id_theme_key_key"
  ON "design_favorites"("user_id", "design_id", "theme_key");

CREATE INDEX "design_favorites_user_id_idx" ON "design_favorites"("user_id");
CREATE INDEX "design_favorites_design_id_idx" ON "design_favorites"("design_id");

-- ForeignKey: cascade so deleting a design cleans up its favourite rows.
ALTER TABLE "design_favorites" ADD CONSTRAINT "design_favorites_design_id_fkey"
  FOREIGN KEY ("design_id") REFERENCES "designs"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
