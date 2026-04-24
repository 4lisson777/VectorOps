# Context: Deployment

**ID**: CTX-INFRA-001  
**Category**: Infrastructure  
**Last Updated**: 2026-04-05  
**Dependencies**: CTX-INFRA-002

<!-- @context-meta
{
  "id": "CTX-INFRA-001",
  "category": "infrastructure",
  "dependencies": ["CTX-INFRA-002"],
  "tags": ["docker", "docker-compose", "production", "deployment", "health-check"],
  "status": "current",
  "language": "en-us"
}
-->

## Summary

ShinobiOps deploys as a single Docker container via Docker Compose. Multi-stage Dockerfile (deps -> builder -> runner). SQLite data persists on a Docker named volume. Runs on internal network only — no external dependencies at runtime.

## Key Information

### Docker Multi-Stage Build

| Stage | Purpose |
|-------|---------|
| `deps` | Install production npm dependencies |
| `builder` | Build Next.js app + generate Prisma client |
| `runner` | Lean runtime with only necessary files |

Base image: Node.js slim or Alpine.

### Docker Compose Configuration

```yaml
services:
  vectorops:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - vectorops-data:/app/prisma/data
    environment:
      - DATABASE_URL=file:./data/prisma.db
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
volumes:
  vectorops-data:
```

### Key Details

- **Port**: 3000 (HTTP)
- **Network**: Internal only — no external internet access required
- **Data volume**: `vectorops-data` mounted at `/app/prisma/data` — survives container restarts
- **Health check**: `GET /api/health` endpoint
- **Environment variables**: Via `.env` file (not committed to source control)
- **HTTPS**: Recommended behind a reverse proxy (nginx, Caddy) for production

### Production Build Commands

```bash
npm run build         # Build all packages via Turbo
npm start -w web      # Start production Next.js server
```

### Environment Variables (Expected)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | SQLite file path for Prisma |
| `NODE_ENV` | `production` or `development` |
| `SESSION_SECRET` | Secret key for JWT/session signing |

## Code References

- `package.json` — Root scripts: build, dev, start
- `turbo.json` — Build task configuration
- `docs/TECH-STACK.md` (Section 9) — Full deployment specification

## Related Contexts

- [CTX-INFRA-002 Database](database.md) — SQLite persistence and Prisma setup
- [CTX-CORE-001 Architecture](../core/architecture.md) — Monorepo build structure

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-05 | Initial context creation | AI Agent |
