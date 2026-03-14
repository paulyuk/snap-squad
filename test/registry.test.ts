import { describe, it, expect } from 'vitest';
import { loadArchetype, listArchetypes } from '../src/registry/loader.js';

describe('Registry Loader', () => {
  it('lists all archetypes', () => {
    const archetypes = listArchetypes();
    expect(archetypes).toContain('neighbors');
    expect(archetypes).toContain('dash');
    expect(archetypes).toContain('sages');
    expect(archetypes).toContain('artisans');
    expect(archetypes.length).toBe(4);
  });

  it('loads the neighbors archetype', () => {
    const arch = loadArchetype('neighbors');
    expect(arch.name).toBe('neighbors');
    expect(arch.displayName).toBe('The Neighbors');
    expect(arch.agents.length).toBeGreaterThan(0);
    expect(arch.routing.rules.length).toBeGreaterThan(0);
  });

  it('loads the dash archetype', () => {
    const arch = loadArchetype('dash');
    expect(arch.name).toBe('dash');
    expect(arch.vibe).toBe('speed');
  });

  it('loads the sages archetype', () => {
    const arch = loadArchetype('sages');
    expect(arch.name).toBe('sages');
    expect(arch.vibe).toBe('mentor');
  });

  it('loads the artisans archetype', () => {
    const arch = loadArchetype('artisans');
    expect(arch.name).toBe('artisans');
    expect(arch.skills.length).toBeGreaterThan(0);
  });

  it('throws on unknown archetype', () => {
    expect(() => loadArchetype('nonexistent')).toThrow('not found');
  });
});
