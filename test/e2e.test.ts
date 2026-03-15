import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'node:child_process';
import { mkdtempSync, rmSync, existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const CLI = join(process.cwd(), 'dist', 'cli.js');

function run(args: string, cwd?: string): string {
  return execSync(`node ${CLI} ${args}`, {
    cwd: cwd || process.cwd(),
    encoding: 'utf-8',
    timeout: 10_000,
  });
}

describe('E2E: snap-squad CLI', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'snap-squad-e2e-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  // --- snap-squad list ---

  it('list shows all 4 presets', () => {
    const output = run('list');
    expect(output).toContain('default');
    expect(output).toContain('fast');
    expect(output).toContain('mentors');
    expect(output).toContain('specialists');
  });

  // --- snap-squad init --type <preset> ---

  it('init --type default creates full .squad/ and hook chain', () => {
    const output = run(`init --type default --dir "${tempDir}" --name test-proj --owner alice`);
    expect(output).toContain('The Default Squad');
    expect(output).toContain('Squad ready');

    // .squad/ core files
    expect(existsSync(join(tempDir, '.squad', 'team.md'))).toBe(true);
    expect(existsSync(join(tempDir, '.squad', 'routing.md'))).toBe(true);
    expect(existsSync(join(tempDir, '.squad', 'decisions.md'))).toBe(true);
    expect(existsSync(join(tempDir, '.squad', 'mcp-config.md'))).toBe(true);

    // Hook chain
    expect(existsSync(join(tempDir, 'AGENTS.md'))).toBe(true);
    expect(existsSync(join(tempDir, 'CLAUDE.md'))).toBe(true);
    expect(existsSync(join(tempDir, '.github', 'copilot-instructions.md'))).toBe(true);

    // Agent charters exist
    const agentsDir = join(tempDir, '.squad', 'agents');
    const agents = readdirSync(agentsDir);
    expect(agents.length).toBeGreaterThanOrEqual(5);

    // Content is correct
    const teamMd = readFileSync(join(tempDir, '.squad', 'team.md'), 'utf-8');
    expect(teamMd).toContain('alice');
    expect(teamMd).toContain('Architect');
    expect(teamMd).toContain('GitOps'); // GitOps agent

    // Hook chain points to .squad/
    const agentsMd = readFileSync(join(tempDir, 'AGENTS.md'), 'utf-8');
    expect(agentsMd).toContain('.squad/team.md');
    expect(agentsMd).toContain('.squad/routing.md');
  });

  it('init --type fast creates speed-focused squad', () => {
    const output = run(`init --type fast --dir "${tempDir}"`);
    expect(output).toContain('Fast Squad');

    const teamMd = readFileSync(join(tempDir, '.squad', 'team.md'), 'utf-8');
    expect(teamMd).toContain('Architect');
    expect(teamMd).toContain('Coder');
  });

  it('init --type specialists includes skill references', () => {
    run(`init --type specialists --dir "${tempDir}"`);

    const mcpMd = readFileSync(join(tempDir, '.squad', 'mcp-config.md'), 'utf-8');
    expect(mcpMd).toContain('postgres-toolbox');
    expect(mcpMd).toContain('security-scanner');
    expect(mcpMd).toContain('sensei');
    expect(mcpMd).toContain('waza');
  });

  // --- Plain English init ---

  it('plain English: "fast hackathon" resolves to fast', () => {
    const output = run(`init fast hackathon project --dir "${tempDir}"`);
    expect(output).toContain('fast');
    expect(output).toContain('Fast Squad');

    expect(existsSync(join(tempDir, '.squad', 'team.md'))).toBe(true);
  });

  it('plain English: "learn best practices" resolves to mentors', () => {
    const output = run(`init help me learn best practices --dir "${tempDir}"`);
    expect(output).toContain('mentors');
    expect(output).toContain('Mentors');
  });

  it('plain English: "database security" resolves to specialists', () => {
    const output = run(`init database security hardening --dir "${tempDir}"`);
    expect(output).toContain('specialists');
    expect(output).toContain('Specialists');
  });

  it('plain English: no description defaults to default', () => {
    const output = run(`init --dir "${tempDir}"`);
    expect(output).toContain('Default Squad');
  });

  // --- Error cases ---

  it('refuses to overwrite existing .squad/ without --force', () => {
    // First init
    run(`init --dir "${tempDir}"`);

    // Second init should fail
    try {
      run(`init --dir "${tempDir}"`);
      expect.unreachable('should have thrown');
    } catch (err: any) {
      expect(err.stderr || err.message).toContain('already exists');
    }
  });

  it('--force overwrites structural files but preserves content files', () => {
    run(`init --type default --dir "${tempDir}"`);
    writeFileSync(join(tempDir, '.squad', 'decisions.md'), '# custom decisions\n\nkeep me\n');
    writeFileSync(join(tempDir, 'JOURNAL.md'), '# custom journal\n\nkeep me too\n');

    const output = run(`init --type fast --dir "${tempDir}" --force`);
    expect(output).toContain('Fast Squad');
    expect(output).toContain('⚠ Skipping .squad/decisions.md (contains user content)');
    expect(output).toContain('⚠ Skipping JOURNAL.md (contains user content)');

    const teamMd = readFileSync(join(tempDir, '.squad', 'team.md'), 'utf-8');
    expect(teamMd).toContain('Architect');
    expect(readFileSync(join(tempDir, '.squad', 'decisions.md'), 'utf-8')).toContain('keep me');
    expect(readFileSync(join(tempDir, 'JOURNAL.md'), 'utf-8')).toContain('keep me too');
  });

  it('--reset-all overwrites content files too', () => {
    run(`init --type default --dir "${tempDir}"`);
    writeFileSync(join(tempDir, '.squad', 'decisions.md'), '# custom decisions\n\nwipe me\n');
    writeFileSync(join(tempDir, 'JOURNAL.md'), '# custom journal\n\nwipe me too\n');

    const output = run(`init --type fast --dir "${tempDir}" --reset-all`);
    expect(output).toContain('Fast Squad');
    expect(output).not.toContain('Skipping JOURNAL.md');

    const decisionsMd = readFileSync(join(tempDir, '.squad', 'decisions.md'), 'utf-8');
    const journalMd = readFileSync(join(tempDir, 'JOURNAL.md'), 'utf-8');
    expect(decisionsMd).toContain('"fast" preset');
    expect(decisionsMd).not.toContain('wipe me');
    expect(journalMd).toContain('Fast Squad');
    expect(journalMd).not.toContain('wipe me too');
  });

  it('invalid preset name shows error', () => {
    try {
      run(`init --type nonexistent --dir "${tempDir}"`);
      expect.unreachable('should have thrown');
    } catch (err: any) {
      expect(err.stderr || err.message).toContain('not found');
    }
  });

  // --- Session awareness verification ---

  it('generated files form a complete squad-aware session', () => {
    run(`init --type default --dir "${tempDir}" --name my-app --owner bob`);

    // AGENTS.md instructs reading .squad/
    const agentsMd = readFileSync(join(tempDir, 'AGENTS.md'), 'utf-8');
    expect(agentsMd).toContain('You Are Part of a Squad');
    expect(agentsMd).toContain('.squad/team.md');
    expect(agentsMd).toContain('.squad/routing.md');
    expect(agentsMd).toContain('.squad/decisions.md');

    // CLAUDE.md has session memory
    const claudeMd = readFileSync(join(tempDir, 'CLAUDE.md'), 'utf-8');
    expect(claudeMd).toContain('You are part of a squad');
    expect(claudeMd).toContain('bob');

    // copilot-instructions.md wires the hook chain
    const copilotMd = readFileSync(join(tempDir, '.github', 'copilot-instructions.md'), 'utf-8');
    expect(copilotMd).toContain('AGENTS.md');
    expect(copilotMd).toContain('CLAUDE.md');
    expect(copilotMd).toContain('.squad/team.md');

    // routing.md has rules
    const routingMd = readFileSync(join(tempDir, '.squad', 'routing.md'), 'utf-8');
    expect(routingMd).toContain('Work Type');
    expect(routingMd).toContain('Routing Principles');

    // decisions.md has initial decision
    const decisionsMd = readFileSync(join(tempDir, '.squad', 'decisions.md'), 'utf-8');
    expect(decisionsMd).toContain('D-001');
    expect(decisionsMd).toContain('default');
  });
});
