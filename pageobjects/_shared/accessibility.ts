import { Page, TestInfo } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export type WcagLevel = 'A' | 'AA' | 'AAA';

// axe-core's 4 impact levels, worst to best. A violation with no impact
// (rare, but axe types allow it) is treated as 'critical' rather than
// silently dropped or downgraded - an un-scored finding should never slip
// through a gate meant to catch the worst issues.
type AxeImpact = 'critical' | 'serious' | 'moderate' | 'minor';

// This project's severity scale (see ai/accessibility-testing.md) maps
// 1:1 onto axe's impact levels.
const SEVERITY_LABELS: Record<AxeImpact, string> = {
  critical: 'Blocker/Critical',
  serious: 'Major',
  moderate: 'Minor',
  minor: 'Cosmetic',
};

// Cumulative per WCAG's own structure: AA conformance requires meeting A,
// AAA requires meeting AA (and therefore A) too - so each level's tag set
// is a superset of the one before it.
const WCAG_TAGS: Record<WcagLevel, string[]> = {
  A: ['wcag2a', 'wcag21a'],
  AA: ['wcag2a', 'wcag21a', 'wcag2aa', 'wcag21aa'],
  AAA: ['wcag2a', 'wcag21a', 'wcag2aa', 'wcag21aa', 'wcag2aaa', 'wcag21aaa'],
};

// Which impact levels must have zero violations for the scan to pass at
// each WCAG level. A is the strict baseline (0 Blocker/Critical, 0 Major).
// AA/AAA only gate on Blocker/Critical - their much larger rule sets
// surface far more Major/Minor/Cosmetic findings, which are tracked (full
// results are always attached) but don't block release at those levels.
const GATE_IMPACTS: Record<WcagLevel, AxeImpact[]> = {
  A: ['critical', 'serious'],
  AA: ['critical'],
  AAA: ['critical'],
};

function impactOf(violation: { impact?: string | null }): AxeImpact {
  const impact = violation.impact;
  return impact === 'critical' || impact === 'serious' || impact === 'moderate' || impact === 'minor'
    ? impact
    : 'critical';
}

export async function scanAccessibility(page: Page, testInfo: TestInfo, level: WcagLevel) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS[level]).analyze();

  await testInfo.attach(`axe-results-${level}.json`, {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json',
  });

  const counts = new Map<AxeImpact, number>();
  for (const violation of results.violations) {
    const impact = impactOf(violation);
    counts.set(impact, (counts.get(impact) ?? 0) + 1);
  }
  const summary = counts.size
    ? [...counts.entries()]
        .map(([impact, count]) => `${SEVERITY_LABELS[impact]} (${impact}): ${count}`)
        .join('\n')
    : 'No violations found';
  await testInfo.attach(`axe-summary-${level}.txt`, { body: summary, contentType: 'text/plain' });

  const gateImpacts = GATE_IMPACTS[level];
  const failingViolations = results.violations.filter((violation) =>
    gateImpacts.includes(impactOf(violation)),
  );

  return { violations: results.violations, failingViolations };
}
