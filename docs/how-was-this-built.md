# How snap-squad was built

> **Updated:** March 14, 2026 at 6:02 PM PT  
> **Meta-lesson:** snap-squad is its own best example. It teaches builders to steer a squad with plain language, fast feedback, honest docs, and explicit roles — and that is exactly how this repository was built.

snap-squad did not emerge from a slow, linear plan. It came together in a tightly steered burst: a prompt sparked a spec, a spec became a CLI, the docs got ahead of reality, the team corrected course, the roster expanded, and then the product had to confront a deeper truth — having a squad on paper is not the same thing as having a squad that actually acts.

## The Spark

The first artifact was not code. It was a **Gemini prompt**.

That prompt produced `SPEC.md`: a crisp description of pre-baked squad presets for different kinds of builders. Then Copilot CLI took that spec and implemented the working product: a TypeScript CLI, YAML preset definitions, a generator, and the hook chain that teaches every assistant who the squad is.

That origin matters because it became the product thesis:

- AI helped define the idea.
- AI helped implement the idea.
- The human steered the whole thing with short, high-leverage course corrections.
- The product became a tool for making that style of work repeatable.

So the real origin story is delightfully recursive: **snap-squad was built the way snap-squad asks teams to build.**

## The Complete Steering Log

### Session 1 — Genesis & First Ship (Mar 14, 9:55 AM – 12:52 PM PT)

| Time | Steering Command | What Happened | Level-Up |
|---|---|---|---|
| 9:55 AM · `164ab20` | “Initial snap-squad POC” | A Gemini prompt wrote `SPEC.md`, and Copilot CLI turned that spec into the first working POC: TypeScript CLI, YAML presets, generator, and hook chain. Four presets landed in the opening move: Neighbors, Dash, Sages, and Artisans. | 🌱 **Project born from a Gemini prompt.** The product started by using AI to define the product. |
| 10:11 AM · `9b441d8` | “dont use the word archetype... nor persona, ever” | The language got reset from clever to clear. “Archetypes” became “presets,” “persona” disappeared, GitOps support was added, and the README was rewritten to feel Squad-first instead of taxonomy-first. | 🚫 **No fancy words.** Naming is product design, not decoration. |
| 10:14 AM · `702e57d` | “Add plain English init” | The CLI stopped requiring users to know preset names up front. A natural-language matcher could now take a plain-English description and pick the right preset. | 🗣️ **Plain English beats memorization.** Good tools meet users where they already are. |
| 10:15 AM · `12bfe26` | “Add E2E test suite” | A 12-test end-to-end suite arrived almost immediately, covering the full CLI lifecycle instead of just helper functions. | ✅ **Testing from day one.** Trust comes from verifying the whole path. |
| 10:19 AM · `10327b9` | “Quickstart: plain English in Copilot CLI” | The README stopped leading with flags and started leading with the real user motion: open Copilot CLI, describe the project, let the tool choose the squad. | 🧭 **Lead with the lived workflow.** The fastest path should be the first path. |
| 10:38 AM · `b4315dd` | “Fix bootstrap flow: honest quickstart” | The team noticed the quickstart was implying a smoother experience than the product actually delivered. The docs were corrected so the story matched reality. | 🪞 **Honesty beats hype.** If the docs drift, fix the docs or fix the product — ideally both. |
| 10:41 AM · `2843404` | “Bootstrap runs squad up automatically” | Init briefly gained a post-generation `squad up` step so the bootstrap felt more automatic. It worked as a bridge, but it turned out not to be the final abstraction. | 🔧 **First answers can be scaffolding.** Some features only exist to reveal a simpler future. |
| 10:48 AM · `732393b` | “Hire Ledger” | The historian role was added to the roster, making “capture the build story” an explicit responsibility instead of a vague aspiration. | 📝 **If it matters, name an owner.** Roles turn wishes into work. |
| 10:52 AM · `5829c4d` | “Ledger does its job” | `JOURNAL.md` was generated and linked from the README so the repo could narrate itself, not just compile. | 📚 **The repo should explain itself.** Shipping includes context. |
| 10:55–10:57 AM · `bc79b1d`, `00205a7`, `72e66c8` | “Origin story + Gemini pipeline” | The journal got sharper: evolution table, spark story, and the explicit pipeline `Gemini prompt → SPEC.md → Copilot CLI implementation`. The team chose to document the recursion instead of hiding it. | 🌱 **Show the real origin.** The weirdest, truest part of the build is often the most instructive part. |
| 12:25 PM · `ada4b44` | “Publish to npm” | `snap-squad@0.1.0` went live. `npx snap-squad` now worked from anywhere, which meant the experiment had crossed into public product territory. | 🚀 **Ship early enough to learn in public.** |
| 12:31 PM · `5040692` | “no squad up, hook chain IS the squad” | The biggest pivot landed. There was no need for a runtime activation step after generation. If the hook chain files exist, the squad exists. Version 0.2.0 followed. | 🏛️ **Hook chain IS the squad.** The right abstraction deleted the extra step. |
| 12:34 PM · `5b1a581` | “Fix hallucinated ghcs command” | An invented command had made it into shipped docs. Cleanup started immediately. It was embarrassing, but it forced the team to get serious about operational honesty. | 😳 **Hallucinated commands shipped.** Real mistakes are where trustworthy rules come from. |
| 12:36 PM · `978340f` | “Bake honesty rule into charters” | The response was not just a doc patch. Every squad charter gained a rule: never write CLI commands without testing them first. | 🛡️ **Turn mistakes into guardrails.** A fix that doesn't change upstream behavior is incomplete. |
| 12:44 PM · `f9adb20` | “Fix README: real command is copilot” | More hallucination cleanup followed so the docs matched the actual command path. | 🔍 **Keep cleaning until the lie is gone.** One patch is not enough if confusion remains. |
| 12:52 PM · `5dda531`, `7cc6a6a` | “Launch posts” | The launch story went outward: LinkedIn and Twitter posts were written, then immediately tuned so the messaging order felt right. | 📣 **Distribution is product work too.** The story users hear should match the product they get. |

### Session 2 — Roster Expansion & Features (Mar 14, 1:54 PM – 4:46 PM PT)

| Time | Steering Command | What Happened | Level-Up |
|---|---|---|---|
| 1:54 PM · `f94eac0` | “add Evals role, rename artisans to specialists” | A major roster and framing change landed. Artisans became Specialists, the evals role was added, and new agents like Sensei and Waza expanded the preset's shape. | 🧱 **The roster kept evolving.** Presets are only as strong as the people inside them. |
| 4:05 PM · `084bf69` | “rewrite README with Quick Start first” | The README got restructured so users saw code and action before explanation. The default path and speed path became clearer. | 🥾 **README is a product surface.** Onboarding copy is part of the experience, not post-processing. |
| 4:08 PM · `0ca39a3` | “rename Gauge to Val” | “Gauge” felt cold and mechanical. “Val” felt warmer, more human, and more in tune with the Neighbors preset. | ❤️ **Warmth matters.** Names change how a squad feels before it changes what a squad does. |
| 4:15 PM · `ca3468d` | “add Scout/Recon researchers + speed evals” | Researcher roles were added, and the team made speed measurable with tests that kept preset init under 100ms. | 🧪 **Speed became a spec.** If it matters, measure it. |
| 4:17 PM · `1b0adac` | “add Chuck — the toughest debugger” | Chuck arrived with full Chuck Norris energy, grounded in logs, docs, and troubleshooting guides. Debugging got its own hero. | 🥋 **Chuck arrives.** Debugging should feel powerful, not apologetic. |
| 4:24 PM · `e6bb8a9` | “preset detail docs with deep links” | `docs/presets/` was created so the README could stay crisp while deeper preset detail lived one click away. | 🔗 **Depth should be easy to reach.** Summaries work best when the rabbit hole is nearby. |
| 4:25 PM · `110d43d` | “1-2 word role labels for every agent” | A user-level clarity gap got fixed: cute names stayed, but every agent now carried a plain-English job label. | 🏷️ **Charm needs clarity.** Friendly branding works better when utility is obvious. |
| 4:31 PM · `4e7fd94` | “Chuck debugging example in README” | The README gained a vivid example that showed how plain-English prompting routes to Specialists when something is on fire. | 🔥 **Examples sell better than explanations.** A concrete scenario teaches faster than a definition. |
| 4:37 PM · `8041d55` | “agent spotlights in all preset docs” | Each preset detail page gained agent spotlights with personality and capabilities, making the squads feel concrete instead of abstract. | 🎯 **Personalities need proof.** A roster becomes real when readers can picture who helps with what. |
| 4:46 PM · `39f9757` | “blitz all of them” | The Blitz landed: 18 proposals implemented in one coordinated wave. Tests jumped from 35 to 84. Word-boundary bugs were fixed. Atomic generation with rollback, input sanitization, explain mode, and dry-run all landed together. | ⚡ **The Blitz.** A coordinated review can compress weeks of cleanup into one decisive pass. |
| 4:47 PM · `cc982b7` | “publish” | Version 0.4.0 shipped right after the Blitz, proving the team could turn a review avalanche into a release instead of a backlog. | 📦 **After the blitz, ship.** Momentum matters when the learning is fresh. |

### Session 3 — Squad Awakening (Mar 14, 5:27 PM – 5:54 PM PT → Mar 15)

| Time | Steering Command | What Happened | Level-Up |
|---|---|---|---|
| 5:27 PM · `50b5d4f` | “build journal doesn't say anything” | The user called out that the generated journal was generic. The template was rewritten so it taught journaling instead of just pretending to journal. | ✍️ **A journal should teach, not just exist.** |
| 5:33 PM · `693615e` | “is the squad ready?” | That question exposed another truth: the repo's own generated files were still stale. The team regenerated them so the project actually lived by its own newer rules. | 🧹 **Self-dogfooding is brutal and valuable.** The product has to survive contact with itself. |
| 5:38 PM · `3af5944` | “yes” (clean up stale agents) | Seven stale agent directories from earlier preset switches were removed, clearing away residue that made the repo feel less trustworthy. | 🧼 **Reset stale state.** Clean working history makes the system easier to believe. |
| 5:40 PM · — | “I do not feel like the squad has kicked in” | This was the moment the deeper problem became visible. The squad existed as files and identities, but not yet as an operational system. Decisions were missing. Journal entries were thin. Diagrams and evals were absent. The hook chain told agents who they were, but not what they had to do. | 👁️ **The squad is passive.** Having a roster is not the same thing as having a working team. |
| 5:50 PM · `5916954` | “blitz all 3 tracks” | The product promise got rebuilt from the inside out. The gaps were filled (real journal, diagrams, eval baselines, CONTRIBUTING.md, decisions), prevention duties were added, and the hook chain was rewritten from informative to operational. Assertiveness went from 2/5 to 5/5: “You ARE the squad. Act accordingly.” | 🔥 **You ARE the squad.** The hook chain stopped describing behavior and started enforcing it. |
| 5:54 PM · `4cc1174` | “publish” | Version 0.5.0 shipped with proactive squad activation from second one. This was the moment snap-squad became the thing it had been promising. | ✅ **Promise fulfilled.** The squad finally felt active, not ceremonial. |

## How We Used What We Teach

| snap-squad principle | How snap-squad used it on itself | Evidence |
|---|---|---|
| Plain-English steering | The human kept directing the build with short, natural commands instead of heavyweight specifications after the initial spark. | “Add plain English init,” “build journal doesn't say anything,” “blitz all 3 tracks” |
| Presets over jargon | The product aggressively removed insider language and favored names people could understand immediately. | `9b441d8`, `f94eac0`, `0ca39a3` |
| Honest documentation | Whenever the docs overstated reality or hallucinated commands, the team corrected them fast and encoded the lesson into the system. | `b4315dd`, `5b1a581`, `978340f`, `f9adb20` |
| Hook-chain activation | The biggest architectural insight was that generated files are the runtime. Later, those files were upgraded from descriptive to operational. | `5040692`, `5916954` |
| Test the real path | snap-squad added E2E coverage early, then speed tests, then a Blitz that pushed the suite from 35 to 84 tests. | `12bfe26`, `ca3468d`, `39f9757` |
| Specialists matter | Ledger, Val, Scout, Chuck, and others were added because the product kept discovering real jobs that deserved named ownership. | `732393b`, `f94eac0`, `ca3468d`, `1b0adac` |
| Blitz when signal is high | Instead of dribbling out cleanup, the team bundled high-confidence proposals into one coordinated implementation wave. | `39f9757` |
| Dogfood the promise | The squad's biggest improvement came when the repo used snap-squad on itself and noticed the promise was still only half-true. | `693615e`, `5916954` |

## The Commit Log Is the Story

If you want the raw backbone without the narration, this is the build in one command:

```text
git log --oneline --reverse

164ab20 Initial snap-squad POC: archetypes, CLI, generator, hook chain
9b441d8 Purge jargon, add GitOps agent, rewrite README Squad-first
702e57d Add plain English init — describe what you need, get a squad
12bfe26 Add E2E test suite — 12 tests covering full CLI lifecycle
10327b9 Quickstart: plain English in Copilot CLI is the primary path
b4315dd Fix bootstrap flow: honest quickstart from empty folder
2843404 Bootstrap runs squad up automatically after init
732393b Hire Ledger (Historian) — journals the build story
5829c4d Ledger does its job: JOURNAL.md generated + linked from README
bc79b1d Rewrite journal: evolution table + TLDR steering moments
00205a7 Add origin story to journal — the Gemini prompt that sparked it
72e66c8 Journal: Gemini→SPEC.md→Copilot CLI pipeline documented
ada4b44 Publish snap-squad@0.1.0 to npm — npx snap-squad works from anywhere
5040692 v0.2.0: Copilot-first — no squad up, hook chain IS the squad
5b1a581 Fix hallucinated ghcs command — real command is gh copilot
978340f Bake 'no hallucinated commands' rule into squad charters
f9adb20 Fix README: real command is copilot, not gh copilot
5dda531 Add launch posts (LinkedIn + Twitter) — Herald's first delivery
7cc6a6a Fix post messaging: CoreAI at end, not lead
f94eac0 feat: add Evals role, rename artisans to specialists, add Sensei + Waza
084bf69 docs: rewrite README with Quick Start first, show default + speed flow
0ca39a3 refactor: rename Gauge to Val in neighbors preset
ca3468d feat: add Scout/Recon researcher agents + speed eval tests
1b0adac feat: add Chuck — the toughest debugger on any squad
e6bb8a9 Add preset detail docs with deep links from README
110d43d Add 1-2 word role labels to every agent in README preset table
4e7fd94 Add Chuck debugging example to README Quick Start
8041d55 Add agent spotlights to all preset detail docs
39f9757 Blitz: 18 proposals landed — P0 fixes, validation, testing, strategic
cc982b7 Bump version to 0.4.0
c65cd97 Add .npmrc to gitignore, tag v0.4.0
50b5d4f Improve JOURNAL.md template: teach the journalist how to journal
693615e Regenerate squad files with improved JOURNAL.md template
3af5944 Remove stale agent dirs from previous preset inits
5916954 Squad activation: proactive hook chain + fill all gaps
4cc1174 v0.5.0: proactive squad activation from second 1
```

One nice thing about this raw log: it shows the quiet truths too. Not every important move was a big feature. Some were renames. Some were doc corrections. Some were cleanup commits that made the system more believable. That is the real shape of AI-steered building: ideas, implementation, embarrassment, guardrails, polish, then a better idea.

## What's Next

snap-squad already proves its core idea: a generated squad can shape how future work gets done. The next chapter is about making that proof harder to fake and easier to feel.

A few likely next moves:

- Keep this steering log alive so future releases do not flatten into anonymous commit dust.
- Capture more real user sessions, not just release milestones, so the product learns from actual steering patterns.
- Keep strengthening evals and examples so every agent earns its place in the roster.
- Preserve the most important habit the project learned the hard way: when reality and rhetoric diverge, fix reality or fix the rhetoric immediately.

That last one may be the biggest lesson of the whole build. snap-squad got better every time the team stopped defending the story and started improving the truth behind it.
