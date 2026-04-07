-- AlterTable: add requiresAck and acknowledgedAt to notifications
ALTER TABLE "notifications" ADD COLUMN "requiresAck" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "notifications" ADD COLUMN "acknowledgedAt" DATETIME;

-- CreateIndex
CREATE INDEX "notifications_userId_requiresAck_acknowledgedAt_idx" ON "notifications"("userId", "requiresAck", "acknowledgedAt");
