# Snap Squad

**Warm-start addon for [Squad](https://github.com/bradygaster/squad)** — pre-baked agent archetypes for instant deployment.

> Stop interviewing. Start building.

[![Status](https://img.shields.io/badge/status-alpha-blueviolet)](#status)

## The Problem

Squad's "hiring" process (interactive interview to build your team) is powerful but slow for rapid POCs and repetitive workflows. Every new project starts with the same 5-minute setup ritual.

## The Solution

Snap Squad provides **pre-baked agent archetypes** that inject a fully-configured `.squad/` directory in seconds:

```bash
npx snap-squad init --type dash
# → .squad/ created with Dash Squad (rapid POC team)
# → .github/copilot-instructions.md hooked
# → Ready for `squad up` immediately
```

## Archetypes

| Squad | Vibe | Best For |
|-------|------|----------|
| **The Neighbors** | Generalist | General-purpose projects, reliable building |
| **The Dash Squad** | Speed | Rapid POCs, hackathons, zero fluff |
| **The Sages** | Mentor | Learning, best practices, architecture review |
| **The Artisans** | Precision | Niche specialization, DB tuning, security hardening |

## How It Works

1. `snap-squad init --type <archetype>` reads from the **Snap Registry** (YAML manifests)
2. Generates the full `.squad/` directory (team.md, agent charters, routing, MCP config)
3. Writes the **hook chain** (`AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`) so every future AI session is squad-aware
4. You run `squad up` and start working immediately

## The Hook Chain (Squad-Aware Sessions)

Snap Squad's killer feature: **sessions never forget the squad.**

Every generated project includes three files that make AI assistants squad-aware:

| File | Who Reads It | Purpose |
|------|-------------|---------|
| `AGENTS.md` | Any AI agent | Universal squad operating instructions |
| `CLAUDE.md` | Claude / Copilot CLI | Session memory, project context, squad identity |
| `.github/copilot-instructions.md` | GitHub Copilot | Copilot-specific squad integration |

These all point to `.squad/` — so regardless of which AI tool opens your workspace, it knows the squad and follows the routing rules.

## Status

🚧 **Alpha** — Built by its own squad (dogfooding FTW).

## License

MIT
