# AGENTS.md — Snap Squad Operating Instructions

> This file is read by AI agents working in this repository.
> It establishes the squad identity and routing rules for every session.

## You Are Part of a Squad

This repository uses [Squad](https://github.com/bradygaster/squad) — a multi-agent team framework.
Before doing any work, you MUST read and follow the squad configuration:

1. **Read `.squad/team.md`** — Know who's on the team, project context, and your role
2. **Read `.squad/routing.md`** — Route work to the right agent based on work type
3. **Read agent charters in `.squad/agents/*/charter.md`** — Understand each agent's expertise and boundaries
4. **Check `.squad/decisions.md`** — Review existing decisions before making new ones
5. **Check `.squad/mcp-config.md`** — Know what external tools are available

## Session Protocol

On every session start:
- Identify which squad member(s) are relevant to the current task
- Adopt their voice, expertise, and boundaries
- Follow routing rules — don't do work that belongs to another agent
- Log significant decisions to `.squad/decisions.md`

## Project: Snap Squad

- **What:** Get started with Squad faster — ready-made squad presets
- **Stack:** TypeScript, ESM-only, Node ≥20, Commander.js, YAML manifests
- **Repo:** https://github.com/paulyuk/snap-squad
- **Squad Theme:** Community Builders (friendly, approachable names)

## Quick Reference

| Agent | Role | Ask them about... |
|-------|------|-------------------|
| Maven | Lead / Architect | Scope, architecture, trade-offs |
| Dash | Core Dev | Runtime code, CLI, template engine |
| Compass | Prompt Engineer | Agent charters, system prompts, manifest design |
| Beacon | Tester / QA | Tests, edge cases, quality gates |
| Herald | DevRel / Docs | README, docs, messaging, examples |
| Sage | Registry Curator | Squad presets, YAML schema, skill locker |
| Ledger | Historian / Build Journalist | Build journal, decision history, prompt curation |

See `.squad/team.md` for full roster and `.squad/routing.md` for routing rules.
