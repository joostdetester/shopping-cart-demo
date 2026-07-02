import { Locator, Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  private cartItem(productName: string): Locator {
    return this.page.locator('li.items', {
      has: this.page.locator('h3', { hasText: productName }),
    });
  }

  async waitForItems(): Promise<void> {
    await this.page.locator('li.items').first().waitFor();
  }

  async getItemNames(): Promise<string[]> {
    return this.page.locator('li.items h3').allInnerTexts();
  }

  async removeProduct(productName: string): Promise<void> {
    await this.cartItem(productName).locator('.btn-danger').click();
    await this.cartItem(productName).waitFor({ state: 'detached' });
  }

  /** Removes every item currently in the cart, leaving it empty. */
  async removeAllProducts(): Promise<void> {
    // Wait for the cart to reach a determinate state (items rendered, or
    // the "No Products in Your Cart !" message) before counting, otherwise
    // a cart that legitimately has items can be read as empty mid-render.
    await Promise.race([
      this.page.locator('li.items').first().waitFor(),
      this.page.getByText('No Products in Your Cart').waitFor(),
    ]).catch(() => undefined);

    const removeButtons = this.page.locator('li.items .btn-danger');
    let remaining = await removeButtons.count();
    while (remaining > 0) {
      const firstButton = removeButtons.first();
      await firstButton.click();
      await firstButton.waitFor({ state: 'detached' });
      remaining = await removeButtons.count();
    }
  }

  async getTotal(): Promise<string> {
    return this.page.locator('.subtotal .totalRow .value').last().innerText();
  }

  async checkout(): Promise<void> {
    await this.page.locator('button', { hasText: 'Checkout' }).click();
  }

  async continueShopping(): Promise<void> {
    await this.page.locator('button', { hasText: 'Continue Shopping' }).click();
  }
}
