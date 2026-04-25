# Short-Term Memory -- Senior Backend Engineer

## Current Task
Fix four runtime bugs (20260425_runtime-bugfixes) — Complete

## Files Created / Modified

| File | Action |
|------|--------|
| `apps/web/components/layout/app-shell.tsx` | Modified — guard `session.name` with `?? ""` before `.split()`; fallback initials to `"?"` |
| `apps/web/app/layout.tsx` | Modified — moved manifest from `icons.other` to top-level `manifest: "/site.webmanifest"` |
| `apps/web/components/tv/tv-board.tsx` | Modified — added early return with user-friendly PT-BR message when `orgSlug` is missing; captured narrowed slug in local `const slug` for closure type safety |
| `apps/web/app/api/tickets/route.ts` | Modified — replaced `as any` cast with explicit `organizationId: session.organizationId` in `tx.ticket.create()` data; updated comment to explain why |
