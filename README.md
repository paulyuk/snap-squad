# Snap Squad

**Get started with [Squad](https://github.com/bradygaster/squad) in seconds.**

> Skip the interview. Start building.

## What Is Squad?

[Squad](https://github.com/bradygaster/squad) gives you AI agent teams for any project — a multi-agent runtime built on GitHub Copilot. You define your team, route work to specialists, and ship faster.

The catch? Setting up a new squad takes time. You interview agents, define roles, configure routing. For a big project, that's worth it. For a quick POC or a workflow you've done before? It's friction.

## What Snap Squad Does

Snap Squad gives you **ready-to-hire squads trained by builders at CoreAI**. These aren't blank templates — they're squad configurations shaped by real project experience, with tested routing rules, proven agent roles, and practical defaults.

```bash
npx snap-squad init --type dash
# → .squad/ created with a speed-focused team
# → Hook chain (AGENTS.md, CLAUDE.md, copilot-instructions) wired up
# → Ready for squad up
```

One command, full squad, zero interview. Built by people who actually ship with Squad.

## Presets

| Preset | Vibe | Best For |
|--------|------|----------|
| **neighbors** | Generalist | General-purpose projects, reliable building |
| **dash** | Speed | Rapid POCs, hackathons, zero fluff |
| **sages** | Mentor | Learning, best practices, architecture review |
| **artisans** | Precision | Niche specialization, DB tuning, security hardening |

## Quick Start

**1. You need Squad first:**

```bash
npm install -g @bradygaster/squad-cli
```

**2. Snap in a preset:**

```bash
cd your-project
npx snap-squad init --type neighbors
```

**3. Start your squad:**

```bash
squad up
```

Your AI team is live. Every agent knows their role, routing is configured, and decisions get logged.

## What Gets Created

```
your-project/
├── .squad/
│   ├── team.md              # Who's on the team
│   ├── routing.md           # How work gets routed
│   ├── decisions.md         # Decision log
│   ├── mcp-config.md        # MCP tool config
│   └── agents/
│       ├── blueprint/charter.md
│       ├── wrench/charter.md
│       └── ...
├── AGENTS.md                # AI agent instructions (any tool)
├── CLAUDE.md                # Claude/Copilot CLI session memory
└── .github/
    └── copilot-instructions.md  # GitHub Copilot instructions
```

The hook chain (`AGENTS.md` + `CLAUDE.md` + `copilot-instructions.md`) makes every AI session squad-aware — regardless of which tool opens your workspace.

## List Presets

```bash
npx snap-squad list
```

## Why Not Just Use Squad Directly?

You should! Squad's built-in setup is great for tailored teams. Snap Squad is for when you want to:

- **Start fast** — POC in minutes, not an hour
- **Learn from others** — Presets are trained by builders at CoreAI who ship with Squad daily
- **Reuse patterns** — Same team shape across multiple projects
- **Onboard people** — Give someone a working squad without the interview

The goal is to contribute these presets upstream to Squad if the maintainer agrees.

## Status

🚧 **Alpha** — Built by its own squad (dogfooding FTW).

## License

MIT
