# JOURNAL.md — Build Story

> How this project was built, the steering moments that shaped it, and why things are the way they are.
> Maintained by **Ledger** (Historian / Build Journalist). Update after milestones.

---

## 2026-03-15 — Project Bootstrapped

**Squad:** The Neighbors · **Vibe:** friendly · **Theme:** Community Builders

### The Team

Blueprint, Wrench, Lens, Quill, Mosaic, Relay, Val, Scout, Ledger

### What Happened

Project initialized with the **The Neighbors** squad preset via `npx snap-squad init`. The full `.squad/` directory, hook chain (AGENTS.md, CLAUDE.md, copilot-instructions.md), and this journal were generated automatically.

### Steering Moment

The builder chose **neighbors** — default generalist squad — reliable, well-rounded, good for any project. This shapes everything that follows: who reviews code, how decisions get made, what gets tested first.

### What's Next

- [ ] First real feature or task
- [ ] Builder configures project context in `.squad/team.md`
- [ ] First decision logged to `.squad/decisions.md`

---

## How to Use This Journal

> *Ledger's guide for the builder and future contributors.*

This isn't a changelog. It's the **story of how the project was built** — the decisions, the pivots, the moments where the builder steered the squad in a new direction.

### What to capture

| Entry Type | When | Example |
|-----------|------|---------|
| **Steering Moment** | Builder redirects the squad | "Switched from REST to GraphQL after seeing the query complexity" |
| **Key Decision** | Trade-off was made | "Chose SQLite over Postgres — this is a CLI tool, not a service" |
| **Evolution** | Architecture shifted | "Split monolith into 3 modules after hitting circular deps" |
| **Milestone** | Something shipped | "v0.1.0 published to npm — first public release" |
| **Lesson Learned** | Something surprised you | "Vitest runs 10x faster than Jest for this project — switching permanently" |

### Template for new entries

```markdown
## YYYY-MM-DD — Title

### What Happened

(What was built, changed, or decided)

### Why

(The reasoning — what alternatives existed, what trade-offs were made)

### Steering Moment

(How the builder directed the work — what prompt, feedback, or redirection shaped the outcome)

### Impact

(What this changes going forward)
```

### Rules

1. **Write for future-you.** Six months from now, this journal explains *why* the code looks the way it does.
2. **Capture the steering, not the typing.** The git log shows what changed. The journal shows *why it changed*.
3. **Be honest about pivots.** The best journals include "we tried X, it didn't work, here's why we switched to Y."
4. **Update after milestones, not after every commit.** Quality over quantity.

---

*The code shows what was built. The journal shows why.*
