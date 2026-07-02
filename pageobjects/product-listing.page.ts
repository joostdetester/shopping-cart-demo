import { Locator, Page } from '@playwright/test';

export class ProductListingPage {
  constructor(private readonly page: Page) {}

  async waitForProducts(): Promise<void> {
    await this.page.locator('.card').first().waitFor();
  }

  private productCard(productName: string): Locator {
    return this.page
      .locator('.card', { has: this.page.locator('h5 b', { hasText: productName }) })
      .first();
  }

  async addProductToCart(productName: string): Promise<void> {
    const countBefore = await this.getCartCount();
    await this.productCard(productName)
      .getByRole('button', { name: /Add To Cart/i })
      .click();
    // The cart badge updates asynchronously after the click; wait for it to
    // actually change so callers never read a stale count right after this
    // resolves. Playwright auto-retries locator reads, so this polls rather
    // than sleeping for a fixed duration.
    await this.page.waitForFunction((previousCount) => {
      const badge = document.querySelector('button[routerlink="/dashboard/cart"] label');
      return !!badge && badge.textContent !== previousCount;
    }, countBefore);
  }

  async getCartCount(): Promise<string> {
    return this.page.locator('button[routerlink="/dashboard/cart"] label').innerText();
  }

  async goToCart(): Promise<void> {
    await this.page.locator('button[routerlink="/dashboard/cart"]').click();
  }
}
