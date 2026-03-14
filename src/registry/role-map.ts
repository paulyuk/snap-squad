/**
 * Agent → Squad Base Role Mapping
 *
 * Maps snap-squad agent names to Squad's built-in base role IDs (PR #369).
 * Used for future useRole() codegen and upstream contribution.
 *
 * Squad base roles: lead, frontend, backend, fullstack, reviewer, tester,
 * devops, security, data, docs, ai, designer, marketing-strategist,
 * sales-strategist, product-manager, project-manager, support-specialist,
 * game-developer, media-buyer, compliance-legal
 */

export interface RoleMapping {
  agent: string;
  preset: string;
  squadRoleId: string | null;  // null = snap-squad original (no Squad equivalent)
  proposedRoleId?: string;     // proposed new Squad role for upstream contribution
}

export const ROLE_MAP: RoleMapping[] = [
  // --- Neighbors ---
  { agent: 'Blueprint', preset: 'neighbors', squadRoleId: 'lead' },
  { agent: 'Wrench', preset: 'neighbors', squadRoleId: 'fullstack' },
  { agent: 'Lens', preset: 'neighbors', squadRoleId: 'tester' },
  { agent: 'Quill', preset: 'neighbors', squadRoleId: 'docs' },
  { agent: 'Mosaic', preset: 'neighbors', squadRoleId: 'ai' },
  { agent: 'Relay', preset: 'neighbors', squadRoleId: 'devops' },
  { agent: 'Val', preset: 'neighbors', squadRoleId: null, proposedRoleId: 'eval-specialist' },
  { agent: 'Scout', preset: 'neighbors', squadRoleId: null, proposedRoleId: 'researcher' },
  { agent: 'Ledger', preset: 'neighbors', squadRoleId: null, proposedRoleId: 'historian' },

  // --- Dash ---
  { agent: 'Turbo', preset: 'dash', squadRoleId: 'lead' },
  { agent: 'Bolt', preset: 'dash', squadRoleId: 'fullstack' },
  { agent: 'Flash', preset: 'dash', squadRoleId: 'tester' },  // also does docs

  // --- Sages ---
  { agent: 'Oracle', preset: 'sages', squadRoleId: 'lead' },
  { agent: 'Scriptor', preset: 'sages', squadRoleId: 'fullstack' },
  { agent: 'Proof', preset: 'sages', squadRoleId: 'tester' },
  { agent: 'Chronicle', preset: 'sages', squadRoleId: 'docs' },
  { agent: 'Pattern', preset: 'sages', squadRoleId: 'ai' },
  { agent: 'Measure', preset: 'sages', squadRoleId: null, proposedRoleId: 'eval-specialist' },
  { agent: 'Scout', preset: 'sages', squadRoleId: null, proposedRoleId: 'researcher' },
  { agent: 'Ledger', preset: 'sages', squadRoleId: null, proposedRoleId: 'historian' },

  // --- Specialists ---
  { agent: 'Chuck', preset: 'specialists', squadRoleId: null, proposedRoleId: 'troubleshooter' },
  { agent: 'Forge', preset: 'specialists', squadRoleId: 'lead' },
  { agent: 'Anvil', preset: 'specialists', squadRoleId: 'data' },
  { agent: 'Chisel', preset: 'specialists', squadRoleId: 'security' },
  { agent: 'Prism', preset: 'specialists', squadRoleId: 'designer' },
  { agent: 'Loom', preset: 'specialists', squadRoleId: 'devops' },
  { agent: 'Caliber', preset: 'specialists', squadRoleId: null, proposedRoleId: 'eval-specialist' },
  { agent: 'Sensei', preset: 'specialists', squadRoleId: null, proposedRoleId: 'compliance-specialist' },
  { agent: 'Waza', preset: 'specialists', squadRoleId: null, proposedRoleId: 'benchmark-specialist' },
  { agent: 'Blitz', preset: 'specialists', squadRoleId: null, proposedRoleId: 'operations-specialist' },
  { agent: 'Recon', preset: 'specialists', squadRoleId: null, proposedRoleId: 'researcher' },
  { agent: 'Ledger', preset: 'specialists', squadRoleId: null, proposedRoleId: 'historian' },
];

/** Agents with no Squad equivalent — candidates for upstream contribution */
export const UNMAPPED_AGENTS = ROLE_MAP.filter(r => r.squadRoleId === null);

/** Proposed new Squad roles from snap-squad originals */
export const PROPOSED_ROLES = [...new Set(UNMAPPED_AGENTS.map(r => r.proposedRoleId).filter(Boolean))];

/** Get the Squad role ID for a snap-squad agent */
export function getSquadRoleId(agentName: string, preset?: string): string | null {
  const match = ROLE_MAP.find(r =>
    r.agent === agentName && (!preset || r.preset === preset)
  );
  return match?.squadRoleId ?? null;
}
