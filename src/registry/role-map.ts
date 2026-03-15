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
  { agent: 'Architect', preset: 'default', squadRoleId: 'lead' },
  { agent: 'Coder', preset: 'default', squadRoleId: 'fullstack' },
  { agent: 'Tester', preset: 'default', squadRoleId: 'tester' },
  { agent: 'DevRel', preset: 'default', squadRoleId: 'docs' },
  { agent: 'Prompter', preset: 'default', squadRoleId: 'ai' },
  { agent: 'GitOps', preset: 'default', squadRoleId: 'devops' },
  { agent: 'Evaluator', preset: 'default', squadRoleId: null, proposedRoleId: 'eval-specialist' },
  { agent: 'Researcher', preset: 'default', squadRoleId: null, proposedRoleId: 'researcher' },
  { agent: 'Journalist', preset: 'default', squadRoleId: null, proposedRoleId: 'historian' },

  // --- Dash ---
  { agent: 'Architect', preset: 'fast', squadRoleId: 'lead' },
  { agent: 'Coder', preset: 'fast', squadRoleId: 'fullstack' },
  { agent: 'Tester', preset: 'fast', squadRoleId: 'tester' },  // also does docs

  // --- Sages ---
  { agent: 'Architect', preset: 'mentors', squadRoleId: 'lead' },
  { agent: 'Coder', preset: 'mentors', squadRoleId: 'fullstack' },
  { agent: 'Tester', preset: 'mentors', squadRoleId: 'tester' },
  { agent: 'DocWriter', preset: 'mentors', squadRoleId: 'docs' },
  { agent: 'Prompter', preset: 'mentors', squadRoleId: 'ai' },
  { agent: 'Evaluator', preset: 'mentors', squadRoleId: null, proposedRoleId: 'eval-specialist' },
  { agent: 'Researcher', preset: 'mentors', squadRoleId: null, proposedRoleId: 'researcher' },
  { agent: 'Journalist', preset: 'mentors', squadRoleId: null, proposedRoleId: 'historian' },

  // --- Specialists ---
  { agent: 'Debugger', preset: 'specialists', squadRoleId: null, proposedRoleId: 'troubleshooter' },
  { agent: 'Architect', preset: 'specialists', squadRoleId: 'lead' },
  { agent: 'Backend', preset: 'specialists', squadRoleId: 'data' },
  { agent: 'Security', preset: 'specialists', squadRoleId: 'security' },
  { agent: 'Frontend', preset: 'specialists', squadRoleId: 'designer' },
  { agent: 'DevOps', preset: 'specialists', squadRoleId: 'devops' },
  { agent: 'Evaluator', preset: 'specialists', squadRoleId: null, proposedRoleId: 'eval-specialist' },
  { agent: 'Auditor', preset: 'specialists', squadRoleId: null, proposedRoleId: 'compliance-specialist' },
  { agent: 'EvalRunner', preset: 'specialists', squadRoleId: null, proposedRoleId: 'benchmark-specialist' },
  { agent: 'Swarm', preset: 'specialists', squadRoleId: null, proposedRoleId: 'operations-specialist' },
  { agent: 'Researcher', preset: 'specialists', squadRoleId: null, proposedRoleId: 'researcher' },
  { agent: 'Journalist', preset: 'specialists', squadRoleId: null, proposedRoleId: 'historian' },
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
