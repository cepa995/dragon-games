import { defineWorkspace } from 'vitest/config';

/**
 * Two test projects:
 *  - `unit`        — fast, isolated (jsdom). Pure logic + React components.
 *  - `integration` — real PostgreSQL (DATABASE_URL_TEST). Prisma queries, etc.
 *
 * Run all with `pnpm test`, or one with `pnpm test:unit` / `pnpm test:integration`.
 */
export default defineWorkspace([
  {
    extends: './vitest.config.ts',
    test: {
      name: 'unit',
      environment: 'jsdom',
      include: ['src/**/*.test.{ts,tsx}'],
      setupFiles: ['./test/setup.unit.ts'],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'integration',
      environment: 'node',
      include: ['test/integration/**/*.test.ts'],
      globalSetup: ['./test/integration/global-setup.ts'],
      setupFiles: ['./test/integration/setup.ts'],
    },
  },
]);
