export type Language = 'fr' | 'en';

export type UserRole = 'user' | 'moderator' | 'editor' | 'group_manager' | 'admin';
export type UserBadge = 'creator' | 'staff' | 'founder' | 'official_group' | 'helpful' | 'veteran';
export type AccountStatus = 'active' | 'suspended' | 'banned' | 'pendingDeletion';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferredLanguage: Language;
  interests: string[]; // category IDs e.g. ['seasons', 'weapons']
  role: UserRole;
  accountStatus: AccountStatus;
  createdAt: string;
  updatedAt: string;
  onboardingCompleted: boolean;
  xp: number;
  isVerified?: boolean;
  epicGamesId?: string;
  badges?: UserBadge[];
  suspensionUntil?: string | null;
  suspensionReason?: string | null;
  bannedAt?: string | null;
  banReason?: string | null;
  pendingDeletionAt?: string | null;
  pendingDeletionReason?: string | null;
  lastActiveAt?: string;
  privacySettings: {
    profileVisibility: 'public_in_groups' | 'private';
    activityVisibility: 'friends_in_groups' | 'private';
  };
  notificationPreferences: {
    pushEnabled: boolean;
    newChallenges: boolean;
    challengeUpdates: boolean;
    friendCompletion: boolean;
    dueReminders: boolean;
    newsCategories: boolean;
    adminAnnouncements: boolean;
  };
}

export type NewsStatus = 'draft' | 'published' | 'archived' | 'withdrawn';

export interface NewsCategory {
  id: string;
  name: {
    fr: string;
    en: string;
  };
  description?: {
    fr: string;
    en: string;
  };
}

export interface GameUpdate {
  id: string;
  gameId: 'fortnite';
  slug: string;
  categoryId: string;
  title: {
    fr: string;
    en: string;
  };
  summary: {
    fr: string;
    en: string;
  };
  body: {
    fr: string;
    en: string;
  };
  sourceUrl: string;
  sourceName: string;
  imagePath?: string;
  status: NewsStatus;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  languageAvailability: ('fr' | 'en')[];
}

export type GroupRole = 'owner' | 'moderator' | 'member';
export type GroupStatus = 'active' | 'archived' | 'deleted';

export interface GroupMember {
  id?: string;
  groupId?: string;
  uid: string;
  role: GroupRole;
  joinedAt: string;
  status: 'active' | 'left' | 'removed';
  displayName: string;
  avatarUrl?: string;
}

export interface GroupInvite {
  id: string;
  code: string;
  groupId: string;
  createdBy: string;
  createdAt: string;
  expiresAt?: string | null;
  revokedAt?: string | null;
  maxUses?: number | null;
  usesCount: number;
  status: 'active' | 'revoked' | 'expired';
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  ownerUid: string;
  memberUids: string[];
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  status: GroupStatus;
  avatarUrl?: string;
}

export type ChallengeStatus = 'draft' | 'active' | 'completed' | 'cancelled' | 'expired' | 'archived';
export type ProofPolicy = 'none' | 'optional' | 'required';
export type ValidationPolicy = 'creator_or_admin' | 'peer_review';

export interface Challenge {
  id: string;
  groupId: string;
  title: string;
  description: string;
  createdBy: string;
  status: ChallengeStatus;
  createdAt: string;
  updatedAt: string;
  dueAt?: string | null;
  proofPolicy: ProofPolicy;
  validationPolicy: ValidationPolicy;
  xpReward: number;
  participantUids: string[];
  gameId: 'fortnite';
}

export type ParticipantStatus =
  | 'not_started'
  | 'submitted'
  | 'completed_verified'
  | 'completed_unverified'
  | 'rejected'
  | 'contested'
  | 'expired'
  | 'withdrawn';

export interface ProofItem {
  id: string;
  storagePath?: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  uploadedAt: string;
  uploadedBy: string;
  status: 'pending' | 'accepted' | 'rejected' | 'superseded' | 'deleted';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewReason?: string;
  notes?: string;
}

export interface ChallengeParticipant {
  id?: string;
  uid: string;
  challengeId: string;
  status: ParticipantStatus;
  submittedAt?: string;
  completedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  contestedAt?: string;
  contestReason?: string;
  xpAwarded: number;
  xpAwardedAt?: string;
  proof?: ProofItem;
  proofUrl?: string;
  notes?: string;
  updatedAt: string;
}

export type NotificationType =
  | 'group_joined'
  | 'group_left'
  | 'challenge_new'
  | 'challenge_updated'
  | 'challenge_due_soon'
  | 'proof_submitted'
  | 'proof_accepted'
  | 'proof_rejected'
  | 'contest_opened'
  | 'contest_decided'
  | 'all_completed'
  | 'challenge_cancelled'
  | 'news_published'
  | 'admin_broadcast';

export interface AppNotification {
  id: string;
  uid: string;
  type: NotificationType;
  title: {
    fr: string;
    en: string;
  };
  body: {
    fr: string;
    en: string;
  };
  targetPath: string;
  eventId: string;
  createdAt: string;
  readAt?: string | null;
  status: 'unread' | 'read';
}

export interface XpLedgerEntry {
  id: string;
  uid: string;
  userUid?: string;
  challengeId: string;
  groupId: string;
  reason: string;
  amount: number;
  createdAt: string;
  idempotencyKey: string;
}

export type ReportTargetType = 'challenge' | 'user' | 'proof' | 'group';
export type ReportStatus = 'new' | 'in_progress' | 'resolved' | 'rejected';

export interface Report {
  id: string;
  reportedBy: string;
  targetType: ReportTargetType;
  targetId: string;
  groupId?: string;
  reason: string;
  description?: string;
  status: ReportStatus;
  assignedTo?: string;
  resolution?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AuditLog {
  id: string;
  actorUid: string;
  actorName: string;
  action: string;
  targetType: string;
  targetId: string;
  createdAt: string;
  details?: Record<string, unknown> | string;
}

export interface SystemSettings {
  maintenanceMode: boolean;
  maintenanceMessage: {
    fr: string;
    en: string;
  };
  minXpReward: number;
  maxXpReward: number;
  maxFileUploadMb: number;
  defaultProofPolicy: 'none' | 'optional' | 'required';
  updatedAt?: string;
  updatedBy?: string;
}

