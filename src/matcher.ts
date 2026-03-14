export interface KeywordMatch {
  keyword: string;
  preset: string;
  weight: number;
}

export interface PresetMatch {
  preset: string;
  score: number;
  why: string;
  matchedKeywords: KeywordMatch[];
}

const KEYWORDS: Record<string, { preset: string; weight: number }[]> = {
  // --- Dash: speed, POCs, hackathons ---
  fast: [{ preset: 'dash', weight: 3 }],
  quick: [{ preset: 'dash', weight: 3 }],
  speed: [{ preset: 'dash', weight: 3 }],
  rapid: [{ preset: 'dash', weight: 3 }],
  poc: [{ preset: 'dash', weight: 4 }],
  prototype: [{ preset: 'dash', weight: 4 }],
  hackathon: [{ preset: 'dash', weight: 5 }],
  demo: [{ preset: 'dash', weight: 3 }],
  mvp: [{ preset: 'dash', weight: 4 }],
  'ship fast': [{ preset: 'dash', weight: 5 }],
  'no fluff': [{ preset: 'dash', weight: 4 }],

  // --- Sages: learning, mentoring, best practices ---
  learn: [{ preset: 'sages', weight: 4 }],
  teach: [{ preset: 'sages', weight: 4 }],
  mentor: [{ preset: 'sages', weight: 5 }],
  explain: [{ preset: 'sages', weight: 3 }],
  'best practice': [{ preset: 'sages', weight: 4 }],
  'best practices': [{ preset: 'sages', weight: 4 }],
  onboard: [{ preset: 'sages', weight: 3 }],
  training: [{ preset: 'sages', weight: 4 }],
  understand: [{ preset: 'sages', weight: 3 }],
  why: [{ preset: 'sages', weight: 2 }],
  review: [{ preset: 'sages', weight: 2 }],

  // --- Specialists: deep domain expertise ---
  database: [{ preset: 'specialists', weight: 4 }],
  postgres: [{ preset: 'specialists', weight: 5 }],
  security: [{ preset: 'specialists', weight: 5 }],
  hardening: [{ preset: 'specialists', weight: 5 }],
  performance: [{ preset: 'specialists', weight: 3 }],
  optimize: [{ preset: 'specialists', weight: 3 }],
  specialist: [{ preset: 'specialists', weight: 4 }],
  deep: [{ preset: 'specialists', weight: 2 }],
  tuning: [{ preset: 'specialists', weight: 4 }],
  infrastructure: [{ preset: 'specialists', weight: 3 }],
  devops: [{ preset: 'specialists', weight: 3 }],
  ui: [{ preset: 'specialists', weight: 2 }],
  accessibility: [{ preset: 'specialists', weight: 4 }],
  cicd: [{ preset: 'specialists', weight: 3 }],

  // --- Specialists: evals (Caliber, Sensei, Waza) ---
  eval: [{ preset: 'specialists', weight: 3 }],
  evals: [{ preset: 'specialists', weight: 3 }],
  benchmark: [{ preset: 'specialists', weight: 3 }],
  'agent-as-judge': [{ preset: 'specialists', weight: 4 }],
  baseline: [{ preset: 'specialists', weight: 2 }],
  'skill quality': [{ preset: 'specialists', weight: 4 }],

  // --- Specialists: troubleshooting (Chuck) ---
  debug: [{ preset: 'specialists', weight: 3 }],
  troubleshoot: [{ preset: 'specialists', weight: 4 }],
  'root cause': [{ preset: 'specialists', weight: 5 }],
  crash: [{ preset: 'specialists', weight: 4 }],
  'stack trace': [{ preset: 'specialists', weight: 4 }],
  logs: [{ preset: 'specialists', weight: 2 }],
  firefight: [{ preset: 'specialists', weight: 5 }],

  // --- Specialists: mass ops (Blitz) ---
  'multi-repo': [{ preset: 'specialists', weight: 5 }],
  'mass update': [{ preset: 'specialists', weight: 5 }],
  migration: [{ preset: 'specialists', weight: 4 }],
  'at scale': [{ preset: 'specialists', weight: 4 }],
  'bulk fix': [{ preset: 'specialists', weight: 5 }],
  campaign: [{ preset: 'specialists', weight: 3 }],
  blitz: [{ preset: 'specialists', weight: 5 }],
  'file issues': [{ preset: 'specialists', weight: 3 }],

  // --- Neighbors: general / default ---
  general: [{ preset: 'neighbors', weight: 3 }],
  'all purpose': [{ preset: 'neighbors', weight: 3 }],
  balanced: [{ preset: 'neighbors', weight: 3 }],
  reliable: [{ preset: 'neighbors', weight: 3 }],
  standard: [{ preset: 'neighbors', weight: 2 }],
  project: [{ preset: 'neighbors', weight: 1 }],
  app: [{ preset: 'neighbors', weight: 1 }],
  build: [{ preset: 'neighbors', weight: 1 }],
};

const REASONS: Record<string, string> = {
  neighbors: 'Good all-around team for general projects',
  dash: 'Speed-focused team for rapid building',
  sages: 'Mentor team that explains the "why" behind decisions',
  specialists: 'Specialist team for deep, precise work',
};

export function matchPreset(description: string): PresetMatch {
  const lower = description.toLowerCase();
  const scores: Record<string, number> = {};
  const matchedKeywords: KeywordMatch[] = [];

  for (const [keyword, mappings] of Object.entries(KEYWORDS)) {
    // Use word boundary matching for single words to avoid substring false positives
    // Multi-word phrases use includes() since they're specific enough
    const isMatch = keyword.includes(' ')
      ? lower.includes(keyword)
      : new RegExp(`\\b${keyword}\\b`).test(lower);

    if (isMatch) {
      for (const { preset, weight } of mappings) {
        scores[preset] = (scores[preset] || 0) + weight;
        matchedKeywords.push({ keyword, preset, weight });
      }
    }
  }

  // Find winner (default to neighbors)
  let best = 'neighbors';
  let bestScore = 0;
  for (const [preset, score] of Object.entries(scores)) {
    if (score > bestScore) {
      best = preset;
      bestScore = score;
    }
  }

  return {
    preset: best,
    score: bestScore,
    why: REASONS[best] || `Matched preset: ${best}`,
    matchedKeywords: matchedKeywords.sort((a, b) => b.weight - a.weight),
  };
}
