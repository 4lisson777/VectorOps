# Tech Leader -- Short-Term Memory

## Current Task
- **Name:** Task 5.16 -- Translate ShinobiOps to Brazilian Portuguese
- **Plan folder:** `ai-driven-project/prompt-engineering/20260406_pt-br-translation/`
- **Scope:** Frontend-only
- **Status:** Plan created, ready for frontend-specialist execution

## Key Decisions
- Rejected React Context + hook approach from original plan -- does not work in Server Components
- Adopted simple `t()` utility function imported directly (works in both server and client components)
- Translation file is a typed TypeScript const object (not JSON) for type safety
- No locale switcher -- app is permanently Portuguese
- API responses stay in English
- 10 stub component files identified and excluded from translation scope
- Actual translation scope: ~27 real component files + ~19 pages with strings + infrastructure files
- Date formatting to use pt-BR locale throughout

## Architecture Notes
- 11 components are Server Components (no "use client"): most are stubs, but ticket-timeline.tsx (225 lines) has real English strings
- Most pages are Server Components with hardcoded English in headings, descriptions, metadata
- my-items/page.tsx is a large Server Component page with extensive English strings and en-US date formatting
- ticket/[publicId]/page.tsx is the most string-heavy page (~50+ translatable strings)

## Plan Files
- Frontend: `ai-driven-project/prompt-engineering/20260406_pt-br-translation/task-request-frontend.md`
