import { expect } from '@playwright/test';
import { Given, When, Then } from './bdd';
import { CartPage } from '../pageobjects/cart.page';
import { CheckoutPage } from '../pageobjects/checkout.page';

Given('the user has items in the shopping cart', async ({ page, world }) => {
  // This demo site persists the cart per account across sessions, so start
  // from a known-empty cart rather than inheriting items another scenario
  // left behind.
  world.cart = new CartPage(page);
  await world.productListing.goToCart();
  await world.cart.removeAllProducts();
  await world.cart.continueShopping();
  await world.productListing.waitForProducts();

  await world.productListing.addProductToCart('ADIDAS ORIGINAL');
});

When('the user navigates to checkout', async ({ page, world }) => {
  world.cart = new CartPage(page);
  await world.productListing.goToCart();
  await world.cart.waitForItems();
  await world.cart.checkout();
  world.checkout = new CheckoutPage(page);
});

When('the user selects {string} as payment method', async ({ world }, method: string) => {
  await world.checkout.selectPaymentMethod(method);
});

When('the user enters credit card number {string}', async ({ world }, cardNumber: string) => {
  await world.checkout.enterCreditCardNumber(cardNumber);
});

When('the user enters expiry date {string}', async ({ world }, expiry: string) => {
  await world.checkout.enterExpiryDate(expiry);
});

When('the user enters CVV code {string}', async ({ world }, cvv: string) => {
  await world.checkout.enterCvv(cvv);
});

When('the user enters shipping email {string}', async ({ world }, email: string) => {
  await world.checkout.enterShippingEmail(email);
});

When('the user selects {string} as shipping country', async ({ world }, country: string) => {
  await world.checkout.selectShippingCountry(country);
});

When('the user clicks the {string} button', async ({ world }, buttonLabel: string) => {
  expect(buttonLabel).toBe('PLACE ORDER');
  await world.checkout.clickPlaceOrder();
});

Then('the order should be placed successfully', async ({ world }) => {
  expect(world.checkout.getUrl()).toContain('/dashboard/thanks');
});

Then('the user should see the order confirmation page', async ({ world }) => {
  const heading = await world.checkout.getConfirmationHeading();
  expect(heading.trim().length).toBeGreaterThan(0);
});

Then('the confirmation should display {string}', async ({ world }, expectedText: string) => {
  const heading = await world.checkout.getConfirmationHeading();
  const normalize = (text: string) => text.replace(/\s+/g, '').toLowerCase();
  expect(normalize(heading)).toContain(normalize(expectedText));
});
