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
  { agent: 'Blueprint', preset: 'default', squadRoleId: 'lead' },
  { agent: 'Wrench', preset: 'default', squadRoleId: 'fullstack' },
  { agent: 'Lens', preset: 'default', squadRoleId: 'tester' },
  { agent: 'Quill', preset: 'default', squadRoleId: 'docs' },
  { agent: 'Mosaic', preset: 'default', squadRoleId: 'ai' },
  { agent: 'Relay', preset: 'default', squadRoleId: 'devops' },
  { agent: 'Val', preset: 'default', squadRoleId: null, proposedRoleId: 'eval-specialist' },
  { agent: 'Scout', preset: 'default', squadRoleId: null, proposedRoleId: 'researcher' },
  { agent: 'Ledger', preset: 'default', squadRoleId: null, proposedRoleId: 'historian' },

  // --- Dash ---
  { agent: 'Turbo', preset: 'fast', squadRoleId: 'lead' },
  { agent: 'Bolt', preset: 'fast', squadRoleId: 'fullstack' },
  { agent: 'Flash', preset: 'fast', squadRoleId: 'tester' },  // also does docs

  // --- Sages ---
  { agent: 'Polaris', preset: 'mentors', squadRoleId: 'lead' },
  { agent: 'Scriptor', preset: 'mentors', squadRoleId: 'fullstack' },
  { agent: 'Proof', preset: 'mentors', squadRoleId: 'tester' },
  { agent: 'Chronicle', preset: 'mentors', squadRoleId: 'docs' },
  { agent: 'Pattern', preset: 'mentors', squadRoleId: 'ai' },
  { agent: 'Measure', preset: 'mentors', squadRoleId: null, proposedRoleId: 'eval-specialist' },
  { agent: 'Scout', preset: 'mentors', squadRoleId: null, proposedRoleId: 'researcher' },
  { agent: 'Ledger', preset: 'mentors', squadRoleId: null, proposedRoleId: 'historian' },

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
