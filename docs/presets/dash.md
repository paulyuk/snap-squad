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
| **Turbo** 🏎️ | Lead / Architect | Makes fast decisions. Scope is tiny by design. If it takes more than a sentence to explain, it's too complex. |
| **Bolt** ⚡ | Full-Stack Dev | Writes all the code — frontend, backend, infra, whatever it takes. Will scaffold an entire app while you're writing the spec. |
| **Flash** 💨 | Tester + DevRel | Smoke tests and writes the README. Two jobs, zero complaints. Three tests for the happy path and we ship. |

## Routing

| Work Type | Agent | Examples |
|-----------|-------|---------|
| `architecture` | Turbo | Quick scope decisions, tech stack picks |
| `implementation` | Bolt | All code — frontend, backend, infra |
| `testing` | Flash | Smoke tests, basic coverage |
| `documentation` | Flash | README, quickstart, demo script |

**Default agent:** Turbo — fast decisions, tight scope.

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
