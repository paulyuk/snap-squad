import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { loadPreset } from '../src/registry/loader.js';
import { generateSquad } from '../src/generator/index.js';

/**
 * Hook Chain Validation
 *
 * These tests verify that generated hook chain files (AGENTS.md, CLAUDE.md,
 * copilot-instructions.md) contain the required enforcement sections that
 * make squad routing visible and non-optional.
 *
 * If these tests fail, AI agents using this squad will silently ignore
 * squad routing — the #1 bug we're preventing.
 */

const PRESETS = ['default', 'fast', 'mentors', 'specialists'] as const;

describe('Hook Chain: squad enforcement is present in generated files', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'snap-squad-hook-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  function generateAndRead(presetKey: string) {
    const preset = loadPreset(presetKey);
    generateSquad({ targetDir: tempDir, preset, projectName: 'test', owner: 'test' });
    return {
      agents: readFileSync(join(tempDir, 'AGENTS.md'), 'utf-8'),
      claude: readFileSync(join(tempDir, 'CLAUDE.md'), 'utf-8'),
      copilot: readFileSync(join(tempDir, '.github', 'copilot-instructions.md'), 'utf-8'),
      routing: readFileSync(join(tempDir, '.squad', 'routing.md'), 'utf-8'),
      team: readFileSync(join(tempDir, '.squad', 'team.md'), 'utf-8'),
    };
  }

  describe('AGENTS.md — primary hook', () => {
    for (const preset of PRESETS) {
      describe(`preset: ${preset}`, () => {
        it('contains Response Format section with role tag requirement', () => {
          const { agents } = generateAndRead(preset);
          expect(agents).toContain('## Response Format (Non-Optional)');
          expect(agents).toContain('**[');  // role tag example
          expect(agents).toContain('Every substantive response MUST begin by stating your active squad role');
        });

        it('contains Always-On Duties with enforcement language', () => {
          const { agents } = generateAndRead(preset);
          expect(agents).toContain('## Always-On Duties');
          expect(agents).toContain('standing orders');
          expect(agents).toContain('Code changed → check tests');
          expect(agents).toContain('Behavior changed → check docs');
          expect(agents).toContain('Decision made → log it');
          expect(agents).toContain('Milestone reached → journal it');
        });

        it('contains completion gate checklist', () => {
          const { agents } = generateAndRead(preset);
          expect(agents).toContain('Before You Say "Done"');
          expect(agents).toContain('decisions.md');
          expect(agents).toContain('JOURNAL.md');
        });

        it('contains session start checklist', () => {
          const { agents } = generateAndRead(preset);
          expect(agents).toContain('Session Start');
          expect(agents).toContain('routing.md');
          expect(agents).toContain('Identify your role');
        });

        it('has no stale creative agent names in enforcement sections', () => {
          const { agents } = generateAndRead(preset);
          const staleNames = ['Blueprint', 'Wrench', 'Lens', 'Quill', 'Mosaic', 'Relay', ' Val ', 'Ledger'];
          for (const name of staleNames) {
            expect(agents).not.toContain(name);
          }
        });

        it('quick reference table uses only functional names', () => {
          const { agents } = generateAndRead(preset);
          // Table should be present with agent entries
          expect(agents).toContain('## Quick Reference');
          expect(agents).toContain('| Agent | Role |');
          // Should NOT contain old creative names
          const creativeNames = ['| Blueprint', '| Wrench', '| Lens', '| Quill', '| Mosaic', '| Relay', '| Val |', '| Ledger'];
          for (const name of creativeNames) {
            expect(agents).not.toContain(name);
          }
        });
      });
    }
  });

  describe('CLAUDE.md — session memory hook', () => {
    for (const preset of PRESETS) {
      it(`${preset}: contains role tag instruction in session start`, () => {
        const { claude } = generateAndRead(preset);
        expect(claude).toContain('Session Start Protocol');
        expect(claude).toContain('role tag');
      });

      it(`${preset}: contains session completion gate`, () => {
        const { claude } = generateAndRead(preset);
        expect(claude).toContain('Session Completion Gate');
        expect(claude).toContain('decisions.md');
        expect(claude).toContain('JOURNAL.md');
      });

      it(`${preset}: contains non-optional operating behaviors`, () => {
        const { claude } = generateAndRead(preset);
        expect(claude).toContain('Non-Optional Operating Behaviors');
        expect(claude).toContain('Code changed → tests reviewed');
      });
    }
  });

  describe('copilot-instructions.md — VS Code / Copilot hook', () => {
    for (const preset of PRESETS) {
      it(`${preset}: contains role tag instruction in squad-aware behavior`, () => {
        const { copilot } = generateAndRead(preset);
        expect(copilot).toContain('Squad-Aware Behavior');
        expect(copilot).toContain('role tag');
      });

      it(`${preset}: contains proactive quality triggers`, () => {
        const { copilot } = generateAndRead(preset);
        expect(copilot).toContain('Proactive Quality Triggers');
        expect(copilot).toContain('Code changed');
      });

      it(`${preset}: contains completion verification`, () => {
        const { copilot } = generateAndRead(preset);
        expect(copilot).toMatch(/Before You Respond With "Done"/);
      });
    }
  });

  describe('routing.md — work routing', () => {
    for (const preset of PRESETS) {
      it(`${preset}: maps work types to agents`, () => {
        const { routing } = generateAndRead(preset);
        expect(routing).toContain('Work Type');
        expect(routing).toContain('Agent');
        // All presets should route architecture
        expect(routing).toMatch(/architecture\s*\|/);
      });

      it(`${preset}: contains routing principles`, () => {
        const { routing } = generateAndRead(preset);
        expect(routing).toContain('Routing Principles');
      });
    }
  });

  describe('cross-file consistency', () => {
    it('all three hook files reference the same squad name', () => {
      const { agents, claude, copilot } = generateAndRead('default');
      expect(agents).toContain('The Default Squad');
      expect(claude).toContain('The Default Squad');
      expect(copilot).toContain('The Default Squad');
    });

    it('role tag format is consistent across hooks', () => {
      const { agents, claude, copilot } = generateAndRead('default');
      // All should reference the role tag concept
      expect(agents).toContain('[');
      expect(claude).toContain('role tag');
      expect(copilot).toContain('role tag');
    });
  });

  describe('team.md — no duplicates or title bugs', () => {
    for (const preset of PRESETS) {
      it(`${preset}: title is not duplicated when no projectName`, () => {
        const p = loadPreset(preset);
        // Regenerate without projectName to test default title
        rmSync(tempDir, { recursive: true, force: true });
        const { mkdtempSync: mktemp } = require('node:fs');
        const newDir = mktemp(require('node:path').join(require('node:os').tmpdir(), 'snap-squad-team-'));
        generateSquad({ targetDir: newDir, preset: p, owner: 'test' });
        const team = readFileSync(require('node:path').join(newDir, '.squad', 'team.md'), 'utf-8');
        const title = team.split('\n')[0];
        // Title should NOT have "X — X" pattern (duplicated name)
        const parts = title.replace('# ', '').split(' — ');
        if (parts.length > 1) {
          expect(parts[0]).not.toEqual(parts[1]);
        }
        rmSync(newDir, { recursive: true, force: true });
      });

      it(`${preset}: no agent appears twice in members table`, () => {
        const { team } = generateAndRead(preset);
        const memberLines = team.split('\n').filter((l: string) => l.startsWith('| ') && l.includes('charter.md'));
        const names = memberLines.map((l: string) => l.split('|')[1].trim());
        const unique = new Set(names);
        expect(names.length).toBe(unique.size);
      });
    }
  });
});
