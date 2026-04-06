# Frontend Task: Translate ShinobiOps to Brazilian Portuguese (pt-BR)

## Description

Translate all user-visible English strings in the ShinobiOps web application to Brazilian Portuguese. The app is internal to Inovar Sistemas and will run exclusively in Portuguese -- no locale switcher, no multi-language support needed. API responses remain in English; only the UI layer is translated.

## Acceptance Criteria

- [ ] All user-visible text in the application is in Brazilian Portuguese
- [ ] Ninja/dojo themed terminology is properly adapted (see Terminology section below)
- [ ] The `<html lang="en">` attribute in root layout is changed to `lang="pt-BR"`
- [ ] Date formatting uses `pt-BR` locale (not `en-US`)
- [ ] `metadata.title` and `metadata.description` values in page files are translated
- [ ] No hardcoded English remains in any component or page (excluding code comments and variable names)
- [ ] `npm run build` completes successfully with no TypeScript errors
- [ ] `npm run lint` passes

## Architectural Constraint: Server Components vs Client Components

**CRITICAL:** This codebase has a mix of Server Components and Client Components. A React Context approach will NOT work for Server Components (they cannot use hooks or context).

**Recommended approach:** Instead of a React Context + hook system, use a **simple utility function** that can work in BOTH server and client contexts:

1. Create `/apps/web/lib/i18n/translations.ts` that exports a `t(key: string, params?: Record<string, string>)` function
2. The function reads from a static translations object (imported from `pt-BR.ts`)
3. Create `/apps/web/lib/i18n/pt-BR.ts` that exports a typed translations object (use `as const` for type safety)
4. The `t()` function supports dot-path keys: `t('auth.login.title')` and optional interpolation: `t('common.itemCount', { count: '5' })`
5. No context, no provider, no hook needed -- just import `{ t }` from `@/lib/i18n/translations`

This is simpler, works everywhere, and aligns with the KISS principle. Since the app only ever uses one language, there is no need for runtime language switching.

## Stubs to Skip

The following component files are stubs (return null) and do NOT need translation. Skip them entirely:

- `components/support/action-selector.tsx` (stub)
- `components/support/ticket-form.tsx` (stub)
- `components/support/bug-form.tsx` (stub)
- `components/support/my-items-list.tsx` (stub)
- `components/mission-board/mission-board.tsx` (stub)
- `components/mission-board/ticket-card.tsx` (stub)
- `components/mission-board/mission-board-filters.tsx` (stub)
- `components/ticket/ticket-detail.tsx` (stub)
- `components/ticket/ticket-header.tsx` (stub)
- `components/ticket/ticket-timeline.tsx` (stub)

## Files to Translate

### Infrastructure (create new -- Phase 1)

1. `/apps/web/lib/i18n/pt-BR.ts` -- All Portuguese translations as a typed const object (~350+ keys)
2. `/apps/web/lib/i18n/translations.ts` -- The `t()` utility function

### Root Layout (modify -- Phase 2)

3. `/apps/web/app/layout.tsx` -- Change `lang="en"` to `lang="pt-BR"`, translate metadata

### Client Components (modify -- Phase 3, batch A)

These files have `"use client"` and contain hardcoded English strings:

4. `components/auth/login-form.tsx` -- Form labels, buttons, validation messages, errors
5. `components/auth/register-form.tsx` -- Form labels, role options, buttons
6. `components/layout/header.tsx` -- Search placeholder, navigation, user menu items
7. `components/layout/sidebar.tsx` -- Navigation labels
8. `components/layout/notification-center.tsx` -- Notification titles, empty state, mark as read
9. `components/layout/app-shell.tsx` -- Any labels/aria text
10. `components/profile/profile-form.tsx` -- Profile settings labels and validation
11. `components/tickets/mission-board.tsx` -- Filters, status labels, empty states, buttons
12. `components/tickets/ticket-form.tsx` -- Form labels, severity options, buttons
13. `components/tickets/bug-form.tsx` -- Form labels, environment options, buttons
14. `components/tickets/ticket-actions.tsx` -- Action buttons, status change, assign
15. `components/tickets/copy-id-button.tsx` -- Tooltip/button text
16. `components/tickets/clickup-copy-button.tsx` -- Button text
17. `components/dev/ninja-board.tsx` -- Developer card labels, status labels
18. `components/dev/developer-card.tsx` -- Status labels, ticket info
19. `components/dev/smoke-signal-modal.tsx` -- Modal title, form labels, buttons
20. `components/dev/status-scroll-modal.tsx` -- Modal title, form labels, buttons
21. `components/admin/command-dojo-overview.tsx` -- Dashboard labels, stats, config
22. `components/admin/team-management.tsx` -- Table headers, role labels, actions
23. `components/admin/checkpoint-config.tsx` -- Config labels, form fields
24. `components/admin/ticket-log.tsx` -- Table headers, filters, status labels
25. `components/admin/notification-routing.tsx` -- Config labels, toggle labels
26. `components/tv/tv-board.tsx` -- TV display labels, status text
27. `components/user-avatar.tsx` -- Alt text / aria labels (if any)
28. `components/theme-provider.tsx` -- Likely no strings, but check

### Server Components (modify -- Phase 3, batch B)

These are Server Components (no "use client") with hardcoded English. Import `t` directly:

29. `components/tickets/ticket-timeline.tsx` -- Event labels ("Opened by", "Status changed", "Assigned to", etc.), relative time ("just now", "ago"), date formatting locale

### Pages (modify -- Phase 4)

Translate headings, subheadings, descriptions, and `metadata.title` in each page:

30. `app/layout.tsx` -- Root metadata (already in Phase 2)
31. `app/error.tsx` -- Error page text ("Critical Failure", "Smoke in the Dojo", buttons)
32. `app/not-found.tsx` -- 404 page text ("Mission Not Found", buttons)
33. `app/(auth)/login/page.tsx` -- Page title metadata
34. `app/(auth)/register/page.tsx` -- Page title metadata
35. `app/(protected)/support/page.tsx` -- Action cards ("Open a Ticket", "Threat Report"), descriptions, buttons
36. `app/(protected)/support/ticket/new/page.tsx` -- Heading, description, metadata
37. `app/(protected)/support/bug/new/page.tsx` -- Heading, description, metadata
38. `app/(protected)/support/queue/page.tsx` -- Heading, description, metadata
39. `app/(protected)/support/my-items/page.tsx` -- Heading, status labels, empty state, date formatting, metadata
40. `app/(protected)/dev/page.tsx` -- Metadata title
41. `app/(protected)/dev/queue/page.tsx` -- Heading, description, metadata
42. `app/(protected)/profile/page.tsx` -- Heading, description, metadata
43. `app/(protected)/admin/page.tsx` -- Metadata title
44. `app/(protected)/admin/team/page.tsx` -- Metadata title
45. `app/(protected)/admin/checkpoints/page.tsx` -- Metadata title
46. `app/(protected)/admin/notifications/page.tsx` -- Heading, description, metadata
47. `app/(protected)/admin/log/page.tsx` -- Metadata title
48. `app/(protected)/ticket/[publicId]/page.tsx` -- Section headings ("Description", "Bug Details", "Mission Log"), labels ("Opened by", "Assigned to", "Created", "Due", "OVERDUE"), status labels, type labels, date formatting

## Terminology Mappings

Use these consistently across the entire application:

| English | Portuguese (pt-BR) |
|---------|-------------------|
| Mission Board | Painel de Missoes |
| Ninja Board | Painel Ninja |
| Smoke Signal | Sinal de Fumaca |
| Status Scroll | Pergaminho de Status |
| Command Dojo | Dojo de Comando |
| Threat Report | Relatorio de Ameaca |
| Ticket | Ticket (keep as-is, it is commonly used in pt-BR tech) |
| Bug | Bug (keep as-is) |
| Mission | Missao |
| Ninja | Ninja |
| Jonin (Tech Lead) | Jonin |
| Dojo | Dojo |
| Mission Log | Registro da Missao |
| Open the Dojo | Entrar no Dojo |
| Submit Mission | Enviar Missao |
| Return to Base | Retornar a Base |
| Support Home | Central de Suporte |
| Smoke in the Dojo | Fumaca no Dojo |
| Critical Failure | Falha Critica |
| Mission Not Found | Missao Nao Encontrada |

**Status labels:**
| English | Portuguese |
|---------|-----------|
| Open | Aberto |
| In Progress | Em Progresso |
| Waiting for Info | Aguardando Informacoes |
| Done | Concluido |
| Cancelled | Cancelado |

**Severity labels:**
| English | Portuguese |
|---------|-----------|
| Low | Baixa |
| Medium | Media |
| High | Alta |
| Critical | Critica |

**Role labels:**
| English | Portuguese |
|---------|-----------|
| Support | Suporte |
| Developer | Desenvolvedor |
| Tech Lead | Lider Tecnico / Jonin |

**Common UI terms:**
| English | Portuguese |
|---------|-----------|
| Search | Buscar |
| Save | Salvar |
| Cancel | Cancelar |
| Delete | Excluir |
| Edit | Editar |
| Close | Fechar |
| Submit | Enviar |
| Loading... | Carregando... |
| No results | Nenhum resultado |
| Unassigned | Nao atribuido |
| Assigned to | Atribuido a |
| Opened by | Aberto por |
| Created | Criado em |
| Due | Prazo |
| Overdue | Atrasado |
| Profile | Perfil |
| Settings | Configuracoes |
| Logout | Sair |
| Notifications | Notificacoes |
| Mark as read | Marcar como lida |
| Mark all as read | Marcar todas como lidas |
| just now | agora mesmo |

NOTE: Use proper Portuguese diacritics (accents) in all actual translation strings: a with tilde, c with cedilla, o with circumflex, etc. The table above uses ASCII for compatibility but the actual pt-BR.ts file MUST use proper Unicode characters.

## Rules to Follow

- Use the `t()` function approach (NOT React Context) as described above
- Keep API responses in English -- only translate what users see in the UI
- Do NOT modify any API route files
- Do NOT modify any files in `packages/ui/` -- only `apps/web/`
- Maintain the existing code structure -- do not refactor beyond what is needed for translation
- For date formatting, replace `"en-US"` locale strings with `"pt-BR"`
- For number formatting, use `"pt-BR"` locale
- Comments in code stay in English
- Variable names stay in English
- Test by running `npm run build` and `npm run lint` after all changes

## Implementation Sequence

1. **Phase 1:** Create `pt-BR.ts` and `translations.ts` in `/apps/web/lib/i18n/`
2. **Phase 2:** Update root `layout.tsx` (lang attribute + metadata)
3. **Phase 3A:** Refactor client components (items 4-28)
4. **Phase 3B:** Refactor server components (item 29)
5. **Phase 4:** Refactor pages (items 30-48)
6. **Phase 5:** Run build + lint to verify, fix any issues

## Communication File

N/A -- frontend-only task, no backend changes needed.
