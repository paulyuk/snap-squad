import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { loadPreset } from '../src/registry/loader.js';
import { generateSquad } from '../src/generator/index.js';

const PRESETS = ['default', 'fast', 'mentors', 'specialists'] as const;

describe('hook-chain dispatch enforcement', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'snap-squad-hook-dispatch-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  function generateAndRead(presetKey: (typeof PRESETS)[number]) {
    const preset = loadPreset(presetKey);
    generateSquad({ targetDir: tempDir, preset, projectName: 'test', owner: 'test' });

    return {
      agents: readFileSync(join(tempDir, 'AGENTS.md'), 'utf-8'),
      claude: readFileSync(join(tempDir, 'CLAUDE.md'), 'utf-8'),
      copilot: readFileSync(join(tempDir, '.github', 'copilot-instructions.md'), 'utf-8'),
      routing: readFileSync(join(tempDir, '.squad', 'routing.md'), 'utf-8'),
    };
  }

  for (const presetName of PRESETS) {
    describe(`${presetName} preset`, () => {
      it('enforces dispatch through AGENTS.md, CLAUDE.md, and copilot instructions', () => {
        const { agents, claude, copilot } = generateAndRead(presetName);

        expect(agents).toContain('`task` tool');
        expect(agents).toContain('mode: "background"');
        expect(agents).toContain('.squad/agents/<name>/charter.md');
        expect(agents).toMatch(/dispatch/i);
        expect(claude).toContain('Dispatch, don\'t role-play.');
        expect(claude).toContain('`task` tool');
        expect(copilot).toContain('`task` tool');
        expect(copilot).toContain('mode: "background"');
        expect(copilot).toContain('.squad/agents/<name>/charter.md');
      });

      it('contains the secondary routing table with required trigger mappings', () => {
        const { routing } = generateAndRead(presetName);

        expect(routing).toContain('Automatic Secondary Routing');
        expect(routing).toContain('Implementation work | Testing review');
        expect(routing).toContain('User-visible behavior changes | Documentation update');
        expect(routing).toContain('Prompt or agent changes | Eval baseline check');
        expect(routing).toContain('Significant trade-off or decision | Decision logging');
        expect(routing).toContain('Meaningful milestone reached | Journal update');
      });

      it('keeps completion-gate specifics in AGENTS.md', () => {
        const { agents } = generateAndRead(presetName);

        expect(agents).toContain('.squad/decisions.md');
        expect(agents).toContain('JOURNAL.md');
        expect(agents).toContain('Docs updated if user-visible behavior changed');
        expect(agents).toContain('Tests considered if code changed');
        expect(agents).toContain('Which squad roles should have touched this work');
      });

      it('enforces role-tag formatting across hook files', () => {
        const { agents, claude, copilot } = generateAndRead(presetName);

        expect(agents).toContain('**[');
        expect(claude).toContain('**[');
        expect(copilot).toContain('**[');
        expect(agents).toContain('Never say "Acting as all agents"');
        expect(agents).toContain('One lead role per response');
      });

      it('keeps routing coverage complete for preset-defined routes', () => {
        const { routing } = generateAndRead(presetName);
        const preset = loadPreset(presetName);
        const expectedRoutes = preset.routing.rules.map((r: { pattern: string }) => r.pattern);

        for (const route of expectedRoutes) {
          expect(routing).toMatch(new RegExp(`\\|\\s*${route}\\s*\\|`));
        }

        expect(routing).toContain('Scribe always runs');
      });
    });
  }
});
