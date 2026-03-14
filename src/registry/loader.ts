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

export function loadPreset(name: string): Preset {
  // Resolve from compiled dist or source
  let dir = PRESETS_DIR;
  try {
    readdirSync(dir);
  } catch {
    // Fallback: try relative to source
    dir = join(__dirname, '..', '..', 'src', 'registry', 'presets');
  }

  const filePath = join(dir, `${name}.yaml`);
  try {
    const content = readFileSync(filePath, 'utf-8');
    return parseYaml(content) as Preset;
  } catch (err) {
    throw new Error(
      `Preset "${name}" not found. Available: ${listPresets().join(', ')}`
    );
  }
}

export function listPresets(): string[] {
  let dir = PRESETS_DIR;
  try {
    readdirSync(dir);
  } catch {
    dir = join(__dirname, '..', '..', 'src', 'registry', 'presets');
  }

  try {
    return readdirSync(dir)
      .filter((f) => f.endsWith('.yaml'))
      .map((f) => f.replace('.yaml', ''));
  } catch {
    return [];
  }
}
