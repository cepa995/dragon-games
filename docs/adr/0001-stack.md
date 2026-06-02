# ADR 0001 — Core stack

- **Status**: Accepted
- **Date**: 2026-06-02
- **Context**: SRS §9 (Technical Architecture), client direction.

## Context

Dragon Games needs a production (not MVP) bilingual web platform: informational
site, inquiry-based catalog/commerce (no online payments), tournaments, news, and
an admin panel — with a V2 forum to follow. The SRS §9 recommends a stack but
leaves room to adjust. The client directed the implementation stack explicitly.

## Decision

| Concern | Choice |
|---|---|
| Framework | **Next.js 15** (App Router, RSC), React 19, TypeScript strict |
| Database | **PostgreSQL** |
| ORM | **Prisma** (committed migrations; custom client output `src/generated/prisma`) |
| Styling | Tailwind CSS v4 + CSS variables |
| UI | shadcn/ui primitives |
| Auth | **Auth.js (NextAuth v5)** + Prisma adapter; Argon2id; TOTP 2FA for admin |
| i18n | next-intl, locale-prefixed routes (`/sr` default, `/en`) |
| Email | Resend |
| Search | PostgreSQL FTS + `pg_trgm` |
| Testing | Vitest (unit/integration) + Playwright (e2e) |
| CI | GitHub Actions |
| Errors | Sentry (PII-scrubbed) |
| Package manager | pnpm 10 |
| Runtime | Node 20+ |

This **overrides** the SRS §9 alternatives where they differ: PostgreSQL+Prisma
instead of Supabase/Drizzle, and Auth.js instead of Supabase Auth/Clerk. Hosting
remains EU-region for GDPR/ZZPL (SRS C-5).

## Consequences

- **Money** stored as whole RSD integers; EUR derived from an admin-configured
  rate (SRS C-3/C-4) with an optional per-product override.
- **Stock** modelled as `stockOnHand` + `stockReserved` so inquiry orders reserve
  without decrementing on-hand (SRS FR-12.5).
- The Prisma client is generated to a **gitignored** `src/generated/prisma`; a
  `postinstall` hook regenerates it after install (and in CI).
- pnpm's isolated store requires `.npmrc` `public-hoist-pattern` entries so
  `eslint-config-next` can resolve its plugins.
- **No payment provider** is integrated by design; orders are inquiry-based and
  settled offline (courier/post/pickup).

## Alternatives considered

- **Supabase (Auth + DB + Storage)** — fast, but couples us to one vendor and the
  client chose self-managed PostgreSQL + Prisma.
- **Drizzle ORM** — lighter, but Prisma's tooling (Migrate, Studio, ecosystem)
  better fits a single-admin, maintainability-focused project (NFR-8).
