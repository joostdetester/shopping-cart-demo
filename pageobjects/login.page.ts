import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    // Deliberately not a leading-slash path: baseURL already includes the
    // `/client` app path, and a leading slash would replace it instead of
    // appending to it (see URL resolution rules for page.goto).
    await this.page.goto('#/auth/login');
  }

  async enterEmail(email: string): Promise<void> {
    await this.page.locator('#userEmail').fill(email);
  }

  async enterPassword(password: string): Promise<void> {
    await this.page.locator('#userPassword').fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.page.locator('#login').click();
    // Wait for either a successful redirect to the dashboard or a login
    // error toast, so callers always see a settled URL/DOM state rather
    // than reading page.url() mid-navigation.
    await Promise.race([
      this.page.waitForURL(/\/dashboard/),
      this.page.locator('.toast-error').waitFor(),
    ]).catch(() => undefined);
  }

  getUrl(): string {
    return this.page.url();
  }
}
