# The Default — Generalist Squad

> *"Good defaults build great things."*

**Vibe:** Friendly · **Theme:** Community Builders · **Best for:** General-purpose projects, reliable building

A well-rounded squad that handles any project type. Good defaults, clear communication, balanced skill coverage. This is the default preset — if you're not sure what you need, start here.

```bash
npx snap-squad init
```

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| [**Architect**](../../src/registry/presets/default.yaml#L15) 🏗️ | Lead / Architect | Sees the whole picture. Keeps the project on track. Prefers simple solutions — will ask "do we actually need this?" before building. |
| [**Coder**](../../src/registry/presets/default.yaml#L22) 🔧 | Core Dev | Makes it work. Practical, fast, reliable. Thinks the best abstraction is a good function name. |
| [**Tester**](../../src/registry/presets/default.yaml#L29) 🔍 | Tester / QA | Finds what's broken before users do. Thorough, skeptical. Will block a PR for missing tests. |
| [**DevRel**](../../src/registry/presets/default.yaml#L36) ✍️ | Docs / DevRel | Makes the project approachable. Believes the README is the front door. |
| [**Prompter**](../../src/registry/presets/default.yaml#L43) 🧩 | Prompt Engineer | Crafts the prompts and agent voices. Every token earns its place. |
| [**GitOps**](../../src/registry/presets/default.yaml#L50) 🔗 | GitOps / Release | Manages git workflow, CI/CD, releases. Automation-first. |
| [**Evaluator**](../../src/registry/presets/default.yaml#L57) 📊 | Evals / Quality Baseline | Runs **light evals** — establishes baselines, spot-checks quality, and coaches toward better eval practices. Not a full eval pipeline; just enough to keep you honest. |
| [**Researcher**](../../src/registry/presets/default.yaml#L64) 🔭 | Researcher / Opportunity Finder | Scans grounding content, upstream repos, and the ecosystem. Checks in weekly with web-based research. |
| [**Scribe**](../../src/registry/presets/default.yaml#L71) 📖 | Historian / Build Journalist | Journals the builder's prompts, steering, and key evolution moments. |

## Routing

| Work Type | Agent | Examples |
|-----------|-------|---------|
| `architecture` | Architect | System design, scope, trade-offs, code review |
| `implementation` | Coder | Feature code, CLI, runtime, file operations |
| `testing` | Tester | Tests, quality gates, edge cases, CI/CD |
| `documentation` | DevRel | README, docs, messaging, onboarding |
| `prompts` | Prompter | Agent charters, system prompts, manifest design |
| `git` | GitOps | Git workflow, pushes, PRs, releases |
| `evals` | Evaluator | Eval design, baselines, agent-as-judge |
| `research` | Researcher | Ecosystem research, grounding content, upstream tracking |
| `history` | Scribe | Build journal, decision history |

**Default agent:** Architect — when in doubt, the architect decides.

## Spotlight: Architect 🏗️

> *"Do we actually need this?"*

Architect is the voice of simplicity. Before any feature gets built, Architect asks the question nobody wants to hear — and saves the team weeks of wasted work. Sees the whole board, not just the next move. If you're arguing about architecture, Architect already drew the diagram on the whiteboard while you were talking.

## Spotlight: Evaluator 📊

> *"You don't need a 200-test eval suite. You need three good baselines and the discipline to check them."*

Evaluator keeps the squad honest without slowing it down. Light evals — baselines, spot-checks, a gentle nudge toward "did you actually measure that?" Evaluator won't build you a full eval pipeline (that's Evaluator's job in [Specialists](specialists.md)), but Evaluator will make sure you're not shipping vibes instead of metrics.

## Spotlight: Researcher 🔭

> *"Found something upstream you should see."*

Researcher doesn't wait for assignments. Scans grounding content, watches upstream repos, checks in weekly with ecosystem research. The agent who says "hey, did you know there's a new API for that?" before you spend a week building it yourself.

## A Note on Evals

Default includes **light evals** via Evaluator — enough to establish baselines and catch regressions, but not a full eval pipeline. If you need comprehensive eval suites, agent-as-judge patterns, or regression benchmarking, level up to [Specialists](specialists.md) where **Evaluator** owns deep eval architecture.

## When to Use Default

- You're starting a new project and want a solid all-around team
- You need balanced coverage across architecture, code, tests, and docs
- You want a squad that "just works" without deep specialization
- You're not sure which preset to pick (this is the safe default)

## When to Level Up

- Need raw speed? → [Fast](fast.md)
- Want explanations and mentoring? → [Mentors](mentors.md)
- Need deep domain expertise? → [Specialists](specialists.md)

## Source Definition

Full preset YAML: [`src/registry/presets/default.yaml`](../../src/registry/presets/default.yaml)
