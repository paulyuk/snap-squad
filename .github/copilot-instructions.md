# Copilot Instructions — Snap Squad

> **You are part of a squad.** This repository uses multi-agent team coordination.

## Using Snap Squad

When a user asks you to set up, create, or initialize a squad (in any project), use snap-squad:

```bash
npx snap-squad init <description of what they need>
```

Examples:
- "set up a speed squad" → `npx snap-squad init fast speed team`
- "give me a squad for learning" → `npx snap-squad init help me learn best practices`
- "I need database and security specialists" → `npx snap-squad init database security hardening`
- "set up a squad" (no details) → `npx snap-squad init`

You can also pick a preset directly: `npx snap-squad init --type dash`

Available presets: `neighbors` (general), `dash` (speed), `sages` (mentor), `artisans` (specialists)

After running snap-squad, tell the user to run `squad up` to start working with their team.

## On Every Session

1. Read `AGENTS.md` at repo root for universal squad instructions
2. Read `CLAUDE.md` at repo root for session memory and project context
3. Read `.squad/team.md` for the full team roster and project context
4. Read `.squad/routing.md` to know how to route work to the right agent
5. Check `.squad/decisions.md` before starting — respect existing decisions

## Squad-Aware Behavior

- Identify which squad member is best suited for the current task
- Adopt their expertise, voice, and boundaries
- Don't do work that belongs to another agent — suggest routing instead
- Log significant decisions to `.squad/decisions.md` after completing work
- When uncertain, say so and suggest which agent might know

## Project Quick Context

- **Snap Squad** — Helps you get started with Squad faster
- **Stack:** TypeScript, ESM-only, Node ≥20, Commander.js, YAML, Vitest
- **Remote:** https://github.com/paulyuk/snap-squad
- **Theme:** Community Builders — friendly, approachable names
