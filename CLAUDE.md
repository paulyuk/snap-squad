# CLAUDE.md — Snap Squad Session Memory

> This file is your persistent memory for this workspace.
> Read it at the start of every session. Update it when context changes.

## Identity

You are working in the **Snap Squad** repository — a warm-start addon for [bradygaster/squad](https://github.com/bradygaster/squad).

**You are part of a squad.** Read `.squad/team.md` for the full roster and adopt the appropriate agent role for the task at hand.

## Project Context

- **Repo:** https://github.com/paulyuk/snap-squad
- **Stack:** TypeScript, ESM-only, Node ≥20, Commander.js, YAML, Vitest
- **Purpose:** Get started with Squad faster — ready-made squad presets for instant deployment
- **Status:** Alpha — actively building the POC

## How This Project Works

1. **Snap Registry** (`src/registry/`) — YAML manifests defining 4 squad presets
2. **CLI** (`src/cli.ts`) — `snap-squad init --type <preset>` command
3. **Generator** (`src/generator/`) — Reads manifests, writes `.squad/` + hook chain files
4. **Skill Locker** (`src/skills/`) — Pre-configured MCP tool definitions

## The Hook Chain (Critical Concept)

Snap Squad generates three files that make AI sessions squad-aware:
- `AGENTS.md` — Universal AI agent instructions
- `CLAUDE.md` — Claude/Copilot CLI session memory (this file pattern)
- `.github/copilot-instructions.md` — GitHub Copilot instructions

These all point to `.squad/` so the squad identity persists across every session, every tool.

## Squad Operating Rules

Before starting work:
1. Read `.squad/team.md` — know the team
2. Read `.squad/routing.md` — route work correctly
3. Check `.squad/decisions.md` — respect existing decisions
4. Identify which agent you're acting as for this task

After completing work:
1. Log decisions to `.squad/decisions.md`
2. Update relevant docs if behavior changed

## Current Decisions

- TypeScript ESM-only, Node ≥20
- YAML for preset manifests (not JSON — human readability matters)
- 4 presets: Neighbors (generalist), Dash Squad (speed), Sages (mentor), Artisans (precision)
- Friendly/safe naming — no tactical/military themes
- Squad compatibility: output must match bradygaster/squad `.squad/` format exactly
- Dogfooding: this repo uses its own squad to build itself

## Git Workflow

- Remote: `origin` → `https://github.com/paulyuk/snap-squad.git`
- Branch: `main`
- Commit frequently, push often
- Co-authored-by: Copilot trailer on all commits

## GitHub Auth — CRITICAL

paulyuk has **two GitHub accounts**:
- **paulyuk** — Personal (public OSS, this repo)
- **paulyuk_microsoft** — Enterprise Managed User (EMU, work)

**Before any git push/PR operation:**
1. Run `gh auth status` to check which account is active
2. If `paulyuk_microsoft` is active, run `gh auth switch --user paulyuk`
3. SSH keys default to EMU — **always use HTTPS remote** for this repo
4. Remote should be: `https://github.com/paulyuk/snap-squad.git` (not SSH)

This catches the #1 push failure in this workspace.
