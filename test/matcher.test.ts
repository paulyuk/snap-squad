import { describe, it, expect } from 'vitest';
import { matchPreset } from '../src/matcher.js';

describe('Matcher', () => {
  it('matches speed keywords to dash', () => {
    expect(matchPreset('I need a fast team for a hackathon').preset).toBe('dash');
    expect(matchPreset('rapid prototyping for a demo').preset).toBe('dash');
    expect(matchPreset('quick POC, ship it fast').preset).toBe('dash');
  });

  it('matches learning keywords to sages', () => {
    expect(matchPreset('help me learn best practices').preset).toBe('sages');
    expect(matchPreset('I want a mentor who explains the why').preset).toBe('sages');
    expect(matchPreset('training project for new developers').preset).toBe('sages');
  });

  it('matches specialist keywords to artisans', () => {
    expect(matchPreset('I need database tuning and security hardening').preset).toBe('artisans');
    expect(matchPreset('postgres optimization and performance').preset).toBe('artisans');
    expect(matchPreset('deep infrastructure and devops work').preset).toBe('artisans');
  });

  it('defaults to neighbors for general descriptions', () => {
    expect(matchPreset('build a web app').preset).toBe('neighbors');
    expect(matchPreset('general purpose project').preset).toBe('neighbors');
    expect(matchPreset('').preset).toBe('neighbors');
  });

  it('returns a reason for the match', () => {
    const match = matchPreset('hackathon project');
    expect(match.why).toBeTruthy();
    expect(match.score).toBeGreaterThan(0);
  });
});
