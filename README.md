# Snap Squad

> Skip the interview. Start building.

**Get a working [Squad](https://github.com/bradygaster/squad) in one command.** No setup. No interviews. Just a team that's ready to ship.

## Quick Start

```bash
mkdir my-project && cd my-project
npx snap-squad init
```

That's it. You now have the **Neighbors** squad — a reliable generalist team with routing rules, agent charters, and decision logging. Open Copilot and start building:

```bash
copilot
# Or open VS Code — your squad is already wired in
```

### Need speed instead?

```bash
npx snap-squad init I need a fast team for a hackathon
```

Snap Squad reads your description and picks **Dash** — a speed-focused squad built for rapid POCs. No fluff, no ceremony, just velocity.

### Describe what you need. Get the right team.

```bash
npx snap-squad init help me learn best practices    # → Sages (mentor)
npx snap-squad init database security hardening      # → Specialists (precision)
npx snap-squad init something is on fire debug help  # → Specialists (Chuck is already on his way)
npx snap-squad init                                  # → Neighbors (default)
npx snap-squad init --type fast                      # → pick directly
```

### Regenerate safely

```bash
npx snap-squad init --force      # refresh structural templates, keep JOURNAL.md + .squad/decisions.md
npx snap-squad init --reset-all  # overwrite every generated file for a true clean slate
```

When `--force` preserves a content file, Snap Squad prints a warning so you know it left your journal or decisions log alone.

---

## What Is Squad?

[Squad](https://github.com/bradygaster/squad) gives you AI agent teams for any project — a multi-agent runtime built on GitHub Copilot. You define your team, route work to specialists, and ship faster.

The catch? Setting up a new squad takes time. Interviews, charters, routing config. For a big project, that's worth it. For a quick POC? It's friction.

**Snap Squad removes the friction.** One command, full squad, zero interview.

## Presets

| Preset | Vibe | Agents | Best For |
|--------|------|--------|----------|
| [**default**](docs/presets/default.md) | Generalist | Blueprint *(architect)*, Wrench *(dev)*, Lens *(QA)*, Quill *(docs)*, Mosaic *(prompts)*, Relay *(GitOps)*, Val *(light evals)*, Scout *(researcher)*, Ledger *(historian)* | General-purpose projects, reliable building |
| [**fast**](docs/presets/fast.md) | Speed | Turbo *(architect)*, Bolt *(full-stack)*, Flash *(test + docs)* | Rapid POCs, hackathons, zero fluff |
| [**mentors**](docs/presets/mentors.md) | Mentor | Polaris *(architect)*, Scriptor *(mentor dev)*, Proof *(test mentor)*, Chronicle *(docs)*, Pattern *(prompts)*, Measure *(evals)*, Scout *(researcher)*, Ledger *(historian)* | Learning, best practices, architecture review |
| [**specialists**](docs/presets/specialists.md) | Precision | Chuck 🥋 *(debugger)*, Forge *(architect)*, Anvil *(data)*, Chisel *(security)*, Prism *(UI/UX)*, Loom *(infra)*, Caliber *(deep evals)*, Sensei *(skill audit)*, Waza *(skill bench)*, Blitz *(mass ops)*, Recon *(deep research)*, Ledger *(historian)* | DB tuning, security hardening, mass ops, troubleshooting |

> **Neighbors** does light evals (Val spots-checks baselines). Need a full eval pipeline? **Specialists** brings Caliber for deep eval architecture plus Sensei and Waza for skill benchmarking.

Click any preset name above to see the full roster — every agent's role, personality, routing rules, and when to use them.

These aren't blank templates. They're squad configurations shaped by real project experience at CoreAI — tested routing rules, proven agent roles, and practical defaults.

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

## After Bootstrap: Plain English

Once your squad is initialized, just talk to it:

```
> switch my squad to the mentors preset
> add a security specialist to my team
> show me my squad routing rules
```

The generated instructions teach your AI how to manage the squad. No special syntax needed.

## Browse Presets

```bash
npx snap-squad list
```

## Want the Full Squad Runtime?

Snap Squad gets you started. The [Squad CLI](https://github.com/bradygaster/squad) takes it further — interactive shell, triage, hire, and more:

```bash
npm install -g @bradygaster/squad-cli
squad
```

## Why Not Just Use Squad Directly?

You should! Squad's built-in setup is great for tailored teams. Snap Squad is for when you want to:

- **Start in seconds** — working squad before your coffee gets cold
- **Learn from others** — presets shaped by builders who ship with Squad daily
- **Reuse patterns** — same team shape across multiple projects
- **Onboard people** — give someone a working squad without the interview

The goal is to contribute these presets upstream to Squad.

## Status

🚧 **Alpha** — Built by its own squad (dogfooding FTW).

## How This Was Built

This project was built with AI assistance, steered by a human builder. The full story — every steering moment, key decision, and evolution arc — is in the [build journal](JOURNAL.md).

## License

MIT
