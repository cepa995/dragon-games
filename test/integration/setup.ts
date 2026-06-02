import 'dotenv/config';

/**
 * Point Prisma at the test database for the duration of the integration suite.
 * This must run before any module that constructs a PrismaClient, so it is wired
 * as a `setupFiles` entry (executed before test modules are imported).
 */
if (!process.env.DATABASE_URL_TEST) {
  throw new Error('DATABASE_URL_TEST is required for integration tests.');
}
process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;
