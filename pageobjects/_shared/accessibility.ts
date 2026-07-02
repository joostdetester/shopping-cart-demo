import { Page, TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

type AxeImpact = 'minor' | 'moderate' | 'serious' | 'critical';

const FAILING_IMPACTS: AxeImpact[] = ['serious', 'critical'];

export async function scanAccessibility(page: Page, testInfo: TestInfo) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

  await testInfo.attach('axe-results.json', {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json',
  });

  const counts = new Map<string, number>();
  for (const violation of results.violations) {
    const impact = violation.impact ?? 'unknown';
    counts.set(impact, (counts.get(impact) ?? 0) + 1);
  }
  const summary = counts.size
    ? [...counts.entries()].map(([impact, count]) => `${impact}: ${count}`).join('\n')
    : 'No violations found';
  await testInfo.attach('axe-summary.txt', { body: summary, contentType: 'text/plain' });

  const failingViolations = results.violations.filter((violation) =>
    FAILING_IMPACTS.includes(violation.impact as AxeImpact),
  );

  return { violations: results.violations, failingViolations };
}
