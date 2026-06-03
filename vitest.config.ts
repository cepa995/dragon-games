import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/**
 * Base Vitest config — shared by both projects (see vitest.workspace.ts) and the
 * source of global options (coverage). Critical-path coverage thresholds
 * (auth/cart/orders ≥70%, NFR-8.3) are enforced per-file as those modules land.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/generated/**',
        'src/**/*.test.{ts,tsx}',
        'src/instrumentation*.ts',
        'src/app/**/layout.tsx',
      ],
    },
  },
});
