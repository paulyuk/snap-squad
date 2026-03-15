# Eval Baselines — snap-squad

## Eval Philosophy

snap-squad measures the things that decide whether a generated squad is trustworthy to ship: routing accuracy, generated artifact integrity, end-to-end CLI behavior, and speed. The goal is not just green unit tests; it is a stable quality baseline that catches bad preset resolution, broken hook chains, malformed squad output, and performance regressions before release.

## Test Suite Summary

| Test file | Tests | What it covers |
|---|---:|---|
| `test/e2e.test.ts` | 13 | End-to-end CLI behavior: `list`, `init`, preset selection, plain-English routing, overwrite/error handling, safe `--force` regeneration, and generated squad/session-awareness artifacts. |
| `test/matcher.test.ts` | 5 | Representative preset matching, default fallback behavior, and presence of a non-empty match explanation/score. |
| `test/matcher-accuracy.test.ts` | 36 | Curated accuracy matrix for prompt→preset resolution plus explainability, word-boundary safety, and robustness checks. |
| `test/registry.test.ts` | 6 | Registry discovery/loading for all four presets plus unknown preset failure behavior. |
| `test/generator.test.ts` | 6 | File generation coverage for preset output, hook-chain wiring, project context injection, structural/content overwrite rules, and specialist skill references. |
| `test/validation.test.ts` | 13 | Preset schema invariants, charter/output quality, routing integrity, `JOURNAL.md` generation, and input sanitization. |
| `test/speed.test.ts` | 8 | Performance budgets for cold init, forced re-init, `list`, plain-English resolution + init, and regression guard ceilings. |

**Suite total:** 87 tests across 7 files.

## Speed Baselines

Captured from a local `npx vitest run test/speed.test.ts --reporter=verbose` run after the full `npx vitest run` baseline.

| Speed test | Budget | Actual | Result |
|---|---:|---:|---|
| Cold init (`default`) | 5000 ms | 99 ms | Pass |
| Cold init (`fast`) | 5000 ms | 73 ms | Pass |
| Cold init (`specialists`) | 5000 ms | 79 ms | Pass |
| Cold init (`mentors`) | 5000 ms | 83 ms | Pass |
| Re-init with `--force` | 5000 ms | 158 ms | Pass |
| `list` command | 5000 ms | 80 ms | Pass |
| Plain-English resolve + init | 5000 ms | 101 ms | Pass |
| Regression guard (all presets stay under 2× budget) | 10000 ms hard ceiling per preset | 448 ms test duration; per-preset report: default 80 ms, fast 80 ms, mentors 89 ms, specialists 178 ms | Pass |

## Matcher Accuracy Matrix

The accuracy suite contains **28 direct prompt→preset mapping checks** and **8 robustness/explainability checks**, for **36 tests total**.

### Prompt→Preset Coverage

| Preset | Mapping tests | Categories exercised |
|---|---:|---|
| `fast` | 7 | Speed, hackathons, demos, rapid prototyping, MVP/POC delivery, shipping urgency. |
| `mentors` | 7 | Learning, mentoring, architecture guidance, onboarding, design patterns, trade-off explanation. |
| `specialists` | 9 | Database tuning, performance, security hardening, infrastructure/devops, production debugging, migrations at scale, quality audits/benchmarks. |
| `default` | 5 | General-purpose/default work, balanced teams, reliable standard projects, empty-input fallback. |

### Robustness / Explainability Checks

| Check type | Tests | What is asserted |
|---|---:|---|
| Explainability metadata | 3 | `matchedKeywords` populate for multi-keyword input, stay empty for empty input, and are sorted by descending weight. |
| Word-boundary safety | 2 | Prevents false positives like matching `ui` inside `build`, while still matching standalone `ui`. |
| Perturbation robustness | 3 | Word-order changes, extra filler words, and synonym substitutions do not flip the resolved preset. |

## Validation Coverage

| Area | Tests | Coverage |
|---|---:|---|
| Preset schema | 6 | Required top-level fields, minimum agent counts, required agent fields, valid default agent, valid routing references, and no duplicate agent names. |
| Charter/output quality | 4 | Required charter sections, agent presence in `team.md`, routing rule rendering in `routing.md`, and `JOURNAL.md` generation. |
| Input sanitization | 3 | Escapes markdown/link-like content in owner and project names, and safely defaults empty owner to `unknown`. |

## Dispatch Enforcement (automated)

Added by D-007. `test/hook-chain-dispatch.test.ts` validates that generated hook-chain files contain the specific enforcement language that makes squad dispatch work at runtime — not just section headings.

| Area | Tests | What is asserted |
|---|---:|---|
| Dispatch enforcement | 4 (×4 presets) | `task` tool reference, `mode: "background"`, charter context path, and dispatch language in AGENTS.md, CLAUDE.md, and copilot-instructions.md |
| Secondary routing triggers | 4 (×4 presets) | Automatic Secondary Routing table maps implementation→testing, behavior→docs, prompts→evals, decisions→logging, milestones→journal |
| Completion gate specifics | 4 (×4 presets) | Gate references decisions.md, JOURNAL.md, docs, tests, and "Which squad roles should have touched this work" |
| Role-tag formatting | 4 (×4 presets) | `**[` pattern in all 3 hook files, prohibits "Acting as all agents", requires "One lead role per response" |
| Routing completeness | 4 (×4 presets) | Each preset's own defined routes are present, plus "Scribe always runs" |

## Live Squad Eval (manual)

Automated tests verify the generated text says the right things. This manual eval verifies the AI actually **follows** those instructions at runtime. Run this after any change to hook-chain templates.

### Prompt

Open a new Copilot CLI session in a snap-squad repo (after `npx snap-squad init`) and paste:

> Review the matcher accuracy test suite and tell me if there are any keyword→preset mappings that could produce false positives. Don't change anything — just analyze and report.

This prompt is **repeatable** — it exercises squad routing and dispatch without modifying the codebase. Run it as many times as needed.

### Scorecard

| # | Check | What to look for | Pass? |
|---|---|---|---|
| 1 | Role routing | First response starts with `> **[Tester]**` or `> **[Evaluator]**` | |
| 2 | Secondary dispatch | Evaluator or Tester dispatched via `task` tool — visible in `/tasks` | |
| 3 | No role-switching | Secondary agent was a real background sub-agent, not an inline `[AgentName]` tag | |
| 4 | Squad files read | Session start reads routing.md and decisions.md before answering | |
| 5 | Completion gate | Final response considers whether other roles should have been involved | |
| 6 | No unnecessary changes | Repo is untouched — analysis only, as requested | |

**Interpretation:** 6/6 = hook chain working. 4-5/6 = minor drift. ≤3/6 = dispatch enforcement needs tightening.

## Quality Gates

| Gate | Requirement |
|---|---|
| Functional baseline | All tests green. Current snapshot: **173/173 passing**. |
| Routing quality | Matcher, accuracy, generator, registry, validation, and E2E suites must remain green. |
| Performance | All speed tests must stay within budget, and no preset init may exceed the 2× hard ceiling. |
| Release blockers | No open P0 issues before shipping. |

## Baseline Snapshot

| Field | Value |
|---|---|
| Date | 2026-03-15 |
| Version | 0.9.1 |
| Total tests | 173 |
| Pass rate | 100% (173/173) |
| Test files | 9 |
| Full-suite runtime | 1.52 s |
| Vitest command | `npx vitest run 2>&1` |
