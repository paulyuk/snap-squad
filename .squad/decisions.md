# Decisions — The Neighbors

> Significant decisions made during development. Check before starting work.

## Active Decisions

### D-001: Squad initialized with The Neighbors preset
- **By:** snap-squad
- **Date:** 2026-03-15
- **Context:** Project initialized using snap-squad warm-start
- **Decision:** Using the "neighbors" preset (friendly vibe, Community Builders theme)

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
