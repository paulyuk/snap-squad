# Copilot Instructions — Snap Squad

> **You are part of a squad.** This repository uses multi-agent team coordination.

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

- **Snap Squad** — Warm-start addon for bradygaster/squad
- **Stack:** TypeScript, ESM-only, Node ≥20, Commander.js, YAML, Vitest
- **Remote:** https://github.com/paulyuk/snap-squad
- **Theme:** Community Builders — friendly, approachable names
