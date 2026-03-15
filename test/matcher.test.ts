import { describe, it, expect } from 'vitest';
import { matchPreset } from '../src/matcher.js';

describe('Matcher', () => {
  it('matches speed keywords to dash', () => {
    expect(matchPreset('I need a fast team for a hackathon').preset).toBe('fast');
    expect(matchPreset('rapid prototyping for a demo').preset).toBe('fast');
    expect(matchPreset('quick POC, ship it fast').preset).toBe('fast');
  });

  it('matches learning keywords to sages', () => {
    expect(matchPreset('help me learn best practices').preset).toBe('mentors');
    expect(matchPreset('I want a mentor who explains the why').preset).toBe('mentors');
    expect(matchPreset('training project for new developers').preset).toBe('mentors');
  });

  it('matches specialist keywords to specialists', () => {
    expect(matchPreset('I need database tuning and security hardening').preset).toBe('specialists');
    expect(matchPreset('postgres optimization and performance').preset).toBe('specialists');
    expect(matchPreset('deep infrastructure and devops work').preset).toBe('specialists');
  });

  it('defaults to default for general descriptions', () => {
    expect(matchPreset('build a web app').preset).toBe('default');
    expect(matchPreset('general purpose project').preset).toBe('default');
    expect(matchPreset('').preset).toBe('default');
  });

  it('returns a reason for the match', () => {
    const match = matchPreset('hackathon project');
    expect(match.why).toBeTruthy();
    expect(match.score).toBeGreaterThan(0);
  });
});
