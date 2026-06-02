# Developer onboarding

Goal: a new developer running the app locally in **≤ 30 minutes** (NFR-8.5).

## 1. Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | **20+** | `nvm use` reads [`.nvmrc`](../.nvmrc) |
| pnpm | **10+** | `corepack enable` or `npm i -g pnpm` |
| Docker + Compose | recent | for local PostgreSQL |
| Git | 2.40+ | |

## 2. Clone & install

```bash
git clone git@github.com:cepa995/dragon-games.git
cd dragon-games
nvm use            # Node 20
pnpm install       # also runs `prisma generate` (postinstall)
```

## 3. Environment

```bash
cp .env.example .env
```

The defaults work out of the box with the bundled database. Fill in optional
integration keys (Auth, Resend, Sentry, Turnstile) as you reach those features.
`src/env.ts` validates the environment at boot and fails fast on missing/invalid
values.

## 4. Database

```bash
docker compose up -d         # PostgreSQL on localhost:5433 (+ a test DB)
pnpm prisma:migrate          # apply migrations
pnpm db:seed                 # seed settings, categories, sample products, users
```

Seeded logins (development only — replaced by real auth in M3):

- **Admin** — `admin@dragon.rs` / `dragon-admin-dev`
- **Member** — `member@example.com` / `member-dev`

Inspect data with `pnpm prisma:studio`.

## 5. Run

```bash
pnpm dev          # http://localhost:3000  → redirects to /sr
```

Verify health: `curl http://localhost:3000/api/health` → `{"status":"ok",...}`.

## 6. Everyday commands

```bash
pnpm lint          # ESLint
pnpm typecheck     # tsc --noEmit
pnpm test          # unit + integration (Vitest)
pnpm test:e2e      # Playwright (installs browsers on first run)
pnpm format        # Prettier
pnpm db:reset      # drop, re-migrate, re-seed
```

A Husky pre-commit hook runs `lint-staged` (ESLint + Prettier on staged files).

## 7. Workflow

Read [`../CLAUDE.md`](../CLAUDE.md): start each session by reading app state and
open issues, work against a dedicated GitHub issue on a feature branch
(`feat/<issue#>-slug`), use Conventional Commits, and add tests for any code you
write. CI must be green before merge.

## Troubleshooting

- **`prisma generate` / client import errors** → `pnpm install` or `pnpm prisma:generate`.
- **DB connection refused** → `docker compose ps`; ensure `postgres` is healthy; confirm `DATABASE_URL` port `5433`.
- **Port 5433 in use** → change the host port in `docker-compose.yml` and `DATABASE_URL`.
- **ESLint can't find a plugin** → ensure `.npmrc` hoist patterns applied; reinstall with `pnpm install`.
