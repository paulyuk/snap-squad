This spec outlines the development of **Snap Squad**, an addon designed to eliminate the "cold start" initialization lag in the [bradygaster/squad](https://github.com/bradygaster/squad) framework. It moves the project from a "Hire-on-the-fly" model to a "Pre-Baked/Warm-Start" model.

---

# Specification: Snap Squad (Addon for Squad)

## 1. Project Overview

* **Project Name:** Snap Squad
* **Target Framework:** `bradygaster/squad` (AI Agent Teams)
* **Core Problem:** Initializing a squad via the standard "interview/hiring" process is too slow for rapid POCs and repetitive workflows.
* **Proposed Solution:** A caching and templating layer that injects pre-defined agent archetypes, grounding data, and MCP tools directly into the `.squad/` directory to enable instant deployment.

---

## 2. Key Decisions & Design Principles

* **"Warm Start" Architecture:** Use a manifest-driven approach to bypass dynamic agent discovery.
* **Safe & Friendly Branding:** Avoid tactical/strike-team themes. Use approachable, community-focused names.
* **Addon Strategy:** Develop as a separate repository/CLI wrapper to allow for rapid iteration, with the goal of a future upstream PR to the main Squad repo.
* **Compatibility:** Must strictly follow Squad's file-based persistence (`team.md`, `decisions.md`) and support **MCP (Model Context Protocol)**.

---

## 3. The Squad Archetypes (The Manifests)

Snap Squad will ship with four "Warm-Start" presets:

| Squad Name | Role/Vibe | Particular Set of Skills |
| --- | --- | --- |
| **The Neighbors** | Default / Generalist | High-level logic, project structure, reliable general-purpose building. |
| **The Dash Squad** | Rapid POC / Speed | Minimalist prompts, high-velocity code generation, zero conversational "fluff." |
| **The Sages** | Learning / Mentor | Explains the "why," focuses on best practices, documentation, and architectural critique. |
| **The Artisans** | Precision Specialists | Niche MCP tool experts (e.g., UI/UX polish, DB tuning, Security hardening). |

---

## 4. Technical Requirements for the Coding Agent

### A. The Snap-Registry (Metadata Store)

* Create a local storage mechanism (JSON or YAML) that maps the four archetypes to:
* **System Prompts:** Distinct "Charter" text for each role.
* **Tool Manifests:** Pre-configured MCP server endpoints and tool definitions.
* **Grounding Templates:** Path mappings to common repo structures.



### B. The CLI Wrapper (`snap-squad`)

* **Command:** `snap-squad init --type [archetype]`
* **Functionality:** 1.  Detect if a `.squad/` folder exists.
2.  Instead of triggering a chat-based interview, pull the relevant manifest from the **Snap-Registry**.
3.  Automatically write/overwrite `.squad/team.md` and `.squad/decisions.md` with the pre-baked context.
4.  Initialize the session so the user can immediately run `squad up`.

### C. The "Skill Locker"

* Implement a repository for common MCP tool configurations.
* Ensure the **Artisans** can dynamically "snap" into specific toolsets (e.g., "Snap in the Postgres-Toolbox").

---

## 5. Summary of Prompt History

* **Concept:** Rapid-response squads that "live in cache" to solve slow initialization and repetitive hiring.
* **Refinement:** Names finalized as Snap Squad, Neighbors, Dash Squad, Sages, and Artisans.
* **Guardrails:** Friendly, safe, and non-violent terminology.
* **Integration:** Designed as a "Provider" that prepares the environment *before* the main Squad runtime takes over.

---

### Suggested Next Step

Would you like me to **generate the specific YAML manifest files** for the four archetypes so the coding agent has the exact "personality" and "skill" data to work with?

[Squad: AI Agent Teams for Any Project](https://www.youtube.com/watch?v=kQmXtrmQ5Zg)
This video explains the core architecture of AI agent teams and the Model Context Protocol (MCP), which are the fundamental building blocks for your Snap Squad extension.
