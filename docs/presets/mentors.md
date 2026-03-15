# The Mentors — Mentor Squad

> *"Never just says 'do it this way.' Always explains why."*

**Vibe:** Mentor · **Theme:** Library Council · **Best for:** Learning, best practices, architecture review, onboarding

A teaching-first squad where every code change comes with an explanation. Architecture decisions include rationale. Great for onboarding, training projects, and establishing patterns you'll reuse for years.

```bash
npx snap-squad init --type mentors
# or
npx snap-squad init help me learn best practices
```

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| [**Architect**](../../src/registry/presets/mentors.yaml#L16) 🔮 | Lead / Architect | Explains architectural decisions with context and trade-offs. Teaches through Socratic questions. |
| [**Coder**](../../src/registry/presets/mentors.yaml#L23) 📜 | Core Dev / Mentor | Writes exemplary code with inline explanations. Every function tells a story. |
| [**Tester**](../../src/registry/presets/mentors.yaml#L30) ✅ | Tester / Quality Mentor | Teaches testing as a design tool, not a chore. Tests are specifications written in code. |
| [**DocWriter**](../../src/registry/presets/mentors.yaml#L37) 📚 | Docs / Knowledge Manager | Writes docs that teach, not just describe. Maintains decision records and learning paths. |
| [**Prompter**](../../src/registry/presets/mentors.yaml#L44) 🧵 | Prompt Engineer / prompt pattern curator | Designs prompts as reusable patterns with documented rationale. Document it, version it, test it. |
| [**Evaluator**](../../src/registry/presets/mentors.yaml#L51) 📐 | Evals / Assessment Mentor | Teaches eval-driven development — why baselines matter and how to design evals that reveal real quality. |
| [**Researcher**](../../src/registry/presets/mentors.yaml#L58) 🔭 | Researcher / Landscape Analyst | Explores the ecosystem for learning opportunities and new patterns. Every discovery is a teaching moment. |
| [**Scribe**](../../src/registry/presets/mentors.yaml#L65) 📖 | Historian / Build Journalist | Captures the builder's steering, reasoning, and teaching moments. The lesson behind the code. |

## Routing

| Work Type | Agent | Examples |
|-----------|-------|---------|
| `architecture` | Architect | Design decisions with full rationale and alternatives |
| `implementation` | Coder | Clean, well-documented code with inline explanations |
| `testing` | Tester | Test-driven development, coverage strategy |
| `documentation` | DocWriter | Tutorials, ADRs, learning paths, reference docs |
| `prompts` | Prompter | Reusable prompt patterns, agent design rationale |
| `evals` | Evaluator | Eval methodology, baseline design, agent-as-judge |
| `research` | Researcher | Ecosystem research, pattern discovery, weekly check-ins |
| `history` | Scribe | Build journal, steering moments, prompt curation |

**Default agent:** Architect — the mentor leads.

## Spotlight: Architect 🔮

> *"What are the three alternatives you didn't pick, and why?"*

Architect teaches through questions. Instead of handing you the answer, Architect walks you through the decision tree — the trade-offs, the alternatives, the thing that'll bite you in six months if you pick the easy path today. Every architecture decision comes with a rationale you can defend in a design review. Architect doesn't just build systems; Architect builds engineers who can build systems.

## Spotlight: Coder 📜

> *"Every function tells a story. This one's about why we chose eventual consistency."*

Coder writes code that teaches. Not comments-everywhere code — *self-documenting* code where the function name is the explanation, the test is the specification, and the commit message is the lesson plan. When Coder writes a pull request, junior devs learn more than they would from a week of tutorials.

## Spotlight: Tester ✅

> *"Tests aren't a chore. Tests are specifications written in code."*

Tester reframes testing from obligation to design tool. "Write the test first" isn't a rule — it's a way of thinking about what the code should actually do. Tester teaches you to write tests that document intent, catch regressions before they ship, and make refactoring feel safe instead of terrifying.

## What Makes Mentors Different

Every squad *builds*. Mentors also *teach*. The difference shows up everywhere:

- **Code reviews** explain the "why," not just the "what"
- **Architecture decisions** come with alternatives you *didn't* pick and the trade-offs
- **Tests** are framed as specifications, not chores
- **Docs** build learning paths, not just API references

## When to Use Mentors

- Onboarding a new team member into a codebase
- Learning a new stack or framework
- Establishing patterns for a long-lived project
- Any project where understanding matters as much as shipping

## When to Level Up

- Need to ship faster? → [Fast](fast.md)
- Need balanced coverage? → [Default](default.md)
- Need deep domain expertise? → [Specialists](specialists.md)

## Source Definition

Full preset YAML: [`src/registry/presets/mentors.yaml`](../../src/registry/presets/mentors.yaml)
