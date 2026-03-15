#!/usr/bin/env node

import { Command } from 'commander';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import { loadPreset, listPresets } from './registry/loader.js';
import { generateSquad } from './generator/index.js';
import { matchPreset } from './matcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));

const availablePresets = listPresets();

const program = new Command();

program
  .name('snap-squad')
  .description('Get started with Squad faster — ready-made squad presets')
  .version(pkg.version);

program
  .command('init')
  .description('Initialize a squad — describe what you need or pick a preset')
  .argument('[description...]', 'describe your project in plain English')
  .option('-t, --type <preset>', `pick a preset directly (${availablePresets.join(', ')})`)
  .option('-d, --dir <directory>', 'target directory', '.')
  .option('-n, --name <name>', 'project name')
  .option('-o, --owner <owner>', 'project owner')
  .option('-f, --force', 'overwrite structural files but preserve JOURNAL.md and .squad/decisions.md', false)
  .option('--reset-all', 'overwrite every generated file, including JOURNAL.md and .squad/decisions.md', false)
  .option('--explain', 'show why a preset was chosen')
  .option('--dry-run', 'show what would be created without writing files')
  .action((descriptionWords: string[], opts) => {
    const targetDir = resolve(opts.dir);
    const squadDir = resolve(targetDir, '.squad');
    const canRegenerate = opts.force || opts.resetAll;

    if (existsSync(squadDir) && !canRegenerate) {
      console.error(chalk.red('✗ .squad/ already exists. Use --force to refresh templates or --reset-all for a clean slate.'));
      process.exit(1);
    }

    // Resolve preset: explicit --type wins, otherwise match from description
    let presetName: string;
    if (opts.type) {
      presetName = opts.type;
    } else if (descriptionWords.length > 0) {
      const description = descriptionWords.join(' ');
      const match = matchPreset(description);
      presetName = match.preset;
      console.log(chalk.dim(`  "${description}" → ${chalk.bold(match.preset)} (${match.why})\n`));
      if (opts.explain && match.matchedKeywords.length > 0) {
        console.log(chalk.dim('  Matched keywords:'));
        for (const kw of match.matchedKeywords) {
          console.log(chalk.dim(`    • "${kw.keyword}" → ${kw.preset} (+${kw.weight})`));
        }
        console.log();
      }
    } else {
      presetName = availablePresets.includes('default') ? 'default' : availablePresets[0] ?? 'default';
    }

    let preset;
    try {
      preset = loadPreset(presetName);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(chalk.red(`✗ ${message}`));
      process.exit(1);
    }

    if (opts.dryRun) {
      console.log(chalk.blue(`🔍 Dry run: would create ${chalk.bold(preset.displayName)} squad\n`));
      console.log(chalk.dim(`  Agents: ${preset.agents.map(a => a.name).join(', ')}`));
      console.log(chalk.dim(`  Files: .squad/, AGENTS.md, CLAUDE.md, JOURNAL.md, .github/copilot-instructions.md`));
      console.log(chalk.dim(`  Target: ${targetDir}\n`));
      return;
    }

    console.log(chalk.blue(`⚡ Snapping in ${chalk.bold(preset.displayName)}...`));

    const { written, skipped } = generateSquad({
      targetDir,
      preset,
      projectName: opts.name,
      owner: opts.owner,
      overwriteMode: opts.resetAll ? 'all' : opts.force ? 'structural' : 'all',
    });

    if (skipped.length > 0) {
      console.log();
      for (const file of skipped) {
        console.log(chalk.yellow(`⚠ Skipping ${file} (contains user content)`));
      }
    }

    console.log(chalk.green(`\n✓ Squad ready! (${preset.displayName})\n`));
    console.log(chalk.dim('Written:'));
    for (const file of written) {
      console.log(chalk.dim(`  ${file}`));
    }
    console.log(
      `\n${chalk.yellow('Next:')} Open ${chalk.bold('Copilot CLI')} or ${chalk.bold('VS Code')} in this folder — your AI is already squad-aware.\n`
    );
  });

program
  .command('list')
  .description('List available presets')
  .action(() => {
    const presets = listPresets();
    if (presets.length === 0) {
      console.log(chalk.yellow('No presets found.'));
      return;
    }

    console.log(chalk.blue('Available presets:\n'));
    for (const name of presets) {
      try {
        const p = loadPreset(name);
        console.log(`  ${chalk.bold(name)} — ${p.description}`);
      } catch {
        console.log(`  ${chalk.bold(name)}`);
      }
    }
    console.log();
  });

program.parse();
