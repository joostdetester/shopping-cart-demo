import { Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async selectPaymentMethod(method: string): Promise<void> {
    await this.page.locator('.payment__type', { hasText: method }).click();
  }

  async enterCreditCardNumber(cardNumber: string): Promise<void> {
    await this.page
      .locator('.field .title', { hasText: 'Credit Card Number' })
      .locator('..')
      .locator('input')
      .fill(cardNumber);
  }

  async enterExpiryDate(expiry: string): Promise<void> {
    const [month, year] = expiry.split('/').map((part) => part.trim());
    const expirySelects = this.page.locator('select.input.ddl');
    await expirySelects.nth(0).selectOption(month);
    await expirySelects.nth(1).selectOption(year);
  }

  async enterCvv(cvv: string): Promise<void> {
    await this.page
      .locator('.field .title', { hasText: 'CVV' })
      .locator('..')
      .locator('input')
      .fill(cvv);
  }

  async enterShippingEmail(email: string): Promise<void> {
    await this.page.locator('.user__name input.input.txt').first().fill(email);
  }

  async selectShippingCountry(country: string): Promise<void> {
    const countryInput = this.page.locator('input[ngxtypeahead]');
    await countryInput.click();
    await countryInput.pressSequentially(country, { delay: 100 });
    await this.page.locator('button.ta-item', { hasText: country }).first().click();
  }

  async clickPlaceOrder(): Promise<void> {
    await this.page.locator('a.action__submit', { hasText: 'Place Order' }).click();
    await this.page.waitForURL(/\/dashboard\/thanks/);
  }

  getUrl(): string {
    return this.page.url();
  }

  async getConfirmationHeading(): Promise<string> {
    return this.page.locator('h1.hero-primary').innerText();
  }
}
