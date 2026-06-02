import { execSync } from 'node:child_process';
import 'dotenv/config';

/**
 * Runs once before the integration suite: applies all migrations to the isolated
 * test database (DATABASE_URL_TEST). The DB itself is created by
 * docker/postgres/init/01-create-test-db.sql.
 */
export default function setup() {
  const url = process.env.DATABASE_URL_TEST;
  if (!url) {
    throw new Error(
      'DATABASE_URL_TEST is not set — copy .env.example to .env and start `docker compose up -d`.',
    );
  }

  execSync('pnpm exec prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: url },
  });
}
