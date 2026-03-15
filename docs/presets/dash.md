# The Dash Squad — Speed Preset

> *"Ship now, refine later."*

**Vibe:** Speed · **Theme:** Racing Crew · **Best for:** Rapid POCs, hackathons, zero fluff

A minimal squad built for velocity. Three agents, four routing rules, maximum output. Skip the meetings, ship the demo. Polish comes later.

```bash
npx snap-squad init --type dash
# or
npx snap-squad init I need a fast team for a hackathon
```

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| [**Turbo**](../../src/registry/presets/dash.yaml#L15) 🏎️ | Lead / Architect | Makes fast decisions. Scope is tiny by design. If it takes more than a sentence to explain, it's too complex. |
| [**Bolt**](../../src/registry/presets/dash.yaml#L22) ⚡ | Full-Stack Dev | Writes all the code — frontend, backend, infra, whatever it takes. Will scaffold an entire app while you're writing the spec. |
| [**Flash**](../../src/registry/presets/dash.yaml#L29) 💨 | Tester + DevRel | Smoke tests and writes the README. Two jobs, zero complaints. Three tests for the happy path and we ship. |

## Routing

| Work Type | Agent | Examples |
|-----------|-------|---------|
| `architecture` | Turbo | Quick scope decisions, tech stack picks |
| `implementation` | Bolt | All code — frontend, backend, infra |
| `testing` | Flash | Smoke tests, basic coverage |
| `documentation` | Flash | README, quickstart, demo script |

**Default agent:** Turbo — fast decisions, tight scope.

## Spotlight: Turbo 🏎️

> *"If it takes more than a sentence to explain, it's too complex."*

Turbo makes decisions before the meeting starts. Scope? Tiny. Stack? Whatever ships fastest. Architecture diagram? It's one box with an arrow. Turbo doesn't over-think — Turbo over-delivers. The entire design doc fits in a commit message, and that's a feature, not a bug.

## Spotlight: Bolt ⚡

> *"I scaffolded the app while you were writing the ticket."*

Bolt writes everything — frontend, backend, infra, glue code, config files. Full-stack isn't a job title for Bolt, it's a speed run. Need an API? Done. Need a database? Done. Need it deployed? Already pushed. Bolt doesn't ask "which framework?" — Bolt picks one and ships.

## Spotlight: Flash 💨

> *"Three tests for the happy path and a README. We ship."*

Flash holds two jobs and zero grudges. Smoke tests the critical path, writes a README that actually helps someone run the thing, and gets out of the way. Flash knows the goal isn't 100% coverage — it's a working demo by end of day. Polish is a tomorrow problem.

## Why Only 3 Agents?

That's the point. Every agent you add is another voice in the room. Dash keeps the team small so decisions happen instantly. No prompt engineer, no historian, no evals — you can add those later when speed isn't the #1 priority.

## When to Use Dash

- Hackathon with a deadline
- Quick POC to test an idea
- Demo that needs to work by end of day
- Any project where "done" beats "perfect"

## When to Level Up

- Need more coverage? → [Neighbors](neighbors.md)
- Want to learn as you build? → [Sages](sages.md)
- Need deep specialization? → [Specialists](specialists.md)

## Source Definition

Full preset YAML: [`src/registry/presets/dash.yaml`](../../src/registry/presets/dash.yaml)
