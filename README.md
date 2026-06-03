# Dragon Games — Web Platform

Modern, bilingual (Serbian / English) web platform for **Dragon Games**, a TCG &
board-games club and shop in Novi Sad, Serbia (operating since 1994). Replaces the
legacy `dragon.rs` site.

See [`Dragon_Games_SRS_v1.0.md`](./Dragon_Games_SRS_v1.0.md) for the full
requirements and [`CLAUDE.md`](./CLAUDE.md) for the contribution workflow.

## Stack

Next.js 15 (App Router, RSC) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
PostgreSQL + Prisma · Auth.js · next-intl · Vitest + Playwright. Inquiry-based
ordering — **no online payments**.

## Quickstart

> Requires **Node 20+** (see `.nvmrc`) and **pnpm 10+**. Full setup, including the
> database, is documented in [`docs/onboarding.md`](./docs/onboarding.md).

```bash
nvm use            # Node 20
pnpm install
cp .env.example .env   # then fill in values
docker compose up -d   # local PostgreSQL
pnpm prisma:migrate    # apply migrations
pnpm db:seed           # seed reference + sample data
pnpm dev               # http://localhost:3000  → redirects to /sr
```

Health check: `GET /api/health`.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm lint` / `pnpm format` | ESLint / Prettier |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Unit + integration (Vitest) |
| `pnpm test:e2e` | End-to-end (Playwright) |
| `pnpm prisma:migrate` / `pnpm db:seed` | Migrate / seed the database |

## Project status

Under active development. Work is tracked via GitHub milestones (M1–M10) and issues;
see [`CLAUDE.md`](./CLAUDE.md) for the session protocol (read state → check issues →
work against a dedicated issue → test).
