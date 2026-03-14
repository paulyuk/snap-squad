# Community Builders — Snap Squad

> Pre-baked squad presets for instant deployment.
> *"Good neighbors build great things."*

## Coordinator

| Name | Role | Notes |
|------|------|-------|
| Squad | Coordinator | Routes work, enforces handoffs and reviewer gates. Does not generate domain artifacts. |

## Members

| Name | Role | Charter | Status |
|------|------|---------|--------|
| Maven | Lead / Architect | `.squad/agents/maven/charter.md` | ✅ Active |
| Dash | Core Dev | `.squad/agents/dash/charter.md` | ✅ Active |
| Compass | Prompt Engineer | `.squad/agents/compass/charter.md` | ✅ Active |
| Beacon | Tester / QA | `.squad/agents/beacon/charter.md` | ✅ Active |
| Herald | DevRel / Docs | `.squad/agents/herald/charter.md` | ✅ Active |
| Sage | Registry Curator | `.squad/agents/sage/charter.md` | ✅ Active |
| Ledger | Historian / Build Journalist | `.squad/agents/ledger/charter.md` | ✅ Active |
| Scribe | Session Logger | `.squad/agents/scribe/charter.md` | 📋 Silent |

## Coding Agent

<!-- copilot-auto-assign: false -->

| Name | Role | Charter | Status |
|------|------|---------|--------|
| @copilot | Coding Agent | — | 🤖 Coding Agent |

### Capabilities

**🟢 Good fit — auto-route when enabled:**
- Bug fixes with clear reproduction steps
- Test coverage (adding missing tests, fixing flaky tests)
- Lint/format fixes and code style cleanup
- Dependency updates and version bumps
- Small isolated features with clear specs
- Boilerplate/scaffolding generation
- Documentation fixes and README updates

**🟡 Needs review — route to @copilot but flag for squad member PR review:**
- Medium features with clear specs and acceptance criteria
- Refactoring with existing test coverage
- New preset manifests following established YAML schema
- CLI command additions following established patterns

**🔴 Not suitable — route to squad member instead:**
- Architecture decisions and system design
- Hook chain design (AGENTS.md, CLAUDE.md, copilot-instructions)
- Manifest schema changes affecting all presets
- Security-critical changes
- Changes requiring cross-agent discussion

## Project Context

- **Owner:** paulyuk
- **Stack:** TypeScript (strict mode, ESM-only), Node.js ≥20, Commander.js, YAML, Vitest
- **Description:** Get started with Squad faster — ready-made squad presets for instant deployment
- **Distribution:** npm (`npx snap-squad init --type <preset>`)
- **Universe:** Community Builders — friendly neighborhood theme
- **Repo:** https://github.com/paulyuk/snap-squad
- **Created:** 2026-03-14
