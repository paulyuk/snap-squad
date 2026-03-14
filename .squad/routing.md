# Routing Rules — Community Builders

## Work Type → Agent

| Work Type | Agent | Examples |
|-----------|-------|---------|
| Architecture & scope | Maven 🏗️ | Product direction, system design, trade-offs, code review |
| Core runtime | Dash ⚡ | CLI implementation, template engine, registry loader, file generation |
| Prompt & manifest design | Compass 🧭 | Agent charters, system prompts, YAML manifests, preset design |
| Tests & quality | Beacon 🔦 | Test coverage, Vitest, edge cases, quality gates |
| Docs & developer experience | Herald 📢 | README, getting-started, examples, messaging, onboarding |
| Registry & skill curation | Sage 📚 | Preset manifests, YAML schema, skill locker, MCP tool configs |
| Session logging | Scribe 📋 | Decision logging, session history, orchestration log |

## Module Ownership

| Module | Primary | Secondary |
|--------|---------|-----------|
| `src/cli.ts` | Dash ⚡ | Maven 🏗️ |
| `src/generator/` | Dash ⚡ | Compass 🧭 |
| `src/registry/` | Sage 📚 | Compass 🧭 |
| `src/registry/presets/` | Compass 🧭 | Sage 📚 |
| `src/skills/` | Sage 📚 | Dash ⚡ |
| `test/` | Beacon 🔦 | Dash ⚡ |
| `README.md` | Herald 📢 | Maven 🏗️ |
| `AGENTS.md` | Compass 🧭 | Herald 📢 |
| `CLAUDE.md` | Compass 🧭 | Herald 📢 |
| `.github/copilot-instructions.md` | Compass 🧭 | Herald 📢 |
| `.squad/` | Maven 🏗️ | Compass 🧭 |
| `SPEC.md` | Maven 🏗️ | Herald 📢 |

## Routing Principles

1. **Eager by default** — spawn agents who could usefully start work, including anticipatory downstream work.
2. **Scribe always runs** after substantial work, always in background. Never blocks.
3. **Quick facts → coordinator answers directly.** Don't spawn for trivial questions.
4. **Two agents could handle it** → pick the one whose domain is the primary concern.
5. **Herald reviews all user-facing changes** — README, CLI output, error messages, getting-started.
6. **Anticipate downstream.** Feature being built? Spawn Beacon for test cases simultaneously.
