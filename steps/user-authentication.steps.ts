import { expect } from '@playwright/test';
import { Given, When, Then } from './bdd';
import { LoginPage } from '../pageobjects/login.page';
import { ProductListingPage } from '../pageobjects/product-listing.page';

Given('the user is on the login page', async ({ page, world }) => {
  const login = new LoginPage(page);
  await login.open();
  world.login = login;
});

When('the user enters email {string}', async ({ world }, email: string) => {
  await world.login.enterEmail(email);
});

When('the user enters password', async ({ world, config }) => {
  await world.login.enterPassword(config.userPassword);
});

When('the user clicks the Login button', async ({ page, world }) => {
  await world.login.clickLogin();
  world.productListing = new ProductListingPage(page);
});

Given('the user is logged in', async ({ page, world, config }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.enterEmail(config.userEmail);
  await login.enterPassword(config.userPassword);
  await login.clickLogin();
  world.productListing = new ProductListingPage(page);
  await world.productListing.waitForProducts();
});

Then('the user should be redirected to the dashboard', async ({ world }) => {
  expect(world.login.getUrl()).toContain('/dashboard');
});

Then('the user should see the product listing page', async ({ world }) => {
  await world.productListing.waitForProducts();
});
