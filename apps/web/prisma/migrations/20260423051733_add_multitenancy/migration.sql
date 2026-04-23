-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "invites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT,
    "expiresAt" DATETIME NOT NULL,
    "usedById" TEXT,
    "usedAt" DATETIME,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "invites_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "invites_usedById_fkey" FOREIGN KEY ("usedById") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "invites_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_checkpoint_config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT,
    "intervalMinutes" INTEGER NOT NULL DEFAULT 60,
    "activeHoursStart" TEXT NOT NULL DEFAULT '09:00',
    "activeHoursEnd" TEXT NOT NULL DEFAULT '18:00',
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "checkpoint_config_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_checkpoint_config" ("activeHoursEnd", "activeHoursStart", "id", "intervalMinutes", "isEnabled") SELECT "activeHoursEnd", "activeHoursStart", "id", "intervalMinutes", "isEnabled" FROM "checkpoint_config";
DROP TABLE "checkpoint_config";
ALTER TABLE "new_checkpoint_config" RENAME TO "checkpoint_config";
CREATE TABLE "new_checkpoints" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT,
    "userId" TEXT NOT NULL,
    "currentTask" TEXT NOT NULL,
    "isBlocked" BOOLEAN NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "checkpoints_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "checkpoints_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_checkpoints" ("createdAt", "currentTask", "id", "isBlocked", "notes", "userId") SELECT "createdAt", "currentTask", "id", "isBlocked", "notes", "userId" FROM "checkpoints";
DROP TABLE "checkpoints";
ALTER TABLE "new_checkpoints" RENAME TO "checkpoints";
CREATE INDEX "checkpoints_userId_createdAt_idx" ON "checkpoints"("userId", "createdAt");
CREATE TABLE "new_help_request_responses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT,
    "helpRequestId" TEXT NOT NULL,
    "responderId" TEXT NOT NULL,
    "respondedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "help_request_responses_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "help_request_responses_helpRequestId_fkey" FOREIGN KEY ("helpRequestId") REFERENCES "help_requests" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "help_request_responses_responderId_fkey" FOREIGN KEY ("responderId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_help_request_responses" ("helpRequestId", "id", "respondedAt", "responderId") SELECT "helpRequestId", "id", "respondedAt", "responderId" FROM "help_request_responses";
DROP TABLE "help_request_responses";
ALTER TABLE "new_help_request_responses" RENAME TO "help_request_responses";
CREATE TABLE "new_help_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT,
    "requestedById" TEXT NOT NULL,
    "contextMessage" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "help_requests_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "help_requests_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_help_requests" ("contextMessage", "createdAt", "id", "requestedById") SELECT "contextMessage", "createdAt", "id", "requestedById" FROM "help_requests";
DROP TABLE "help_requests";
ALTER TABLE "new_help_requests" RENAME TO "help_requests";
CREATE TABLE "new_notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "ticketId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "requiresAck" BOOLEAN NOT NULL DEFAULT false,
    "acknowledgedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "notifications_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "tickets" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_notifications" ("acknowledgedAt", "body", "createdAt", "id", "isRead", "requiresAck", "ticketId", "title", "type", "userId") SELECT "acknowledgedAt", "body", "createdAt", "id", "isRead", "requiresAck", "ticketId", "title", "type", "userId" FROM "notifications";
DROP TABLE "notifications";
ALTER TABLE "new_notifications" RENAME TO "notifications";
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");
CREATE INDEX "notifications_userId_requiresAck_acknowledgedAt_idx" ON "notifications"("userId", "requiresAck", "acknowledgedAt");
CREATE TABLE "new_role_notification_configs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT,
    "role" TEXT NOT NULL,
    "notifyOnCreation" BOOLEAN NOT NULL DEFAULT false,
    "notifyOnAssignment" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "role_notification_configs_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_role_notification_configs" ("id", "notifyOnAssignment", "notifyOnCreation", "role", "updatedAt") SELECT "id", "notifyOnAssignment", "notifyOnCreation", "role", "updatedAt" FROM "role_notification_configs";
DROP TABLE "role_notification_configs";
ALTER TABLE "new_role_notification_configs" RENAME TO "role_notification_configs";
CREATE UNIQUE INDEX "role_notification_configs_organizationId_role_key" ON "role_notification_configs"("organizationId", "role");
CREATE TABLE "new_tickets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT,
    "publicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "deadline" DATETIME NOT NULL,
    "priorityOrder" INTEGER NOT NULL,
    "openedById" TEXT NOT NULL,
    "assignedToId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "resolvedAt" DATETIME,
    CONSTRAINT "tickets_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tickets_openedById_fkey" FOREIGN KEY ("openedById") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tickets_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tickets" ("assignedToId", "createdAt", "deadline", "description", "id", "openedById", "priorityOrder", "publicId", "resolvedAt", "severity", "status", "title", "type", "updatedAt") SELECT "assignedToId", "createdAt", "deadline", "description", "id", "openedById", "priorityOrder", "publicId", "resolvedAt", "severity", "status", "title", "type", "updatedAt" FROM "tickets";
DROP TABLE "tickets";
ALTER TABLE "new_tickets" RENAME TO "tickets";
CREATE UNIQUE INDEX "tickets_publicId_key" ON "tickets"("publicId");
CREATE TABLE "new_tv_config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "refreshInterval" INTEGER NOT NULL DEFAULT 30,
    CONSTRAINT "tv_config_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tv_config" ("id", "isEnabled", "refreshInterval") SELECT "id", "isEnabled", "refreshInterval" FROM "tv_config";
DROP TABLE "tv_config";
ALTER TABLE "new_tv_config" RENAME TO "tv_config";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "ninjaAlias" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "notifyTickets" BOOLEAN NOT NULL DEFAULT true,
    "notifyBugs" BOOLEAN NOT NULL DEFAULT true,
    "soundEnabled" BOOLEAN NOT NULL DEFAULT true,
    "devStatus" TEXT DEFAULT 'ACTIVE',
    "currentTask" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_users" ("avatarUrl", "createdAt", "currentTask", "devStatus", "email", "id", "isActive", "name", "ninjaAlias", "notifyBugs", "notifyTickets", "passwordHash", "role", "soundEnabled", "updatedAt") SELECT "avatarUrl", "createdAt", "currentTask", "devStatus", "email", "id", "isActive", "name", "ninjaAlias", "notifyBugs", "notifyTickets", "passwordHash", "role", "soundEnabled", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_organizationId_email_key" ON "users"("organizationId", "email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "invites_code_key" ON "invites"("code");
