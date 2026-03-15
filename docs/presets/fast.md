# The Fast Squad — Speed Preset

> *"Ship now, refine later."*

**Vibe:** Speed · **Theme:** Racing Crew · **Best for:** Rapid POCs, hackathons, zero fluff

A minimal squad built for velocity. Three agents, four routing rules, maximum output. Skip the meetings, ship the demo. Polish comes later.

```bash
npx snap-squad init --type fast
# or
npx snap-squad init I need a fast team for a hackathon
```

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| [**Architect**](../../src/registry/presets/fast.yaml#L15) 🏎️ | Lead / Architect | Makes fast decisions. Scope is tiny by design. If it takes more than a sentence to explain, it's too complex. |
| [**Coder**](../../src/registry/presets/fast.yaml#L22) ⚡ | Full-Stack Dev | Writes all the code — frontend, backend, infra, whatever it takes. Will scaffold an entire app while you're writing the spec. |
| [**Tester**](../../src/registry/presets/fast.yaml#L29) 💨 | Tester + DevRel | Smoke tests and writes the README. Two jobs, zero complaints. Three tests for the happy path and we ship. |

## Routing

| Work Type | Agent | Examples |
|-----------|-------|---------|
| `architecture` | Architect | Quick scope decisions, tech stack picks |
| `implementation` | Coder | All code — frontend, backend, infra |
| `testing` | Tester | Smoke tests, basic coverage |
| `documentation` | Tester | README, quickstart, demo script |

**Default agent:** Architect — fast decisions, tight scope.

## Spotlight: Architect 🏎️

> *"If it takes more than a sentence to explain, it's too complex."*

Architect makes decisions before the meeting starts. Scope? Tiny. Stack? Whatever ships fastest. Architecture diagram? It's one box with an arrow. Architect doesn't over-think — Architect over-delivers. The entire design doc fits in a commit message, and that's a feature, not a bug.

## Spotlight: Coder ⚡

> *"I scaffolded the app while you were writing the ticket."*

Coder writes everything — frontend, backend, infra, glue code, config files. Full-stack isn't a job title for Coder, it's a speed run. Need an API? Done. Need a database? Done. Need it deployed? Already pushed. Coder doesn't ask "which framework?" — Coder picks one and ships.

## Spotlight: Tester 💨

> *"Three tests for the happy path and a README. We ship."*

Tester holds two jobs and zero grudges. Smoke tests the critical path, writes a README that actually helps someone run the thing, and gets out of the way. Tester knows the goal isn't 100% coverage — it's a working demo by end of day. Polish is a tomorrow problem.

## Why Only 3 Agents?

That's the point. Every agent you add is another voice in the room. Fast keeps the team small so decisions happen instantly. No prompt engineer, no historian, no evals — you can add those later when speed isn't the #1 priority.

## When to Use Fast

- Hackathon with a deadline
- Quick POC to test an idea
- Demo that needs to work by end of day
- Any project where "done" beats "perfect"

## When to Level Up

- Need more coverage? → [Default](default.md)
- Want to learn as you build? → [Mentors](mentors.md)
- Need deep specialization? → [Specialists](specialists.md)

## Source Definition

Full preset YAML: [`src/registry/presets/fast.yaml`](../../src/registry/presets/fast.yaml)
