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
