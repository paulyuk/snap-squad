import { describe, it, expect } from 'vitest';
import { matchPreset } from '../src/matcher.js';

/**
 * Edge-case and false-positive analysis for the keyword matcher.
 *
 * Key insight: ANY non-zero score beats default when no default keywords are
 * present.  Weight-2 keywords like "review", "ui", "logs", "why" will claim
 * their preset even when used casually.  These tests document actual behavior
 * so regressions (or intentional fixes) are caught.
 */
describe('Edge Cases & Potential False Positives', () => {
  describe('LOW-WEIGHT KEYWORDS (weight 2) — win when alone', () => {
    it('review (mentors, weight 2) wins with no competing keywords', () => {
      // NOTE: arguably a false positive — "code review" is routine, not mentoring
      expect(matchPreset('code review').preset).toBe('mentors');
      expect(matchPreset('peer review').preset).toBe('mentors');
      expect(matchPreset('review the architecture').preset).toBe('mentors');
    });

    it('ui (specialists, weight 2) wins when alone', () => {
      expect(matchPreset('ui design').preset).toBe('specialists');
      expect(matchPreset('build ui').preset).toBe('specialists'); // ui(2) > build(1)
      expect(matchPreset('ui development').preset).toBe('specialists');
    });

    it('deep (specialists, weight 2) wins when alone', () => {
      expect(matchPreset('deep work').preset).toBe('specialists');
      expect(matchPreset('deep dive').preset).toBe('specialists');
      // stacks with higher-weight keyword
      expect(matchPreset('infrastructure deep').preset).toBe('specialists');
    });

    it('logs (specialists, weight 2) wins when alone', () => {
      // NOTE: arguably a false positive — "check the logs" is routine
      expect(matchPreset('check the logs').preset).toBe('specialists');
      expect(matchPreset('logs and metrics').preset).toBe('specialists');
      expect(matchPreset('logs').preset).toBe('specialists');
    });

    it('baseline (specialists, weight 2) wins when alone', () => {
      // NOTE: "establish baseline" could be a default-tier task
      expect(matchPreset('establish baseline').preset).toBe('specialists');
      expect(matchPreset('baseline tests').preset).toBe('specialists');
      expect(matchPreset('baseline').preset).toBe('specialists');
    });

    it('why (mentors, weight 2) wins when alone', () => {
      // NOTE: "why is this happening" sounds like debugging, not mentoring
      expect(matchPreset('why is this happening').preset).toBe('mentors');
      expect(matchPreset('why').preset).toBe('mentors');
      expect(matchPreset('the why').preset).toBe('mentors');
    });
  });

  describe('AMBIGUOUS KEYWORDS — actual routing behavior', () => {
    it('demo (fast, weight 3) always pushes fast', () => {
      expect(matchPreset('demo').preset).toBe('fast');
      expect(matchPreset('build a demo').preset).toBe('fast'); // demo(3) > build(1)
      expect(matchPreset('demo for client').preset).toBe('fast');
      expect(matchPreset('demo application').preset).toBe('fast');
    });

    it('review routes to mentors even in non-mentoring context', () => {
      expect(matchPreset('code review').preset).toBe('mentors');
      expect(matchPreset('review quality').preset).toBe('mentors');
    });

    it('performance routes to specialists', () => {
      expect(matchPreset('performance optimization').preset).toBe('specialists');
      expect(matchPreset('improve performance').preset).toBe('specialists');
      expect(matchPreset('high performance').preset).toBe('specialists');
    });

    it('fast vs performance tie — fast wins (first scored)', () => {
      // Both score 3 for their preset; fast wins the tie by iteration order
      const match = matchPreset('fast performance');
      expect(match.preset).toBe('fast');
    });
  });

  describe('CONFLICTING KEYWORD COMBINATIONS', () => {
    it('demo + database — specialists wins on weight', () => {
      // postgres(5) + database(4) = 9 vs demo(3)
      expect(matchPreset('demo postgres database').preset).toBe('specialists');
      // database(4) vs demo(3)
      expect(matchPreset('database demo').preset).toBe('specialists');
    });

    it('fast + database — specialists wins on weight', () => {
      // database(4) for specialists vs fast(3) for fast
      const match = matchPreset('fast database work');
      expect(match.preset).toBe('specialists');
    });
  });

  describe('GENERIC KEYWORDS (weight 1) — easily overridden', () => {
    it('build, project, app alone route to default', () => {
      expect(matchPreset('build').preset).toBe('default');
      expect(matchPreset('project').preset).toBe('default');
      expect(matchPreset('app').preset).toBe('default');
    });

    it('generic keywords lose to any higher-weight keyword', () => {
      expect(matchPreset('build fast').preset).toBe('fast');
      expect(matchPreset('app database').preset).toBe('specialists');
      // "learning" does NOT match keyword "learn" (word boundary)
      expect(matchPreset('project learning').preset).toBe('default');
    });
  });

  describe('WEIGHT STACKING', () => {
    it('multiple fast keywords accumulate', () => {
      const match = matchPreset('mvp demo');
      expect(match.preset).toBe('fast');
      expect(match.score).toBe(7); // mvp(4) + demo(3)
    });

    it('infrastructure (3) + deep (2) stack to specialists', () => {
      const match = matchPreset('deep infrastructure work');
      expect(match.preset).toBe('specialists');
      expect(match.score).toBe(5);
    });
  });
});
