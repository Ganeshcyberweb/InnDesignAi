-- CreateTable
CREATE TABLE "guest_sessions" (
    "id" UUID NOT NULL,
    "prompt_count" INTEGER NOT NULL DEFAULT 0,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "converted_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guest_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "guest_sessions_created_at_idx" ON "guest_sessions"("created_at");

-- CreateIndex
CREATE INDEX "guest_sessions_converted_user_id_idx" ON "guest_sessions"("converted_user_id");
