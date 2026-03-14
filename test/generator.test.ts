import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
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

  it('generates all expected files for neighbors preset', () => {
    const preset = loadPreset('neighbors');
    const created = generateSquad({
      targetDir: tempDir,
      preset,
      projectName: 'test-project',
      owner: 'testuser',
    });

    // Core .squad/ files
    expect(created).toContain('.squad/team.md');
    expect(created).toContain('.squad/routing.md');
    expect(created).toContain('.squad/decisions.md');
    expect(created).toContain('.squad/mcp-config.md');

    // Hook chain
    expect(created).toContain('AGENTS.md');
    expect(created).toContain('CLAUDE.md');
    expect(created).toContain('.github/copilot-instructions.md');

    // Agent charters
    for (const agent of preset.agents) {
      expect(created).toContain(`.squad/agents/${agent.name.toLowerCase()}/charter.md`);
    }

    // Verify files exist on disk
    expect(existsSync(join(tempDir, '.squad', 'team.md'))).toBe(true);
    expect(existsSync(join(tempDir, 'AGENTS.md'))).toBe(true);
    expect(existsSync(join(tempDir, 'CLAUDE.md'))).toBe(true);
    expect(existsSync(join(tempDir, '.github', 'copilot-instructions.md'))).toBe(true);
  });

  it('team.md contains project context', () => {
    const preset = loadPreset('neighbors');
    generateSquad({
      targetDir: tempDir,
      preset,
      projectName: 'my-app',
      owner: 'alice',
    });

    const teamMd = readFileSync(join(tempDir, '.squad', 'team.md'), 'utf-8');
    expect(teamMd).toContain('alice');
    expect(teamMd).toContain('The Neighbors');
    expect(teamMd).toContain('Blueprint');
  });

  it('hook chain files reference .squad/', () => {
    const preset = loadPreset('dash');
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

  it('generates skill references for artisans', () => {
    const preset = loadPreset('artisans');
    generateSquad({ targetDir: tempDir, preset });

    const mcpMd = readFileSync(join(tempDir, '.squad', 'mcp-config.md'), 'utf-8');
    expect(mcpMd).toContain('postgres-toolbox');
    expect(mcpMd).toContain('security-scanner');
  });
});
