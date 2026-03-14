# Decisions — Snap Squad

> Significant decisions made during development. Check before starting work.

## Active Decisions

### D-001: TypeScript ESM-only, Node ≥20
- **By:** Maven
- **Date:** 2026-03-14
- **Context:** Match Squad's stack for ecosystem compatibility
- **Decision:** TypeScript strict mode, ESM-only (`"type": "module"`), Node ≥20

### D-002: YAML for preset manifests
- **By:** Sage
- **Date:** 2026-03-14
- **Context:** Manifests are the core data — readability matters for contributors
- **Decision:** Use YAML over JSON for all preset manifests. Human-readable, easy to edit.

### D-003: Four presets at launch
- **By:** Maven, Compass
- **Date:** 2026-03-14
- **Context:** Keep scope tight for POC
- **Decision:** Neighbors (generalist), Dash Squad (speed), Sages (mentor), Artisans (precision)

### D-004: Hook chain — triple-file strategy
- **By:** Compass
- **Date:** 2026-03-14
- **Context:** Different AI tools read different files. We need all three.
- **Decision:** Generate AGENTS.md + CLAUDE.md + .github/copilot-instructions.md. All point to .squad/.

### D-005: Friendly naming only
- **By:** Maven
- **Date:** 2026-03-14
- **Context:** Squad upstream uses movie universes. We use community/neighborhood theme.
- **Decision:** No tactical/military/violent themes. Community Builders aesthetic.

### D-007: No hallucinated commands
- **By:** Maven, Herald
- **Date:** 2026-03-14
- **Context:** Caught `squad up` (doesn't exist) and `ghcs` (doesn't exist) in README
- **Decision:** Every CLI command, flag, and tool reference in docs MUST be verified by running it first. If you haven't run it, don't write it. Test instructions in a clean folder before committing.
