-- Performance indexes for multi-tenant queries
-- Compound indexes on organizationId + frequently filtered/sorted columns
-- prevent full table scans as data grows.

-- User lookups by active status and role (team management, checkpoint targets)
CREATE INDEX "users_organizationId_isActive_idx" ON "users"("organizationId", "isActive");
CREATE INDEX "users_organizationId_role_idx" ON "users"("organizationId", "role");

-- Ticket queue: the three most common filter axes
CREATE INDEX "tickets_organizationId_status_idx" ON "tickets"("organizationId", "status");
CREATE INDEX "tickets_organizationId_priorityOrder_idx" ON "tickets"("organizationId", "priorityOrder");
CREATE INDEX "tickets_organizationId_severity_idx" ON "tickets"("organizationId", "severity");
CREATE INDEX "tickets_organizationId_createdAt_idx" ON "tickets"("organizationId", "createdAt");

-- Ticket timeline (events ordered by time per ticket)
CREATE INDEX "ticket_events_ticketId_createdAt_idx" ON "ticket_events"("ticketId", "createdAt");

-- Reorder requests: pending lookup per ticket
CREATE INDEX "reorder_requests_ticketId_status_idx" ON "reorder_requests"("ticketId", "status");
