import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import type { Preset, Agent } from '../registry/loader.js';
import { listPresets } from '../registry/loader.js';

export interface GenerateOptions {
  targetDir: string;
  preset: Preset;
  projectName?: string;
  owner?: string;
}

// Sanitize user input for markdown templates
function sanitize(input: string): string {
  return input.replace(/[[\](){}|`*_~<>#]/g, '\\$&');
}

export function generateSquad(options: GenerateOptions): string[] {
  const { targetDir, preset, projectName, owner } = options;
  const safeName = projectName ? sanitize(projectName) : undefined;
  const safeOwner = owner ? sanitize(owner) : undefined;
  const squadDir = join(targetDir, '.squad');
  const githubDir = join(targetDir, '.github');

  // Phase 1: Generate all content in memory (no I/O)
  const files: { path: string; content: string; label: string }[] = [];

  files.push({ path: join(squadDir, 'team.md'), content: generateTeamMd(preset, safeName, safeOwner), label: '.squad/team.md' });
  files.push({ path: join(squadDir, 'routing.md'), content: generateRoutingMd(preset), label: '.squad/routing.md' });

  for (const agent of preset.agents) {
    files.push({
      path: join(squadDir, 'agents', agent.name.toLowerCase(), 'charter.md'),
      content: generateCharter(agent),
      label: `.squad/agents/${agent.name.toLowerCase()}/charter.md`,
    });
  }

  files.push({ path: join(squadDir, 'decisions.md'), content: generateDecisionsMd(preset), label: '.squad/decisions.md' });
  files.push({ path: join(squadDir, 'mcp-config.md'), content: generateMcpConfigMd(preset), label: '.squad/mcp-config.md' });
  files.push({ path: join(targetDir, 'AGENTS.md'), content: generateAgentsMd(preset, safeName), label: 'AGENTS.md' });
  files.push({ path: join(targetDir, 'CLAUDE.md'), content: generateClaudeMd(preset, safeName, safeOwner), label: 'CLAUDE.md' });
  files.push({ path: join(githubDir, 'copilot-instructions.md'), content: generateCopilotInstructions(preset), label: '.github/copilot-instructions.md' });
  files.push({ path: join(targetDir, 'JOURNAL.md'), content: generateJournalMd(preset, safeName), label: 'JOURNAL.md' });

  // Phase 2: Create directories
  const dirs = new Set(files.map(f => dirname(f.path)));
  for (const dir of dirs) {
    try {
      mkdirSync(dir, { recursive: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to create directory "${dir}": ${message}`);
    }
  }

  // Phase 3: Write all files (with error context)
  const written: string[] = [];
  try {
    for (const { path, content, label } of files) {
      writeFileSync(path, content);
      written.push(label);
    }
  } catch (err) {
    // Rollback: remove .squad/ if we created it
    try { rmSync(squadDir, { recursive: true, force: true }); } catch {}
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Squad generation failed after writing ${written.length}/${files.length} files: ${message}`);
  }

  return written;
}

function generateTeamMd(arch: Preset, projectName?: string, owner?: string): string {
  const name = projectName || arch.team.name;
  const agentRows = arch.agents
    .map((a) => `| ${a.name} | ${a.role} | \`.squad/agents/${a.name.toLowerCase()}/charter.md\` | ✅ Active |`)
    .join('\n');

  return `# ${arch.team.name} — ${name}

> ${arch.team.description}

## Coordinator

| Name | Role | Notes |
|------|------|-------|
| Squad | Coordinator | Routes work, enforces handoffs and reviewer gates. Does not generate domain artifacts. |

## Members

| Name | Role | Charter | Status |
|------|------|---------|--------|
${agentRows}
| Scribe | Session Logger | \`.squad/agents/scribe/charter.md\` | 📋 Silent |

## Coding Agent

<!-- copilot-auto-assign: false -->

| Name | Role | Charter | Status |
|------|------|---------|--------|
| @copilot | Coding Agent | — | 🤖 Coding Agent |

## Project Context

- **Owner:** ${owner || 'unknown'}
- **Stack:** (configure after init)
- **Description:** ${arch.description}
- **Universe:** ${arch.theme}
- **Created:** ${new Date().toISOString().split('T')[0]}
`;
}

function generateRoutingMd(arch: Preset): string {
  const rows = arch.routing.rules
    .map((r) => `| ${r.pattern} | ${r.agent} | ${r.description} |`)
    .join('\n');

  return `# Routing Rules — ${arch.team.name}

## Work Type → Agent

| Work Type | Agent | Examples |
|-----------|-------|---------|
${rows}

## Routing Principles

1. **Eager by default** — spawn agents who could usefully start work.
2. **Scribe always runs** after substantial work, in background. Never blocks.
3. **Quick facts → coordinator answers directly.** Don't spawn for trivial questions.
4. **Two agents could handle it** → pick the one whose domain is the primary concern.
5. **Anticipate downstream.** Feature being built? Spawn tester simultaneously.
`;
}

function generateCharter(agent: Agent): string {
  return `# ${agent.name} — ${agent.role}

> ${agent.description}

## Identity

- **Name:** ${agent.name}
- **Role:** ${agent.role}
- **Expertise:** ${agent.expertise.join(', ')}
- **Style:** ${agent.style}

## How I Work

- Follow routing rules — handle my domain, defer others
- Check \`.squad/decisions.md\` before starting work
- Log decisions after completing work
- If unsure, say so and suggest who might know

## Voice

${agent.voice}

## Model

- **Preferred:** auto
- **Fallback:** Standard chain

## Collaboration

Before starting work, read \`.squad/decisions.md\` for team decisions that affect me.
After making a decision others should know, log it to \`.squad/decisions.md\`.
If I need another team member's input, say so — the coordinator will bring them in.
`;
}

function generateDecisionsMd(arch: Preset): string {
  return `# Decisions — ${arch.team.name}

> Significant decisions made during development. Check before starting work.

## Active Decisions

### D-001: Squad initialized with ${arch.displayName} preset
- **By:** snap-squad
- **Date:** ${new Date().toISOString().split('T')[0]}
- **Context:** Project initialized using snap-squad warm-start
- **Decision:** Using the "${arch.name}" preset (${arch.vibe} vibe, ${arch.theme} theme)
`;
}

function generateMcpConfigMd(arch: Preset): string {
  let skillSection = '';
  if (arch.skills.length > 0) {
    const skillList = arch.skills.map((s) => `- **${s.name}** — ${s.description}`).join('\n');
    skillSection = `\n## Available Skills\n\n${skillList}\n`;
  }

  return `# MCP Integration — ${arch.team.name}

MCP (Model Context Protocol) servers extend the squad with external tools.
${skillSection}
## Config Locations

1. **Repository-level:** \`.copilot/mcp-config.json\`
2. **Workspace-level:** \`.vscode/mcp.json\`
3. **User-level:** \`~/.copilot/mcp-config.json\`
`;
}

function generateAgentsMd(arch: Preset, projectName?: string): string {
  const name = projectName || arch.team.name;
  const agentTable = arch.agents
    .map((a) => `| ${a.name} | ${a.role} | ${a.expertise.slice(0, 2).join(', ')} |`)
    .join('\n');

  return `# AGENTS.md — ${name} Operating Instructions

> This file is read by AI agents working in this repository.

## You Are Part of a Squad

This repository uses [Squad](https://github.com/bradygaster/squad).
Before doing any work, read and follow the squad configuration:

1. **Read \`.squad/team.md\`** — Know the team and project context
2. **Read \`.squad/routing.md\`** — Route work to the right agent
3. **Read agent charters in \`.squad/agents/*/charter.md\`** — Understand expertise and boundaries
4. **Check \`.squad/decisions.md\`** — Review existing decisions
5. **Check \`.squad/mcp-config.md\`** — Know available tools
6. **Update \`JOURNAL.md\`** after milestones — capture steering moments and key decisions

## Quick Reference

| Agent | Role | Ask them about... |
|-------|------|-------------------|
${agentTable}

## Preset: ${arch.displayName}

${arch.description}
`;
}

function generateClaudeMd(arch: Preset, projectName?: string, owner?: string): string {
  const name = projectName || arch.team.name;

  return `# CLAUDE.md — ${name} Session Memory

> Read this at the start of every session. Update when context changes.

## Identity

You are working in a repository using the **${arch.displayName}** squad preset.

**You are part of a squad.** Read \`.squad/team.md\` for the full roster.

## Project Context

- **Owner:** ${owner || 'unknown'}
- **Squad:** ${arch.displayName} (${arch.vibe})
- **Theme:** ${arch.theme}

## Squad Operating Rules

Before starting work:
1. Read \`.squad/team.md\` — know the team
2. Read \`.squad/routing.md\` — route work correctly
3. Check \`.squad/decisions.md\` — respect existing decisions
4. Identify which agent you're acting as for this task

After completing work:
1. Log decisions to \`.squad/decisions.md\`
2. Update \`JOURNAL.md\` with what happened and why
3. Update relevant docs if behavior changed
`;
}

function generateCopilotInstructions(arch: Preset): string {
  const presetNames = listPresets();
  const presetList = presetNames.length > 0 ? presetNames.join(', ') : 'neighbors, dash, sages, specialists';

  return `# Copilot Instructions — ${arch.team.name}

> **You are part of a squad.** This repository uses multi-agent team coordination.

## On Every Session

1. Read \`AGENTS.md\` at repo root for universal squad instructions
2. Read \`CLAUDE.md\` at repo root for session memory and project context
3. Read \`.squad/team.md\` for the full team roster
4. Read \`.squad/routing.md\` for work routing rules
5. Check \`.squad/decisions.md\` before starting work

## Squad-Aware Behavior

- Identify which squad member is best suited for the current task
- Adopt their expertise, voice, and boundaries
- Log significant decisions to \`.squad/decisions.md\` after completing work

## Managing This Squad

This squad was created with [snap-squad](https://github.com/paulyuk/snap-squad).
If the user asks to change, reset, or switch their squad:

\`\`\`bash
npx snap-squad init --type <preset> --force    # switch to a different preset
npx snap-squad list                            # see available presets
\`\`\`

Available presets: ${presetList}
`;
}

function generateJournalMd(arch: Preset, projectName?: string): string {
  const name = projectName || arch.team.name;
  const date = new Date().toISOString().split('T')[0];
  const agentNames = arch.agents.map(a => a.name).join(', ');

  return `# JOURNAL.md — Build Story

> How this project was built, the steering moments that shaped it, and why things are the way they are.
> Maintained by **Ledger** (Historian / Build Journalist). Update after milestones.

---

## ${date} — Project Bootstrapped

**Squad:** ${arch.displayName} · **Vibe:** ${arch.vibe} · **Theme:** ${arch.theme}

### The Team

${agentNames}

### What Happened

Project initialized with the **${arch.displayName}** squad preset via \`npx snap-squad init\`. The full \`.squad/\` directory, hook chain (AGENTS.md, CLAUDE.md, copilot-instructions.md), and this journal were generated automatically.

### Steering Moment

The builder chose **${arch.name}** — ${arch.description.toLowerCase().replace(/\.\s*$/, '')}. This shapes everything that follows: who reviews code, how decisions get made, what gets tested first.

### What's Next

- [ ] First real feature or task
- [ ] Builder configures project context in \`.squad/team.md\`
- [ ] First decision logged to \`.squad/decisions.md\`

---

## How to Use This Journal

> *Ledger's guide for the builder and future contributors.*

This isn't a changelog. It's the **story of how the project was built** — the decisions, the pivots, the moments where the builder steered the squad in a new direction.

### What to capture

| Entry Type | When | Example |
|-----------|------|---------|
| **Steering Moment** | Builder redirects the squad | "Switched from REST to GraphQL after seeing the query complexity" |
| **Key Decision** | Trade-off was made | "Chose SQLite over Postgres — this is a CLI tool, not a service" |
| **Evolution** | Architecture shifted | "Split monolith into 3 modules after hitting circular deps" |
| **Milestone** | Something shipped | "v0.1.0 published to npm — first public release" |
| **Lesson Learned** | Something surprised you | "Vitest runs 10x faster than Jest for this project — switching permanently" |

### Template for new entries

\`\`\`markdown
## YYYY-MM-DD — Title

### What Happened

(What was built, changed, or decided)

### Why

(The reasoning — what alternatives existed, what trade-offs were made)

### Steering Moment

(How the builder directed the work — what prompt, feedback, or redirection shaped the outcome)

### Impact

(What this changes going forward)
\`\`\`

### Rules

1. **Write for future-you.** Six months from now, this journal explains *why* the code looks the way it does.
2. **Capture the steering, not the typing.** The git log shows what changed. The journal shows *why it changed*.
3. **Be honest about pivots.** The best journals include "we tried X, it didn't work, here's why we switched to Y."
4. **Update after milestones, not after every commit.** Quality over quantity.

---

*The code shows what was built. The journal shows why.*
`;
}
