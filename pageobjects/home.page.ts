import { Page } from '@playwright/test';

// This page object intentionally targets the Playwright marketing site
// directly (an absolute URL, not the configured `baseURL`). It predates the
// shopping-cart SUT and is kept as an unrelated smoke-check example — see
// ai/project-context.md ("Homepage/accessibility smoke checks against the
// public marketing site"). Using an absolute URL keeps it working regardless
// of what BASE_URL is set to for the shopping-cart scenarios.
const MARKETING_SITE_URL = 'https://playwright.dev/';

export class HomePage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto(MARKETING_SITE_URL);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }
}
