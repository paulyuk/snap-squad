import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { loadPreset, listPresets } from '../src/registry/loader.js';
import { generateSquad } from '../src/generator/index.js';

/**
 * Validation tests — preset schema, charter quality, input sanitization, generated output integrity.
 * Covers proposals: p0-preset-validation, p1-charter-quality, p1-input-sanitization, p1-dry-presets
 */
describe('Preset Schema Validation', () => {
  it('all presets have required top-level fields', () => {
    for (const name of listPresets()) {
      const preset = loadPreset(name);
      expect(preset.name, `${name}: missing name`).toBeTruthy();
      expect(preset.displayName, `${name}: missing displayName`).toBeTruthy();
      expect(preset.description, `${name}: missing description`).toBeTruthy();
      expect(preset.vibe, `${name}: missing vibe`).toBeTruthy();
      expect(preset.theme, `${name}: missing theme`).toBeTruthy();
    }
  });

  it('all presets have at least 3 agents (except dash)', () => {
    for (const name of listPresets()) {
      const preset = loadPreset(name);
      if (name === 'fast') {
        expect(preset.agents.length).toBeGreaterThanOrEqual(2);
      } else {
        expect(preset.agents.length, `${name}: fewer than 3 agents`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('every agent has name, role, description, expertise, style, voice', () => {
    for (const name of listPresets()) {
      const preset = loadPreset(name);
      for (const agent of preset.agents) {
        expect(agent.name, `${name}/${agent.name}: missing name`).toBeTruthy();
        expect(agent.role, `${name}/${agent.name}: missing role`).toBeTruthy();
        expect(agent.description, `${name}/${agent.name}: missing description`).toBeTruthy();
        expect(agent.expertise?.length, `${name}/${agent.name}: empty expertise`).toBeGreaterThan(0);
        expect(agent.style, `${name}/${agent.name}: missing style`).toBeTruthy();
        expect(agent.voice, `${name}/${agent.name}: missing voice`).toBeTruthy();
      }
    }
  });

  it('routing defaultAgent exists in agents list', () => {
    for (const name of listPresets()) {
      const preset = loadPreset(name);
      const agentNames = preset.agents.map(a => a.name);
      expect(agentNames, `${name}: defaultAgent "${preset.routing.defaultAgent}" not in agents`).toContain(preset.routing.defaultAgent);
    }
  });

  it('every routing rule references an existing agent', () => {
    for (const name of listPresets()) {
      const preset = loadPreset(name);
      const agentNames = preset.agents.map(a => a.name);
      for (const rule of preset.routing.rules) {
        expect(agentNames, `${name}: routing rule "${rule.pattern}" references unknown agent "${rule.agent}"`).toContain(rule.agent);
      }
    }
  });

  it('no duplicate agent names within a preset', () => {
    for (const name of listPresets()) {
      const preset = loadPreset(name);
      const names = preset.agents.map(a => a.name);
      const unique = new Set(names);
      expect(unique.size, `${name}: duplicate agent names`).toBe(names.length);
    }
  });
});

describe('Generated Charter Quality', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'snap-squad-quality-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('all presets generate well-formed charters with required sections', () => {
    for (const name of listPresets()) {
      const preset = loadPreset(name);
      generateSquad({ targetDir: tempDir, preset, projectName: 'test', owner: 'tester' });

      for (const agent of preset.agents) {
        const charterPath = join(tempDir, '.squad', 'agents', agent.name.toLowerCase(), 'charter.md');
        expect(existsSync(charterPath), `${name}/${agent.name}: charter.md missing`).toBe(true);

        const content = readFileSync(charterPath, 'utf-8');
        expect(content, `${name}/${agent.name}: charter missing Identity section`).toContain('## Identity');
        expect(content, `${name}/${agent.name}: charter missing Voice section`).toContain('## Voice');
        expect(content, `${name}/${agent.name}: charter missing agent name`).toContain(agent.name);
        expect(content, `${name}/${agent.name}: charter missing role`).toContain(agent.role);
      }

      // Clean up for next preset
      rmSync(tempDir, { recursive: true, force: true });
      tempDir = mkdtempSync(join(tmpdir(), 'snap-squad-quality-'));
    }
  });

  it('team.md agent count matches preset agent count', () => {
    for (const name of listPresets()) {
      const preset = loadPreset(name);
      generateSquad({ targetDir: tempDir, preset });

      const teamMd = readFileSync(join(tempDir, '.squad', 'team.md'), 'utf-8');
      for (const agent of preset.agents) {
        expect(teamMd, `${name}: team.md missing agent ${agent.name}`).toContain(agent.name);
      }

      rmSync(tempDir, { recursive: true, force: true });
      tempDir = mkdtempSync(join(tmpdir(), 'snap-squad-quality-'));
    }
  });

  it('routing.md contains all routing rules', () => {
    for (const name of listPresets()) {
      const preset = loadPreset(name);
      generateSquad({ targetDir: tempDir, preset });

      const routingMd = readFileSync(join(tempDir, '.squad', 'routing.md'), 'utf-8');
      for (const rule of preset.routing.rules) {
        expect(routingMd, `${name}: routing.md missing pattern "${rule.pattern}"`).toContain(rule.pattern);
        expect(routingMd, `${name}: routing.md missing agent "${rule.agent}"`).toContain(rule.agent);
      }

      rmSync(tempDir, { recursive: true, force: true });
      tempDir = mkdtempSync(join(tmpdir(), 'snap-squad-quality-'));
    }
  });

  it('JOURNAL.md is generated with preset info', () => {
    const preset = loadPreset('default');
    generateSquad({ targetDir: tempDir, preset, projectName: 'journal-test' });

    const journal = readFileSync(join(tempDir, 'JOURNAL.md'), 'utf-8');
    expect(journal).toContain('JOURNAL.md');
    expect(journal).toContain('Build Story');
    expect(journal).toContain(preset.displayName);
  });
});

describe('Input Sanitization', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'snap-squad-sanitize-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('special characters in owner are escaped in generated files', () => {
    const preset = loadPreset('default');
    generateSquad({ targetDir: tempDir, preset, owner: '**bold** [link](http://evil.com)' });

    const teamMd = readFileSync(join(tempDir, '.squad', 'team.md'), 'utf-8');
    // Should not contain raw markdown bold or links
    expect(teamMd).not.toContain('**bold**');
    expect(teamMd).not.toContain('[link]');
  });

  it('special characters in projectName are escaped', () => {
    const preset = loadPreset('fast');
    generateSquad({ targetDir: tempDir, preset, projectName: '`code` *italic*' });

    const agentsMd = readFileSync(join(tempDir, 'AGENTS.md'), 'utf-8');
    expect(agentsMd).not.toContain('`code`');
    expect(agentsMd).not.toContain('*italic*');
  });

  it('empty owner shows "unknown" not crash', () => {
    const preset = loadPreset('default');
    generateSquad({ targetDir: tempDir, preset });

    const teamMd = readFileSync(join(tempDir, '.squad', 'team.md'), 'utf-8');
    expect(teamMd).toContain('unknown');
  });
});
