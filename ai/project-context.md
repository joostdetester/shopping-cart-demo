---
title: Project Context
description: Project-level context and goals for this system under test.
owner: product
tags: [context, project]
version: 1.0
---

# Project Context

## System Under Test

- Name: Rahul Shetty Academy Client (public e-commerce practice site)
- What it does / who uses it: A demo shopping-cart web app
  (`https://rahulshettyacademy.com/client`) used for QA automation practice —
  login, product listing, cart, and checkout, backed by a real (non-mocked)
  server. Requires a registered account; there is no shared "any password
  works" login.

## Tech Stack

- Test Framework: Playwright
- BDD: Cucumber (`playwright-bdd`, Gherkin feature files)
- Language: TypeScript
- CI/CD: GitHub Actions (`.github/workflows/ci.yml`)
- Target: Web app (Angular SPA, hash-based routing), Chromium via Playwright

## Primary Goals

- Stable and maintainable test automation
- Business-readable scenarios
- Fast feedback in CI pipelines
- Shift-left quality mindset

## Target Audience

- QA Engineers
- Developers contributing to automated tests
- CI/CD pipeline users

## Test Scope

- Authentication: login with a registered account (`features/user-authentication.feature`)
- Shopping cart: adding/removing products, cart totals (`features/shopping-cart.feature`)
- Checkout: payment + shipping info, order confirmation (`features/checkout.feature`)
- Homepage/accessibility smoke checks against the public marketing site (unrelated demo pages, kept from the original scaffold)

## Known quirks of this SUT (verified against the live site)

- Login requires a real registered account — `USER_EMAIL`/`USER_PASSWORD` in
  `.env` must belong to an account created via the app's Register page.
  There is no test/demo account that accepts any password.
- The cart is persisted server-side per account across sessions (not reset
  per browser session), so scenarios that mutate the cart clear it first to
  stay independently runnable — see `pageobjects/cart.page.ts#removeAllProducts`.
- The cart/checkout "Total" can reflect the account's broader order/cart
  history rather than just the currently visible line items — this is a
  known behavior of the demo backend, not a bug in the tests. Assertions on
  totals check the displayed value, not a locally recomputed sum.
- Because the cart is one shared, real resource per account, `playwright.config.ts`
  runs with `workers: 1` to avoid two scenarios racing on the same cart.
- The `test` and `acceptance` GitHub Environments (see `ai/repo-structure.md`)
  currently point at the *same* SUT account, since this demo only has one
  real backend to test against. If `main` and `acceptance` CI runs happen to
  overlap, they can race on that shared cart the same way two local workers
  would — this is what caused a one-off `checkout` timeout on `main` right
  after the `acceptance` branch was introduced; a rerun in isolation passed.
  Not a code bug, and not a flaw in the test/acceptance split itself — a
  real client setup with genuinely separate test and acceptance systems
  wouldn't hit this, since the two environments would no longer share one
  backend/account.
