# CLAUDE.md — Dragon Games Web Platform

Guidance for Claude Code (and any AI agent) working in this repository.

---

## 0. Session start protocol (DO THIS FIRST, EVERY SESSION)

Before writing or changing **any** code, at the start of each working session you MUST:

1. **Read the current state of the application.**
   - Check what already exists: `git log --oneline -20`, `git status`, the directory tree, `package.json` scripts, and the Prisma schema (`prisma/schema.prisma`).
   - Run the test suite if one exists to know the baseline (`pnpm test`), and check that the app builds/boots if relevant.
   - Read this file and the SRS (`Dragon_Games_SRS_v1.0.md`) for context.

2. **Read the open GitHub issues and milestones.**
   - `gh issue list --state open --limit 100`
   - `gh issue list --milestone "<current milestone>"`
   - `gh api repos/cepa995/dragon-games/milestones --jq '.[] | {title, open_issues, closed_issues}'`
   - Understand what is in progress, what is blocked, and what the next logical piece of work is.

3. **Confirm a dedicated issue exists for the work you are about to do.**
   - Every unit of work MUST map to a GitHub issue **before** code is written, unless the user explicitly says otherwise (e.g. a trivial fix, a hotfix, or "skip the issue").
   - If no suitable issue exists, **create one first** (`gh issue create ...`) with a clear scope, acceptance criteria, FR/NFR references from the SRS, and a milestone — then start work.
   - Reference the issue in the branch name and PR (e.g. `feat/23-product-detail`, "Closes #23").

> If you skip steps 1–3, you risk duplicating work, breaking in-progress features, or building something already tracked elsewhere. Don't skip them.

---

## 1. Testing policy (NON-NEGOTIABLE)

Any code you write MUST be covered by tests — **unit, integration, or e2e as appropriate** — unless the user explicitly says not to test it.

- **Unit** (Vitest): pure logic, utilities, validation schemas, formatters, currency conversion, i18n helpers, server-action logic.
- **Integration** (Vitest + test DB): Prisma queries, API/route handlers, auth flows, order/stock reservation logic, against a real Postgres test database.
- **E2E** (Playwright): critical user journeys — browse → cart → submit inquiry; admin login (2FA) → create product → process order; language switching; auth flows.
- Critical paths (auth, cart, order submission, admin order management) require **≥ 70% line coverage** (NFR-8.3).
- A feature is **not done** until its tests pass in CI. Do not mark an issue complete or open a PR with failing/red tests. If you intentionally skip a test, say so explicitly and explain why.

---

## 2. Tech stack (authoritative)

| Layer | Choice |
|---|---|
| Framework | **Next.js 15+ (App Router, RSC)**, React 19, TypeScript **strict** |
| Database | **PostgreSQL** |
| ORM | **Prisma** (migrations via `prisma migrate`, never edit the DB by hand) |
| Styling | Tailwind CSS v4 + CSS variables for theming |
| UI | shadcn/ui primitives, customized |
| Auth | **Auth.js (NextAuth v5)** + Prisma adapter — email/password + magic link, TOTP 2FA for admin |
| i18n | next-intl (locale-prefixed routes `/sr` default, `/en`), ICU pluralization |
| Forms | React Hook Form + Zod |
| Animation | Framer Motion (+ optional GSAP ScrollTrigger on home) |
| Email | Resend (transactional + newsletter), bilingual templates |
| File storage | Local/S3-compatible (e.g. Cloudflare R2), CDN-fronted; server-derived WebP/AVIF |
| Search | Postgres FTS + `pg_trgm` (diacritic-insensitive, typo-tolerant) |
| Testing | Vitest (unit/integration) + Playwright (e2e) |
| CI/CD | GitHub Actions (lint, type-check, test, build) |
| Error tracking | Sentry (PII scrubbed) |
| Package manager | pnpm |

> **No online payments.** All orders are inquiry-based: the customer submits an order, stock is reserved, and Dragon Games staff confirm price/fulfilment offline (courier or postal delivery, or in-store pickup). Do **not** add Stripe/PayPal/card flows.

The SRS (§9) recommends Supabase/Drizzle as one option; **this project overrides that with the stack above.** When the SRS and this file disagree on stack, this file wins.

---

## 3. Product constraints to always honor

- **Bilingual**: Serbian (Latin, default) + English. No hardcoded UI strings — everything in `messages/sr.json` / `messages/en.json`. Content models carry `_sr` / `_en` fields. Fallback to SR when EN missing (FR-26).
- **Mobile-first**, responsive, dark-first theme with light toggle (FR-23, FR-25).
- **Accessibility**: WCAG 2.2 AA; respect `prefers-reduced-motion` on every animation (NFR-4, C-8).
- **Performance**: LCP ≤ 2.5s on throttled 3G; CLS ≤ 0.1; INP ≤ 200ms (NFR-1).
- **Prices**: RSD primary, EUR secondary via admin-configurable manual rate (C-3, C-4).
- **Privacy/legal**: GDPR + Serbian ZZPL — consent logging, data export, right to erasure (NFR-3).
- **Security**: OWASP ASVS L2 baseline — admin 2FA, CSRF, rate limiting, security headers, Argon2id/bcrypt passwords, audit log (NFR-2).
- This is a **production application, not an MVP** — build for completeness, reliability, and maintainability.

---

## 4. Workflow & conventions

- **Branching**: never commit directly to `main`. Branch per issue: `feat/<issue#>-slug`, `fix/<issue#>-slug`, `chore/...`.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`). Keep `main` protected and green. Do not mention the AI assistant's name (e.g. Claude) anywhere in commit messages.
- **PRs**: reference the issue ("Closes #N"), describe what/why, list tests added, confirm CI green. Only commit/push when the user asks.
- **Prisma**: schema changes go through `prisma migrate dev` (committed migrations). Update the seed when adding core models.
- **Commands** (once scaffolded): `pnpm dev`, `pnpm build`, `pnpm test`, `pnpm test:e2e`, `pnpm lint`, `pnpm typecheck`, `pnpm prisma migrate dev`, `pnpm prisma studio`.
- Document architectural decisions as short ADRs under `docs/adr/` (NFR-8.4).

---

## 5. Key references

- **SRS**: `Dragon_Games_SRS_v1.0.md` — the source of truth for requirements (FR-x.y functional, NFR-x.y non-functional). Cite these IDs in issues and PRs.
- Sitemap: SRS §14. User journeys: SRS §15. Data model sketch: SRS §9.3.
- GitHub repo: `cepa995/dragon-games`.
