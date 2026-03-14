#!/usr/bin/env node

import { Command } from 'commander';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';
import chalk from 'chalk';
import { loadPreset, listPresets } from './registry/loader.js';
import { generateSquad } from './generator/index.js';
import { matchPreset } from './matcher.js';

const program = new Command();

program
  .name('snap-squad')
  .description('Get started with Squad faster — ready-made squad presets')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize a squad — describe what you need or pick a preset')
  .argument('[description...]', 'describe your project in plain English')
  .option('-t, --type <preset>', 'pick a preset directly (neighbors, dash, sages, artisans)')
  .option('-d, --dir <directory>', 'target directory', '.')
  .option('-n, --name <name>', 'project name')
  .option('-o, --owner <owner>', 'project owner')
  .option('-f, --force', 'overwrite existing .squad/ directory', false)
  .option('--no-up', 'skip running squad up after init')
  .action((descriptionWords: string[], opts) => {
    const targetDir = resolve(opts.dir);
    const squadDir = resolve(targetDir, '.squad');

    if (existsSync(squadDir) && !opts.force) {
      console.error(chalk.red('✗ .squad/ already exists. Use --force to overwrite.'));
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
    } else {
      presetName = 'neighbors';
    }

    let preset;
    try {
      preset = loadPreset(presetName);
    } catch (err) {
      console.error(chalk.red(`✗ ${(err as Error).message}`));
      process.exit(1);
    }

    console.log(chalk.blue(`⚡ Snapping in ${chalk.bold(preset.displayName)}...`));

    const created = generateSquad({
      targetDir,
      preset,
      projectName: opts.name,
      owner: opts.owner,
    });

    console.log(chalk.green(`\n✓ Squad ready! (${preset.displayName})\n`));
    console.log(chalk.dim('Created:'));
    for (const file of created) {
      console.log(chalk.dim(`  ${file}`));
    }

    // Run squad up unless --no-up
    if (opts.up !== false) {
      try {
        execSync('squad --version', { stdio: 'ignore' });
        console.log(chalk.blue(`\n🚀 Running ${chalk.bold('squad up')}...\n`));
        execSync('squad up', { cwd: targetDir, stdio: 'inherit' });
      } catch {
        console.log(
          `\n${chalk.yellow('Note:')} Squad CLI not found. Install it to run your squad:\n`
        );
        console.log(chalk.dim('  npm install -g @bradygaster/squad-cli'));
        console.log(chalk.dim(`  cd ${targetDir}`));
        console.log(chalk.dim('  squad up\n'));
      }
    }
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
