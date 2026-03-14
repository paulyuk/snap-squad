interface PresetMatch {
  preset: string;
  score: number;
  why: string;
}

const KEYWORDS: Record<string, { preset: string; weight: number }[]> = {
  // Dash signals
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

  // Sages signals
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

  // Artisans signals
  database: [{ preset: 'artisans', weight: 4 }],
  postgres: [{ preset: 'artisans', weight: 5 }],
  security: [{ preset: 'artisans', weight: 5 }],
  hardening: [{ preset: 'artisans', weight: 5 }],
  performance: [{ preset: 'artisans', weight: 3 }],
  optimize: [{ preset: 'artisans', weight: 3 }],
  specialist: [{ preset: 'artisans', weight: 4 }],
  deep: [{ preset: 'artisans', weight: 2 }],
  tuning: [{ preset: 'artisans', weight: 4 }],
  infrastructure: [{ preset: 'artisans', weight: 3 }],
  devops: [{ preset: 'artisans', weight: 3 }],
  ui: [{ preset: 'artisans', weight: 2 }],
  accessibility: [{ preset: 'artisans', weight: 4 }],
  cicd: [{ preset: 'artisans', weight: 3 }],

  // Neighbors signals (general/default)
  general: [{ preset: 'neighbors', weight: 3 }],
  'all purpose': [{ preset: 'neighbors', weight: 3 }],
  balanced: [{ preset: 'neighbors', weight: 3 }],
  reliable: [{ preset: 'neighbors', weight: 3 }],
  standard: [{ preset: 'neighbors', weight: 2 }],
  project: [{ preset: 'neighbors', weight: 1 }],
  app: [{ preset: 'neighbors', weight: 1 }],
  build: [{ preset: 'neighbors', weight: 1 }],
};

export function matchPreset(description: string): PresetMatch {
  const lower = description.toLowerCase();
  const scores: Record<string, number> = {
    neighbors: 0,
    dash: 0,
    sages: 0,
    artisans: 0,
  };

  for (const [keyword, mappings] of Object.entries(KEYWORDS)) {
    if (lower.includes(keyword)) {
      for (const { preset, weight } of mappings) {
        scores[preset] += weight;
      }
    }
  }

  // Find winner
  let best = 'neighbors';
  let bestScore = 0;
  for (const [preset, score] of Object.entries(scores)) {
    if (score > bestScore) {
      best = preset;
      bestScore = score;
    }
  }

  const reasons: Record<string, string> = {
    neighbors: 'Good all-around team for general projects',
    dash: 'Speed-focused team for rapid building',
    sages: 'Mentor team that explains the "why" behind decisions',
    artisans: 'Specialist team for deep, precise work',
  };

  return {
    preset: best,
    score: bestScore,
    why: reasons[best],
  };
}
