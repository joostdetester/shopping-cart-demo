import { expect } from '@playwright/test';
import { Then } from './bdd';
import { scanAccessibility } from '../pageobjects/_shared/accessibility';

Then(
  'the page has no critical or serious accessibility violations',
  async ({ page, $testInfo }) => {
    const { failingViolations } = await scanAccessibility(page, $testInfo);
    expect(failingViolations, JSON.stringify(failingViolations, null, 2)).toHaveLength(0);
  },
);
