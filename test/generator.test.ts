import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { loadPreset } from '../src/registry/loader.js';
import { generateSquad } from '../src/generator/index.js';

describe('Generator', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'snap-squad-test-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('generates all expected files for default preset', () => {
    const preset = loadPreset('default');
    const result = generateSquad({
      targetDir: tempDir,
      preset,
      projectName: 'test-project',
      owner: 'testuser',
    });

    expect(result.skipped).toEqual([]);

    // Core .squad/ files
    expect(result.written).toContain('.squad/team.md');
    expect(result.written).toContain('.squad/routing.md');
    expect(result.written).toContain('.squad/decisions.md');
    expect(result.written).toContain('.squad/mcp-config.md');

    // Hook chain
    expect(result.written).toContain('AGENTS.md');
    expect(result.written).toContain('CLAUDE.md');
    expect(result.written).toContain('.github/copilot-instructions.md');

    // Agent charters
    for (const agent of preset.agents) {
      expect(result.written).toContain(`.squad/agents/${agent.name.toLowerCase()}/charter.md`);
    }

    // Verify files exist on disk
    expect(existsSync(join(tempDir, '.squad', 'team.md'))).toBe(true);
    expect(existsSync(join(tempDir, 'AGENTS.md'))).toBe(true);
    expect(existsSync(join(tempDir, 'CLAUDE.md'))).toBe(true);
    expect(existsSync(join(tempDir, '.github', 'copilot-instructions.md'))).toBe(true);
  });

  it('team.md contains project context', () => {
    const preset = loadPreset('default');
    generateSquad({
      targetDir: tempDir,
      preset,
      projectName: 'my-app',
      owner: 'alice',
    });

    const teamMd = readFileSync(join(tempDir, '.squad', 'team.md'), 'utf-8');
    expect(teamMd).toContain('alice');
    expect(teamMd).toContain('The Default Squad');
    expect(teamMd).toContain('Blueprint');
  });

  it('hook chain files reference .squad/', () => {
    const preset = loadPreset('fast');
    generateSquad({ targetDir: tempDir, preset });

    const agentsMd = readFileSync(join(tempDir, 'AGENTS.md'), 'utf-8');
    expect(agentsMd).toContain('.squad/team.md');
    expect(agentsMd).toContain('.squad/routing.md');

    const claudeMd = readFileSync(join(tempDir, 'CLAUDE.md'), 'utf-8');
    expect(claudeMd).toContain('.squad/team.md');
    expect(claudeMd).toContain('.squad/decisions.md');

    const copilotMd = readFileSync(
      join(tempDir, '.github', 'copilot-instructions.md'),
      'utf-8'
    );
    expect(copilotMd).toContain('AGENTS.md');
    expect(copilotMd).toContain('.squad/team.md');
  });

  it('preserves content files during structural overwrite mode', () => {
    generateSquad({ targetDir: tempDir, preset: loadPreset('default') });

    const decisionsPath = join(tempDir, '.squad', 'decisions.md');
    const journalPath = join(tempDir, 'JOURNAL.md');
    writeFileSync(decisionsPath, '# custom decisions\n\nDo not erase this.\n');
    writeFileSync(journalPath, '# custom journal\n\nDo not erase this either.\n');

    const result = generateSquad({
      targetDir: tempDir,
      preset: loadPreset('fast'),
      overwriteMode: 'structural',
    });

    expect(result.skipped).toEqual(['.squad/decisions.md', 'JOURNAL.md']);
    expect(readFileSync(join(tempDir, '.squad', 'team.md'), 'utf-8')).toContain('Turbo');
    expect(readFileSync(decisionsPath, 'utf-8')).toContain('Do not erase this.');
    expect(readFileSync(journalPath, 'utf-8')).toContain('Do not erase this either.');
  });

  it('reset-all overwrite mode replaces content files too', () => {
    generateSquad({ targetDir: tempDir, preset: loadPreset('default') });

    const decisionsPath = join(tempDir, '.squad', 'decisions.md');
    const journalPath = join(tempDir, 'JOURNAL.md');
    writeFileSync(decisionsPath, '# custom decisions\n\nReset me.\n');
    writeFileSync(journalPath, '# custom journal\n\nReset me too.\n');

    const result = generateSquad({
      targetDir: tempDir,
      preset: loadPreset('fast'),
      overwriteMode: 'all',
    });

    expect(result.skipped).toEqual([]);
    expect(readFileSync(decisionsPath, 'utf-8')).toContain('"fast" preset');
    expect(readFileSync(decisionsPath, 'utf-8')).not.toContain('Reset me.');
    expect(readFileSync(journalPath, 'utf-8')).toContain('Fast Squad');
    expect(readFileSync(journalPath, 'utf-8')).not.toContain('Reset me too.');
  });

  it('generates skill references for specialists', () => {
    const preset = loadPreset('specialists');
    generateSquad({ targetDir: tempDir, preset });

    const mcpMd = readFileSync(join(tempDir, '.squad', 'mcp-config.md'), 'utf-8');
    expect(mcpMd).toContain('postgres-toolbox');
    expect(mcpMd).toContain('security-scanner');
    expect(mcpMd).toContain('sensei');
    expect(mcpMd).toContain('waza');
  });
});
