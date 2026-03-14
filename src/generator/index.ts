import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Preset, Agent } from '../registry/loader.js';

export interface GenerateOptions {
  targetDir: string;
  preset: Preset;
  projectName?: string;
  owner?: string;
}

export function generateSquad(options: GenerateOptions): string[] {
  const { targetDir, preset, projectName, owner } = options;
  const squadDir = join(targetDir, '.squad');
  const githubDir = join(targetDir, '.github');
  const created: string[] = [];

  // Create directories
  mkdirSync(squadDir, { recursive: true });
  mkdirSync(githubDir, { recursive: true });
  for (const agent of preset.agents) {
    mkdirSync(join(squadDir, 'agents', agent.name.toLowerCase()), { recursive: true });
  }

  // Generate team.md
  const teamMd = generateTeamMd(preset, projectName, owner);
  writeFileSync(join(squadDir, 'team.md'), teamMd);
  created.push('.squad/team.md');

  // Generate routing.md
  const routingMd = generateRoutingMd(preset);
  writeFileSync(join(squadDir, 'routing.md'), routingMd);
  created.push('.squad/routing.md');

  // Generate agent charters
  for (const agent of preset.agents) {
    const charter = generateCharter(agent);
    const charterPath = join(squadDir, 'agents', agent.name.toLowerCase(), 'charter.md');
    writeFileSync(charterPath, charter);
    created.push(`.squad/agents/${agent.name.toLowerCase()}/charter.md`);
  }

  // Generate decisions.md
  const decisionsMd = generateDecisionsMd(preset);
  writeFileSync(join(squadDir, 'decisions.md'), decisionsMd);
  created.push('.squad/decisions.md');

  // Generate mcp-config.md
  const mcpMd = generateMcpConfigMd(preset);
  writeFileSync(join(squadDir, 'mcp-config.md'), mcpMd);
  created.push('.squad/mcp-config.md');

  // Generate hook chain: AGENTS.md, CLAUDE.md, .github/copilot-instructions.md
  const agentsMd = generateAgentsMd(preset, projectName);
  writeFileSync(join(targetDir, 'AGENTS.md'), agentsMd);
  created.push('AGENTS.md');

  const claudeMd = generateClaudeMd(preset, projectName, owner);
  writeFileSync(join(targetDir, 'CLAUDE.md'), claudeMd);
  created.push('CLAUDE.md');

  const copilotMd = generateCopilotInstructions(preset);
  writeFileSync(join(githubDir, 'copilot-instructions.md'), copilotMd);
  created.push('.github/copilot-instructions.md');

  // Generate JOURNAL.md (Ledger's home)
  const journalMd = generateJournalMd(preset, projectName);
  writeFileSync(join(targetDir, 'JOURNAL.md'), journalMd);
  created.push('JOURNAL.md');

  return created;
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

Available presets: neighbors (general), dash (speed), sages (mentor), artisans (specialists)
`;
}

function generateJournalMd(arch: Preset, projectName?: string): string {
  const name = projectName || arch.team.name;
  const date = new Date().toISOString().split('T')[0];

  return `# JOURNAL.md — Build Story

> How this project was built, the steering moments that shaped it, and why things are the way they are.
> Maintained by the Historian / Build Journalist. Update after milestones.

---

## ${date} — Project Bootstrapped

### Setup

- **Squad:** ${arch.displayName} (${arch.vibe})
- **Preset:** ${arch.name}
- **Theme:** ${arch.theme}
- **Created with:** \`npx snap-squad init\`

### What Happened

Project initialized with the ${arch.displayName} squad preset. The full \`.squad/\` directory, hook chain (AGENTS.md, CLAUDE.md, copilot-instructions.md), and this journal were generated automatically.

### Next

Start building. Update this journal as the project evolves — capture steering moments, key decisions, and the reasoning behind changes.

---

*Keep this journal alive. The code shows what was built. The journal shows why.*
`;
}
