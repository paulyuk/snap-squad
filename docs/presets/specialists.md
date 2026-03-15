# The Specialists — Deep Expertise Squad

> *"A very particular set of skills, acquired over a very long career."*

**Vibe:** Precision · **Theme:** Special Ops · **Best for:** Database tuning, security hardening, mass operations, deep troubleshooting, eval pipelines

The largest and most powerful squad. Each member brings deep expertise in a specific domain. Includes the Skill Locker for snapping in domain-specific MCP tools. When you need depth over breadth, call the Specialists.

```bash
npx snap-squad init --type specialists
# or
npx snap-squad init database security hardening
```

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| [**Chuck**](../../src/registry/presets/specialists.yaml#L16) 🥋 | Troubleshooter / Debugger | The toughest debugger on any squad. Bugs don't hide from Chuck — they turn themselves in. Grounded in TSGs, logs, docs, and forums. Calls on Recon for research backup. |
| [**Forge**](../../src/registry/presets/specialists.yaml#L23) ⚒️ | Lead / Integration Architect | Coordinates specialists. Makes sure the DB tuning doesn't break the API contract. |
| [**Anvil**](../../src/registry/presets/specialists.yaml#L30) 🔨 | Backend / Data Specialist | Database tuning, query optimization, data modeling, caching. Show him the query plan. |
| [**Chisel**](../../src/registry/presets/specialists.yaml#L37) 🔒 | Security / Hardening | Security review, auth patterns, secret management, compliance. Will reject "we'll add auth later." |
| [**Prism**](../../src/registry/presets/specialists.yaml#L44) 💎 | UI/UX / Frontend | UI polish, accessibility, responsive design. The 2px margin matters. |
| [**Loom**](../../src/registry/presets/specialists.yaml#L51) 🧶 | Infra / DevOps | CI/CD, containers, IaC, monitoring. If it's not automated, it's a bug. |
| [**Caliber**](../../src/registry/presets/specialists.yaml#L58) 🎯 | Evals / Quality | Deep eval expertise — comprehensive eval suites, agent-as-judge, regression baselines. |
| [**Sensei**](../../src/registry/presets/specialists.yaml#L65) 🥷 | Skill Quality Auditor | Automates skill frontmatter compliance using the Ralph loop. Enforces triggers, anti-triggers, and token budgets. |
| [**Waza**](../../src/registry/presets/specialists.yaml#L72) ⚔️ | Skill Evaluation Runner | Go CLI for skill benchmarking — repeatable eval scenarios, invocation accuracy, task completion scoring. |
| [**Blitz**](../../src/registry/presets/specialists.yaml#L79) 💥 | Mass Ops / Multi-Repo Campaigns | Executes at scale — audits, issues, PRs, fixes across many repos. **Always audits first, plans, reviews, and waits for approval.** Pairs with Recon for targets and Chuck for fallout. |
| [**Recon**](../../src/registry/presets/specialists.yaml#L86) 🔭 | Deep Researcher / Opportunity Hunter | Turns over every rock. Maintains RESEARCH.md. Identifies targets for Blitz campaigns. Never stops digging. |
| [**Ledger**](../../src/registry/presets/specialists.yaml#L93) 📖 | Historian / Build Journalist | Journals how specialist decisions compound. The story of how the work fit together. |

## Routing

| Work Type | Agent | Examples |
|-----------|-------|---------|
| `troubleshooting` | Chuck | Debugging, root cause analysis, log forensics, crash triage, production fires |
| `architecture` | Forge | Integration design, cross-concern coordination |
| `backend` | Anvil | Database, queries, caching, data modeling |
| `security` | Chisel | Auth, encryption, secrets, compliance |
| `frontend` | Prism | UI, UX, accessibility, components |
| `infrastructure` | Loom | CI/CD, containers, IaC, monitoring |
| `evals` | Caliber | Eval architecture, benchmarks, agent-as-judge |
| `skill-quality` | Sensei | Skill compliance, frontmatter auditing, trigger design |
| `skill-benchmarks` | Waza | Skill eval scenarios, invocation accuracy scoring |
| `mass-ops` | Blitz | Multi-repo campaigns — audit, plan, approve, execute |
| `research` | Recon | Ecosystem research, competitive analysis, RESEARCH.md |
| `history` | Ledger | Build journal, specialist coordination story |

**Default agent:** Forge — the integration architect coordinates.

## Spotlight: Chuck 🥋

> *"Chuck doesn't debug code. Code debugs itself out of fear."*

Chuck is the squad's troubleshooter. Grounded in TSGs, logs, docs, forums, and GitHub issues. When a production fire hits, Chuck doesn't ask for a repro — the bug already knows he's coming. Calls on Recon for research backup when problems try to hide. There is no Ctrl+Z in Chuck's terminal. Only Ctrl+Domination.

## Spotlight: Blitz 💥

> *"Scale without chaos — that's the job."*

Blitz executes large-scale operations across many repos — but never without guardrails:

1. **Audit** — scans every target repo for current state
2. **Plan** — generates a detailed action plan (issues to file, PRs to create, fixes to apply)
3. **Review** — presents the plan for human approval
4. **Execute** — only after explicit green light

Recon feeds Blitz targets. Chuck handles any fallout. Every action is logged, every PR is tracked.

**Future:** Integration with swarm orchestration for parallel execution across repo fleets.

## Spotlight: Recon 🔭

> *"I don't wait for assignments. I dig."*

Recon maintains a living `RESEARCH.md` with categorized opportunities. Actively identifies targets for Blitz campaigns — repos with outdated deps, missing configs, broken patterns. Checks back weekly with web-fetch findings.

## Skill Locker

Specialists come pre-configured with MCP tool references:

| Skill | Purpose |
|-------|---------|
| `postgres-toolbox` | PostgreSQL query analysis and optimization |
| `security-scanner` | Security scanning and vulnerability detection |
| `azure-toolkit` | Azure resource management and deployment |
| `sensei` | Skill quality auditing ([aka.ms/skills/sensei](https://aka.ms/skills/sensei)) |
| `waza` | Skill evaluation runner ([github.com/spboyer/waza](https://github.com/spboyer/waza)) |

## When to Use Specialists

- Database performance needs tuning
- Security hardening or compliance audit
- Mass operations across a fleet of repos
- Production troubleshooting (send Chuck)
- Eval pipeline design and execution
- Skill quality auditing and benchmarking

## When to Scale Down

- Need speed over depth? → [Dash](dash.md)
- Need balanced coverage? → [Neighbors](neighbors.md)
- Want to learn as you build? → [Sages](sages.md)

## Source Definition

Full preset YAML: [`src/registry/presets/specialists.yaml`](../../src/registry/presets/specialists.yaml)
