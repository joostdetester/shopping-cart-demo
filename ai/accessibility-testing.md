---
title: Accessibility Testing
description: Lightweight accessibility testing approach for this project's Playwright BDD UI suite.
owner: team-qa
tags: [testing, accessibility, ui, axe]
version: 1.0
---

# Accessibility Testing

## Scope
- Accessibility tests in this project run only on UI flows.
- Start with stable entry pages to keep failures actionable and reduce noise.
- Baseline uses `@axe-core/playwright` with WCAG 2 A and AA tags.

## Reporting
- Every accessibility scan attaches the full axe JSON results to the test report.
- A text summary is also attached with counts per impact level.
- Axe classifies violations with impact levels such as `minor`, `moderate`, `serious`, and `critical`.
- Baseline fails tests only for `critical` and `serious` findings.

## Tags
- Use `@accessibility` and `@a11y` on dedicated accessibility scenarios.
- Combine them with the existing `@ui` tag.

## First iteration
- `features/accessibility.feature` scans the homepage as a working example —
  reuse its pattern (`pageobjects/_shared/accessibility.ts` +
  `steps/accessibility.steps.ts`) for the project's other entry pages.
- List the additional entry pages for this project's first accessibility pass
  here (e.g. the login page, the main landing page, the primary conversion
  flow) once known.

## Guidelines
- Reuse existing navigation steps and page objects.
- Keep accessibility checks in dedicated scenarios instead of mixing them into broad E2E flows.
- Attach full scan output so findings can be reviewed even when the test passes.
- Tighten the failure threshold only after the team understands the current issue baseline.
