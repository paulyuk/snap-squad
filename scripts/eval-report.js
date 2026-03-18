#!/usr/bin/env node

/**
 * Eval Report Generator
 *
 * Reads vitest JSON results from evals/results.json, generates:
 *   1. Structured summary on stdout (with color)
 *   2. LKG markdown report at evals/REPORT.md (committed to repo)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { basename } from 'node:path';

const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));
const resultsPath = 'evals/results.json';

if (!existsSync(resultsPath)) {
  console.error('❌ No eval results found. Run `npm run eval` first.');
  process.exit(1);
}

const results = JSON.parse(readFileSync(resultsPath, 'utf-8'));

// ── Categorize tests ────────────────────────────────────────────────

const fileCategories = {
  'charter-evals': null, // split by ancestor titles
  'hook-chain-dispatch': 'Hook Chain Dispatch',
  'hook-chain': 'Hook Chain',
  'speed': 'Speed',
  'e2e': 'E2E',
  'matcher-accuracy': 'Matcher Accuracy',
  'matcher': 'Matcher',
  'validation': 'Validation',
  'generator': 'Generator',
  'registry': 'Registry',
  'edge-case-analysis': 'Edge Cases',
};

function categorize(testResult) {
  const file = basename(testResult.name, '.test.ts');

  if (file === 'charter-evals') {
    // Split charter-evals into Charter and Routing based on ancestors
    const charter = [];
    const routing = [];
    for (const a of testResult.assertionResults) {
      // Skip the top-level describe ("Charter & Routing Evals") and check sub-describes
      const subTitles = a.ancestorTitles.slice(1);
      if (subTitles.some(t => /^Routing/i.test(t))) {
        routing.push(a);
      } else {
        charter.push(a);
      }
    }
    return [
      { category: 'Charter Evals', assertions: charter },
      { category: 'Routing Evals', assertions: routing },
    ];
  }

  return [{
    category: fileCategories[file] || file,
    assertions: testResult.assertionResults,
  }];
}

// Build category map
const categories = new Map();
for (const tr of results.testResults) {
  for (const { category, assertions } of categorize(tr)) {
    if (!categories.has(category)) {
      categories.set(category, { passed: 0, failed: 0, total: 0, duration: 0, failures: [] });
    }
    const cat = categories.get(category);
    for (const a of assertions) {
      cat.total++;
      cat.duration += a.duration || 0;
      if (a.status === 'passed') {
        cat.passed++;
      } else {
        cat.failed++;
        cat.failures.push({ name: a.fullName, messages: a.failureMessages });
      }
    }
  }
}

// ── Compute totals ──────────────────────────────────────────────────

const totalTests = results.numTotalTests;
const passedTests = results.numPassedTests;
const failedTests = results.numFailedTests;
const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : '0.0';
const totalDuration = results.testResults.reduce(
  (sum, tr) => sum + (tr.endTime - tr.startTime), 0
);
const durationSec = (totalDuration / 1000).toFixed(2);
const verdict = failedTests === 0 ? 'PASS' : 'FAIL';
const now = new Date().toISOString().replace('T', ' ').replace(/\.\d+Z/, ' UTC');

// ── Stdout report ───────────────────────────────────────────────────

const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

const icon = failedTests === 0 ? green('✅') : red('❌');
const passColor = failedTests === 0 ? green : red;

console.log('');
console.log(bold(`  ┌${'─'.repeat(45)}┐`));
console.log(bold(`  │  EVAL REPORT — snap-squad v${pkg.version}${' '.repeat(Math.max(0, 14 - pkg.version.length))}│`));
console.log(bold(`  │  ${passColor(`${passedTests}/${totalTests} passing (${passRate}%)`)}${' '.repeat(Math.max(0, 28 - `${passedTests}/${totalTests} passing (${passRate}%)`.length))}${durationSec}s  │`));
console.log(bold(`  ├${'─'.repeat(45)}┤`));

// Sort: Charter, Routing first; then alphabetical
const sortOrder = ['Charter Evals', 'Routing Evals', 'Hook Chain', 'Hook Chain Dispatch'];
const sorted = [...categories.entries()].sort(([a], [b]) => {
  const ia = sortOrder.indexOf(a);
  const ib = sortOrder.indexOf(b);
  if (ia !== -1 && ib !== -1) return ia - ib;
  if (ia !== -1) return -1;
  if (ib !== -1) return 1;
  return a.localeCompare(b);
});

for (const [name, cat] of sorted) {
  const status = cat.failed === 0 ? green('✅') : red('❌');
  const count = `${cat.passed}/${cat.total}`;
  const pad = ' '.repeat(Math.max(0, 30 - name.length - count.length));
  console.log(`  │  ${name}${pad}${count}   ${status}  │`);
}

console.log(bold(`  ├${'─'.repeat(45)}┤`));
console.log(bold(`  │  LKG → evals/REPORT.md${' '.repeat(20)}│`));
console.log(bold(`  │  Verdict: ${passColor(verdict)} ${icon}${' '.repeat(Math.max(0, 30 - verdict.length))}│`));
console.log(bold(`  └${'─'.repeat(45)}┘`));
console.log('');

// Print failures if any
if (failedTests > 0) {
  console.log(red(bold('  FAILURES:')));
  for (const [name, cat] of sorted) {
    for (const f of cat.failures) {
      console.log(red(`  ✗ ${f.name}`));
      for (const msg of f.messages) {
        console.log(dim(`    ${msg.split('\n')[0]}`));
      }
    }
  }
  console.log('');
}

// ── Markdown report ─────────────────────────────────────────────────

let md = `# Eval Report — snap-squad v${pkg.version}

> Last Known Good (LKG) — generated ${now}

## Summary

| Metric | Value |
|--------|-------|
| Version | ${pkg.version} |
| Total tests | ${totalTests} |
| Passed | ${passedTests} |
| Failed | ${failedTests} |
| Pass rate | ${passRate}% |
| Duration | ${durationSec}s |
| Verdict | **${verdict}** ${failedTests === 0 ? '✅' : '❌'} |

## Results by Category

| Category | Passed | Total | Status |
|----------|-------:|------:|--------|
`;

for (const [name, cat] of sorted) {
  const status = cat.failed === 0 ? '✅' : '❌';
  md += `| ${name} | ${cat.passed} | ${cat.total} | ${status} |\n`;
}

md += `
## Charter Quality Evals

Grades quality, tone, and correctness of generated charters.

| Grounding Source | Agent | Style |
|-----------------|-------|-------|
| Azure-Samples READMEs, Pamela Fox repos/blog | DevRel | Direct, scannable, no fluff, test-before-document |
| Azure Functions samples (5 languages), Bicep IaC | Coder | Precise, security-conscious, gpt-5.4-mini model floor |
| git-for-pms how-was-this-built.md | Scribe | Narrative, timestamps, Level-Ups, honest about failures |

`;

// Add charter eval details
const charterCat = categories.get('Charter Evals');
if (charterCat) {
  md += `### Charter Test Details\n\n`;
  // Group by agent (DevRel, Coder, Scribe)
  const charterFile = results.testResults.find(tr => basename(tr.name, '.test.ts') === 'charter-evals');
  if (charterFile) {
    const agents = new Map();
    for (const a of charterFile.assertionResults) {
      if (a.ancestorTitles.slice(1).some(t => /^Routing/i.test(t))) continue;
      const agent = a.ancestorTitles.find(t => /DevRel|Coder|Scribe/.test(t)) || 'Other';
      if (!agents.has(agent)) agents.set(agent, []);
      agents.get(agent).push(a);
    }
    for (const [agent, tests] of agents) {
      const passed = tests.filter(t => t.status === 'passed').length;
      const status = passed === tests.length ? '✅' : '❌';
      md += `**${agent}** — ${passed}/${tests.length} ${status}\n\n`;
      for (const t of tests) {
        const icon = t.status === 'passed' ? '✅' : '❌';
        md += `- ${icon} ${t.title}\n`;
      }
      md += '\n';
    }
  }
}

// Add routing eval details
const routingCat = categories.get('Routing Evals');
if (routingCat) {
  md += `## Routing Dispatch Evals\n\n`;
  md += `Tests that secondary agents (DevRel, Scribe, Evaluator) are explicitly wired into dispatch instructions.\n\n`;
  const charterFile = results.testResults.find(tr => basename(tr.name, '.test.ts') === 'charter-evals');
  if (charterFile) {
    const groups = new Map();
    for (const a of charterFile.assertionResults) {
      if (!a.ancestorTitles.slice(1).some(t => /^Routing/i.test(t))) continue;
      const group = a.ancestorTitles.find(t => /^Routing/i.test(t)) || 'Routing';
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(a);
    }
    for (const [group, tests] of groups) {
      const passed = tests.filter(t => t.status === 'passed').length;
      const status = passed === tests.length ? '✅' : '❌';
      md += `**${group}** — ${passed}/${tests.length} ${status}\n\n`;
      for (const t of tests) {
        const icon = t.status === 'passed' ? '✅' : '❌';
        md += `- ${icon} ${t.title}\n`;
      }
      md += '\n';
    }
  }
}

// Failures section
if (failedTests > 0) {
  md += `## Failures\n\n`;
  for (const [name, cat] of sorted) {
    for (const f of cat.failures) {
      md += `### ❌ ${f.name}\n\n`;
      for (const msg of f.messages) {
        md += `\`\`\`\n${msg}\n\`\`\`\n\n`;
      }
    }
  }
}

md += `---\n\n*Generated by \`npm run eval\` — commit this file as the LKG baseline.*\n`;

// Write report
if (!existsSync('evals')) mkdirSync('evals', { recursive: true });
writeFileSync('evals/REPORT.md', md);

// Exit with failure code if tests failed
if (failedTests > 0) process.exit(1);
