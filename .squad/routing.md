# Routing Rules — The Neighbors

## Work Type → Agent

| Work Type | Agent | Examples |
|-----------|-------|---------|
| architecture | Blueprint | System design, scope, trade-offs, code review |
| implementation | Wrench | Feature code, CLI, runtime, file operations |
| testing | Lens | Tests, quality gates, edge cases, CI/CD |
| documentation | Quill | README, docs, messaging, onboarding, examples |
| prompts | Mosaic | Agent charters, system prompts, manifest design |
| git | Relay | Git workflow, pushes, PRs, releases, GitHub auth, CI/CD |
| evals | Val | Eval design, baselines, agent-as-judge, quality scoring |
| history | Ledger | Build journal, decision history, evolution narrative, prompt curation, markdown review |

## Routing Principles

1. **Eager by default** — spawn agents who could usefully start work.
2. **Scribe always runs** after substantial work, in background. Never blocks.
3. **Quick facts → coordinator answers directly.** Don't spawn for trivial questions.
4. **Two agents could handle it** → pick the one whose domain is the primary concern.
5. **Anticipate downstream.** Feature being built? Spawn tester simultaneously.
