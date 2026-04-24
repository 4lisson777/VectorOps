# 🥷 ShinobiOps — Technical Stack Specification

**Version:** 1.0  
**Last Updated:** 2025  
**Status:** Implementation Guide

---

## Table of Contents

1. [Overview](#overview)
2. [Frontend Stack](#frontend-stack)
3. [Backend Stack](#backend-stack)
4. [Database & ORM](#database--orm)
5. [Real-Time Communication](#real-time-communication)
6. [Authentication & Sessions](#authentication--sessions)
7. [UI & Styling](#ui--styling)
8. [Audio & Media](#audio--media)
9. [Deployment & Infrastructure](#deployment--infrastructure)
10. [Development Tooling](#development-tooling)
11. [Package Manager & Dependencies](#package-manager--dependencies)
12. [Code Quality & Linting](#code-quality--linting)

---

## Overview

ShinobiOps is a **full-stack TypeScript application** built with modern, proven technologies designed for internal deployment on a private network. The architecture prioritizes real-time collaboration, developer experience, and maintainability.

- **Type Safety:** 100% TypeScript
- **Monorepo:** Turbo-managed workspaces for scalable organization
- **Framework:** Next.js 14+ (App Router)
- **Deployment Model:** Docker + Docker Compose with persistent SQLite volume

---

## Frontend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.1.6 | React meta-framework with App Router, SSR, API routes, and automatic code splitting |
| **React** | 19.2.4 | UI library and component model |
| **React DOM** | 19.2.4 | DOM rendering for React |
| **TypeScript** | 5.9.3 | Static type checking and developer tooling |
| **Next Themes** | 0.4.6 | Theme switching (dark/light mode support) |

### Key Frontend Capabilities

- **App Router**: File-based routing with `app/` directory
- **Server Components**: Reduce client-side JavaScript where possible
- **API Routes**: Backend handlers at `/api/*` routes
- **SSR & ISR**: Server-side and incremental static rendering for performance
- **Image Optimization**: Built-in image handling via `next/image`
- **Automatic Code Splitting**: Optimized bundle sizes

---

## Backend Stack

### Runtimes & Language

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | ≥20 | JavaScript/TypeScript runtime |
| **TypeScript** | 5.9.3 | Typed backend code |

### API Framework

- **Next.js API Routes**: RESTful endpoints using `/api/*` structure
- **Server Actions**: Direct async functions for form submissions and data mutations (when using React 19+)
- **Middleware**: Authentication and request validation middleware via Next.js middleware

### Backend Features

- Custom session management via JWT (`jose`) or `iron-session`
- Role-based access control (RBAC) on every API endpoint
- Graceful error handling with user-friendly messages
- Health check endpoint at `/api/health`

---

## Database & ORM

| Technology | Version | Purpose |
|-----------|---------|---------|
| **SQLite** | 3 | Lightweight, file-based SQL database |
| **Prisma** | Latest | Type-safe ORM and database toolkit |

### SQLite Configuration

**Recommended Pragmas:**

```sql
PRAGMA journal_mode = WAL;       -- Concurrent reads with writes (Write-Ahead Logging)
PRAGMA foreign_keys = ON;        -- Enforce relational integrity
PRAGMA synchronous = NORMAL;     -- Safe performance balance
PRAGMA busy_timeout = 5000;      -- Prevent SQLITE_BUSY under concurrency
```

### Data Persistence

- SQLite database file stored on **Docker named volume** at `/app/prisma/data`
- Survives container restarts and upgrades
- No external database dependency — fully self-contained

### Prisma Features

- **Schema-driven ORM**: Declarative `schema.prisma` for all models
- **Type Safety**: Auto-generated types for all queries
- **Migrations**: `prisma migrate` for schema version control
- **Prisma Studio**: Visual database explorer (dev mode)
- **Raw SQL Fallback**: `$queryRaw()` when needed

---

## Real-Time Communication

| Technology | Purpose |
|-----------|---------|
| **Server-Sent Events (SSE)** | Push notifications and live updates to connected clients |
| **Web API EventSource** | Client-side listener for SSE streams |

### Real-Time Features

- **Sound Alerts**: Web Audio API (bundled sound files)
- **Live Notifications**: In-app notification center with real-time delivery
- **Ninja Board Updates**: Developer status and task updates streamed to connected clients
- **Checkpoint Reminders**: Time-based prompts and responses

**Transport Details:**

- SSE over HTTP/HTTPS — simple, bidirectional push without WebSocket overhead
- Automatic reconnection handled by browser
- Graceful degradation if SSE unavailable (fallback to polling)

---

## Authentication & Sessions

| Technology | Purpose |
|-----------|---------|
| **jose** (or `iron-session`) | JWT/session encoding, verification, and signing |
| **bcrypt** | Password hashing (cost factor ≥ 12) |

### Session Management

- **HTTP-Only Secure Cookie**: Session token stored in secure, HTTP-only cookie (prevents XSS access)
- **Server-Side Validation**: Every protected route checks session validity
- **Role-Based Access Control**: Enforced on all API routes, not just the UI
- **Graceful Logout**: Session cleared on both client and server

### Password Security

- Bcrypt with cost factor ≥ 12 (approximately 100ms per hash)
- Passwords never stored in plaintext
- Secure comparison to prevent timing attacks

---

## UI & Styling

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Tailwind CSS** | 4.1.18 | Utility-first CSS framework |
| **PostCSS** | 4.1.18 | CSS processing and Tailwind integration |
| **shadcn/ui** | Latest | Pre-built, accessible React components |
| **Radix UI** | (via shadcn/ui) | Headless component primitives |
| **HugeIcons** | 1.1.6 | Icon library (React component set) |
| **HugeIcons Core** | 4.1.1 | Core icon assets |

### Design System

- **Color Palette**:
  - Primary: Deep Navy `#1A1A2E`
  - Accent: Crimson `#E94560`
  - Neutral: Off-white surfaces
  - **Severity Colors**:
    - White — Low
    - Green — Medium
    - Red — High
    - Black — Critical

- **Responsive Design**: Mobile-first approach, tested at 1280px desktop and tablet sizes
- **Theme Switching**: Dark/light mode support via `next-themes`
- **Ninja Theme**: Shuriken, katana, smoke bomb, and scroll icons (SVG)

### Component Architecture

- **shadcn/ui Components**: Buttons, modals, forms, tables, dropdowns, etc.
- **Custom Components**: Domain-specific components (Ninja Board, Mission Queue, etc.)
- **Accessible**: WCAG-compliant (via Radix UI primitives)
- **Server Components**: Static components rendered server-side for performance

---

## Audio & Media

| Technology | Purpose |
|-----------|---------|
| **Web Audio API** | Real-time sound playback |
| **Bundled Audio Files** | Pre-loaded sound effects for alerts |

### Sound Alerts

- **Tone A**: Subtle chime (new Ticket)
- **Tone B**: Urgent tone (new Bug)
- **Tone C**: Sharp alert (Help Request)
- **Tone D**: Soft pulse (Checkpoint reminder)
- **Tone E**: Resolution sound (Ticket Done/Cancelled)

### Muting

- Per-user setting in profile preferences
- Client-side toggle (does not require server roundtrip)

---

## Deployment & Infrastructure

| Technology | Purpose |
|-----------|---------|
| **Docker** | Containerization and isolated runtime |
| **Docker Compose** | Multi-container orchestration |
| **Named Volume** | Persistent SQLite data storage |

### Docker Configuration

- **Single `Dockerfile`**: Multi-stage build (`deps → builder → runner`)
- **Base Image**: Node.js slim or Alpine (optimized for size)
- **Stages**:
  1. `deps`: Install production dependencies
  2. `builder`: Build Next.js app and Prisma client
  3. `runner`: Lean runtime image with only necessary files

### Docker Compose

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

### Port & Network

- **Exposed**: Port `3000` (HTTP)
- **Network**: Internal network only (no external connectivity required)
- **Health Check**: `/api/health` endpoint for orchestration

---

## Development Tooling

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Turbo** | 2.8.17 | Monorepo task orchestration and caching |
| **TypeScript** | 5.9.3 | Type checking and compilation |
| **ESLint** | 9.39.2 | Code linting and quality |
| **Prettier** | 3.8.1 | Code formatting |
| **Tailwind CSS Plugin (Prettier)** | 0.7.2 | Automatic class sorting |

### Turbo Workspace Structure

```
.
├── apps/
│   └── web/                    # Next.js application
│       ├── app/                # App Router pages & layouts
│       ├── api/                # API routes
│       ├── components/         # React components
│       └── lib/                # Utilities and helpers
├── packages/
│   ├── ui/                     # Shared shadcn/ui components
│   ├── typescript-config/      # Shared tsconfig.json
│   └── eslint-config/          # Shared ESLint rules
└── turbo.json                  # Task configuration
```

### Build Pipeline

- **`turbo build`**: Build all workspaces; outputs to `.next/**`
- **`turbo dev`**: Start all dev servers with hot reload (Turbopack)
- **`turbo lint`**: Run ESLint across all packages
- **`turbo format`**: Format all code with Prettier
- **`turbo typecheck`**: Full TypeScript type checking

---

## Package Manager & Dependencies

| Tool | Version | Purpose |
|------|---------|---------|
| **npm** | 11.6.2 | Package manager |
| **Node.js** | ≥20 | Runtime requirement |

### Dependency Management

- **Lock File**: `package-lock.json` (committed to version control)
- **Workspaces**: npm workspaces via `package.json` `workspaces` field
- **Monorepo Scripts**: Root `package.json` defines shared commands

### Key Dependencies

**Production:**
- `next`, `react`, `react-dom` — Framework & UI runtime
- `@hugeicons/react` — Icon components
- `next-themes` — Theme switching

**Development:**
- `typescript` — Language & type checking
- `@tailwindcss/postcss` — Styling
- `eslint` — Code linting
- `prettier` — Code formatting
- Workspace configs — Shared ESLint and TypeScript rules

---

## Code Quality & Linting

### ESLint Configuration

- **Rules**: React, Next.js, and TypeScript best practices
- **Shared Config**: `@workspace/eslint-config` (reusable across all packages)
- **Execution**: `turbo lint` or `npm run lint`

### Prettier Configuration

- **Style**: Consistent formatting across TypeScript and JSX
- **Tailwind Plugin**: Automatic class sorting for consistent output
- **Execution**: `turbo format` or `npm run format`

### Type Checking

- **Full TypeScript Compilation**: `turbo typecheck` or `npm run typecheck`
- **Strict Mode**: Enabled for maximum safety
- **No Implicit Any**: Required explicit types

### Pre-Commit (Optional)

- Can configure Husky + lint-staged for automatic checks before commits
- Not mandatory in v1.0, but recommended for production

---

## Summary: Technology Choices

| Concern | Solution | Why |
|---------|----------|-----|
| **Type Safety** | TypeScript 100% | Catch errors at dev time; better IDE support |
| **Framework** | Next.js 14+ | SSR, API routes, built-in optimization, large ecosystem |
| **Database** | SQLite + Prisma | Self-contained, no external dependency, type-safe ORM |
| **Real-Time** | SSE | Simple, no extra infrastructure, works over standard HTTP |
| **UI Components** | shadcn/ui + Tailwind | Accessible, customizable, zero runtime overhead for base styles |
| **Icons** | HugeIcons | Free, modern, large library, React-native |
| **Audio** | Web Audio API | No external service, bundled assets, works offline |
| **Deployment** | Docker Compose | Single-file deployment, data persistence, easy to scale |
| **Dev Experience** | Turbo + Prettier + ESLint | Fast builds, consistent code, linting, modern tooling |

---

## Performance Targets

- **Page Load**: &lt;2 seconds on LAN connection
- **Real-Time Notifications**: &lt;1 second delivery after trigger
- **Database Reads**: Non-blocking during writes (WAL mode)
- **Bundle Size**: Optimized via Next.js code splitting and tree-shaking

---

## Security Considerations

- ✅ Passwords hashed with bcrypt (cost ≥ 12)
- ✅ Session cookies are HTTP-only and Secure
- ✅ Role-based access checks on every API route
- ✅ SQLite file not exposed outside Docker container
- ✅ No external API calls — fully internal network
- ✅ HTTPS recommended for production (behind reverse proxy)

---

*ShinobiOps — Inovar Sistemas Technical Stack — v1.0*
