-- Migration: add_notification_ack
-- Adds requiresAck and acknowledgedAt fields to the notifications table.
--
-- NOTE: This migration is a no-op on databases created with schema version >= 20260427032807_init,
-- because those columns are already included in the initial schema.
--
-- Column definitions added in this migration:
--   "requiresAck" BOOLEAN NOT NULL DEFAULT false
--   "acknowledgedAt" DATETIME(3)
--
-- Index created in this migration:
--   notifications_userId_requiresAck_acknowledgedAt_idx ON notifications (userId, requiresAck, acknowledgedAt)
--
-- These fields support the persistent notification feature where certain notifications
-- require explicit user acknowledgement before being dismissed.

-- This statement is a no-op sentinel so Prisma records this migration as applied.
SELECT 1;
