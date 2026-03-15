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
| [**Debugger**](../../src/registry/presets/specialists.yaml#L16) 🥋 | Troubleshooter / Debugger | The toughest debugger on any squad. Bugs don't hide from Debugger — they turn themselves in. Grounded in TSGs, logs, docs, and forums. Calls on Researcher for research backup. |
| [**Architect**](../../src/registry/presets/specialists.yaml#L23) ⚒️ | Lead / Integration Architect | Coordinates specialists. Makes sure the DB tuning doesn't break the API contract. |
| [**Backend**](../../src/registry/presets/specialists.yaml#L30) 🔨 | Backend / Data Specialist | Database tuning, query optimization, data modeling, caching. Show him the query plan. |
| [**Security**](../../src/registry/presets/specialists.yaml#L37) 🔒 | Security / Hardening | Security review, auth patterns, secret management, compliance. Will reject "we'll add auth later." |
| [**Frontend**](../../src/registry/presets/specialists.yaml#L44) 💎 | UI/UX / Frontend | UI polish, accessibility, responsive design. The 2px margin matters. |
| [**DevOps**](../../src/registry/presets/specialists.yaml#L51) 🧶 | Infra / DevOps | CI/CD, containers, IaC, monitoring. If it's not automated, it's a bug. |
| [**Evaluator**](../../src/registry/presets/specialists.yaml#L58) 🎯 | Evals / Quality | Deep eval expertise — comprehensive eval suites, agent-as-judge, regression baselines. |
| [**Auditor**](../../src/registry/presets/specialists.yaml#L65) 🥷 | Skill Quality Auditor | Automates skill frontmatter compliance using the Ralph loop. Enforces triggers, anti-triggers, and token budgets. |
| [**EvalRunner**](../../src/registry/presets/specialists.yaml#L72) ⚔️ | Skill Evaluation Runner | Go CLI for skill benchmarking — repeatable eval scenarios, invocation accuracy, task completion scoring. |
| [**Swarm**](../../src/registry/presets/specialists.yaml#L79) 💥 | Mass Ops / Multi-Repo Campaigns | Executes at scale — audits, issues, PRs, fixes across many repos. **Always audits first, plans, reviews, and waits for approval.** Pairs with Researcher for targets and Debugger for fallout. |
| [**Researcher**](../../src/registry/presets/specialists.yaml#L86) 🔭 | Deep Researcher / Opportunity Hunter | Turns over every rock. Maintains RESEARCH.md. Identifies targets for Swarm campaigns. Never stops digging. |
| [**Scribe**](../../src/registry/presets/specialists.yaml#L93) 📖 | Historian / Build Journalist | Journals how specialist decisions compound. The story of how the work fit together. |

## Routing

| Work Type | Agent | Examples |
|-----------|-------|---------|
| `troubleshooting` | Debugger | Debugging, root cause analysis, log forensics, crash triage, production fires |
| `architecture` | Architect | Integration design, cross-concern coordination |
| `backend` | Backend | Database, queries, caching, data modeling |
| `security` | Security | Auth, encryption, secrets, compliance |
| `frontend` | Frontend | UI, UX, accessibility, components |
| `infrastructure` | DevOps | CI/CD, containers, IaC, monitoring |
| `evals` | Evaluator | Eval architecture, benchmarks, agent-as-judge |
| `skill-quality` | Auditor | Skill compliance, frontmatter auditing, trigger design |
| `skill-benchmarks` | EvalRunner | Skill eval scenarios, invocation accuracy scoring |
| `mass-ops` | Swarm | Multi-repo campaigns — audit, plan, approve, execute |
| `research` | Researcher | Ecosystem research, competitive analysis, RESEARCH.md |
| `history` | Scribe | Build journal, specialist coordination story |

**Default agent:** Architect — the integration architect coordinates.

## Spotlight: Debugger 🥋

> *"Debugger doesn't debug code. Code debugs itself out of fear."*

Debugger is the squad's troubleshooter. Grounded in TSGs, logs, docs, forums, and GitHub issues. When a production fire hits, Debugger doesn't ask for a repro — the bug already knows he's coming. Calls on Researcher for research backup when problems try to hide. There is no Ctrl+Z in Debugger's terminal. Only Ctrl+Domination.

## Spotlight: Swarm 💥

> *"Scale without chaos — that's the job."*

Swarm executes large-scale operations across many repos — but never without guardrails:

1. **Audit** — scans every target repo for current state
2. **Plan** — generates a detailed action plan (issues to file, PRs to create, fixes to apply)
3. **Review** — presents the plan for human approval
4. **Execute** — only after explicit green light

Researcher feeds Swarm targets. Debugger handles any fallout. Every action is logged, every PR is tracked.

**Future:** Integration with swarm orchestration for parallel execution across repo fleets.

## Spotlight: Researcher 🔭

> *"I don't wait for assignments. I dig."*

Researcher maintains a living `RESEARCH.md` with categorized opportunities. Actively identifies targets for Swarm campaigns — repos with outdated deps, missing configs, broken patterns. Checks back weekly with web-fetch findings.

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
- Production troubleshooting (send Debugger)
- Eval pipeline design and execution
- Skill quality auditing and benchmarking

## When to Scale Down

- Need speed over depth? → [Fast](fast.md)
- Need balanced coverage? → [Default](default.md)
- Want to learn as you build? → [Mentors](mentors.md)

## Source Definition

Full preset YAML: [`src/registry/presets/specialists.yaml`](../../src/registry/presets/specialists.yaml)
