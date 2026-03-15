# Contributing to Snap Squad

Thanks for helping improve Snap Squad. This project is small on purpose: a TypeScript CLI that loads preset YAML, generates squad files, and stays easy to understand.

## Quick Start for Contributors

1. **Fork** the repo on GitHub (click the Fork button)
2. **Clone your fork** and create a branch:

```bash
git clone https://github.com/<your-username>/snap-squad.git
cd snap-squad
git checkout -b my-feature
npm install
npx tsc
npx vitest run
```

3. Make your changes, then **push to your fork** and open a PR against `main`:

```bash
git push origin my-feature
```

> **Why fork+branch?** It keeps `main` clean, lets CI run on your changes before merge, and is standard open-source workflow. Never push directly to `main`.

## Project Structure

- `src/cli.ts` — CLI entry point for `snap-squad init` and `snap-squad list`.
- `src/generator/` — turns a preset into generated files like `.squad/`, `AGENTS.md`, `CLAUDE.md`, and `JOURNAL.md`.
- `src/registry/presets/` — preset YAML files (`default.yaml`, `fast.yaml`, etc.).
- `src/registry/loader.ts` — loads presets, validates them, and auto-discovers `*.yaml` files in the preset directory.
- `src/registry/role-map.ts` — keyword weighting used when matching plain-English input to a preset.
- `src/matcher.ts` — picks the best preset from a user description.
- `src/index.ts` — package exports.
- `test/` — Vitest coverage for e2e flows, registry loading, generator output, validation, matching, and speed.
- `docs/` — supporting docs for presets and launch notes.
- `dist/` — compiled output from `tsc`; do not edit by hand.
- `README.md` — project overview and end-user quick start.
- `AGENTS.md`, `CLAUDE.md`, `JOURNAL.md` — squad instructions, session memory, and build history for this repo.

## How to Add a New Agent to a Preset

1. Open the preset YAML in `src/registry/presets/`.
2. Add the agent under `agents:` with these fields:
   - `name`
   - `role`
   - `description`
   - `expertise`
   - `style`
   - `voice`
3. Add a matching entry under `routing.rules` so work can be routed to that agent.
4. If the new agent should be the fallback, update `routing.defaultAgent` too.
5. Run the build and tests.

Example:

```yaml
agents:
  - name: Quill
    role: Docs / DevRel
    description: Makes the project approachable.
    expertise: [documentation, README, onboarding, examples]
    style: Warm, clear, example-driven
    voice: "Believes the README is the front door."

routing:
  rules:
    - pattern: documentation
      agent: Quill
      description: README, docs, onboarding, examples
```

Charters are generated automatically for every agent in the preset. If you need different charter output or extra sections, update `generateCharter()` in `src/generator/index.ts`.

## How to Create a New Preset

1. Create a new YAML file in `src/registry/presets/`.
2. Follow the existing preset shape:
   - top-level metadata: `name`, `displayName`, `description`, `vibe`, `theme`
   - `team`
   - `agents`
   - `routing`
   - `skills` for generated MCP/skill notes (there is no separate `mcp` block today)
3. Keep the filename aligned with the preset name, for example `default.yaml` → `default`.
4. Build and test the project.

```bash
npx tsc
npx vitest run
```

The CLI auto-discovers presets by reading `src/registry/presets/*.yaml`, so you do not need to register the preset anywhere else.

## Testing

Run the full suite:

```bash
npx vitest run
```

Run only the speed checks:

```bash
npx vitest run test/speed.test.ts
```

All relevant tests must pass before opening a PR.

## Code Style

- TypeScript only.
- ESM-only package (`"type": "module"`).
- Node.js **20+**.
- Do not use `require()`; use `import` / `export`.
- Keep it simple. This is a CLI tool, not a framework.
- Prefer small, direct changes over clever abstractions.

## Commit Messages

Use Conventional Commits style:

```text
feat: add specialists preset docs
fix: validate unknown default agent
docs: add contributing guide
test: cover preset auto-discovery
```

Common prefixes: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`.
