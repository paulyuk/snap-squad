# JOURNAL.md — Build Story

> The steering moments that shaped snap-squad, told in the order they happened.
> For the full timestamped log with every commit, see [`docs/how-was-this-built.md`](docs/how-was-this-built.md).

---

## Arc 1 — Genesis (Mar 14 morning)

A Gemini prompt wrote `SPEC.md`. Copilot CLI turned it into a working TypeScript CLI with 4 presets, a YAML registry, and a generator. The product was born recursive: AI defined the tool that helps AI teams work.

**Key moves:** Plain-English init (`702e57d`), E2E tests from day one (`12bfe26`), honest quickstart fix (`b4315dd`).

---

## Arc 2 — Ship & Correct (Mar 14 midday)

Published v0.1.0. Immediately discovered hallucinated commands in docs (`ghcs`, `squad up`). Fixed them and turned the embarrassment into a permanent rule: *never write a CLI command without testing it first*.

**Pivot:** Hook chain IS the squad — no runtime activation step needed (`5040692`). This was the biggest architectural insight. v0.2.0 shipped.

---

## Arc 3 — Roster Expansion (Mar 14 afternoon)

The squad grew. Val (evals), Scout (research), Chuck (debugging), Ledger (historian) each arrived because a real job needed an owner. "Artisans" became "Specialists" because fancy words don't help. "Gauge" became "Val" because warmth matters.

**Key moves:** Speed evals added (`ca3468d`), preset detail docs (`e6bb8a9`), agent spotlights (`8041d55`).

---

## Arc 4 — The Blitz (Mar 14 late afternoon)

18 proposals reviewed and implemented in one coordinated wave. Tests jumped from 35 to 84. Word-boundary matching fixed. Atomic generation with rollback, input sanitization, explain mode, dry-run all landed together. v0.4.0 shipped.

---

## Arc 5 — Squad Awakening (Mar 14 evening → Mar 15)

The builder looked at the repo and said: *"I do not feel like the squad has kicked in."*

That was the turning point. The squad had identity but no operational instructions. Decisions were empty. Journal was generic. No diagrams, no evals baseline, no contributor guide.

**What happened:**
- Filled every gap: real decisions (13 entries), architecture diagrams, eval baselines, CONTRIBUTING.md
- Rewrote all 4 hook chain templates from passive (assertiveness 2-3/5) to operational (4-5/5)
- Added "You ARE the squad. Act accordingly." to AGENTS.md
- v0.5.0 shipped: proactive squad activation from second one

---

## Arc 6 — Agent Skill-Ups (Mar 15)

Every agent across all 4 presets got operational "How I [verb]" sections in their charters. 32 agents, 14 role types, each with specific duties, quality gates, and output expectations. Ledger learned the steering log format. Flash's role matching was fixed. `docs/how-was-this-built.md` written as the full build story.

---

## What We Learned

1. **Having a roster ≠ having a team.** Agents need operational instructions, not just identity.
2. **Honesty beats hype.** Every time docs drifted from reality, fixing them made the product better.
3. **Dogfooding is brutal and valuable.** The biggest improvements came from using snap-squad on itself.
4. **Hook chain is the runtime.** Generated files aren't config — they're the actual system.
5. **Name an owner.** Roles turn wishes into work.

---

*The code shows what was built. This journal shows why. The [full steering log](docs/how-was-this-built.md) shows how.*
