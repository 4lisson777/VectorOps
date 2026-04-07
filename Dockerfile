# syntax=docker/dockerfile:1

# Stage 1: Install all dependencies
FROM node:20-slim AS deps
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY packages/ui/package.json ./packages/ui/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY apps/web/package.json ./apps/web/

RUN npm ci

# Stage 2: Build the application
FROM node:20-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client before building
RUN cd apps/web && npx prisma generate

ENV SKIP_ENV_VALIDATION=true
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Prune dev-only dependencies so the runner gets a clean production node_modules
RUN npm prune --omit=dev

# Stage 3: Production runner
FROM node:20-slim AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV DATABASE_URL="file:/app/apps/web/prisma/data/shinobiops.db"

# Copy standalone output
COPY --from=builder --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=builder --chown=node:node /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=node:node /app/apps/web/public ./apps/web/public

# Copy Prisma schema, config, migrations, and generated client for runtime migration
COPY --from=builder --chown=node:node /app/apps/web/prisma ./apps/web/prisma
COPY --from=builder --chown=node:node /app/apps/web/prisma.config.ts ./apps/web/prisma.config.ts
COPY --from=builder --chown=node:node /app/apps/web/generated ./apps/web/generated

# Copy the full pruned node_modules — npm manages all transitive dependencies correctly
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

# Copy entrypoint
COPY --chown=node:node entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

USER node

EXPOSE 3000

ENTRYPOINT ["/app/entrypoint.sh"]
