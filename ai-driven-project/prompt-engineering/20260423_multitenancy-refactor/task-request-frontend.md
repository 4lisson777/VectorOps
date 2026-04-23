# Frontend Task: Multitenancy UI Updates

## Description
Update all frontend pages and components to support multitenancy. This includes: updated registration flow (create org / join via invite), login disambiguation, org name in header, invite management UI for TECH_LEADs, org settings page, and super-admin panel.

## Prerequisites
- All backend phases (MT-1 through MT-5) must be complete
- Check `.claude/communication/20260423_multitenancy-refactor.md` for API endpoint details

## Acceptance Criteria
- [ ] Registration page has two modes: "Criar organizacao" and "Tenho um convite"
- [ ] "Create org" mode collects org name + user details, calls register API in create-org mode
- [ ] "Join via invite" mode accepts invite code, validates it (shows org name + role), then collects user details
- [ ] Login page handles multi-org disambiguation (if API returns 409, show org selector)
- [ ] Header displays current organization name next to the ShinobiOps logo
- [ ] Sidebar includes "Organizacao" link under admin section for TECH_LEAD role
- [ ] New page `/admin/organization` shows org settings and invite management
- [ ] Invite management: TECH_LEAD can create invites (select role, optional email, expiry), view active invites, revoke invites
- [ ] Invite creation shows a copyable invite link
- [ ] Super-admin pages exist at `/super-admin/*` with org list, org detail, user list
- [ ] Super-admin sees an impersonation banner when viewing another org's context
- [ ] All existing pages continue to work (they already fetch from tenant-scoped APIs)
- [ ] TV page (`/dev/tv`) accepts `?org=slug` query parameter and passes it to the API

## Pages / Components

### Modified Components

**`apps/web/components/auth/register-form.tsx`**
- Add a tab or toggle to switch between "Criar Organizacao" and "Tenho um Convite"
- Create Org tab: add "Nome da Organizacao" field, remove role selector (role is auto TECH_LEAD)
- Join via Invite tab: add "Codigo de Convite" field, on blur/enter validate the code via `GET /api/invites/[code]`, show the org name and role that will be assigned, remove role selector (role comes from invite)
- Keep existing fields: name, email, password, ninja alias
- Update form submission to call the appropriate register mode

**`apps/web/components/auth/login-form.tsx`**
- Handle 409 response from login API: show a dropdown/select with the list of organizations
- When org is selected, re-submit login with `organizationSlug` parameter
- Show org name in success state if available

**`apps/web/components/layout/header.tsx`**
- Fetch org name from session or `/api/auth/me` response
- Display org name in the header, left side, after the ShinobiOps logo
- Style: smaller text, muted color, separated by a `/` or `|` from the logo
- For super-admin impersonating: show an amber banner below the header saying "Voce esta visualizando como: [Org Name]" with a "Voltar" button

**`apps/web/components/layout/sidebar.tsx`**
- Add "Organizacao" navigation item under the admin section
- Only visible to TECH_LEAD role
- Icon: use an appropriate HugeIcon (e.g., Building or Organization icon)
- Links to `/admin/organization`

**`apps/web/components/admin/team-management.tsx`**
- No functional changes needed (API is now org-scoped, component fetches from same endpoint)
- Optionally: add a note/badge showing the organization name at the top

### New Components

**`apps/web/components/admin/organization-settings.tsx`**
- Displays current org name with an edit form
- Shows org slug (read-only for TECH_LEAD, informational)
- Shows org creation date
- Shows user count
- Save button calls `PATCH /api/organizations/current`

**`apps/web/components/admin/invite-management.tsx`**
- Section title: "Convites Ativos"
- List of active invites showing: role, email restriction (if any), expiry date, invite code
- Each invite has a "Copiar Link" button and a "Revogar" button
- "Novo Convite" button opens a dialog/form:
  - Role selector (dropdown with all roles)
  - Email field (optional, placeholder: "Deixe vazio para permitir qualquer email")
  - Expiry selector (24h, 48h, 72h, 7 days)
  - Submit creates invite and shows the generated link in a copyable field

**`apps/web/app/(protected)/admin/organization/page.tsx`**
- Server component that renders OrganizationSettings and InviteManagement
- Auth guard: TECH_LEAD only

**`apps/web/app/(protected)/super-admin/layout.tsx`**
- Layout for super-admin pages
- Simple layout with back-to-app navigation

**`apps/web/app/(protected)/super-admin/page.tsx`**
- Dashboard showing: total orgs, total users, total active tickets across all orgs
- Quick links to org management and user management

**`apps/web/components/super-admin/org-list.tsx`**
- Table of organizations: name, slug, user count, ticket count, active/inactive status, created date
- Search input for filtering
- "Criar Organizacao" button
- Click row to view org detail
- Toggle active/inactive per org

**`apps/web/components/super-admin/org-detail.tsx`**
- Shows full org details: name, slug, status, users (list), ticket count
- Edit org name/slug form
- "Visualizar como esta organizacao" button (impersonation)
- User list with roles, active status

**`apps/web/app/(protected)/super-admin/organizations/page.tsx`**
- Renders OrgList component

**`apps/web/app/(protected)/super-admin/organizations/[id]/page.tsx`**
- Renders OrgDetail component

### Modified Pages

**`apps/web/app/(public)/dev/tv/page.tsx`**
- Accept `org` query parameter from URL
- Pass it to the TV data fetch: `/api/tv/data?org=slug`
- Show org name in the TV display header

**`apps/web/app/(auth)/register/page.tsx`**
- Check for `?invite=CODE` query parameter
- If present, pre-fill the invite code and auto-switch to "join" mode
- Pass the invite code to the RegisterForm component

## Mock Data
During initial development (before backend is ready), use these mock values:
- Organization: `{ id: "org_1", name: "Inovar Sistemas", slug: "inovar-sistemas" }`
- Invites: `[{ id: "inv_1", code: "ABC12345", role: "DEVELOPER", email: null, expiresAt: "2026-04-30T00:00:00Z" }]`
- For multi-org login: `{ organizations: [{ name: "Inovar Sistemas", slug: "inovar-sistemas" }, { name: "Outra Empresa", slug: "outra-empresa" }] }`

## Design Reference
- Follow existing design tokens from `ai-driven-project/utilities/ui-system.md`
- Use shadcn/ui components: Card, Dialog, Input, Select, Button, Badge, Table
- Use the ninja theme: navy primary, crimson accent
- Invite codes displayed in monospace font, large size, for easy reading
- Organization name in header: use `text-muted-foreground text-sm`
- Impersonation banner: amber/warning color scheme, sticky, full-width
- Super-admin pages: clean, data-focused, less thematic (more utilitarian)

## Rules to Follow
- All UI text in PT-BR (matching existing convention)
- Use `"use client"` only when needed (state, events, hooks)
- Import UI components from `@workspace/ui/components/*`
- Use `cn()` from `@workspace/ui/lib/utils` for class merging
- Follow existing component patterns (see similar components for structure)
- Use HugeIcons for all icons
- Validate invite codes on blur/change, not just on submit
- Show loading states during async operations
- Handle error states with toast notifications (existing pattern)

## Communication File
`.claude/communication/20260423_multitenancy-refactor.md`
