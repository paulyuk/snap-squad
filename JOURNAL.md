# JOURNAL.md — Build Story of Snap Squad

> Snap Squad: get started with [Squad](https://github.com/bradygaster/squad) faster.
> Built by its own squad. Steered by a human. Journaled by Ledger.

## Evolution

| # | Commit | What Changed | Why (Builder Steering) |
|---|--------|-------------|----------------------|
| 1 | `164ab20` | Initial POC — 4 presets, CLI, generator, hook chain, 10 tests | "build a squad to build snap-squad" — dogfooding from day one |
| 2 | `9b441d8` | Purged "archetype" → "preset", added GitOps agent, rewrote README | "don't use fancy words" + "Squad is the main tool, not snap-squad" |
| 3 | `702e57d` | Plain English init via keyword matcher | "add a skill so you can initialize using only English" |
| 4 | `12bfe26` | 12 E2E tests covering full CLI lifecycle | "build a test to ensure this works e2e, and run it" |
| 5 | `10327b9` | Copilot CLI as primary quickstart path | "when you're in copilot cli, you can bootstrap with English" |
| 6 | `b4315dd` | Honest bootstrap flow from empty folder | "make sure the reasoning works on a new folder for someone who has not yet bootstrapped" |
| 7 | `2843404` | Auto `squad up` after init | "i want to actually run the squad every time" |
| 8 | `732393b` | Hired Ledger (Historian), wrote this journal | "journal what we did to build this repo" |
| 9 | `5829c4d` | Generator creates JOURNAL.md, README links to it | "the readme does not have evidence that the ledger did their job" |

## Key Steering Moments

**"Don't use the word archetype. Or persona. Ever."**
Swept 20 files. `Archetype` → `Preset` in types, functions, directories, docs. Set the tone: plain language only.

**"Squad is the main tool. Snap-squad just helps you get started."**
README rewritten Squad-first. Added CoreAI builder-trained value prop. Goal: upstream contribution.

**"Make sure the reasoning works on a new folder."**
Caught us overselling the plain English path. Honest fix: first command is always `npx snap-squad init`, AI-powered English works after the hook chain exists.

**"I want the GitOps squad member to know GitHub account swaps."**
paulyuk has two accounts (personal + EMU). SSH defaults to EMU. Baked into CLAUDE.md and stored as memory. Relay agent added to carry this knowledge.

**"Keep the instructions honest."**
Now a core principle. Don't oversell, don't hide prereqs. If something only works after a step, say so.

## Principles

| Principle | Origin |
|-----------|--------|
| Plain language only | "don't use fancy words" |
| Squad is the product | "snap-squad just helps you get started" |
| Honest docs | "make sure the reasoning works for someone who hasn't bootstrapped" |
| Dogfooding | "build a squad to build snap-squad" |
| Hook chain = memory | AGENTS.md + CLAUDE.md + copilot-instructions = sessions never forget |
| Builder-trained presets | "ready to hire squads trained by builders in coreai" |

## Current State

- **9 commits** on main, 27 tests passing
- **4 presets:** neighbors, dash, sages, artisans (3 with Ledger historian)
- **8 agents** in dogfooding squad: Maven, Dash, Compass, Beacon, Herald, Sage, Ledger, Scribe
- **Repo:** https://github.com/paulyuk/snap-squad

---

*— Ledger, Historian / Build Journalist*
