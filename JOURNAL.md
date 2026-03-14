# JOURNAL.md — Build Story of Snap Squad

> Snap Squad: get started with [Squad](https://github.com/bradygaster/squad) faster.
> Built by its own squad. Steered by a human. Journaled by Ledger.

## Origin

The idea started as a prompt to Gemini in a browser. The builder (paulyuk) had three frustrations with Squad:

1. **Initializing is too slow** for rapid POCs
2. **Keep re-hiring the same squads** — same charters, same skills, every time
3. **Need a "very particular set of skills"** but don't want to build from scratch

The spark prompt:

> *"my idea is to have some 'rapid response' squads that basically live in cache somewhere... so initializing is rapid and automatic. Then I want a few different squads for hire that are well known, like a default squad that is well rounded, a rapid one that can get the mission done fast, and maybe a learning focused one."*

The naming constraint was set early: *"while I like the strike team themes personally lets be careful and keep things feeling safe and friendly, not scary or violent."*

Gemini helped with research and naming. The final prompt to Gemini was:

> *"summarize every prompt, key decision and key details here, so i can develop into a spec that i hand off to the coding agent. this should be a detailed markdown file"*

That output became `SPEC.md` — the document that was already in this repo when the Copilot CLI session started. The builder used Gemini as the thinking partner, then handed the spec to Copilot as the builder.

## Evolution

| # | Commit | What Changed | Why (Builder Steering) |
|---|--------|-------------|----------------------|
| 1 | `164ab20` | Initial POC — 4 presets, CLI, generator, hook chain, 10 tests | "build a squad to build snap-squad" — dogfooding from day one |
| 2 | `9b441d8` | Purged "archetype" → "preset", added GitOps agent, rewrote README | "don't use fancy words" + "Squad is the main tool, not snap-squad" |
| 3 | `702e57d` | Plain English init via keyword matcher | "add a skill so you can initialize using only English" |
| 4 | `12bfe26` | 12 E2E tests covering full CLI lifecycle | "build a test to ensure this works e2e, and run it" |
| 5 | `10327b9` | Copilot CLI as primary quickstart path | "when you're in copilot cli, you can bootstrap with English" |
| 6 | `b4315dd` | Honest bootstrap flow from empty folder | "make sure the reasoning works on a new folder for someone who has not yet bootstrapped" |
| 7 | `2843404` | Auto `squad` launch after init | "i want to actually run the squad every time" |
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
