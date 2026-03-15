# JOURNAL.md — Build Story

> **Meta-lesson:** snap-squad is its own best example. It teaches builders to steer a squad with plain language, fast feedback, honest docs, and explicit roles — and that is exactly how this repository was built.

---

snap-squad did not emerge from a slow, linear plan. It came together in a tightly steered burst: a prompt sparked a spec, a spec became a CLI, the docs got ahead of reality, the team corrected course, the roster expanded, and then the product had to confront a deeper truth — having a squad on paper is not the same thing as having a squad that actually acts.

## The Spark

The first artifact was not code. It was a **Gemini prompt**.

That prompt produced `SPEC.md`: a crisp description of pre-baked squad presets for different kinds of builders. Then Copilot CLI took that spec and implemented the working product: a TypeScript CLI, YAML preset definitions, a generator, and the hook chain that teaches every assistant who the squad is.

The real origin story is delightfully recursive: **snap-squad was built the way snap-squad asks teams to build.**

## The Complete Steering Log

### Session 1 — Genesis & First Ship (Mar 14, 9:55 AM – 12:52 PM PT)

| Time | Steering Command | What Happened | Level-Up |
|---|---|---|---|
| 9:55 AM · `164ab20` | "Initial snap-squad POC" | A Gemini prompt wrote `SPEC.md`, and Copilot CLI turned that spec into the first working POC: TypeScript CLI, YAML presets, generator, and hook chain. Four presets landed in the opening move: Neighbors, Dash, Sages, and Artisans. | 🌱 **Project born from a Gemini prompt.** |
| 10:11 AM · `9b441d8` | "dont use the word archetype... nor persona, ever" | The language got reset from clever to clear. "Archetypes" became "presets," "persona" disappeared. | 🚫 **No fancy words.** Naming is product design, not decoration. |
| 10:14 AM · `702e57d` | "Add plain English init" | The CLI stopped requiring users to know preset names up front. A natural-language matcher picks the right preset. | 🗣️ **Plain English beats memorization.** |
| 10:15 AM · `12bfe26` | "Add E2E test suite" | 12-test end-to-end suite covering the full CLI lifecycle. | ✅ **Testing from day one.** |
| 10:38 AM · `b4315dd` | "Fix bootstrap flow: honest quickstart" | Docs were implying a smoother experience than reality. Fixed. | 🪞 **Honesty beats hype.** |
| 10:48 AM · `732393b` | "Hire Ledger" | The historian role made "capture the build story" an explicit responsibility. | 📝 **If it matters, name an owner.** |
| 12:25 PM · `ada4b44` | "Publish to npm" | `snap-squad@0.1.0` went live. | 🚀 **Ship early enough to learn in public.** |
| 12:31 PM · `5040692` | "no squad up, hook chain IS the squad" | The biggest pivot. No runtime activation step needed. If the hook chain files exist, the squad exists. v0.2.0. | 🏛️ **Hook chain IS the squad.** |
| 12:34 PM · `5b1a581` | "Fix hallucinated ghcs command" | An invented command shipped in docs. Cleanup started immediately. | 😳 **Hallucinated commands shipped.** |
| 12:36 PM · `978340f` | "Bake honesty rule into charters" | Every charter gained a rule: never write CLI commands without testing them first. | 🛡️ **Turn mistakes into guardrails.** |

### Session 2 — Roster Expansion & Features (Mar 14, 1:54 PM – 4:46 PM PT)

| Time | Steering Command | What Happened | Level-Up |
|---|---|---|---|
| 1:54 PM · `f94eac0` | "add Evals role, rename artisans to specialists" | Artisans became Specialists. Evals role added. Sensei and Waza expanded the preset. | 🧱 **The roster kept evolving.** |
| 4:08 PM · `0ca39a3` | "rename Gauge to Val" | "Gauge" felt cold. "Val" felt warmer, more human. | ❤️ **Warmth matters.** |
| 4:15 PM · `ca3468d` | "add Scout/Recon researchers + speed evals" | Researcher roles added. Speed became measurable. | 🧪 **Speed became a spec.** |
| 4:17 PM · `1b0adac` | "add Chuck — the toughest debugger" | Chuck arrived with full Chuck Norris energy. Debugging got its own hero. | 🥋 **Chuck arrives.** |
| 4:46 PM · `39f9757` | "blitz all of them" | 18 proposals in one wave. Tests: 35 → 84. Word-boundary bugs fixed. Atomic generation, rollback, sanitization, explain mode, dry-run. | ⚡ **The Blitz.** |
| 4:47 PM · `cc982b7` | "publish" | v0.4.0 shipped right after the Blitz. | 📦 **After the blitz, ship.** |

### Session 3 — Squad Awakening (Mar 14, 5:27 PM – Mar 15)

| Time | Steering Command | What Happened | Level-Up |
|---|---|---|---|
| 5:27 PM · `50b5d4f` | "build journal doesn't say anything" | Generated journal was generic. Template rewritten to teach journaling. | ✍️ **A journal should teach, not just exist.** |
| 5:40 PM · — | "I do not feel like the squad has kicked in" | The deeper problem: squad existed as files and identities, but not as an operational system. Hook chain told agents who they were, but not what to do. | 👁️ **The squad is passive.** |
| 5:50 PM · `5916954` | "blitz all 3 tracks" | Gaps filled (decisions, diagrams, evals, CONTRIBUTING.md). Hook chain rewritten from informative to operational. Assertiveness: 2/5 → 5/5. "You ARE the squad." | 🔥 **You ARE the squad.** |
| 5:54 PM · `4cc1174` | "publish" | v0.5.0: proactive squad activation from second one. | ✅ **Promise fulfilled.** |
| Mar 15 · `423a0fd` | "ensure all agent skills get updated" | 32 agents across 4 presets got operational "How I [verb]" sections. 14 role types with duties and quality gates. | 🎓 **Skill up every agent.** |
| Mar 15 | "did we break the npm again?" | `--force` had been nuking JOURNAL.md and decisions.md. Chuck debugged it. Files split into structural (safe to overwrite) vs content (protected). `--reset-all` added for true clean slate. Tests: 84 → 87. | 🛡️ **Protect user content from regeneration.** |

### Session 4 — Source-Linked Preset Docs (Mar 14, 6:27 PM PDT)

| Time | Steering Command | What Happened | Level-Up |
|---|---|---|---|
| 6:27 PM · — | "Update all 4 preset detail docs ... to deep link agent names to their YAML definitions" | Quill traced every `- name:` entry in the four preset YAML files, converted each team-table agent name into a GitHub line anchor, and added a Source Definition section to every preset detail doc. No build or test run — the user explicitly asked to skip them for this docs-only pass. | 🔗 **Docs now point at source, not just describe it.** |

### Session 5 — Functional Naming Alignment (Mar 15)

| Time | Steering Command | What Happened | Level-Up |
|---|---|---|---|
| Mar 15 · — | "Update docs to new functional agent names" | Preset docs, the plain-language explainer, and evaluator guidance were updated from retired creative names to the current functional roster. YAML deep-link targets and external tool URLs stayed intact, and the targeted files were verified with grep for missed names. | 🧭 **Docs now match the shipped roster.** |

## How We Used What We Teach

| snap-squad principle | How snap-squad used it on itself | Evidence |
|---|---|---|
| Plain-English steering | Short, natural commands instead of specs. | "build journal doesn't say anything," "blitz all 3 tracks" |
| Presets over jargon | Aggressively removed insider language. | `9b441d8`, `f94eac0`, `0ca39a3` |
| Honest documentation | Hallucinated commands fixed fast, lesson encoded into system. | `5b1a581`, `978340f`, `f9adb20` |
| Hook-chain activation | Generated files are the runtime. Upgraded from descriptive to operational. | `5040692`, `5916954` |
| Test the real path | E2E early, speed tests, Blitz pushed 35 → 84 → 87 tests. | `12bfe26`, `ca3468d`, `39f9757` |
| Dogfood the promise | Biggest improvement came from using snap-squad on itself. | `693615e`, `5916954` |

## The Commit Log Is the Curriculum

```text
git log --oneline --reverse
```

The raw log shows the quiet truths too. Not every important move was a big feature. Some were renames. Some were doc corrections. Some were cleanup commits that made the system more believable. That is the real shape of AI-steered building: ideas, implementation, embarrassment, guardrails, polish, then a better idea.

## What We Learned

1. **Having a roster ≠ having a team.** Agents need operational instructions, not just identity.
2. **Honesty beats hype.** Every time docs drifted from reality, fixing them made the product better.
3. **Dogfooding is brutal and valuable.** The biggest improvements came from using snap-squad on itself.
4. **Hook chain is the runtime.** Generated files aren't config — they're the actual system.
5. **Name an owner.** Roles turn wishes into work.
6. **Protect user content.** Structural files and content files need different regeneration rules.

---

## 2026-03-15 — Hook-chain prompt coverage baseline

### What Happened

Established an evaluation baseline for the current hook-chain prompt coverage work. The full Vitest suite is green at **153/153 passing**, and hook-chain coverage analysis/reporting is prepared for three upcoming test prompts.

### Why

This locks in a known-good starting point before expanding prompt coverage, so future hook-chain prompt additions can be measured against a verified baseline instead of guesswork.

---

## Dispatch Enforcement — The Squad That Wouldn't Squad

**Date:** 2026-03-15

### What Happened

During a live session testing hook chain behavior, the squad failed to dispatch. The user had to explicitly remind the AI to use real sub-agents instead of answering everything directly. This proved that **having dispatch instructions in the templates isn't enough if they aren't tested.**

We designed 3 eval prompts (scored 82, 98, 92 by Evaluator), wrote 20 new dispatch enforcement tests in `test/hook-chain-dispatch.test.ts`, and discovered 7 failures:

- AGENTS.md was missing the "Which squad roles should have touched this work?" completion routing check
- The routing completeness test assumed all 9 generic routes exist in every preset (they don't — fast has 4, specialists use domain-specific names)

Both were fixed. Suite went from 153 → 173 tests, all green.

### Why

The original hook-chain tests checked that enforcement *sections* existed (headings, role tags, always-on duties). They never checked the specific *language* that makes dispatch actually happen at runtime — things like `task` tool references, `mode: "background"`, charter context inclusion, and secondary trigger mappings. The gap was invisible until a real session exposed it.

### The Lesson

Testing that a prompt section exists is not the same as testing that it says the right thing. Dispatch enforcement is now a first-class test category.

---

*The code shows what was built. This journal shows why.*
