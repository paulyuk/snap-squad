import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface Agent {
  name: string;
  role: string;
  description: string;
  expertise: string[];
  style: string;
  voice: string;
}

export interface RoutingRule {
  pattern: string;
  agent: string;
  description: string;
}

export interface SkillRef {
  name: string;
  description: string;
}

export interface Preset {
  name: string;
  displayName: string;
  description: string;
  vibe: string;
  theme: string;
  team: {
    name: string;
    description: string;
    projectContext: string;
  };
  agents: Agent[];
  routing: {
    rules: RoutingRule[];
    defaultAgent: string;
  };
  skills: SkillRef[];
}

const PRESETS_DIR = join(__dirname, '..', 'registry', 'presets');

function resolvePresetsDir(): string {
  let dir = PRESETS_DIR;
  try {
    readdirSync(dir);
    return dir;
  } catch (err) {
    // Fallback: try relative to source
    const fallback = join(__dirname, '..', '..', 'src', 'registry', 'presets');
    try {
      readdirSync(fallback);
      return fallback;
    } catch {
      throw new Error(
        `Preset registry unavailable. Tried:\n  ${dir}\n  ${fallback}\n` +
        `Original error: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }
}

function validatePreset(data: unknown, name: string): Preset {
  if (!data || typeof data !== 'object') {
    throw new Error(`Preset "${name}" is empty or not a valid object`);
  }

  const p = data as Record<string, unknown>;

  // Required top-level fields
  for (const field of ['name', 'displayName', 'description']) {
    if (!p[field] || typeof p[field] !== 'string') {
      throw new Error(`Preset "${name}" missing required field: ${field}`);
    }
  }

  // Agents array
  if (!Array.isArray(p.agents) || p.agents.length === 0) {
    throw new Error(`Preset "${name}" must have at least one agent`);
  }

  const agentNames = new Set<string>();
  for (const agent of p.agents as Record<string, unknown>[]) {
    if (!agent.name || typeof agent.name !== 'string') {
      throw new Error(`Preset "${name}" has agent missing required field: name`);
    }
    if (!agent.role || typeof agent.role !== 'string') {
      throw new Error(`Preset "${name}" agent "${agent.name}" missing required field: role`);
    }
    if (!agent.description || typeof agent.description !== 'string') {
      throw new Error(`Preset "${name}" agent "${agent.name}" missing required field: description`);
    }
    agentNames.add(agent.name as string);
  }

  // Routing
  if (!p.routing || typeof p.routing !== 'object') {
    throw new Error(`Preset "${name}" missing required field: routing`);
  }
  const routing = p.routing as Record<string, unknown>;

  if (!routing.defaultAgent || typeof routing.defaultAgent !== 'string') {
    throw new Error(`Preset "${name}" missing routing.defaultAgent`);
  }
  if (!agentNames.has(routing.defaultAgent as string)) {
    throw new Error(`Preset "${name}" defaultAgent "${routing.defaultAgent}" not found in agents`);
  }

  // Validate routing rules reference existing agents
  if (Array.isArray(routing.rules)) {
    for (const rule of routing.rules as Record<string, unknown>[]) {
      if (rule.agent && typeof rule.agent === 'string' && !agentNames.has(rule.agent)) {
        throw new Error(`Preset "${name}" routing rule references unknown agent: ${rule.agent}`);
      }
    }
  }

  return data as Preset;
}

export function loadPreset(name: string): Preset {
  const dir = resolvePresetsDir();
  const filePath = join(dir, `${name}.yaml`);

  let content: string;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch {
    throw new Error(
      `Preset "${name}" not found. Available: ${listPresets().join(', ')}`
    );
  }

  const parsed = parseYaml(content);
  return validatePreset(parsed, name);
}

export function listPresets(): string[] {
  try {
    const dir = resolvePresetsDir();
    return readdirSync(dir)
      .filter((f) => f.endsWith('.yaml'))
      .map((f) => f.replace('.yaml', ''));
  } catch {
    return [];
  }
}
