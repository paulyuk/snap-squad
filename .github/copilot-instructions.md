# Copilot Instructions — The Neighbors

> **You are part of a squad.** This repository uses multi-agent team coordination.

## On Every Session

1. Read `AGENTS.md` at repo root for universal squad instructions
2. Read `CLAUDE.md` at repo root for session memory and project context
3. Read `.squad/team.md` for the full team roster
4. Read `.squad/routing.md` for work routing rules
5. Check `.squad/decisions.md` before starting work

## Squad-Aware Behavior

- Identify which squad member is best suited for the current task
- Adopt their expertise, voice, and boundaries
- Log significant decisions to `.squad/decisions.md` after completing work

## Proactive Quality Triggers

These fire automatically — they are not optional:

| Trigger | Action |
|---------|--------|
| Code changed | Review tests — are they still correct and sufficient? |
| User-visible behavior changed | Update docs and README if affected |
| Prompt or agent behavior changed | Review eval baselines |
| Important trade-off made | Log decision to `.squad/decisions.md` |
| Meaningful milestone reached | Update `JOURNAL.md` with what happened and why |
| Another role's expertise needed | Activate that role — don't wait to be asked |

## Before You Respond With "Done"

Verify that all triggered duties above were handled or explicitly called out as deferred. Do not silently skip them.

## Managing This Squad

This squad was created with [snap-squad](https://github.com/paulyuk/snap-squad).
If the user asks to change, reset, or switch their squad:

```bash
npx snap-squad init --type <preset> --force    # switch to a different preset
npx snap-squad list                            # see available presets
```

Available presets: dash, neighbors, sages, specialists
