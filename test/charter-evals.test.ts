import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { loadPreset } from '../src/registry/loader.js';
import { generateSquad } from '../src/generator/index.js';

/**
 * Charter & Routing Quality Evals
 *
 * Grades quality, tone, correctness of generated charters for DevRel, Coder, Scribe.
 * Grades routing coverage — whether secondary agents (DevRel, Scribe, Evaluator) are
 * explicitly wired into dispatch instructions so they don't get silently skipped.
 *
 * Grounding:
 *   DevRel  — Azure-Samples README style, Pamela Fox repos/blog (direct, scannable, no fluff)
 *   Coder   — Azure Functions samples (Python/TS/C#/Java), Bicep IaC, Azure skills
 *   Scribe  — git-for-pms how-was-this-built.md (narrative steering log, Level-Ups)
 *   Routing — All hook chain files must name secondary roles explicitly to prevent skipping
 */
describe('Charter & Routing Evals', () => {
  let tempDir: string;
  let devrel: string;
  let coder: string;
  let scribe: string;
  let agentsMd: string;
  let claudeMd: string;
  let routingMd: string;
  let copilotInstructions: string;

  beforeAll(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'charter-evals-'));
    generateSquad({ targetDir: tempDir, preset: loadPreset('default') });

    devrel = readFileSync(join(tempDir, '.squad', 'agents', 'devrel', 'charter.md'), 'utf-8');
    coder = readFileSync(join(tempDir, '.squad', 'agents', 'coder', 'charter.md'), 'utf-8');
    scribe = readFileSync(join(tempDir, '.squad', 'agents', 'scribe', 'charter.md'), 'utf-8');
    agentsMd = readFileSync(join(tempDir, 'AGENTS.md'), 'utf-8');
    claudeMd = readFileSync(join(tempDir, 'CLAUDE.md'), 'utf-8');
    routingMd = readFileSync(join(tempDir, '.squad', 'routing.md'), 'utf-8');
    copilotInstructions = readFileSync(join(tempDir, '.github', 'copilot-instructions.md'), 'utf-8');
  });

  afterAll(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  // ── DevRel Charter ───────────────────────────────────────────────────

  describe('DevRel — Quality', () => {
    it('has How I Write and Always-On Duties sections', () => {
      expect(devrel).toContain('## How I Write');
      expect(devrel).toContain('### Always-On Duties');
    });

    it('includes the Honesty Rule with verification mechanism', () => {
      expect(devrel).toMatch(/honesty/i);
      expect(devrel).toMatch(/hallucinated/i);
      expect(devrel).toMatch(/test.*first|check.*--help/i);
    });

    it('references specific doc targets (README, CONTRIBUTING)', () => {
      expect(devrel).toContain('README');
      expect(devrel).toContain('CONTRIBUTING.md');
    });
  });

  describe('DevRel — Tone', () => {
    it('uses direct imperative language (Azure Samples style)', () => {
      // Grounding: Azure-Samples READMEs use "Install", "Run", "Deploy" — not suggestions
      const imperatives = ['update', 'add', 'test'];
      const found = imperatives.filter(v => devrel.toLowerCase().includes(v));
      expect(found.length).toBeGreaterThanOrEqual(2);
    });

    it('avoids marketing fluff (Pamela Fox style: technical, not promotional)', () => {
      const fluff = ['amazing', 'revolutionary', 'best-in-class', 'leverage', 'synergy'];
      for (const word of fluff) {
        expect(devrel.toLowerCase()).not.toContain(word);
      }
    });
  });

  describe('DevRel — Correctness', () => {
    it('always-on duties have specific trigger → action pairs', () => {
      expect(devrel).toMatch(/after.*behavior.*change|behavior change/i);
      expect(devrel).toMatch(/update.*README|update.*docs/i);
    });

    it('honesty rule includes how to verify, not just "be honest"', () => {
      expect(devrel).toMatch(/run.*command|check.*--help|test.*first/i);
    });
  });

  // ── Coder Charter ────────────────────────────────────────────────────

  describe('Coder — Quality', () => {
    it('has How I Build, Code Standards, and Always-On Duties sections', () => {
      expect(coder).toContain('## How I Build');
      expect(coder).toContain('### Code Standards');
      expect(coder).toContain('### Always-On Duties');
    });

    it('has Language Standards section with multi-language coverage', () => {
      expect(coder).toContain('### Language Standards');
    });

    it('has completion criteria', () => {
      expect(coder).toMatch(/when.*done/i);
    });
  });

  describe('Coder — Tone', () => {
    it('has explicit prohibitions (Azure Functions sample style)', () => {
      // Grounding: Azure samples use strict patterns — no ambiguity
      expect(coder).toMatch(/no.*require/i);
      expect(coder).toMatch(/ESM/i);
    });

    it('emphasizes security and reliability patterns', () => {
      // Grounding: Azure samples use managed identities, sanitization, singleton patterns
      expect(coder).toMatch(/sanitize/i);
      expect(coder).toMatch(/rollback|atomic/i);
    });

    it('leaves room for team overrides (not over-opinionated)', () => {
      expect(coder).toMatch(/team.*override|style guide/i);
    });
  });

  describe('Coder — Language Coverage', () => {
    // Grounding: Azure-Samples/simple-agent-functions-{lang} patterns
    const languages = [
      { name: 'TypeScript', markers: [/typescript/i, /ESM|import/i, /npx tsc/] },
      { name: 'Python', markers: [/python/i, /uv run|uv pip/i, /type hint/i] },
      { name: 'C# / .NET', markers: [/C#|\.NET/i, /dotnet build|dotnet test/i] },
      { name: 'Java', markers: [/java/i, /maven|mvn/i, /Optional/] },
      { name: 'Bicep / IaC', markers: [/bicep/i, /managed identit/i, /parameterize/i] },
      { name: 'PowerShell', markers: [/powershell/i, /pester/i, /StrictMode/i] },
    ];

    for (const { name, markers } of languages) {
      it(`covers ${name} with actionable standards`, () => {
        for (const pattern of markers) {
          expect(coder, `${name}: missing ${pattern}`).toMatch(pattern);
        }
      });
    }

    it('Python standards require uv, not raw pip or python3', () => {
      // Grounding: user requirement — always uv, never pip directly
      expect(coder).toMatch(/uv/);
      expect(coder).toMatch(/never.*python3|never.*pip|not.*pip install/i);
    });
  });

  describe('Coder — Correctness', () => {
    it('includes build/test commands for multiple languages', () => {
      expect(coder).toContain('npx tsc');
      expect(coder).toContain('dotnet build');
      expect(coder).toContain('mvn clean package');
    });

    it('references decisions.md before starting work', () => {
      expect(coder).toContain('.squad/decisions.md');
    });

    it('flags behavior changes for downstream docs update', () => {
      expect(coder).toMatch(/behavior.*changed.*docs|flag.*docs/i);
    });

    it('specifies minimum model for code generation and IaC', () => {
      expect(coder).toContain('gpt-5.4-mini');
      expect(coder).toMatch(/code generation|IaC/i);
    });

    it('references Azure-Samples as grounding source', () => {
      expect(coder).toMatch(/azure.samples/i);
    });
  });

  // ── Scribe Charter ───────────────────────────────────────────────────

  describe('Scribe — Quality', () => {
    it('has all required journal sections', () => {
      expect(scribe).toContain('## How I Journal');
      expect(scribe).toContain('### The Format');
      expect(scribe).toContain('### What to Capture');
      expect(scribe).toContain('### Sources');
      expect(scribe).toContain('### Rules');
    });

    it('includes markdown table template with required columns', () => {
      // Grounding: git-for-pms uses timestamped tables
      expect(scribe).toContain('Time');
      expect(scribe).toContain('Steering Command');
      expect(scribe).toContain('What Happened');
      expect(scribe).toContain('Level-Up');
    });
  });

  describe('Scribe — Tone', () => {
    it('frames work as narrative, not changelog (git-for-pms style)', () => {
      expect(scribe).toMatch(/story/i);
      expect(scribe).toMatch(/not a changelog/i);
    });

    it('emphasizes honesty about failures', () => {
      expect(scribe).toMatch(/honest|mistake/i);
      expect(scribe).toMatch(/didn.t work|failure/i);
    });

    it('uses Level-Up gamification for learning moments', () => {
      expect(scribe).toMatch(/level.up/i);
      expect(scribe).toContain('🆙');
    });

    it('requires quoting human steering commands', () => {
      expect(scribe).toMatch(/quote.*human|human.*said|steering command/i);
    });
  });

  describe('Scribe — Correctness', () => {
    it('git log command format is valid', () => {
      expect(scribe).toContain('git log --oneline --reverse');
    });

    it('references real target files (JOURNAL.md, decisions.md)', () => {
      expect(scribe).toContain('JOURNAL.md');
      expect(scribe).toContain('.squad/decisions.md');
    });

    it('has at least 3 numbered rules (specific, not vague)', () => {
      const numberedRules = scribe.match(/\n\d+\.\s/g);
      expect(numberedRules?.length).toBeGreaterThanOrEqual(3);
    });
  });

  // ── Routing — Secondary Agent Dispatch ───────────────────────────────
  //
  // Root cause of skipped agents: if routing instructions don't NAME the role
  // explicitly (just say "dispatch it"), the AI defaults to Coder + Tester
  // and silently drops DevRel, Scribe, and Evaluator.

  describe('Routing — Work-Type Coverage', () => {
    it('routing.md maps documentation → DevRel', () => {
      expect(routingMd).toMatch(/documentation.*DevRel/i);
    });

    it('routing.md maps history → Scribe', () => {
      expect(routingMd).toMatch(/history.*Scribe/i);
    });

    it('routing.md maps evals → Evaluator', () => {
      expect(routingMd).toMatch(/evals.*Evaluator/i);
    });
  });

  describe('Routing — Always-On Triggers in Hook Chain', () => {
    // These 5 triggers must appear in ALL three hook chain files.
    // If a trigger is missing from any file, the AI may skip that duty.
    const coreTriggers = [
      { name: 'code → test', pattern: /code.*changed|test.*before.*commit/i },
      { name: 'behavior → docs', pattern: /behavior.*changed|behavior.*doc|user.visible/i },
      { name: 'decision → log', pattern: /decision.*log|trade.off.*log/i },
      { name: 'milestone → journal', pattern: /milestone.*journal|milestone.*JOURNAL/i },
    ];

    it('AGENTS.md has all core Always-On triggers', () => {
      for (const { name, pattern } of coreTriggers) {
        expect(agentsMd, `AGENTS.md missing trigger: ${name}`).toMatch(pattern);
      }
    });

    it('CLAUDE.md has all core Always-On triggers', () => {
      for (const { name, pattern } of coreTriggers) {
        expect(claudeMd, `CLAUDE.md missing trigger: ${name}`).toMatch(pattern);
      }
    });

    it('copilot-instructions.md has all core triggers plus eval trigger', () => {
      for (const { name, pattern } of coreTriggers) {
        expect(copilotInstructions, `copilot-instructions.md missing: ${name}`).toMatch(pattern);
      }
      // The eval trigger is critical — prompts changed → eval baseline check
      expect(copilotInstructions).toMatch(/prompt.*eval|agent.*eval|eval.*baseline/i);
    });
  });

  describe('Routing — Explicit Role Naming (prevents skipping)', () => {
    it('AGENTS.md dispatch names DevRel explicitly', () => {
      expect(agentsMd).toMatch(/dispatch.*DevRel/i);
    });

    it('AGENTS.md dispatch names Scribe explicitly', () => {
      expect(agentsMd).toMatch(/dispatch.*Scribe/i);
    });

    it('AGENTS.md dispatch names Evaluator explicitly', () => {
      expect(agentsMd).toMatch(/dispatch.*Evaluator/i);
    });

    it('CLAUDE.md names DevRel, Scribe, Evaluator in operating behaviors', () => {
      expect(claudeMd).toMatch(/dispatch.*DevRel|DevRel/i);
      expect(claudeMd).toMatch(/dispatch.*Scribe|Scribe/i);
      expect(claudeMd).toMatch(/dispatch.*Evaluator|Evaluator/i);
    });

    it('copilot-instructions.md names DevRel, Scribe, Evaluator in trigger table', () => {
      expect(copilotInstructions).toMatch(/DevRel/i);
      expect(copilotInstructions).toMatch(/Scribe/i);
      expect(copilotInstructions).toMatch(/Evaluator/i);
    });

    it('routing.md includes "Scribe always runs" principle', () => {
      expect(routingMd).toMatch(/scribe.*always.*run/i);
    });
  });

  describe('Routing — Completion Gate', () => {
    it('AGENTS.md completion gate checks all 4 outputs', () => {
      expect(agentsMd).toMatch(/before.*say.*done|before.*done/i);
      expect(agentsMd).toContain('decisions.md');
      expect(agentsMd).toContain('JOURNAL.md');
      expect(agentsMd).toMatch(/docs.*updated|documentation/i);
      expect(agentsMd).toMatch(/tests.*considered|test/i);
    });

    it('AGENTS.md completion gate asks which roles were missed', () => {
      expect(agentsMd).toMatch(/which.*squad.*roles.*should.*have/i);
    });

    it('CLAUDE.md has matching Session Completion Gate', () => {
      expect(claudeMd).toMatch(/session.*completion|before.*ending/i);
      expect(claudeMd).toContain('decisions.md');
      expect(claudeMd).toContain('JOURNAL.md');
    });
  });
});
