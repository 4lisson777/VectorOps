# ShinobiOps Deployment Guide

**Audience:** DevOps Engineers  
**Last Updated:** 2026-05-06  
**Application:** ShinobiOps (internal Turbo monorepo, Next.js + MySQL)

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Architecture Overview](#2-architecture-overview)
3. [Environment Variables](#3-environment-variables)
4. [First-Time Setup](#4-first-time-setup)
5. [Building and Running with Docker Compose](#5-building-and-running-with-docker-compose)
6. [Database Setup and Migrations](#6-database-setup-and-migrations)
7. [Production Seed](#7-production-seed)
8. [Health Checks](#8-health-checks)
9. [Logging](#9-logging)
10. [Backup and Restore](#10-backup-and-restore)
11. [Updating / Redeploying](#11-updating--redeploying)
12. [Reverse Proxy (HTTPS)](#12-reverse-proxy-https)
13. [Resource Limits and Tuning](#13-resource-limits-and-tuning)
14. [Security Considerations](#14-security-considerations)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Prerequisites

| Requirement | Minimum Version | Notes |
|-------------|-----------------|-------|
| Docker | 20.10+ | BuildKit enabled (default in modern Docker) |
| Docker Compose | v2.0+ | The `docker compose` plugin (not legacy `docker-compose`) |
| Disk Space | 2 GB free | For images, volumes, and build cache |
| RAM | 1 GB | 512 MB for app + 512 MB for MySQL |
| Network | Internal LAN | No outbound internet required at runtime |

For **local development** without Docker:

| Requirement | Version |
|-------------|---------|
| Node.js | >= 20 |
| npm | 11.6.2 |
| MySQL | 8.4 |

---

## 2. Architecture Overview

```
                        +-------------------+
                        |  Reverse Proxy    |
                        |  (nginx / Caddy)  |
                        |  :443 -> :3000    |
                        +---------+---------+
                                  |
            +---------------------+---------------------+
            |                                           |
   +--------v--------+                        +---------v-------+
   |   web service   |                        |  docs service   |
   |  (Next.js app)  |                        | (Fumadocs app)  |
   |  Port 3000      |                        |  Port 3006      |
   +--------+--------+                        +-----------------+
            |
   +--------v--------+
   |  mysql service   |
   |  MySQL 8.4       |
   |  Port 3306       |
   |  (internal only) |
   +------------------+
   |  mysql-data vol  |
   +------------------+
```

### Docker Image Build Stages (web)

The Dockerfile uses a multi-stage build to minimize final image size (~287 MB):

| Stage | Name | Purpose |
|-------|------|---------|
| 0 | `pruner` | Runs `turbo prune web --docker` to isolate the web workspace |
| 1 | `deps` | Installs only the pruned workspace dependencies via `npm ci` |
| 2 | `builder` | Builds the Next.js app, compiles the production seed, installs Prisma CLI |
| 3 | `web-runner` | Minimal runtime: Next.js standalone output + Prisma CLI for migrations |

The docs app has its own stages (4-6) with a similar pattern but no database dependencies.

### Container Startup Flow (web)

The `entrypoint.sh` script runs on every container start:

1. Waits for MySQL to be available (handled by `depends_on: condition: service_healthy`)
2. Runs `prisma migrate deploy` to apply any pending migrations
3. If `SEED_ADMIN_EMAIL` is set, runs the production seed (idempotent via upserts)
4. Starts the Next.js server (`node server.js`)

---

## 3. Environment Variables

There are two `.env` files in play:

- **Root `.env`** -- Used by Docker Compose for build-time interpolation (MySQL service config)
- **`apps/web/.env`** -- Injected into the web container at runtime via `env_file:`

Both files must have consistent database credentials. Use the `.env.example` files as templates.

### Root `.env`

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_URL` | Full MySQL connection URL (for Prisma CLI on host) | `mysql://vectorops:STRONG_PASSWORD@127.0.0.1:3308/vectorops` |
| `DB_NAME` | Database name | `vectorops` |
| `DB_USER` | MySQL username | `vectorops` |
| `DB_PASSWORD` | MySQL password | (generate a strong password) |
| `DB_HOST` | MySQL host (for local dev CLI) | `127.0.0.1` |
| `DB_PORT` | MySQL port mapped to host | `3308` |

### `apps/web/.env`

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SESSION_SECRET` | Yes | Encryption key for iron-session cookies. Must be at least 32 characters. | `openssl rand -base64 32` |
| `DB_URL` | Yes | MySQL connection URL. **Inside Docker, host must be `mysql` (service name), port `3306`.** | `mysql://vectorops:STRONG_PASSWORD@mysql:3306/vectorops` |
| `DB_HOST` | Yes | MySQL hostname. `mysql` in Docker, `127.0.0.1` for local dev. | `mysql` |
| `DB_PORT` | Yes | MySQL port. `3306` in Docker, `3308` for local dev (mapped port). | `3306` |
| `DB_NAME` | Yes | Database name. | `vectorops` |
| `DB_USER` | Yes | MySQL username. | `vectorops` |
| `DB_PASSWORD` | Yes | MySQL password. Must match root `.env`. | (same as root) |
| `NODE_ENV` | Yes | Runtime environment. | `production` |
| `SEED_ADMIN_NAME` | First deploy | Name of the initial super-admin user. | `Admin Name` |
| `SEED_ADMIN_EMAIL` | First deploy | Email for the initial super-admin login. | `admin@yourcompany.com` |
| `SEED_ADMIN_PASSWORD` | First deploy | Password for the initial super-admin. Use a strong password. | `ChangeMe123!` |

**Important:** The `SEED_*` variables trigger the production seed on every container start. After the initial deployment, you can remove them from the `.env` file to skip the seed step (it is idempotent, so leaving them is safe but adds a few seconds to startup).

### Generating Secrets

```bash
# Generate SESSION_SECRET
openssl rand -base64 32

# Generate a strong DB_PASSWORD
openssl rand -base64 24
```

---

## 4. First-Time Setup

```bash
# 1. Clone the repository
git clone <repo-url> vectorops
cd vectorops

# 2. Create root .env from template
cp .env.example .env

# 3. Create app .env from template
cp apps/web/.env.example apps/web/.env

# 4. Edit both files with production values
#    - Set strong passwords (DB_PASSWORD must match in both files)
#    - Generate and set SESSION_SECRET
#    - In apps/web/.env, set DB_HOST=mysql and DB_PORT=3306 for Docker
#    - Set NODE_ENV=production
#    - Set SEED_ADMIN_* variables for the initial super-admin account
```

Edit `apps/web/.env` -- the critical changes from the example for Docker deployment:

```
DB_URL=mysql://vectorops:YOUR_STRONG_PASSWORD@mysql:3306/vectorops
DB_HOST=mysql
DB_PORT=3306
DB_PASSWORD=YOUR_STRONG_PASSWORD
NODE_ENV=production
SESSION_SECRET=<output of openssl rand -base64 32>
SEED_ADMIN_NAME=Your Name
SEED_ADMIN_EMAIL=admin@yourcompany.com
SEED_ADMIN_PASSWORD=SomeStrongPassword!
```

Edit root `.env`:

```
DB_URL=mysql://vectorops:YOUR_STRONG_PASSWORD@127.0.0.1:3308/vectorops
DB_NAME=vectorops
DB_USER=vectorops
DB_PASSWORD=YOUR_STRONG_PASSWORD
DB_HOST=127.0.0.1
DB_PORT=3308
```

---

## 5. Building and Running with Docker Compose

### Build and Start

```bash
# Build images and start all services (detached)
docker compose up -d --build

# First run will:
#   1. Pull node:22-alpine and mysql:8.4 base images
#   2. Build the multi-stage Dockerfile (~5-10 min depending on hardware)
#   3. Start MySQL, wait for healthcheck, then start the web app
#   4. Run migrations automatically via entrypoint.sh
#   5. Run production seed if SEED_ADMIN_EMAIL is set
```

### Watch Logs During First Start

```bash
# All services
docker compose logs -f

# Web service only
docker compose logs -f web

# MySQL only
docker compose logs -f mysql
```

### Stop Services

```bash
# Stop without removing volumes (data persists)
docker compose down

# Stop AND remove volumes (destroys all data)
docker compose down -v
```

### Rebuild After Code Changes

```bash
# Rebuild only the web service image
docker compose up -d --build web

# Force full rebuild (no cache)
docker compose build --no-cache web
docker compose up -d
```

---

## 6. Database Setup and Migrations

### Automatic Migrations

Migrations run automatically on every container start via `entrypoint.sh`:

```
prisma migrate deploy
```

This applies all pending migrations from `apps/web/prisma/migrations/` in order. It is safe to run repeatedly -- already-applied migrations are skipped.

### Manual Migration (Outside Docker)

If you need to run migrations from the host machine (e.g., during development):

```bash
# Ensure MySQL is running
docker compose up -d mysql

# From the project root (uses DB_URL from root .env with host port 3308)
cd apps/web
npx prisma migrate deploy
```

### Checking Migration Status

```bash
# Inside the running container
docker compose exec web sh -c "cd /app/apps/web && NODE_PATH=/prisma-cli/node_modules node /prisma-cli/node_modules/prisma/build/index.js migrate status"
```

### Creating New Migrations (Development Only)

```bash
# From apps/web/ on the host
npx prisma migrate dev --name descriptive_migration_name
```

Never run `migrate dev` in production. It can reset data. Always use `migrate deploy`.

---

## 7. Production Seed

The production seed (`prisma/seed.prod.ts`, compiled to `seed.prod.mjs`) runs automatically when `SEED_ADMIN_EMAIL` is set. It creates:

- **VectorOps** organization (slug: `vectorops`)
- One **super-admin** user with TECH_LEAD role
- Default **CheckpointConfig** (60-minute intervals, 09:00-18:00)
- Default **TvConfig** (enabled, 30-second refresh)
- **RoleNotificationConfig** for all five roles

All operations use `upsert`, so the seed is idempotent and safe to re-run.

### Running the Seed Manually

```bash
# Inside the running container
docker compose exec web sh -c "cd /app/apps/web && node prisma/seed.prod.mjs"
```

---

## 8. Health Checks

### Application Health Endpoint

- **URL:** `GET /api/health`
- **Success (200):** `{"status": "ok", "timestamp": "2026-05-06T12:00:00.000Z"}`
- **Failure (503):** `{"status": "error", "timestamp": "..."}` (database unreachable)

The health check verifies database connectivity by running `SELECT 1`.

### Docker Health Checks

**MySQL service:**
```
mysqladmin ping -h localhost -u $DB_USER -p$DB_PASSWORD
Interval: 10s | Timeout: 5s | Retries: 5
```

**Web service (Dockerfile-level):**
```
node -e "fetch('http://localhost:3000/api/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
Interval: 30s | Timeout: 10s | Start Period: 30s | Retries: 3
```

### Monitoring Health

```bash
# Check all service health statuses
docker compose ps

# Check web health specifically
docker inspect --format='{{json .State.Health}}' vectorops-web-1 | python3 -m json.tool

# Curl from host
curl -s http://localhost:3000/api/health | python3 -m json.tool
```

---

## 9. Logging

### Log Configuration

Both `web` and `docs` services use the `json-file` logging driver:

- **Max file size:** 10 MB per log file
- **Max files:** 3 (rotated automatically)

This caps log storage at ~30 MB per service.

### Viewing Logs

```bash
# Live logs
docker compose logs -f web

# Last 100 lines
docker compose logs --tail=100 web

# Since a specific time
docker compose logs --since="2026-05-06T10:00:00" web
```

### Application Logging

- Prisma logs `error` level only in production (configurable in `lib/db.ts`)
- The app also integrates with **Sentry** for error tracking (configured in `sentry.server.config.ts`)

---

## 10. Backup and Restore

### Automated Backup Script

A backup script is provided at `scripts/backup-db.sh`:

```bash
# Usage: ./scripts/backup-db.sh [container-name] [backup-directory]
# Defaults: container = vectorops-mysql-1, directory = ./backups

# Create a backup
./scripts/backup-db.sh

# Backup to a specific directory
./scripts/backup-db.sh vectorops-mysql-1 /mnt/backup/shinobiops
```

This runs `mysqldump` inside the MySQL container and writes a timestamped `.sql` file to the host.

### Manual Backup

```bash
# Full database dump
docker compose exec mysql mysqldump -u vectorops -pvectorops vectorops > backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
docker compose exec mysql mysqldump -u vectorops -pvectorops vectorops | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Restore from Backup

```bash
# Restore from a SQL file
docker compose exec -T mysql mysql -u vectorops -pvectorops vectorops < backup_20260506_120000.sql

# Restore from a compressed backup
gunzip -c backup_20260506_120000.sql.gz | docker compose exec -T mysql mysql -u vectorops -pvectorops vectorops
```

### Scheduled Backups (cron)

Add to crontab on the host:

```bash
# Daily backup at 2:00 AM, retain 30 days
0 2 * * * /path/to/vectorops/scripts/backup-db.sh vectorops-mysql-1 /mnt/backup/shinobiops && find /mnt/backup/shinobiops -name "*.sql" -mtime +30 -delete
```

### Volume Backup (Alternative)

For a raw volume backup (useful before upgrades):

```bash
# Stop the database first
docker compose stop mysql

# Backup the volume
docker run --rm -v vectorops_mysql-data:/data -v $(pwd)/backups:/backup alpine \
  tar czf /backup/mysql-volume-$(date +%Y%m%d).tar.gz -C /data .

# Restart
docker compose start mysql
```

---

## 11. Updating / Redeploying

### Standard Update Procedure

```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild and restart (migrations run automatically)
docker compose up -d --build web

# 3. Verify health
curl -s http://localhost:3000/api/health

# 4. Check logs for migration output
docker compose logs --tail=50 web
```

### Zero-Downtime Considerations

This is an internal application, so brief downtime during updates is typically acceptable. For minimal disruption:

1. Build the new image first: `docker compose build web`
2. Stop and replace in one step: `docker compose up -d web`

The `restart: unless-stopped` policy ensures the container restarts automatically if it crashes.

### Rollback

```bash
# If the new version has issues, revert code and rebuild
git checkout <previous-commit>
docker compose up -d --build web
```

---

## 12. Reverse Proxy (HTTPS)

The web service exposes HTTP on port 3000. For production, place it behind a reverse proxy for HTTPS termination.

### Nginx Example

```nginx
server {
    listen 443 ssl http2;
    server_name shinobiops.yourcompany.internal;

    ssl_certificate     /etc/ssl/certs/shinobiops.crt;
    ssl_certificate_key /etc/ssl/private/shinobiops.key;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # SSE support (Server-Sent Events) -- disable buffering
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 86400s;
    }
}
```

**Critical:** The `proxy_buffering off` and `proxy_cache off` directives are required for the SSE (Server-Sent Events) real-time notification system to function correctly. Without these, notifications will be delayed or never reach the client.

### Caddy Example

```
shinobiops.yourcompany.internal {
    reverse_proxy localhost:3000
}
```

Caddy handles SSE correctly by default and auto-provisions TLS certificates.

---

## 13. Resource Limits and Tuning

### Docker Compose Defaults

| Service | Memory Limit | Notes |
|---------|-------------|-------|
| `web` | 512 MB | Sufficient for typical usage |
| `docs` | 256 MB | Static documentation site |
| `mysql` | Unlimited | Constrained by host; consider setting a limit |

### MySQL Tuning

The default MySQL 8.4 configuration is adequate for an internal tool with moderate usage. Key parameters to monitor:

```bash
# Check current connection count
docker compose exec mysql mysql -u vectorops -pvectorops -e "SHOW STATUS LIKE 'Threads_connected'"

# Check max connections setting (default: 151)
docker compose exec mysql mysql -u vectorops -pvectorops -e "SHOW VARIABLES LIKE 'max_connections'"
```

The app uses a connection pool with `connectionLimit: 8` (configured in `lib/db.ts`). A single app instance will never exceed 8 concurrent MySQL connections.

### MySQL Port Exposure

In `docker-compose.yml`, MySQL is exposed on `127.0.0.1:3308:3306`. This means:

- **Port 3308 on the host** is accessible only from localhost (for development/debugging)
- **Port 3306 inside Docker** is used by the web container (via service name `mysql`)

For production servers where no local database access is needed, you can remove the `ports:` block entirely from the `mysql` service to eliminate external exposure.

---

## 14. Security Considerations

### Secrets Management

- Never commit `.env` files to version control (they are in `.gitignore`)
- Use strong, unique values for `SESSION_SECRET` and `DB_PASSWORD`
- Rotate `SESSION_SECRET` periodically (this will invalidate all active sessions)
- Remove `SEED_ADMIN_PASSWORD` from the `.env` after the initial deployment

### Network Security

- The application is designed for internal network deployment only
- MySQL should not be accessible from outside the Docker network in production
- Consider removing the MySQL `ports:` mapping in production
- Place the app behind a reverse proxy with HTTPS (see section 12)

### Container Security

- The web container runs as the non-root `node` user
- The `init: true` flag ensures proper signal handling and zombie process reaping

### Session Cookies

- Sessions use `iron-session` with HTTP-only, secure cookies
- Cookie encryption uses `SESSION_SECRET` (minimum 32 characters)
- All API routes enforce role-based access control server-side

### Database

- MySQL credentials are injected via environment variables, not hardcoded
- The app connects via the `mariadb` driver (pure JavaScript, no native addons)
- Connection pooling limits concurrent connections to prevent exhaustion

---

## 15. Troubleshooting

### Web Container Fails to Start

**Symptom:** Container restarts repeatedly or stays in "starting" state.

```bash
# Check container logs
docker compose logs web

# Check if MySQL is healthy
docker compose ps mysql
```

**Common causes:**
- MySQL is not ready yet -- check the MySQL health status
- Invalid `DB_URL` or mismatched credentials between root `.env` and `apps/web/.env`
- `DB_HOST` in `apps/web/.env` is set to `127.0.0.1` instead of `mysql` (the Docker service name)

### "Too many connections" Error

**Symptom:** `(no: 1040, SQLState: 08004) Too many connections` or `pool timeout: ... active=0 idle=0`

```bash
# Check connection count
docker compose exec mysql mysql -u vectorops -pvectorops -e "SELECT user, count(*) FROM information_schema.PROCESSLIST GROUP BY user"
```

**Cause:** This was a historical bug caused by a missing singleton pattern in `lib/db.ts`. It has been fixed. If it recurs, verify that `lib/db.ts` uses a module-level singleton (`let prismaInstance`), not a fresh `createPrismaClient()` on every call.

### Migrations Fail

**Symptom:** `entrypoint.sh` logs show migration errors.

```bash
# Check migration status
docker compose exec web sh -c "cd /app/apps/web && NODE_PATH=/prisma-cli/node_modules node /prisma-cli/node_modules/prisma/build/index.js migrate status"
```

**Common causes:**
- Database schema was manually modified outside of Prisma migrations
- A migration file was edited after being applied (checksum mismatch)

**Resolution:** If the migration history is corrupted, you may need to mark migrations as applied:

```bash
docker compose exec web sh -c "cd /app/apps/web && NODE_PATH=/prisma-cli/node_modules node /prisma-cli/node_modules/prisma/build/index.js migrate resolve --applied <migration_name>"
```

### Build Fails: Out of Memory

**Symptom:** `docker compose build` crashes with JavaScript heap out of memory.

**Fix:** Increase Docker's memory allocation, or set Node.js heap size in the Dockerfile's builder stage:

```bash
# Build with increased memory
DOCKER_BUILDKIT=1 docker compose build --build-arg NODE_OPTIONS="--max-old-space-size=4096" web
```

### Application Returns 503

**Symptom:** `GET /api/health` returns `{"status": "error"}`.

**Cause:** The app cannot reach MySQL. Check:

```bash
# Is MySQL running?
docker compose ps mysql

# Can the web container reach MySQL?
docker compose exec web sh -c "node -e \"const net=require('net');const s=new net.Socket();s.connect(3306,'mysql',()=>{console.log('OK');s.destroy()});s.on('error',e=>console.log('FAIL:',e.message))\""
```

### Static Assets Not Loading

**Symptom:** Pages load but CSS/JS files return 404.

**Cause:** The `.next/static` directory was not copied correctly in the Docker build.

**Fix:** Rebuild the image:
```bash
docker compose build --no-cache web
docker compose up -d web
```

### Docker Build Cache Issues

```bash
# Clear all build cache
docker builder prune

# Full cleanup (removes unused images, containers, volumes)
docker system prune -a
```

---

## Quick Reference

```bash
# Start everything
docker compose up -d --build

# Stop everything (keep data)
docker compose down

# Stop everything (destroy data)
docker compose down -v

# View logs
docker compose logs -f web

# Check health
curl http://localhost:3000/api/health

# Backup database
./scripts/backup-db.sh

# Shell into web container
docker compose exec web sh

# Shell into MySQL
docker compose exec mysql mysql -u vectorops -pvectorops vectorops

# Rebuild after code changes
docker compose up -d --build web

# Check resource usage
docker stats
```
