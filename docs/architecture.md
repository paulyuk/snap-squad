# Architecture

## Overview

snap-squad is a CLI that turns a plain-English project description or explicit preset choice into a ready-to-use Squad workspace. `init` resolves a preset, loads and validates its YAML definition, then generates the `.squad/` coordination files and root hook-chain files that make downstream AI agents squad-aware.

## CLI Flow

```mermaid
graph TD
  A["User runs npx snap-squad init"] --> B["Commander parses args and options"]
  B --> C["Resolve preset name"]
  C --> C1["Use --type when provided"]
  C --> C2["Otherwise matchPreset() scores description keywords"]
  C --> C3["Fallback to neighbors when no description is given"]
  C1 --> D["loadPreset() reads the selected YAML preset"]
  C2 --> D
  C3 --> D
  D --> E["Loader parses YAML and validates required fields, agents, and routing"]
  E --> F["Validated Preset object"]
  F --> G["generateSquad() builds output content in memory"]
  G --> H["Create directories and write files"]
  H --> I["Squad ready"]
```

## File Generation Pipeline

```mermaid
graph TD
  A["generateSquad(options)"] --> B["Phase 1: build file content in memory"]
  B --> C[".squad/ directory"]
  B --> D["Hook-chain files"]
  C --> C1["team.md"]
  C --> C2["routing.md"]
  C --> C3["decisions.md"]
  C --> C4["mcp-config.md"]
  C --> C5["agents/<agent>/charter.md"]
  D --> D1["AGENTS.md"]
  D --> D2["CLAUDE.md"]
  D --> D3[".github/copilot-instructions.md"]
  D --> D4["JOURNAL.md"]
  C --> E["Phase 2: create directories"]
  D --> E
  E --> F["Phase 3: write files to disk"]
  F --> G["Ready-to-use squad workspace"]
```

## Hook Chain Mechanism

```mermaid
graph TD
  A["AI agent starts session"] --> B["Read AGENTS.md for universal squad instructions"]
  B --> C["Read CLAUDE.md for session memory and operating rules"]
  C --> D["Read .github/copilot-instructions.md for repo-level behavior"]
  D --> E["Consult .squad/routing.md to choose the right squad member"]
  E --> F["Read selected charter in .squad/agents/<agent>/charter.md"]
  F --> G["Work in the chosen agent voice, scope, and boundaries"]
```

## Preset Architecture

```mermaid
graph LR
  A["src/registry/presets/*.yaml"] --> B["loadPreset(name)"]
  B --> C["resolvePresetsDir() finds the preset registry"]
  C --> D["Read YAML file"]
  D --> E["parseYaml(content)"]
  E --> F["validatePreset() checks shape, agents, and routing"]
  F --> G["Preset object"]
  G --> H["generateSquad()"]
```

## Directory Structure

```text
project-root/
├── .github/
│   └── copilot-instructions.md
├── .squad/
│   ├── agents/
│   │   └── <agent>/
│   │       └── charter.md
│   ├── decisions.md
│   ├── mcp-config.md
│   ├── routing.md
│   └── team.md
├── AGENTS.md
├── CLAUDE.md
└── JOURNAL.md
```
