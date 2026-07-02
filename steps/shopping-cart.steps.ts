import { expect } from '@playwright/test';
import { Given, When, Then } from './bdd';
import { CartPage } from '../pageobjects/cart.page';

Given('the user is on the product listing page', async ({ page, world }) => {
  await world.productListing.waitForProducts();
  // This demo site persists the cart per account across sessions, so a
  // scenario starting here could otherwise inherit items left behind by an
  // earlier run. Clearing the cart keeps the scenario independently runnable.
  world.cart = new CartPage(page);
  await world.productListing.goToCart();
  await world.cart.removeAllProducts();
  await world.cart.continueShopping();
  await world.productListing.waitForProducts();
});

Given(
  'the user has added {string} and {string} to cart',
  async ({ page, world }, first: string, second: string) => {
    world.cart = new CartPage(page);
    await world.productListing.goToCart();
    await world.cart.removeAllProducts();
    await world.cart.continueShopping();
    await world.productListing.waitForProducts();

    await world.productListing.addProductToCart(first);
    await world.productListing.addProductToCart(second);
  },
);

When('the user adds {string} to the cart', async ({ world }, productName: string) => {
  await world.productListing.addProductToCart(productName);
});

When('the user navigates to the cart', async ({ page, world }) => {
  await world.productListing.goToCart();
  world.cart = new CartPage(page);
  await world.cart.waitForItems();
});

When('the user removes {string} from the cart', async ({ world }, productName: string) => {
  await world.cart.removeProduct(productName);
});

Then('the cart counter should display {string}', async ({ world }, expected: string) => {
  const count = await world.productListing.getCartCount();
  expect(count).toBe(expected);
});

Then('the cart should contain both items', async ({ page, world }) => {
  world.cart = new CartPage(page);
  await world.productListing.goToCart();
  await world.cart.waitForItems();
  const items = await world.cart.getItemNames();
  expect(items.map((item: string) => item.toLowerCase())).toEqual(
    expect.arrayContaining(['adidas original', 'iphone 13 pro']),
  );
});

Then('the cart should only contain {string}', async ({ world }, productName: string) => {
  const items = await world.cart.getItemNames();
  expect(items.map((item: string) => item.toLowerCase())).toEqual([productName.toLowerCase()]);
});

Then('the cart total should be {string}', async ({ world }, expectedTotal: string) => {
  const total = await world.cart.getTotal();
  expect(total).toBe(expectedTotal);
});
