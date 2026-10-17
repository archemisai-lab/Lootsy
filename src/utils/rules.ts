/**
 * Lootsy Business Logic & Rule Engine
 * Specifications: Sections 15, 16, 17, 24, 25 of Lootsy.md
 */

export interface LevelInfo {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
  totalXp: number;
}

/**
 * Calculates user gaming level and progress from accumulated XP.
 * Rule: Stable, versioned formula.
 * Level 1: 0 - 99 XP
 * Level 2: 100 - 249 XP (+150)
 * Level 3: 250 - 449 XP (+200)
 * Level 4: 450 - 699 XP (+250)
 * General: Level n requires (n * 50 + 50) XP to advance to Level n+1.
 */
export function calculateLevelFromXp(totalXp: number): LevelInfo {
  const safeXp = Math.max(0, Math.floor(totalXp || 0));

  let currentLevel = 1;
  let accumulatedForCurrentLevel = 0;
  let xpForNext = 100;

  while (safeXp >= accumulatedForCurrentLevel + xpForNext) {
    accumulatedForCurrentLevel += xpForNext;
    currentLevel += 1;
    xpForNext = currentLevel * 50 + 50;
  }

  const currentLevelXp = safeXp - accumulatedForCurrentLevel;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentLevelXp / xpForNext) * 100)));

  return {
    level: currentLevel,
    currentLevelXp,
    nextLevelXp: xpForNext,
    progressPercent,
    totalXp: safeXp,
  };
}

/**
 * Self-validation check (Lootsy.md section 16.7):
 * "Un utilisateur ne peut jamais valider sa propre preuve."
 */
export function canValidateProof(params: {
  reviewerUid: string;
  participantUid: string;
  isOwnerOrAdmin: boolean;
}): { allowed: boolean; reasonKey?: string } {
  if (!params.reviewerUid || !params.participantUid) {
    return { allowed: false, reasonKey: 'invalid_users' };
  }

  if (params.reviewerUid === params.participantUid) {
    return { allowed: false, reasonKey: 'cannot_validate_own_proof' };
  }

  if (!params.isOwnerOrAdmin) {
    return { allowed: false, reasonKey: 'insufficient_role' };
  }

  return { allowed: true };
}

/**
 * XP reward allocation rule (Lootsy.md section 16.8 and 17.2)
 * Verified proof gets 100% of base reward.
 * Optional unverified declaration gets 50% (capped).
 * Required proof without proof gets 0.
 */
export function calculateXpReward(params: {
  proofPolicy: 'none' | 'optional' | 'required';
  baseReward: number;
  status: 'completed_verified' | 'completed_unverified' | 'rejected' | 'contested' | 'submitted' | 'not_started';
}): number {
  const base = Math.max(0, Math.floor(params.baseReward || 0));

  if (params.status === 'completed_verified') {
    return base;
  }

  if (params.status === 'completed_unverified') {
    if (params.proofPolicy === 'required') {
      return 0; // cannot be unverified if proof is required
    }
    // Spec 16.8: declarations non vérifiées peuvent recevoir une récompense de base si autorisée
    return Math.floor(base * 0.5);
  }

  return 0;
}

export interface InviteValidation {
  valid: boolean;
  errorKey?: 'code_revoked' | 'code_expired' | 'code_exhausted' | 'code_invalid';
}

/**
 * Validates group invite codes (Lootsy.md section 15.3, 15.5)
 */
export function validateInvite(invite: {
  status: 'active' | 'revoked' | 'expired';
  expiresAt?: string | null;
  maxUses?: number | null;
  usesCount: number;
}, nowIsoString: string = new Date().toISOString()): InviteValidation {
  if (!invite || invite.status === 'revoked') {
    return { valid: false, errorKey: 'code_revoked' };
  }

  if (invite.status === 'expired') {
    return { valid: false, errorKey: 'code_expired' };
  }

  if (invite.expiresAt) {
    const expiresTime = new Date(invite.expiresAt).getTime();
    const currentTime = new Date(nowIsoString).getTime();
    if (currentTime > expiresTime) {
      return { valid: false, errorKey: 'code_expired' };
    }
  }

  if (invite.maxUses && invite.usesCount >= invite.maxUses) {
    return { valid: false, errorKey: 'code_exhausted' };
  }

  return { valid: true };
}

/**
 * Generates secure, readable invite code: e.g. LOOT-7K9A2
 */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let segment1 = '';
  let segment2 = '';
  for (let i = 0; i < 4; i++) {
    segment1 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  for (let i = 0; i < 4; i++) {
    segment2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `LOOT-${segment1}-${segment2}`;
}

/**
 * Challenge overall status resolver (Lootsy.md section 16.1, 16.10)
 */
export function resolveChallengeStatus(challenge: {
  currentStatus: 'draft' | 'active' | 'completed' | 'cancelled' | 'expired' | 'archived';
  dueAt?: string | null;
  allParticipantsCompleted?: boolean;
}, nowIsoString: string = new Date().toISOString()): 'draft' | 'active' | 'completed' | 'cancelled' | 'expired' | 'archived' {
  if (challenge.currentStatus !== 'active') {
    return challenge.currentStatus;
  }

  if (challenge.allParticipantsCompleted) {
    return 'completed';
  }

  if (challenge.dueAt) {
    const dueTime = new Date(challenge.dueAt).getTime();
    const nowTime = new Date(nowIsoString).getTime();
    if (nowTime > dueTime) {
      return 'expired';
    }
  }

  return 'active';
}
