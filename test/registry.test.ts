import { describe, it, expect } from 'vitest';
import { loadPreset, listPresets } from '../src/registry/loader.js';

describe('Registry Loader', () => {
  it('lists all presets', () => {
    const presets = listPresets();
    expect(presets).toContain('default');
    expect(presets).toContain('fast');
    expect(presets).toContain('mentors');
    expect(presets).toContain('specialists');
    expect(presets.length).toBe(4);
  });

  it('loads the default preset', () => {
    const preset = loadPreset('default');
    expect(preset.name).toBe('default');
    expect(preset.displayName).toBe('The Default Squad');
    expect(preset.agents.length).toBeGreaterThan(0);
    expect(preset.routing.rules.length).toBeGreaterThan(0);
  });

  it('loads the fast preset', () => {
    const preset = loadPreset('fast');
    expect(preset.name).toBe('fast');
    expect(preset.vibe).toBe('speed');
  });

  it('loads the mentors preset', () => {
    const preset = loadPreset('mentors');
    expect(preset.name).toBe('mentors');
    expect(preset.vibe).toBe('mentor');
  });

  it('loads the specialists preset', () => {
    const preset = loadPreset('specialists');
    expect(preset.name).toBe('specialists');
    expect(preset.skills.length).toBeGreaterThan(0);
  });

  it('throws on unknown preset', () => {
    expect(() => loadPreset('nonexistent')).toThrow('not found');
  });
});
