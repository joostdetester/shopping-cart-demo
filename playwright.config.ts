import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import dotenv from 'dotenv';

// Load .env before anything below (including config/project.config.ts, which
// is imported later via steps/fixtures.ts) reads process.env.
dotenv.config();

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['steps/**/*.ts'],
});

const isDebug = !!process.env.PWDEBUG;

export default defineConfig({
  testDir,
  timeout: 90_000,
  // The shopping-cart/checkout scenarios share one real backend account
  // (see ai/project-context.md) whose cart persists server-side across
  // sessions. Running workers in parallel lets two scenarios mutate that
  // same cart at once and race each other, so this suite runs serially.
  workers: 1,
  use: {
    baseURL: process.env.BASE_URL ?? 'https://playwright.dev',
    headless: !isDebug,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  reporter: [['list'], ['allure-playwright']],
});
