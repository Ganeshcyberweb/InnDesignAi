-- AlterTable: stamp guest -> user conversion time for funnel analytics
ALTER TABLE "guest_sessions" ADD COLUMN "converted_at" TIMESTAMP(3);

-- CreateTable: per-request AI generation log
CREATE TABLE "ai_generations" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "guest_session_id" UUID,
    "prompt_preview" TEXT,
    "status" TEXT NOT NULL,
    "theme_count" INTEGER NOT NULL DEFAULT 0,
    "image_count" INTEGER NOT NULL DEFAULT 0,
    "tokens_input" INTEGER,
    "tokens_output" INTEGER,
    "duration_ms" INTEGER,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_generations_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ai_generations_user_id_idx" ON "ai_generations"("user_id");
CREATE INDEX "ai_generations_guest_session_id_idx" ON "ai_generations"("guest_session_id");
CREATE INDEX "ai_generations_status_idx" ON "ai_generations"("status");
CREATE INDEX "ai_generations_created_at_idx" ON "ai_generations"("created_at");

-- CreateTable: auth event log (signin / signin_failed / signup / signout / password_reset_requested)
CREATE TABLE "auth_events" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "email" TEXT,
    "event_type" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "auth_events_user_id_idx" ON "auth_events"("user_id");
CREATE INDEX "auth_events_event_type_idx" ON "auth_events"("event_type");
CREATE INDEX "auth_events_created_at_idx" ON "auth_events"("created_at");

-- CreateTable: admin audit log (writers come in Phase 5)
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actor_id" UUID,
    "actor_role" TEXT,
    "action" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" TEXT,
    "before" JSONB,
    "after" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs"("actor_id");
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");
