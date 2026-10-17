import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLevelFromXp,
  canValidateProof,
  calculateXpReward,
  validateInvite,
  resolveChallengeStatus,
} from './rules.ts';

test('calculateLevelFromXp: level 1 with 0 XP', () => {
  const result = calculateLevelFromXp(0);
  assert.equal(result.level, 1);
  assert.equal(result.currentLevelXp, 0);
  assert.equal(result.nextLevelXp, 100);
  assert.equal(result.progressPercent, 0);
});

test('calculateLevelFromXp: transitions to level 2 at 100 XP', () => {
  const result = calculateLevelFromXp(100);
  assert.equal(result.level, 2);
  assert.equal(result.currentLevelXp, 0);
  assert.equal(result.nextLevelXp, 150);
});

test('calculateLevelFromXp: level 2 mid progress', () => {
  const result = calculateLevelFromXp(175);
  assert.equal(result.level, 2);
  assert.equal(result.currentLevelXp, 75);
  assert.equal(result.progressPercent, 50);
});

test('canValidateProof: participant cannot validate own proof', () => {
  const check = canValidateProof({
    reviewerUid: 'user-123',
    participantUid: 'user-123',
    isOwnerOrAdmin: true,
  });
  assert.equal(check.allowed, false);
  assert.equal(check.reasonKey, 'cannot_validate_own_proof');
});

test('canValidateProof: owner can validate another participant', () => {
  const check = canValidateProof({
    reviewerUid: 'user-admin',
    participantUid: 'user-player',
    isOwnerOrAdmin: true,
  });
  assert.equal(check.allowed, true);
});

test('canValidateProof: non-owner/non-admin cannot validate', () => {
  const check = canValidateProof({
    reviewerUid: 'user-member',
    participantUid: 'user-player',
    isOwnerOrAdmin: false,
  });
  assert.equal(check.allowed, false);
  assert.equal(check.reasonKey, 'insufficient_role');
});

test('calculateXpReward: verified completion awards 100%', () => {
  const xp = calculateXpReward({
    proofPolicy: 'optional',
    baseReward: 250,
    status: 'completed_verified',
  });
  assert.equal(xp, 250);
});

test('calculateXpReward: unverified completion awards partial XP when optional', () => {
  const xp = calculateXpReward({
    proofPolicy: 'optional',
    baseReward: 200,
    status: 'completed_unverified',
  });
  assert.equal(xp, 100);
});

test('calculateXpReward: unverified completion awards 0 if proof was required', () => {
  const xp = calculateXpReward({
    proofPolicy: 'required',
    baseReward: 200,
    status: 'completed_unverified',
  });
  assert.equal(xp, 0);
});

test('calculateXpReward: rejected proof awards 0 XP', () => {
  const xp = calculateXpReward({
    proofPolicy: 'optional',
    baseReward: 200,
    status: 'rejected',
  });
  assert.equal(xp, 0);
});

test('validateInvite: rejects revoked code', () => {
  const check = validateInvite({
    status: 'revoked',
    usesCount: 1,
  });
  assert.equal(check.valid, false);
  assert.equal(check.errorKey, 'code_revoked');
});

test('validateInvite: rejects expired code by date', () => {
  const check = validateInvite(
    {
      status: 'active',
      expiresAt: '2026-01-01T00:00:00.000Z',
      usesCount: 0,
    },
    '2026-10-17T12:00:00.000Z'
  );
  assert.equal(check.valid, false);
  assert.equal(check.errorKey, 'code_expired');
});

test('validateInvite: rejects exhausted usage code', () => {
  const check = validateInvite({
    status: 'active',
    maxUses: 5,
    usesCount: 5,
  });
  assert.equal(check.valid, false);
  assert.equal(check.errorKey, 'code_exhausted');
});

test('validateInvite: accepts valid active code', () => {
  const check = validateInvite({
    status: 'active',
    maxUses: 10,
    usesCount: 3,
  });
  assert.equal(check.valid, true);
});

test('resolveChallengeStatus: active expires when due date passed', () => {
  const status = resolveChallengeStatus(
    {
      currentStatus: 'active',
      dueAt: '2026-10-15T00:00:00.000Z',
    },
    '2026-10-17T12:00:00.000Z'
  );
  assert.equal(status, 'expired');
});

test('resolveChallengeStatus: stays active when deadline is in the future', () => {
  const status = resolveChallengeStatus(
    {
      currentStatus: 'active',
      dueAt: '2026-10-25T00:00:00.000Z',
    },
    '2026-10-17T12:00:00.000Z'
  );
  assert.equal(status, 'active');
});
