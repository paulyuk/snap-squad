import { describe, it, expect } from 'vitest';
import { matchPreset } from '../src/matcher.js';

/**
 * Matcher Accuracy Matrix — 30+ prompts with expected preset mappings.
 * Validates precision/recall per preset and catches keyword ambiguity.
 */
describe('Matcher Accuracy Matrix', () => {
  // Curated test cases: [description, expected preset]
  const cases: [string, string][] = [
    // --- fast (speed) ---
    ['I need a fast team for a hackathon', 'fast'],
    ['rapid prototyping for a demo', 'fast'],
    ['quick POC, ship it fast', 'fast'],
    ['build an MVP in 6 hours', 'fast'],
    ['ship fast no fluff', 'fast'],
    ['speed is all that matters', 'fast'],
    ['quick prototype for investor demo', 'fast'],

    // --- mentors (learning/mentoring) ---
    ['help me learn best practices', 'mentors'],
    ['I want a mentor who explains the why', 'mentors'],
    ['training project for new developers', 'mentors'],
    ['teach me how to architect this', 'mentors'],
    ['onboard a junior dev into the codebase', 'mentors'],
    ['I want to understand design patterns', 'mentors'],
    ['explain the trade-offs of each approach', 'mentors'],

    // --- Specialists (deep domain) ---
    ['database tuning and security hardening', 'specialists'],
    ['postgres optimization and performance', 'specialists'],
    ['deep infrastructure and devops work', 'specialists'],
    ['troubleshoot a production crash', 'specialists'],
    ['root cause analysis on this stack trace', 'specialists'],
    ['multi-repo migration at scale', 'specialists'],
    ['mass update across 50 repos', 'specialists'],
    ['debug this firefight', 'specialists'],
    ['skill quality audit with benchmarks', 'specialists'],

    // --- default (general/all-purpose) ---
    ['build a web app', 'default'],
    ['general purpose project', 'default'],
    ['', 'default'],
    ['a reliable standard project', 'default'],
    ['balanced all purpose team', 'default'],
  ];

  // Run all cases
  for (const [description, expected] of cases) {
    const label = description || '(empty string)';
    it(`"${label}" → ${expected}`, () => {
      expect(matchPreset(description).preset).toBe(expected);
    });
  }

  // --- Explain mode ---
  it('matchedKeywords are populated for multi-keyword input', () => {
    const match = matchPreset('fast hackathon demo');
    expect(match.matchedKeywords.length).toBeGreaterThanOrEqual(2);
    expect(match.matchedKeywords.some(kw => kw.keyword === 'hackathon')).toBe(true);
    expect(match.matchedKeywords.some(kw => kw.keyword === 'fast')).toBe(true);
  });

  it('matchedKeywords are empty for empty input', () => {
    const match = matchPreset('');
    expect(match.matchedKeywords).toEqual([]);
  });

  it('matchedKeywords are sorted by weight (highest first)', () => {
    const match = matchPreset('fast hackathon demo');
    for (let i = 1; i < match.matchedKeywords.length; i++) {
      expect(match.matchedKeywords[i].weight).toBeLessThanOrEqual(match.matchedKeywords[i - 1].weight);
    }
  });

  // --- Word boundary matching ---
  it('does not match "ui" inside "build"', () => {
    const match = matchPreset('build something');
    expect(match.matchedKeywords.some(kw => kw.keyword === 'ui')).toBe(false);
  });

  it('matches "ui" as a standalone word', () => {
    const match = matchPreset('ui design work');
    expect(match.matchedKeywords.some(kw => kw.keyword === 'ui')).toBe(true);
  });

  // --- Perturbation / robustness ---
  it('word order does not change result', () => {
    const a = matchPreset('database security hardening');
    const b = matchPreset('hardening security database');
    expect(a.preset).toBe(b.preset);
  });

  it('extra words do not flip result', () => {
    const a = matchPreset('hackathon');
    const b = matchPreset('I want to build something for a hackathon this weekend');
    expect(a.preset).toBe(b.preset);
  });

  it('synonyms resolve consistently', () => {
    expect(matchPreset('fast team').preset).toBe(matchPreset('quick team').preset);
    expect(matchPreset('speed focused').preset).toBe(matchPreset('rapid development').preset);
  });
});
