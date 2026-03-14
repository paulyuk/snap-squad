# JOURNAL.md — The Build Story of Snap Squad

> How this project was built, the steering moments that shaped it, and why things are the way they are.
> Maintained by Ledger (Historian / Build Journalist).

---

## The Beginning — March 14, 2026

### The Spark

The builder (paulyuk) came in with a clear problem: Squad is great, but the setup takes too long for rapid work. The SPEC.md was already written — four squad types, a CLI wrapper, a manifest registry. The vision was there. The job was to build it fast and prove it works.

But the first instruction wasn't "build the CLI." It was: **"build a squad to build snap-squad."** Dogfooding from minute one. The tool that helps you start squads faster would itself be built by a squad.

### Commit: `164ab20` — Initial POC

Everything landed in one shot: 4 YAML manifests (Neighbors, Dash Squad, Sages, Artisans), a CLI with `init` and `list` commands, a generator that writes the full `.squad/` directory, and the hook chain (`AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`). 10 tests passing. The dogfooding squad — Community Builders — was the first squad created.

The hook chain was the key insight from the start: three files that make every AI session squad-aware, regardless of which tool opens the workspace.

---

## The Voice Corrections — Finding the Right Tone

### Steering: "Don't use the word archetype. Or persona. Ever."

> *Builder's exact words: "dont use the word archetype (or any word that is too fancy) nor use the word persona (hypothetical solutions for hypothetical customer/user = yuck), ever."*

This was a defining moment. The builder has a strong preference for plain language. No academic jargon, no UX theater. "Archetype" became "preset." The entire codebase was swept — TypeScript types renamed from `Archetype` to `Preset`, `loadArchetype` to `loadPreset`, the directory from `archetypes/` to `presets/`. Every doc, every agent charter, every test.

**Lesson:** Voice decisions aren't cosmetic. They set the tone for the entire project. This one word change touched 20 files.

### Commit: `9b441d8` — Purge jargon, add GitOps agent, rewrite README Squad-first

### Steering: "Squad is the main tool. Snap Squad just helps you get started."

> *"we want this to be part of squad later if maintainer agrees."*

The builder pushed back on snap-squad positioning itself as its own product. Squad is the product. Snap-squad is a helper — a fast on-ramp. The README was rewritten from scratch: Squad gets introduced first, the problem explained, then snap-squad as the solution. Not the other way around.

This also brought in the CoreAI value proposition: these aren't blank templates — they're squad configurations shaped by real builders at CoreAI who ship with Squad daily.

---

## The Natural Language Moment

### Steering: "Add a quick skill so you can initialize a squad using only English."

The builder wanted someone to be able to say what they need and get the right squad. Not pick from a menu — just describe it.

A keyword matcher was built (`src/matcher.ts`) that maps descriptions to presets: "fast hackathon" → dash, "learn best practices" → sages, "database security" → artisans. No AI needed — just pattern matching on keywords that matter.

### Commit: `702e57d` — Add plain English init

### Steering: "The quickstart should work from Copilot CLI too."

The builder imagined sitting in Copilot CLI and just saying "give me a speed squad." But here's the honest catch: in a brand new empty folder, no copilot-instructions exist yet. The AI doesn't know about snap-squad until snap-squad has run.

So the flow is honest about this:
1. First time: `npx snap-squad init ...` (you need to know this command)
2. After that: the hook chain teaches every AI session how to manage the squad

### Commit: `10327b9` — Copilot CLI as primary path

---

## The Bootstrap Truth

### Steering: "Make sure the reasoning works on a new folder for someone who has not yet bootstrapped anything."

The builder caught us overselling. The README implied you could use plain English from an empty folder, which isn't true — the copilot-instructions don't exist until snap-squad creates them. 

The fix: be completely honest about the bootstrap sequence. `npx` handles the zero-install story. One command generates everything. If Squad isn't installed, snap-squad says so clearly and tells you how to fix it.

### Steering: "I want to actually run the squad every time. That should be part of the bootstrap."

`snap-squad init` now automatically runs `squad up` after generating files. If Squad CLI isn't found, it gives honest install instructions. A `--no-up` flag exists for CI/tests.

### Commit: `2843404` — Bootstrap runs squad up automatically

---

## The GitHub Auth Story

### Steering: "I want the GitOps squad member to know how to swap GitHub accounts."

paulyuk has two GitHub accounts: personal (`paulyuk`) for OSS and EMU (`paulyuk_microsoft`) for work. SSH keys default to EMU. This caused a push failure during development — the fix was switching to HTTPS for the personal repo.

This was baked into `CLAUDE.md` as permanent session knowledge and stored as a repository memory. Every future session knows to check `gh auth status` before pushing.

The Relay agent (GitOps / Release) was added to the Neighbors preset specifically to carry this kind of operational knowledge.

---

## Principles That Emerged

These weren't planned — they came from the builder's steering:

1. **Plain language only** — No "archetype," "persona," or academic jargon
2. **Squad is the product** — Snap-squad is a helper, not a competitor
3. **Honest docs** — Don't oversell. If something only works after a step, say so.
4. **Dogfooding** — This repo uses its own squad. The builder practices what they preach.
5. **Hook chain** — AGENTS.md + CLAUDE.md + copilot-instructions = sessions never forget
6. **CoreAI builder-trained** — Presets come from real experience, not theory

---

## Current State

- **7 commits** on main
- **27 tests passing** (registry, generator, matcher, E2E)
- **4 presets** (neighbors, dash, sages, artisans) with Ledger historian added to 3
- **Dogfooding squad** with 8 agents (Maven, Dash, Compass, Beacon, Herald, Sage, Ledger, Scribe)
- **Plain English init** working via keyword matcher
- **Auto squad up** on bootstrap
- **Pushed to** https://github.com/paulyuk/snap-squad

---

*— Ledger, Historian / Build Journalist, Snap Squad Community Builders*
