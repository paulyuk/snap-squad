# Routing Rules — The Default Squad

## Work Type → Agent

| Work Type | Agent | Examples |
|-----------|-------|---------|
| architecture | Architect | System design, scope, trade-offs, code review |
| implementation | Coder | Feature code, CLI, runtime, file operations |
| testing | Tester | Tests, quality gates, edge cases, CI/CD |
| documentation | DevRel | README, docs, messaging, onboarding, examples |
| prompts | Prompter | Agent charters, system prompts, manifest design |
| git | GitOps | Git workflow, pushes, PRs, releases, GitHub auth, CI/CD |
| evals | Evaluator | Eval design, baselines, agent-as-judge, quality scoring |
| research | Researcher | Ecosystem research, grounding content review, upstream tracking, weekly opportunity check-ins |
| history | Scribe | Build journal, decision history, evolution narrative, prompt curation, markdown review |

## Routing Principles

1. **Eager by default** — spawn agents who could usefully start work.
2. **Scribe always runs** after substantial work, in background. Never blocks.
3. **Quick facts → coordinator answers directly.** Don't spawn for trivial questions.
4. **Two agents could handle it** → pick the one whose domain is the primary concern.
5. **Anticipate downstream.** Feature being built? Spawn tester simultaneously.

## Automatic Secondary Routing

These triggers fire every session, regardless of user request:

| When this happens... | Also activate... |
|---------------------|-----------------|
| Implementation work | Testing review (Lens/equivalent) |
| User-visible behavior changes | Documentation update (Quill/equivalent) |
| Prompt or agent changes | Eval baseline check (Val/equivalent) |
| Significant trade-off or decision | Decision logging (any agent) |
| Meaningful milestone reached | Journal update (Ledger/equivalent) |

## Completion Routing Check

Before finishing, ask: **"Which squad roles should have touched this work but haven't?"**
Resolve those gaps or explicitly report them before ending the session.
