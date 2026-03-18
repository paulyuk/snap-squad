# Decisions — The Default Squad

> Significant decisions made during development. Check before starting work.

## Active Decisions

### D-001: Squad initialized with the default preset
- **By:** snap-squad
- **Date:** 2026-03-15
- **Context:** Project initialized using snap-squad warm-start
- **Decision:** Using the "default" preset (friendly vibe, Community Builders theme)

### D-002: `--force` preserves content files during regeneration
- **By:** Wrench / Chuck
- **Date:** 2026-03-15
- **Context:** Re-running `snap-squad init --force` was overwriting `JOURNAL.md` and `.squad/decisions.md`, destroying build history and user-authored decision logs.
- **Decision:** Treat template-driven files as structural and overwrite them on `--force`, but preserve content files (`JOURNAL.md`, `.squad/decisions.md`) when they already exist. Add `--reset-all` as the explicit clean-slate flag for overwriting everything.

### D-003: Keep product mechanics separate from build history
- **By:** Quill
- **Date:** 2026-03-15
- **Context:** The repo already had `JOURNAL.md` for the build story, but it needed a user-facing technical explainer for how snap-squad works as a product.
- **Decision:** Add `docs/how-it-works.md` as a plain-language product explainer, and keep `JOURNAL.md` focused on the build story while `docs/architecture.md` holds the Mermaid diagrams.

### D-004: Preset detail docs should deep-link to preset YAML sources
- **By:** Quill / Ledger
- **Date:** 2026-03-15
- **Context:** The preset detail docs describe each squad roster, but contributors had no direct path from an agent listed in `docs/presets/*.md` to the canonical YAML definition in `src/registry/presets/*.yaml`.
- **Decision:** Link each team-table agent name directly to its `- name:` line in the matching preset YAML and add a Source Definition section at the bottom of every preset detail doc so docs stay traceable to the registry source of truth.

### D-005: Preset docs should use functional roster names
- **By:** DevRel
- **Date:** 2026-03-15
- **Context:** The preset docs and explainer still mixed retired creative agent names into tables, spotlight sections, routing examples, and evaluator guidance after the roster moved to functional names.
- **Decision:** Keep preset docs, the how-it-works explainer, and evaluator guidance aligned to the functional roster names while preserving canonical YAML deep-link paths and external tool URLs.

### D-006: Squad dispatch uses real sub-agents, not role-switching
- **By:** Prompter
- **Date:** 2026-03-15
- **Context:** Routing.md said "spawn agents" but never told the AI how. The AI defaulted to role-switching (one agent wearing different hats via `[AgentName]` tags) instead of dispatching real parallel sub-agents. The squad was invisible in `/tasks`.
- **Decision:** Update all four generated instruction templates (AGENTS.md, CLAUDE.md, copilot-instructions.md, routing.md) to explicitly instruct the AI to use Copilot's `task` tool with `mode: "background"` for parallel sub-agent dispatch. Include charter context in dispatch prompts. Fall back to role-switching only for trivial/single-domain work.

### D-007: Dispatch enforcement must be tested, not just present
- **By:** Evaluator / Prompter
- **Date:** 2026-03-15
- **Context:** D-006 added dispatch language to templates, but no tests verified the specific enforcement wording. During a live session, the AI still failed to dispatch — proving the language existed but wasn't tested for correctness or completeness. AGENTS.md was also missing the completion routing check.
- **Decision:** Add `test/hook-chain-dispatch.test.ts` (20 tests) covering dispatch enforcement (`task` tool, `mode: "background"`, charter context), secondary routing triggers, completion gate specifics, role-tag formatting, and per-preset routing completeness. Test the words, not just the headings.

### D-007: Evaluate hook-chain prompts by behavioral signal, not text overlap
- **By:** Evaluator
- **Date:** 2026-03-15
- **Context:** The current hook-chain suite mostly proves that generated files contain required enforcement text, but it does not prove that an assistant actually follows dispatch, startup, and completion instructions at runtime.
- **Decision:** Score new hook-chain eval prompts primarily on their ability to expose runtime compliance gaps — especially dispatch behavior, startup/routing fidelity, and completion-gate obedience — using a weighted rubric that favors coverage value and behavioral observability over simple textual similarity.

### D-008: Charter quality evals grounded on external taste exemplars
- **By:** Evaluator
- **Date:** 2026-03-18
- **Context:** Generated charters had no quality bar beyond "sections exist." DevRel, Scribe, and Evaluator were being silently skipped at runtime because AGENTS.md and CLAUDE.md only named DevRel and Tester in dispatch examples — Scribe and Evaluator were implicit.
- **Decision:** (1) Add `test/charter-evals.test.ts` (40 tests) grading quality, tone, and correctness for DevRel, Coder, Scribe charters — grounded on Azure-Samples style, Pamela Fox repos/blog, and git-for-pms build journal format. (2) Fix templates to explicitly name Scribe and Evaluator in dispatch instructions across AGENTS.md, CLAUDE.md, and copilot-instructions.md. (3) Add gpt-5.4-mini as minimum model floor for code generation and IaC in Coder charter.

### D-009: gpt-5.4-mini is the minimum model for code and IaC
- **By:** Coder
- **Date:** 2026-03-18
- **Context:** No model guidance existed in the Coder charter. Code generation and IaC tasks need a minimum capability floor.
- **Decision:** Coder charter Code Standards now specifies gpt-5.4-mini as the minimum tasteful default for code generation and IaC, contingent on region availability.
