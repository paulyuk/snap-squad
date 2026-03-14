# MCP Integration — Snap Squad

MCP (Model Context Protocol) servers extend the squad with tools for external services.

## Available MCP Servers

### GitHub (Active)
Used for issue tracking, PR management, and repo operations.
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    }
  }
}
```

### Filesystem (Active)
Used for reading/writing files during generation.
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    }
  }
}
```

## Skill Locker Configs

The Skill Locker (`src/skills/`) ships pre-configured MCP definitions that presets can reference:
- `github.yaml` — GitHub MCP for issue/PR workflows
- `azure.yaml` — Azure MCP for cloud resource management
- `filesystem.yaml` — Local file operations
- `fetch.yaml` — HTTP fetch for API integrations

Artisans preset can dynamically "snap in" additional skill configs.
