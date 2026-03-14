#!/usr/bin/env node

import { Command } from 'commander';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import chalk from 'chalk';
import { loadArchetype, listArchetypes } from './registry/loader.js';
import { generateSquad } from './generator/index.js';

const program = new Command();

program
  .name('snap-squad')
  .description('Warm-start addon for Squad — pre-baked agent archetypes for instant deployment')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize a squad from a pre-baked archetype')
  .option('-t, --type <archetype>', 'archetype to use', 'neighbors')
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

    // Load archetype
    let archetype;
    try {
      archetype = loadArchetype(opts.type);
    } catch (err) {
      console.error(chalk.red(`✗ ${(err as Error).message}`));
      process.exit(1);
    }

    console.log(
      chalk.blue(`⚡ Snapping in ${chalk.bold(archetype.displayName)}...`)
    );

    // Generate
    const created = generateSquad({
      targetDir,
      archetype,
      projectName: opts.name,
      owner: opts.owner,
    });

    // Report
    console.log(chalk.green(`\n✓ Squad initialized with ${archetype.displayName}!\n`));
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
  .description('List available archetypes')
  .action(() => {
    const archetypes = listArchetypes();
    if (archetypes.length === 0) {
      console.log(chalk.yellow('No archetypes found.'));
      return;
    }

    console.log(chalk.blue('Available archetypes:\n'));
    for (const name of archetypes) {
      try {
        const arch = loadArchetype(name);
        console.log(`  ${chalk.bold(name)} — ${arch.description}`);
      } catch {
        console.log(`  ${chalk.bold(name)}`);
      }
    }
    console.log();
  });

program.parse();
