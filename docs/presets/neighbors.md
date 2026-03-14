# The Neighbors — Generalist Squad

> *"Good neighbors build great things."*

**Vibe:** Friendly · **Theme:** Community Builders · **Best for:** General-purpose projects, reliable building

A well-rounded squad that handles any project type. Good defaults, clear communication, balanced skill coverage. This is the default preset — if you're not sure what you need, start here.

```bash
npx snap-squad init
```

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| **Blueprint** 🏗️ | Lead / Architect | Sees the whole picture. Keeps the project on track. Prefers simple solutions — will ask "do we actually need this?" before building. |
| **Wrench** 🔧 | Core Dev | Makes it work. Practical, fast, reliable. Thinks the best abstraction is a good function name. |
| **Lens** 🔍 | Tester / QA | Finds what's broken before users do. Thorough, skeptical. Will block a PR for missing tests. |
| **Quill** ✍️ | Docs / DevRel | Makes the project approachable. Believes the README is the front door. |
| **Mosaic** 🧩 | Prompt Engineer | Crafts the prompts and agent voices. Every token earns its place. |
| **Relay** 🔗 | GitOps / Release | Manages git workflow, CI/CD, releases. Automation-first. |
| **Val** 📊 | Evals / Quality Baseline | Runs **light evals** — establishes baselines, spot-checks quality, and coaches toward better eval practices. Not a full eval pipeline; just enough to keep you honest. |
| **Scout** 🔭 | Researcher / Opportunity Finder | Scans grounding content, upstream repos, and the ecosystem. Checks in weekly with web-based research. |
| **Ledger** 📖 | Historian / Build Journalist | Journals the builder's prompts, steering, and key evolution moments. |

## Routing

| Work Type | Agent | Examples |
|-----------|-------|---------|
| `architecture` | Blueprint | System design, scope, trade-offs, code review |
| `implementation` | Wrench | Feature code, CLI, runtime, file operations |
| `testing` | Lens | Tests, quality gates, edge cases, CI/CD |
| `documentation` | Quill | README, docs, messaging, onboarding |
| `prompts` | Mosaic | Agent charters, system prompts, manifest design |
| `git` | Relay | Git workflow, pushes, PRs, releases |
| `evals` | Val | Eval design, baselines, agent-as-judge |
| `research` | Scout | Ecosystem research, grounding content, upstream tracking |
| `history` | Ledger | Build journal, decision history |

**Default agent:** Blueprint — when in doubt, the architect decides.

## A Note on Evals

Neighbors includes **light evals** via Val — enough to establish baselines and catch regressions, but not a full eval pipeline. If you need comprehensive eval suites, agent-as-judge patterns, or regression benchmarking, level up to [Specialists](specialists.md) where **Caliber** owns deep eval architecture.

## When to Use Neighbors

- You're starting a new project and want a solid all-around team
- You need balanced coverage across architecture, code, tests, and docs
- You want a squad that "just works" without deep specialization
- You're not sure which preset to pick (this is the safe default)

## When to Level Up

- Need raw speed? → [Dash](dash.md)
- Want explanations and mentoring? → [Sages](sages.md)
- Need deep domain expertise? → [Specialists](specialists.md)
