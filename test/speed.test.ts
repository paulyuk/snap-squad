import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'node:child_process';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
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

function timeMs(fn: () => void): number {
  const start = performance.now();
  fn();
  return performance.now() - start;
}

// Speed budgets (milliseconds)
// Note: subprocess spawn overhead on macOS is ~2s (node cold start).
// These budgets measure CLI responsiveness, not in-process speed.
const BUDGETS = {
  initCold: 5000,       // first init in empty dir (includes node spawn)
  initForce: 5000,      // re-init with --force
  list: 5000,           // list all presets
  matcherResolve: 5000,  // plain English → preset resolution + init
};

describe('Speed: snap-squad must stay fast', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'snap-squad-speed-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  // --- init speed ---

  it(`cold init (neighbors) completes under ${BUDGETS.initCold}ms`, () => {
    const ms = timeMs(() => run(`init --type neighbors --dir "${tempDir}"`));
    expect(ms).toBeLessThan(BUDGETS.initCold);
    expect(existsSync(join(tempDir, '.squad', 'team.md'))).toBe(true);
  });

  it(`cold init (dash) completes under ${BUDGETS.initCold}ms`, () => {
    const dir2 = mkdtempSync(join(tmpdir(), 'snap-squad-speed-'));
    try {
      const ms = timeMs(() => run(`init --type dash --dir "${dir2}"`));
      expect(ms).toBeLessThan(BUDGETS.initCold);
    } finally {
      rmSync(dir2, { recursive: true, force: true });
    }
  });

  it(`cold init (specialists) completes under ${BUDGETS.initCold}ms`, () => {
    const dir2 = mkdtempSync(join(tmpdir(), 'snap-squad-speed-'));
    try {
      const ms = timeMs(() => run(`init --type specialists --dir "${dir2}"`));
      expect(ms).toBeLessThan(BUDGETS.initCold);
    } finally {
      rmSync(dir2, { recursive: true, force: true });
    }
  });

  it(`cold init (sages) completes under ${BUDGETS.initCold}ms`, () => {
    const dir2 = mkdtempSync(join(tmpdir(), 'snap-squad-speed-'));
    try {
      const ms = timeMs(() => run(`init --type sages --dir "${dir2}"`));
      expect(ms).toBeLessThan(BUDGETS.initCold);
    } finally {
      rmSync(dir2, { recursive: true, force: true });
    }
  });

  // --- re-init with --force ---

  it(`re-init with --force completes under ${BUDGETS.initForce}ms`, () => {
    run(`init --type neighbors --dir "${tempDir}"`);
    const ms = timeMs(() => run(`init --type dash --dir "${tempDir}" --force`));
    expect(ms).toBeLessThan(BUDGETS.initForce);
  });

  // --- list speed ---

  it(`list command completes under ${BUDGETS.list}ms`, () => {
    const ms = timeMs(() => run('list'));
    expect(ms).toBeLessThan(BUDGETS.list);
  });

  // --- matcher + init (plain English) ---

  it(`plain English resolve + init completes under ${BUDGETS.matcherResolve}ms`, () => {
    const ms = timeMs(() => run(`init I need a fast team for a hackathon --dir "${tempDir}"`));
    expect(ms).toBeLessThan(BUDGETS.matcherResolve);
    expect(existsSync(join(tempDir, '.squad', 'team.md'))).toBe(true);
  });

  // --- regression: all presets stay under budget ---

  it('no preset init exceeds 2x the budget (regression guard)', () => {
    const presets = ['neighbors', 'dash', 'sages', 'specialists'];
    const results: { preset: string; ms: number }[] = [];

    for (const preset of presets) {
      const dir = mkdtempSync(join(tmpdir(), `snap-squad-speed-${preset}-`));
      try {
        const ms = timeMs(() => run(`init --type ${preset} --dir "${dir}"`));
        results.push({ preset, ms });
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    }

    // Log results for visibility
    const report = results.map(r => `${r.preset}: ${r.ms.toFixed(0)}ms`).join(', ');
    console.log(`⚡ Speed report: ${report}`);

    // Hard ceiling: no preset should ever take more than 2x budget
    for (const { preset, ms } of results) {
      expect(ms, `${preset} init took ${ms.toFixed(0)}ms — exceeds 2x budget`).toBeLessThan(BUDGETS.initCold * 2);
    }
  });
});
