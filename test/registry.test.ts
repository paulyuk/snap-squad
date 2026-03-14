import { describe, it, expect } from 'vitest';
import { loadPreset, listPresets } from '../src/registry/loader.js';

describe('Registry Loader', () => {
  it('lists all presets', () => {
    const presets = listPresets();
    expect(presets).toContain('neighbors');
    expect(presets).toContain('dash');
    expect(presets).toContain('sages');
    expect(presets).toContain('specialists');
    expect(presets.length).toBe(4);
  });

  it('loads the neighbors preset', () => {
    const preset = loadPreset('neighbors');
    expect(preset.name).toBe('neighbors');
    expect(preset.displayName).toBe('The Neighbors');
    expect(preset.agents.length).toBeGreaterThan(0);
    expect(preset.routing.rules.length).toBeGreaterThan(0);
  });

  it('loads the dash preset', () => {
    const preset = loadPreset('dash');
    expect(preset.name).toBe('dash');
    expect(preset.vibe).toBe('speed');
  });

  it('loads the sages preset', () => {
    const preset = loadPreset('sages');
    expect(preset.name).toBe('sages');
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
