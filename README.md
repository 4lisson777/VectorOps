# VectorOps

Internal fullstack application for production issue escalation and real-time team coordination. Built with Next.js, Prisma, and SQLite.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- npm >= 11
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) (for containerized setup)

## Getting Started

### Option A: Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp apps/web/.env.example apps/web/.env
# Edit apps/web/.env and set a real SESSION_SECRET:
#   openssl rand -base64 32

# 3. Generate Prisma client
npm run db:generate -w web

# 4. Run database migrations
npm run db:migrate -w web

# 5. Seed the database with sample users
npm run db:seed -w web

# 6. Start the dev server
npm run dev
```

The app will be available at **http://localhost:3000**.

### Option B: Docker

```bash
# 1. Set up environment variables
cp apps/web/.env.example apps/web/.env
# Edit apps/web/.env and set a real SESSION_SECRET

# 2. Build and start
docker compose up --build
```

The app will be available at **http://localhost:3005**.

To seed an admin account in Docker, uncomment and set the `SEED_ADMIN_*` variables in `docker-compose.yml`:

```yaml
environment:
  SEED_ADMIN_NAME: "Your Name"
  SEED_ADMIN_EMAIL: "admin@yourcompany.com"
  SEED_ADMIN_PASSWORD: "ChangeMe123!"
```

## Default Credentials (Local Seed)

All users share the password: **`Password123!`**

| Email | Role |
|---|---|
| `alisson@vector.ops` | Tech Lead (Super Admin) |
| `matheus@vectorops.dev` | Developer |
| `marcos@vectorops.dev` | Developer |
| `ivson@vectorops.dev` | Support Lead |
| `guilherme@vectorops.dev` | Support Member |
| `alisson.rosa@vectorops.dev` | QA |

## Common Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Build all packages
npm run lint         # Lint all code
npm run format       # Format code + sort Tailwind classes
npm run typecheck    # Type-check entire codebase
```

### Database

```bash
npm run db:generate -w web   # Regenerate Prisma client
npm run db:migrate -w web    # Apply migrations
npm run db:seed -w web       # Seed sample data
npm run db:studio -w web     # Open Prisma Studio (visual DB browser)
```

### Docker

```bash
docker compose up --build    # Build and start
docker compose down -v       # Stop and remove all data
docker compose logs -f       # Follow logs
```

## Project Structure

```
apps/web/          Next.js application (App Router)
packages/ui/       Shared UI component library (shadcn/ui)
packages/eslint-config/      Shared ESLint configs
packages/typescript-config/  Shared TypeScript configs
docs/              Product requirements and tech stack docs
```

## Adding UI Components

```bash
npx shadcn@latest add button -c apps/web
```

Components are installed to `packages/ui/src/components/` and imported as:

```tsx
import { Button } from "@workspace/ui/components/button"
```
