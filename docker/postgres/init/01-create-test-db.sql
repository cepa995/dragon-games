-- Dedicated database for the integration test suite (#6). Runs once on the
-- first container init. The app/dev database (dragon_games) is created by the
-- POSTGRES_DB env var; this adds the isolated test database alongside it.
CREATE DATABASE dragon_games_test;
