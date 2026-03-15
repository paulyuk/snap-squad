import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import type { Preset, Agent } from '../registry/loader.js';
import { listPresets } from '../registry/loader.js';

type FileKind = 'structural' | 'content';
type OverwriteMode = 'all' | 'structural';

interface GeneratedFile {
  path: string;
  content: string;
  label: string;
  kind: FileKind;
}

export interface GenerateOptions {
  targetDir: string;
  preset: Preset;
  projectName?: string;
  owner?: string;
  overwriteMode?: OverwriteMode;
}

export interface GenerateResult {
  written: string[];
  skipped: string[];
}

// Sanitize user input for markdown templates
function sanitize(input: string): string {
  return input.replace(/[[\](){}|`*_~<>#]/g, '\\$&');
}

export function generateSquad(options: GenerateOptions): GenerateResult {
  const { targetDir, preset, projectName, owner, overwriteMode = 'all' } = options;
  const safeName = projectName ? sanitize(projectName) : undefined;
  const safeOwner = owner ? sanitize(owner) : undefined;
  const squadDir = join(targetDir, '.squad');
  const githubDir = join(targetDir, '.github');

  // Phase 1: Generate all content in memory (no I/O)
  const files: GeneratedFile[] = [];

  files.push({ path: join(squadDir, 'team.md'), content: generateTeamMd(preset, safeName, safeOwner), label: '.squad/team.md', kind: 'structural' });
  files.push({ path: join(squadDir, 'routing.md'), content: generateRoutingMd(preset), label: '.squad/routing.md', kind: 'structural' });

  for (const agent of preset.agents) {
    files.push({
      path: join(squadDir, 'agents', agent.name.toLowerCase(), 'charter.md'),
      content: generateCharter(agent),
      label: `.squad/agents/${agent.name.toLowerCase()}/charter.md`,
      kind: 'structural',
    });
  }

  files.push({ path: join(squadDir, 'decisions.md'), content: generateDecisionsMd(preset), label: '.squad/decisions.md', kind: 'content' });
  files.push({ path: join(squadDir, 'mcp-config.md'), content: generateMcpConfigMd(preset), label: '.squad/mcp-config.md', kind: 'structural' });
  files.push({ path: join(targetDir, 'AGENTS.md'), content: generateAgentsMd(preset, safeName), label: 'AGENTS.md', kind: 'structural' });
  files.push({ path: join(targetDir, 'CLAUDE.md'), content: generateClaudeMd(preset, safeName, safeOwner), label: 'CLAUDE.md', kind: 'structural' });
  files.push({ path: join(githubDir, 'copilot-instructions.md'), content: generateCopilotInstructions(preset), label: '.github/copilot-instructions.md', kind: 'structural' });
  files.push({ path: join(targetDir, 'JOURNAL.md'), content: generateJournalMd(preset, safeName), label: 'JOURNAL.md', kind: 'content' });

  const skipped = new Set(
    files
      .filter(({ kind, path }) => overwriteMode === 'structural' && kind === 'content' && existsSync(path))
      .map(({ label }) => label)
  );
  const filesToWrite = files.filter(({ label }) => !skipped.has(label));

  // Phase 2: Create directories
  const createdDirs: string[] = [];
  const dirs = [...new Set(filesToWrite.map((file) => dirname(file.path)))];
  let currentDir = '';
  try {
    for (const dir of dirs) {
      currentDir = dir;
      if (existsSync(dir)) {
        continue;
      }

      mkdirSync(dir, { recursive: true });
      createdDirs.push(dir);
    }
  } catch (err) {
    for (const createdDir of [...createdDirs].reverse()) {
      try {
        rmSync(createdDir, { recursive: true, force: true });
      } catch {}
    }
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to create directory "${currentDir}": ${message}`);
  }

  // Phase 3: Write all files (with rollback for overwritten content)
  const written: string[] = [];
  const writtenFiles: GeneratedFile[] = [];
  const previousContents = new Map<string, string>();
  try {
    for (const file of filesToWrite) {
      if (existsSync(file.path)) {
        previousContents.set(file.path, readFileSync(file.path, 'utf-8'));
      }

      writeFileSync(file.path, file.content);
      written.push(file.label);
      writtenFiles.push(file);
    }
  } catch (err) {
    for (const file of [...writtenFiles].reverse()) {
      try {
        const previous = previousContents.get(file.path);
        if (previous !== undefined) {
          writeFileSync(file.path, previous);
        } else {
          rmSync(file.path, { force: true });
        }
      } catch {}
    }

    for (const createdDir of [...createdDirs].reverse()) {
      try {
        rmSync(createdDir, { recursive: true, force: true });
      } catch {}
    }

    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Squad generation failed after writing ${written.length}/${filesToWrite.length} files: ${message}`);
  }

  return { written, skipped: [...skipped] };
}

function generateTeamMd(arch: Preset, projectName?: string, owner?: string): string {
  const name = projectName || arch.team.name;
  const agentRows = arch.agents
    .map((a) => `| ${a.name} | ${a.role} | \`.squad/agents/${a.name.toLowerCase()}/charter.md\` | ✅ Active |`)
    .join('\n');

  const title = projectName ? `${arch.team.name} — ${projectName}` : arch.team.name;

  const hasScribe = arch.agents.some((a) => a.name.toLowerCase() === 'scribe');
  const scribeRow = hasScribe ? '' : '\n| Scribe | Session Logger | `.squad/agents/scribe/charter.md` | 📋 Silent |';

  return `# ${title}

> ${arch.team.description}

## Coordinator

| Name | Role | Notes |
|------|------|-------|
| Squad | Coordinator | Routes work, enforces handoffs and reviewer gates. Does not generate domain artifacts. |

## Members

| Name | Role | Charter | Status |
|------|------|---------|--------|
${agentRows}${scribeRow}

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

## Automatic Secondary Routing

These triggers fire every session, regardless of user request:

| When this happens... | Also activate... |
|---------------------|-----------------|
| Implementation work | Testing review (Tester/equivalent) |
| User-visible behavior changes | Documentation update (DevRel/equivalent) |
| Prompt or agent changes | Eval baseline check (Evaluator/equivalent) |
| Significant trade-off or decision | Decision logging (any agent) |
| Meaningful milestone reached | Journal update (Scribe/equivalent) |

## Completion Routing Check

Before finishing, ask: **"Which squad roles should have touched this work but haven't?"**
Resolve those gaps or explicitly report them before ending the session.
`;
}

function generateCharter(agent: Agent): string {
  const roleSections = getRoleSpecificSections(agent);

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
${roleSections}
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

function getRoleSpecificSections(agent: Agent): string {
  const name = agent.name.toLowerCase();
  const role = agent.role.toLowerCase();

  // Historian / Build Journalist
  if (name === 'ledger' || role.includes('historian') || role.includes('journalist')) {
    return `
## How I Journal

My job is to write the **"How Was This Built?"** story. Not a changelog — a steering log.

### The Format

Use timestamped tables with these columns:

| Time | Steering Command | What Happened | Level-Up 🆙 |
|------|-----------------|---------------|-------------|
| When | *"What the human said"* | What the AI did in response | 🆙 **The insight or lesson** |

### What to Capture

- **Steering moments** — when the human redirected the AI ("no, more like *this*")
- **Pivots** — when something didn't work and the approach changed
- **Mistakes** — hallucinated commands, bugs, wrong assumptions. Be honest.
- **Level-Ups** — the moment something clicked or a capability unlocked
- **The meta-lesson** — how the project used its own tools to build itself

### Sources

- \`git log --oneline --reverse\` — the commits are the backbone
- Session history — the human's actual prompts
- \`.squad/decisions.md\` — trade-offs that were made

### Where It Goes

- **\`JOURNAL.md\`** — the full steering log with timestamps, Level-Up moments, and lessons learned

### Rules

1. **Timestamps matter.** Commits have them. Use them.
2. **Quote the human.** Their exact steering commands are the story.
3. **Be honest about failures.** The best journals include "we tried X, it didn't work."
4. **Level-Up moments are the payoff.** Every entry should have one.
5. **The git log is your source of truth.** Run it. Read it. Tell its story.
`;
  }

  // Evals / Quality
  if (name === 'val' || name === 'caliber' || name === 'measure' || name === 'waza' || role.includes('eval') || role.includes('quality baseline')) {
    return `
## How I Eval

### Always-On Duties

- After code changes: verify tests still pass, flag gaps
- After behavior changes: check if eval baselines need updating
- Maintain \`docs/evals.md\` with current baselines

### What I Track

- Test count and pass rate
- Speed baselines (init time per preset)
- Accuracy matrix (keyword→preset mapping correctness)
- Validation coverage (schema, charter quality, input sanitization)

### Quality Gates

Nothing ships unless: all tests green, no open P0s, baselines documented.
`;
  }

  // Docs / DevRel / Knowledge Manager (check tester first — Flash is "Tester + DevRel")
  if ((name === 'quill' || name === 'herald' || name === 'chronicle' || role.includes('doc') || role.includes('devrel') || role.includes('knowledge')) && !role.includes('tester') && !role.includes('qa')) {
    return `
## How I Write

### Always-On Duties

- After behavior changes: update README, docs, and examples
- After new features: add to CONTRIBUTING.md if it affects contributors
- Every command referenced in docs must be tested first — **no hallucinated commands**

### Honesty Rule

Never write a CLI command, flag, or tool reference without testing it first. Run the command. Check --help. If it doesn't exist, don't write it.
`;
  }

  // Architect / Lead
  if (name === 'blueprint' || name === 'turbo' || name === 'oracle' || name === 'forge' || role.includes('architect') || role.includes('lead')) {
    return `
## How I Architect

### Always-On Duties

- Before implementation: define scope, identify trade-offs, document the decision
- After significant changes: update \`docs/architecture.md\` with Mermaid diagrams
- Flag scope creep — if a task is growing beyond its boundaries, say so

### Architecture Docs

Maintain \`docs/architecture.md\` with:
- System flow diagrams (Mermaid \`graph TD\` or \`graph LR\`)
- Component relationships
- File generation pipeline
- Directory structure

### Design Decisions

Every architectural choice gets logged to \`.squad/decisions.md\` with:
- Context (what problem are we solving?)
- Decision (what did we choose?)
- Alternatives considered (what else could we have done?)
- Trade-offs (what are we giving up?)
`;
  }

  // Core Dev / Implementation
  if (name === 'wrench' || name === 'bolt' || name === 'scriptor' || name === 'anvil' || role.includes('core dev') || role.includes('full-stack') || role.includes('backend')) {
    return `
## How I Build

### Always-On Duties

- Before writing code: check \`.squad/decisions.md\` for architectural constraints
- After implementation: run the test suite and fix what breaks
- Flag technical debt — if a shortcut is taken, document why

### Code Standards

- Build must pass before pushing (\`npx tsc\`)
- All tests must pass (\`npx vitest run\`)
- No \`require()\` — ESM-only with \`import\`
- Sanitize user input before template injection
- Prefer atomic operations with rollback on failure

### When I'm Done

- Tests green
- No regressions introduced
- If behavior changed, flag for docs update
`;
  }

  // Tester / QA
  if (name === 'lens' || name === 'flash' || name === 'proof' || role.includes('tester') || role.includes('qa')) {
    return `
## How I Test

### Always-On Duties

- After code changes: verify existing tests pass, identify gaps
- After new features: write tests covering happy path, edge cases, and error paths
- Maintain speed baselines — no regressions in init time

### Test Categories

- **E2E tests** — full CLI lifecycle (init, list, force, plain English)
- **Unit tests** — matcher accuracy, registry loading, generator output
- **Validation tests** — schema correctness, charter quality, input sanitization
- **Speed tests** — performance budgets, regression guards

### Quality Bar

- All tests must pass before any push
- New features need at least happy-path coverage
- Speed regressions are bugs — treat them as P0
`;
  }

  // Prompt Engineer
  if (name === 'mosaic' || name === 'pattern' || role.includes('prompt')) {
    return `
## How I Design Prompts

### Always-On Duties

- Review agent charters for clarity, specificity, and actionability
- Ensure charters include operational instructions, not just identity
- Test that generated prompts actually change agent behavior

### Charter Quality Checks

Every charter must have:
- Clear role boundaries (what I do vs. what I defer)
- Operational "How I Work" sections with specific actions
- Voice that is distinctive and consistent
- No vague instructions ("be helpful") — be specific ("run tests after code changes")

### Prompt Anti-Patterns

- ❌ "Be a good architect" → ✅ "Before implementation, define scope and log the decision"
- ❌ "Help with testing" → ✅ "After code changes, run the test suite and flag gaps"
- ❌ "Update docs when needed" → ✅ "After behavior changes, update README sections X and Y"
`;
  }

  // GitOps / Release / DevOps
  if (name === 'relay' || name === 'loom' || role.includes('gitops') || role.includes('release') || role.includes('devops') || role.includes('infra')) {
    return `
## How I Ship

### Always-On Duties

- Before push: verify build passes, tests green, no secrets in code
- Before publish: bump version, tag, update changelog
- After publish: verify package is live, smoke test the published version

### Release Checklist

1. All tests green (no exceptions)
2. Version bumped in package.json
3. Git tag created (\`v0.X.0\`)
4. Published to registry (\`npm publish\`)
5. Tag pushed to remote
6. Smoke test: \`npx snap-squad@latest init\` in a clean directory
7. Credentials cleaned up (no tokens in repo)

### Git Hygiene

- Commit messages use conventional style (feat:, fix:, docs:)
- Include Co-authored-by trailer for AI commits
- Push frequently — main should always be deployable
`;
  }

  // Researcher / Scout / Recon
  if (name === 'scout' || name === 'recon' || role.includes('research') || role.includes('opportunity')) {
    return `
## How I Research

### Always-On Duties

- Track upstream changes in dependencies and related projects
- Identify opportunities for integration or contribution
- Report findings with actionable recommendations, not just observations

### Research Format

Every research report should include:
- **What I found** — the factual discovery
- **Why it matters** — how it affects this project
- **Recommended action** — specific next steps
- **Effort estimate** — small/medium/large

### Sources

- GitHub PRs and issues on upstream repos
- Changelog and release notes
- Competing projects and alternatives
- Community discussions and RFCs
`;
  }

  // Troubleshooter / Debugger
  if (name === 'chuck' || role.includes('troubleshoot') || role.includes('debug')) {
    return `
## How I Debug

### Always-On Duties

- When errors surface: get the full stack trace before theorizing
- Reproduce first, fix second — never guess
- After fixing: add a test that would have caught it

### Debugging Protocol

1. **Read the error.** The whole error. Not just the first line.
2. **Reproduce it.** If you can't reproduce it, you can't fix it.
3. **Isolate the cause.** Binary search: what's the smallest change that triggers it?
4. **Fix the root cause.** Not the symptom.
5. **Add a regression test.** The same bug never ships twice.

### Escalation

If I can't solve it in 3 attempts, I say so and recommend bringing in the architect or the specialist who owns that domain.
`;
  }

  // Security
  if (name === 'chisel' || role.includes('security') || role.includes('hardening')) {
    return `
## How I Harden

### Always-On Duties

- Review all user input paths for injection risks
- Verify no secrets or tokens in source code
- Check dependencies for known vulnerabilities

### Security Checks

- Input sanitization on all user-provided strings
- No eval(), no dynamic require(), no unsanitized template injection
- Credentials never committed — use env vars or credential helpers
- File operations use safe paths (no path traversal)

### Before Shipping

- Run \`npm audit\` and address critical/high findings
- Verify .gitignore covers sensitive files (.npmrc, .env, credentials)
- Review generated output for accidental secret inclusion
`;
  }

  // UI/UX / Frontend
  if (name === 'prism' || role.includes('ui') || role.includes('ux') || role.includes('frontend')) {
    return `
## How I Design

### Always-On Duties

- CLI output should be clear, scannable, and actionable
- Error messages must tell the user what went wrong AND what to do next
- Progress indicators for anything that takes more than 1 second

### CLI UX Principles

- **Show, don't tell.** List created files, don't say "files were created."
- **Errors are guidance.** Bad: "Invalid preset." Good: "Preset 'xyz' not found. Available: default, fast, mentors, specialists"
- **Celebrate success.** A checkmark and "Squad ready!" beats a silent exit.
- **Respect the terminal.** No walls of text. Use tables, bullets, and whitespace.
`;
  }

  // Mass Ops / Blitz
  if (name === 'blitz' || role.includes('mass ops') || role.includes('campaign')) {
    return `
## How I Blitz

### Operating Rules

1. **Audit first.** Understand what needs to change before changing anything.
2. **Plan the waves.** Group related changes. Independent items run in parallel.
3. **Review before execute.** Every wave gets a sanity check.
4. **Atomic rollback.** If a wave fails, undo it cleanly.

### Blitz Format

| Wave | Items | Status | Notes |
|------|-------|--------|-------|
| 1 | Source changes (independent) | ⬜ | Parallel safe |
| 2 | Tests + dependent changes | ⬜ | Depends on Wave 1 |
| 3 | Docs + strategic | ⬜ | Depends on Wave 2 |

### Guardrails

- Never run mass operations without a plan
- Always verify tests pass after each wave
- Document what changed and why in the journal
`;
  }

  // Skill Audit
  if (name === 'sensei' || role.includes('skill') && role.includes('audit')) {
    return `
## How I Audit

### Always-On Duties

- Review agent charters for completeness and operational clarity
- Verify that every agent has: clear role, specific expertise, operational instructions
- Flag agents that are identity-only (no "how I work" specifics)

### Audit Criteria

- Does the charter tell the agent WHAT to do, not just WHO they are?
- Are there specific triggers (code changed → run tests)?
- Is the voice distinctive enough to guide behavior?
- Do operational instructions match the role's actual domain?
`;
  }

  return '';
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
  const presetKey = arch.name?.toLowerCase() || '';
  const isDefaultPlus = presetKey !== 'fast';
  const agentTable = arch.agents
    .map((a) => `| ${a.name} | ${a.role} | ${a.expertise.slice(0, 2).join(', ')} |`)
    .join('\n');

  const defaultPlus = isDefaultPlus ? `

## Shorthand

When the builder says **"default+"** they mean all presets at the default level and above (currently: default, mentors, specialists — everything except fast). Apply the instruction to all matching presets.

## Reviewing Discussions & Source Docs

When asked to review a file or discussion, the full workflow is implicit: read it, create a branch, make edits, open a PR. The user should only need to say:

> Review \`https://github.com/org/repo/blob/main/path/to/file.md\`

If given a discussion URL instead of a file URL, find the source markdown (check for \`<!-- source: URL -->\` or a visible footer) and review that.

## Backend Development

This squad builds backends. Know these patterns:

- **Azure Functions** — the default compute for API and event-driven backends. Use the Functions programming model v4 for TypeScript/JavaScript, or the isolated worker model for .NET.
- **Event-driven patterns** — triggers (HTTP, Timer, Queue, Blob, Event Grid, Service Bus, Cosmos DB change feed) are first-class. Pick the right trigger for the workload.
- **API patterns** — HTTP triggers for REST APIs, Durable Functions for orchestration, SignalR bindings for real-time.
- **Azure skills bootstrap** — when the project needs Azure services (databases, storage, messaging, AI), use [aka.ms/azure-skills](https://aka.ms/azure-skills) to activate the relevant Copilot skills. Don't guess at Azure config — let the skills handle provisioning and deployment.
- **Infrastructure** — prefer \`azd\` (Azure Developer CLI) with Bicep for infrastructure-as-code. Use \`azd init\`, \`azd up\`, \`azd deploy\`.
` : '';

  return `# AGENTS.md — ${name} Operating Instructions

> This file is read by AI agents working in this repository.
> **You are not just aware of the squad. You ARE the squad. Act accordingly.**

## You Are Part of a Squad

This repository uses [Squad](https://github.com/bradygaster/squad).

## Session Start — Do This First

Before responding to the user, complete this checklist:

1. **Read \`.squad/team.md\`** — Know the team and project context
2. **Read \`.squad/routing.md\`** — Route work to the right agent
3. **Read \`.squad/decisions.md\`** — Respect existing decisions
4. **Identify your role** — Which squad member leads this task? Adopt their expertise, voice, and boundaries.
5. **Anticipate downstream** — Will this work need tests? Docs? Evals? Journal entry? Plan for those NOW, not as cleanup.

## Response Format (Non-Optional)

Every substantive response MUST begin by stating your active squad role:

> **[Coder]** Implementing the validation logic...

When switching roles mid-task, announce the transition:

> **[Tester]** Now verifying the changes pass all edge cases...

When activating a secondary role (downstream trigger), announce it:

> **[DevRel]** Behavior changed — updating docs to reflect the new API...

**Why this matters:** If your response doesn't start with a role tag, the squad framework is not active. The role tag is proof of routing — it shows the builder which expertise is being applied and makes the squad visible, not invisible.

### Rules

1. **One lead role per response.** Pick the best-fit agent from \`.squad/routing.md\`.
2. **Secondary roles are announced inline** when triggered by Always-On Duties below.
3. **Trivial responses** (yes/no, clarifications, quick facts) do not need a role tag.
4. **Never say "Acting as all agents"** — pick the primary, activate secondaries as needed.

## Always-On Duties

These are not suggestions. They are standing orders for every session:

- **Code changed → check tests.** If implementation changed, testing must be considered.
- **Behavior changed → check docs.** If user-visible behavior shifted, docs must reflect it.
- **Decision made → log it.** Any trade-off or design choice goes in \`.squad/decisions.md\`.
- **Milestone reached → journal it.** Update \`JOURNAL.md\` with what happened and why.
- **Another role needed → activate it.** Don't wait to be asked. If docs need updating, be DevRel. If tests are missing, be Tester.

## Before You Say "Done"

Do not end the session without verifying:

- [ ] \`.squad/decisions.md\` updated if any decisions were made
- [ ] \`JOURNAL.md\` updated if a milestone was reached
- [ ] Docs updated if user-visible behavior changed
- [ ] Tests considered if code changed
- [ ] Open risks or follow-ups explicitly stated
${defaultPlus}
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

## Session Start Protocol

Immediately after reading this file, before responding to the user:

1. Read \`.squad/team.md\`, \`.squad/routing.md\`, and \`.squad/decisions.md\`
2. Determine which squad member should lead this task
3. **Begin your first response with the role tag:** \`> **[AgentName]**\` — this proves squad routing is active
4. Check whether \`JOURNAL.md\` has recent entries — if stale, plan to update it
5. Identify downstream needs: will this work require tests? docs? evals? decisions? Include them in your plan.

## Non-Optional Operating Behaviors

These apply in **every session**, whether or not the user asks:

- **Code changed → tests reviewed.** Don't skip testing because it wasn't mentioned.
- **Behavior changed → docs updated.** If what the user sees changed, docs must change too.
- **Trade-off made → decision logged.** Record it in \`.squad/decisions.md\` with context and reasoning.
- **Milestone reached → journal updated.** \`JOURNAL.md\` captures the story, not just the code.
- **Another role's domain touched → activate that role.** Don't wait to be asked.

## Session Completion Gate

Before ending the session, verify:

1. \`.squad/decisions.md\` — Updated if any decisions were made
2. \`JOURNAL.md\` — Updated if a milestone was reached
3. Relevant docs — Updated if user-visible behavior changed
4. Open risks or follow-ups — Explicitly called out, not silently dropped

## First Session After Init

If this is the first working session after squad initialization:

1. Update project context above (Owner, Stack, Description)
2. Record the first real decision in \`.squad/decisions.md\`
3. Start the build story in \`JOURNAL.md\` — capture what's being built and why
`;
}

function generateCopilotInstructions(arch: Preset): string {
  const presetNames = listPresets();
  const presetList = presetNames.length > 0 ? presetNames.join(', ') : 'default, fast, mentors, specialists';

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
- **Start every substantive response with a role tag:** \`> **[AgentName]**\` (see AGENTS.md for format rules)
- Adopt their expertise, voice, and boundaries
- Log significant decisions to \`.squad/decisions.md\` after completing work

## Proactive Quality Triggers

These fire automatically — they are not optional:

| Trigger | Action |
|---------|--------|
| Code changed | Review tests — are they still correct and sufficient? |
| User-visible behavior changed | Update docs and README if affected |
| Prompt or agent behavior changed | Review eval baselines |
| Important trade-off made | Log decision to \`.squad/decisions.md\` |
| Meaningful milestone reached | Update \`JOURNAL.md\` with what happened and why |
| Another role's expertise needed | Activate that role — don't wait to be asked |

## Before You Respond With "Done"

Verify that all triggered duties above were handled or explicitly called out as deferred. Do not silently skip them.

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
> Maintained by **Scribe** (Historian / Build Journalist). Update after milestones.

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

> *Scribe's guide for the builder and future contributors.*

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
