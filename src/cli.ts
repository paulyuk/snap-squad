#!/usr/bin/env node

import { Command } from 'commander';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import chalk from 'chalk';
import { loadPreset, listPresets } from './registry/loader.js';
import { generateSquad } from './generator/index.js';

const program = new Command();

program
  .name('snap-squad')
  .description('Warm-start addon for Squad — pre-baked squad presets for instant deployment')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize a squad from a pre-baked preset')
  .option('-t, --type <preset>', 'squad preset to use', 'neighbors')
  .option('-d, --dir <directory>', 'target directory', '.')
  .option('-n, --name <name>', 'project name')
  .option('-o, --owner <owner>', 'project owner')
  .option('-f, --force', 'overwrite existing .squad/ directory', false)
  .action((opts) => {
    const targetDir = resolve(opts.dir);
    const squadDir = resolve(targetDir, '.squad');

    // Check for existing .squad/
    if (existsSync(squadDir) && !opts.force) {
      console.error(
        chalk.red('✗ .squad/ already exists. Use --force to overwrite.')
      );
      process.exit(1);
    }

    // Load preset
    let preset;
    try {
      preset = loadPreset(opts.type);
    } catch (err) {
      console.error(chalk.red(`✗ ${(err as Error).message}`));
      process.exit(1);
    }

    console.log(
      chalk.blue(`⚡ Snapping in ${chalk.bold(preset.displayName)}...`)
    );

    // Generate
    const created = generateSquad({
      targetDir,
      preset,
      projectName: opts.name,
      owner: opts.owner,
    });

    // Report
    console.log(chalk.green(`\n✓ Squad initialized with ${preset.displayName}!\n`));
    console.log(chalk.dim('Created:'));
    for (const file of created) {
      console.log(chalk.dim(`  ${file}`));
    }
    console.log(
      `\n${chalk.yellow('Next:')} Your squad is ready. Every AI session in this workspace is now squad-aware.`
    );
    console.log(
      chalk.dim('  The hook chain (AGENTS.md + CLAUDE.md + .github/copilot-instructions.md)')
    );
    console.log(
      chalk.dim('  ensures your squad identity persists across every session, every tool.\n')
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
