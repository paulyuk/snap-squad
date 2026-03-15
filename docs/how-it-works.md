# How snap-squad works

snap-squad takes the slow setup work out of starting a Squad project. Instead of interviewing a team into existence, it writes a ready-made squad into your repo: team roster, routing rules, agent charters, and the instruction files that AI assistants already know how to read. You run one command, pick a preset directly or let the CLI choose one, and end up with a workspace that feels like a team from the first session.

For the exact control flow, see the **CLI Flow**, **File Generation Pipeline**, and **Hook Chain Mechanism** diagrams in [`docs/architecture.md`](./architecture.md). This page stays in plain language and focuses on what those parts mean in practice.

## 1) What happens when you run `init`

At a high level, the pipeline is simple:

1. You run `npx snap-squad init`
2. snap-squad resolves a preset name
3. It loads that preset from the YAML registry
4. The generator turns that preset into real files
5. Those files become the squad

If you run `npx snap-squad init --type neighbors`, the preset step is direct: `neighbors` is the preset name. If you run `npx snap-squad init help me learn best practices`, the CLI scores the words in your description and picks the closest preset.

Once the preset name is known, `loadPreset()` reads `src/registry/presets/<name>.yaml`, parses it, and validates the basics: top-level fields, agent names, and routing references. Then `generateSquad()` writes the squad files to disk.

That means the product is mostly a file generator with a preset registry in front of it. There is no long-running service, database, or hidden control plane.

## 2) What gets created

A small example:

```bash
$ npx snap-squad init --type neighbors
⚡ Snapping in The Neighbors...
✓ Squad ready! (The Neighbors)
```

The generated workspace looks like this:

```text
project-root/
├── .github/
│   └── copilot-instructions.md
├── .squad/
│   ├── agents/
│   │   ├── blueprint/
│   │   │   └── charter.md
│   │   ├── ledger/
│   │   │   └── charter.md
│   │   ├── lens/
│   │   │   └── charter.md
│   │   ├── mosaic/
│   │   │   └── charter.md
│   │   ├── quill/
│   │   │   └── charter.md
│   │   ├── relay/
│   │   │   └── charter.md
│   │   ├── scout/
│   │   │   └── charter.md
│   │   ├── val/
│   │   │   └── charter.md
│   │   └── wrench/
│   │       └── charter.md
│   ├── decisions.md
│   ├── mcp-config.md
│   ├── routing.md
│   └── team.md
├── AGENTS.md
├── CLAUDE.md
└── JOURNAL.md
```

That tree is the product output. The YAML preset is the source material; the generated files are the working squad.

## 3) The hook chain: the files are the squad

This is the important idea behind snap-squad.

Most AI coding assistants already look for well-known instruction files in a repository. snap-squad writes those files so the assistant starts in the right context without any extra runtime step.

The core chain is:

- `AGENTS.md` — broad repo-wide operating rules
- `CLAUDE.md` — session memory and completion checks
- `.github/copilot-instructions.md` — GitHub Copilot-specific repo instructions

Those files then point the assistant into the `.squad/` directory:

- `.squad/team.md` says who is on the team
- `.squad/routing.md` says which agent should lead which kind of work
- `.squad/agents/{name}/charter.md` gives each agent its job, voice, and boundaries
- `.squad/decisions.md` and `JOURNAL.md` hold project memory

So when people say snap-squad has no runtime, that is literal. There is no background process coordinating agents. The instruction files do the coordination work because the assistant reads them at session start.

That is also why the phrase **"the files are the squad"** matters. If the files are present and the assistant reads them, the squad exists. If a tool ignores repo instructions entirely, snap-squad cannot force that tool to become squad-aware.

## 4) Presets are just YAML

A preset is a YAML file in `src/registry/presets/`. It defines the team name, tone, agent list, routing rules, and optional skill references.

Today snap-squad ships four presets:

- **Neighbors** — the general-purpose default
- **Dash** — fast, low-ceremony, demo-first
- **Sages** — mentor-style, explains the why
- **Specialists** — deeper domain experts for precision work

That matters because presets are not hard-coded as giant `if` statements. The CLI resolves a preset name, loads the YAML, validates it, and generates the same file structure every time. That makes the product easy to inspect and easy to extend.

In other words: the registry is data, not magic.

## 5) What an agent charter does

Each agent gets a charter at `.squad/agents/{name}/charter.md`.

A good charter is more than a personality blurb. In snap-squad, the charter gives the assistant the working shape of the role:

- identity and expertise
- how the agent works
- role-specific duties
- voice and tone
- collaboration rules

For example, Quill's charter is not just "the docs writer." It also says to update docs after behavior changes and to avoid writing untested commands. Lens is not just "QA"; the charter tells Lens what kinds of tests matter and what quality bar to hold.

This matters because AI assistants respond better to concrete operating instructions than to vague role labels. "You are an architect" is weak. "Before implementation, define scope and log the decision" is much stronger.

## 6) How routing works

Routing lives in `.squad/routing.md`.

That file maps a work type to the agent who should lead it. For example:

- architecture → Blueprint or the preset's equivalent
- implementation → Wrench or equivalent
- documentation → Quill or equivalent
- testing → Lens or equivalent

The file also includes routing principles and automatic follow-ons. If implementation work happens, testing should also get involved. If user-visible behavior changes, docs should also get involved. If a meaningful milestone is reached, the journal should get updated.

So routing is not a task runner. It is a decision guide for the assistant. It answers: *who should take point on this, and who else should be pulled in?*

## 7) Generated files vs. user-owned files

snap-squad draws a useful line between files it can safely regenerate and files that should accumulate project history.

### Usually regenerated

These are structural templates. They describe how the squad should work right now:

- `AGENTS.md`
- `CLAUDE.md`
- `.github/copilot-instructions.md`
- `.squad/team.md`
- `.squad/routing.md`
- `.squad/mcp-config.md`
- `.squad/agents/*/charter.md`

### Usually preserved

These are content files. They become more valuable as the project lives longer:

- `.squad/decisions.md`
- `JOURNAL.md`

That split shows up in the generator itself. `init --force` refreshes the structural files while preserving the project memory files. `init --reset-all` is the clean-slate option when you really do want everything regenerated.

This is a small design choice, but it matters. Templates should stay easy to refresh. History should be harder to erase by accident.

## 8) The honest version

snap-squad is not a multi-agent runtime by itself. It is a warm-start generator for a file-based squad setup.

Its job is to give your assistant a strong starting context:

- a named team
- clear roles
- routing rules
- project memory files
- instruction hooks that common AI tools already understand

That is enough to remove the cold start problem for a lot of projects. It is also intentionally simple: a preset registry plus a generator. The upside is transparency. The trade-off is that the system only works as well as the instruction files and the assistant reading them.

That is the whole product idea in one line: **snap-squad turns a preset into a working set of files that make an AI assistant behave like a squad from session one.**
