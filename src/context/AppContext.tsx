import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Language,
  GameUpdate,
  NewsCategory,
  Group,
  GroupMember,
  GroupInvite,
  Challenge,
  ChallengeParticipant,
  AppNotification,
  XpLedgerEntry,
  AuditLog,
  Report,
} from '../types';
import { translations } from '../i18n/translations';
import {
  initialCategories,
  initialUsers,
  initialNews,
  initialGroups,
  initialMembers,
  initialInvites,
  initialChallenges,
  initialParticipants,
  initialNotifications,
  initialLedger,
  initialAuditLogs,
  initialReports,
} from '../data/mockData';
import {
  calculateLevelFromXp,
  canValidateProof,
  calculateXpReward,
  validateInvite,
  generateInviteCode,
  resolveChallengeStatus,
} from '../utils/rules';

interface AppContextType {
  currentUser: UserProfile | null;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (section: keyof typeof translations.fr, key: string, params?: Record<string, string | number>) => string;
  users: UserProfile[];
  switchDemoUser: (uid: string) => void;
  login: (email: string, pass: string) => { success: boolean; error?: string };
  signup: (email: string, pass: string, displayName: string) => { success: boolean; error?: string };
  logout: () => void;
  completeOnboarding: (interests: string[]) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  deleteAccount: () => void;
  // News
  news: GameUpdate[];
  categories: NewsCategory[];
  savedNewsIds: string[];
  toggleSaveNews: (newsId: string) => void;
  createNews: (newsItem: Omit<GameUpdate, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => void;
  updateNews: (id: string, updates: Partial<GameUpdate>) => void;
  deleteNews: (id: string) => void;
  archiveNews: (id: string) => void;
  // Groups
  groups: Group[];
  groupMembers: GroupMember[];
  groupInvites: GroupInvite[];
  createGroup: (name: string, description?: string) => { success: boolean; group?: Group; error?: string };
  joinGroupWithCode: (code: string) => { success: boolean; group?: Group; error?: string };
  revokeInvite: (inviteId: string) => void;
  regenerateInvite: (groupId: string) => string;
  leaveGroup: (groupId: string) => void;
  // Challenges
  challenges: Challenge[];
  participants: ChallengeParticipant[];
  createChallenge: (data: {
    groupId: string;
    title: string;
    description: string;
    proofPolicy: Challenge['proofPolicy'];
    validationPolicy: Challenge['validationPolicy'];
    xpReward: number;
    dueAt?: string | null;
  }) => { success: boolean; challenge?: Challenge; error?: string };
  submitChallengeClaim: (
    challengeId: string,
    options: { hasProof: boolean; proofUrl?: string; notes?: string }
  ) => { success: boolean; error?: string };
  reviewProof: (
    challengeId: string,
    participantUid: string,
    decision: 'accept' | 'reject',
    reason?: string
  ) => { success: boolean; error?: string };
  contestRejection: (challengeId: string, contestReason: string) => { success: boolean; error?: string };
  // Notifications
  notifications: AppNotification[];
  unreadCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  sendAdminBroadcast: (titleFr: string, titleEn: string, bodyFr: string, bodyEn: string, targetPath?: string) => void;
  // Ledger, Logs & Reports
  ledger: XpLedgerEntry[];
  auditLogs: AuditLog[];
  reports: Report[];
  resolveReport: (id: string, resolution: string, status: Report['status']) => void;
  toggleUserSuspension: (uid: string, reason: string) => void;
  changeUserRole: (uid: string, role: UserProfile['role']) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load stored state or use initial seeds
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('lootsy_lang');
    return saved === 'en' || saved === 'fr' ? saved : 'fr';
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('lootsy_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    const saved = localStorage.getItem('lootsy_current_uid');
    return saved !== null ? saved : 'user-1'; // default to Alex for instant rich UX demo
  });

  const [news, setNews] = useState<GameUpdate[]>(() => {
    const saved = localStorage.getItem('lootsy_news');
    return saved ? JSON.parse(saved) : initialNews;
  });

  const [savedNewsIds, setSavedNewsIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('lootsy_saved_news');
    return saved ? JSON.parse(saved) : ['news-1'];
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('lootsy_groups');
    return saved ? JSON.parse(saved) : initialGroups;
  });

  const [groupMembers, setGroupMembers] = useState<GroupMember[]>(() => {
    const saved = localStorage.getItem('lootsy_members');
    return saved ? JSON.parse(saved) : initialMembers;
  });

  const [groupInvites, setGroupInvites] = useState<GroupInvite[]>(() => {
    const saved = localStorage.getItem('lootsy_invites');
    return saved ? JSON.parse(saved) : initialInvites;
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('lootsy_challenges');
    return saved ? JSON.parse(saved) : initialChallenges;
  });

  const [participants, setParticipants] = useState<ChallengeParticipant[]>(() => {
    const saved = localStorage.getItem('lootsy_participants');
    return saved ? JSON.parse(saved) : initialParticipants;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('lootsy_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [ledger, setLedger] = useState<XpLedgerEntry[]>(() => {
    const saved = localStorage.getItem('lootsy_ledger');
    return saved ? JSON.parse(saved) : initialLedger;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('lootsy_audit');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('lootsy_reports');
    return saved ? JSON.parse(saved) : initialReports;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('lootsy_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('lootsy_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem('lootsy_current_uid', currentUserId);
    } else {
      localStorage.removeItem('lootsy_current_uid');
    }
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('lootsy_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('lootsy_saved_news', JSON.stringify(savedNewsIds));
  }, [savedNewsIds]);

  useEffect(() => {
    localStorage.setItem('lootsy_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('lootsy_members', JSON.stringify(groupMembers));
  }, [groupMembers]);

  useEffect(() => {
    localStorage.setItem('lootsy_invites', JSON.stringify(groupInvites));
  }, [groupInvites]);

  useEffect(() => {
    localStorage.setItem('lootsy_challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('lootsy_participants', JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem('lootsy_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('lootsy_ledger', JSON.stringify(ledger));
  }, [ledger]);

  useEffect(() => {
    localStorage.setItem('lootsy_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('lootsy_reports', JSON.stringify(reports));
  }, [reports]);

  // Current user helper
  const currentUser = users.find((u) => u.uid === currentUserId) || null;

  // Language setter
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (currentUser) {
      setUsers((prev) =>
        prev.map((u) => (u.uid === currentUser.uid ? { ...u, preferredLanguage: lang } : u))
      );
    }
  };

  // Translation lookup helper with interpolation
  const t = (
    section: keyof typeof translations.fr,
    key: string,
    params?: Record<string, string | number>
  ): string => {
    const langDict = translations[language] || translations.fr;
    const sec = (langDict as Record<string, Record<string, string>>)[section];
    let val = sec ? sec[key] : undefined;

    let result = val || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        result = result.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      });
    }

    return result;
  };

  // Demo user switcher
  const switchDemoUser = (uid: string) => {
    const target = users.find((u) => u.uid === uid);
    if (target) {
      setCurrentUserId(uid);
      setLanguageState(target.preferredLanguage);
    }
  };

  // Auth methods
  const login = (email: string, _pass: string) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      if (found.accountStatus === 'suspended') {
        return { success: false, error: 'Compte suspendu par l’administration.' };
      }
      setCurrentUserId(found.uid);
      setLanguageState(found.preferredLanguage);
      return { success: true };
    }
    return { success: false, error: 'Identifiants invalides.' };
  };

  const signup = (email: string, _pass: string, displayName: string) => {
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, error: 'Cette adresse e-mail est déjà utilisée.' };
    }

    const newUid = `user-${Date.now()}`;
    const newUser: UserProfile = {
      uid: newUid,
      email,
      displayName: displayName.trim() || 'Gamer_' + newUid.slice(-4),
      preferredLanguage: language,
      interests: ['seasons', 'weapons'],
      role: 'user',
      accountStatus: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      onboardingCompleted: false,
      xp: 0,
      privacySettings: {
        profileVisibility: 'public_in_groups',
        activityVisibility: 'friends_in_groups',
      },
      notificationPreferences: {
        pushEnabled: false,
        newChallenges: true,
        challengeUpdates: true,
        friendCompletion: true,
        dueReminders: true,
        newsCategories: true,
        adminAnnouncements: true,
      },
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newUid);

    // Audit log
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        actorUid: newUid,
        actorName: newUser.displayName,
        action: 'USER_REGISTERED',
        targetType: 'user',
        targetId: newUid,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    return { success: true };
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const completeOnboarding = (interests: string[]) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.uid === currentUser.uid
          ? { ...u, interests, onboardingCompleted: true, updatedAt: new Date().toISOString() }
          : u
      )
    );
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.uid === currentUser.uid
          ? { ...u, ...updates, updatedAt: new Date().toISOString() }
          : u
      )
    );
  };

  const deleteAccount = () => {
    if (!currentUser) return;
    const uid = currentUser.uid;
    // Remove user
    setUsers((prev) => prev.filter((u) => u.uid !== uid));
    // Remove from groups
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        memberUids: g.memberUids.filter((id) => id !== uid),
        memberCount: Math.max(0, g.memberCount - (g.memberUids.includes(uid) ? 1 : 0)),
      }))
    );
    setGroupMembers((prev) => prev.filter((m) => m.uid !== uid));
    setCurrentUserId(null);
  };

  // News methods
  const toggleSaveNews = (newsId: string) => {
    setSavedNewsIds((prev) =>
      prev.includes(newsId) ? prev.filter((id) => id !== newsId) : [...prev, newsId]
    );
  };

  const createNews = (newsItem: Omit<GameUpdate, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    const id = `news-${Date.now()}`;
    const now = new Date().toISOString();
    const created: GameUpdate = {
      ...newsItem,
      id,
      gameId: 'fortnite',
      createdBy: currentUser.uid,
      updatedBy: currentUser.uid,
      createdAt: now,
      updatedAt: now,
      publishedAt: newsItem.publishedAt || now,
    };
    setNews((prev) => [created, ...prev]);

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        actorUid: currentUser.uid,
        actorName: currentUser.displayName,
        action: 'NEWS_CREATED',
        targetType: 'gameUpdate',
        targetId: id,
        createdAt: now,
        details: { title: created.title.fr, status: created.status },
      },
      ...prev,
    ]);
  };

  const updateNews = (id: string, updates: Partial<GameUpdate>) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    setNews((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...updates, updatedBy: currentUser.uid, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const deleteNews = (id: string) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    setNews((prev) => prev.filter((item) => item.id !== id));
    setSavedNewsIds((prev) => prev.filter((savedId) => savedId !== id));
  };

  const archiveNews = (id: string) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    updateNews(id, { status: 'archived' });
  };

  // Groups methods
  const createGroup = (name: string, description?: string) => {
    if (!currentUser) return { success: false, error: 'Non authentifié' };
    const trimmed = name.trim();
    if (!trimmed) return { success: false, error: 'Le nom du groupe est obligatoire' };

    const groupId = `group-${Date.now()}`;
    const now = new Date().toISOString();
    const newGroup: Group = {
      id: groupId,
      name: trimmed,
      description: description?.trim() || '',
      ownerUid: currentUser.uid,
      memberUids: [currentUser.uid],
      memberCount: 1,
      createdAt: now,
      updatedAt: now,
      status: 'active',
    };

    const newMember: GroupMember = {
      uid: currentUser.uid,
      role: 'owner',
      joinedAt: now,
      status: 'active',
      displayName: currentUser.displayName,
    };

    const inviteCode = generateInviteCode();
    const newInvite: GroupInvite = {
      id: `inv-${Date.now()}`,
      code: inviteCode,
      groupId,
      createdBy: currentUser.uid,
      createdAt: now,
      expiresAt: null,
      revokedAt: null,
      maxUses: 20,
      usesCount: 0,
      status: 'active',
    };

    setGroups((prev) => [newGroup, ...prev]);
    setGroupMembers((prev) => [newMember, ...prev]);
    setGroupInvites((prev) => [newInvite, ...prev]);

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        actorUid: currentUser.uid,
        actorName: currentUser.displayName,
        action: 'GROUP_CREATED',
        targetType: 'group',
        targetId: groupId,
        createdAt: now,
        details: { name: trimmed },
      },
      ...prev,
    ]);

    return { success: true, group: newGroup };
  };

  const joinGroupWithCode = (code: string) => {
    if (!currentUser) return { success: false, error: 'Non authentifié' };
    const cleanCode = code.trim().toUpperCase();

    const invite = groupInvites.find((inv) => inv.code === cleanCode);
    if (!invite) {
      return { success: false, error: 'Code d’invitation introuvable ou incorrect.' };
    }

    const check = validateInvite(invite);
    if (!check.valid) {
      if (check.errorKey === 'code_revoked') {
        return { success: false, error: 'Ce code d’invitation a été révoqué par le propriétaire.' };
      }
      if (check.errorKey === 'code_expired') {
        return { success: false, error: 'Ce code d’invitation a expiré.' };
      }
      if (check.errorKey === 'code_exhausted') {
        return { success: false, error: 'Ce code d’invitation a atteint sa limite d’utilisations.' };
      }
      return { success: false, error: 'Invitation non valide.' };
    }

    const targetGroup = groups.find((g) => g.id === invite.groupId);
    if (!targetGroup || targetGroup.status !== 'active') {
      return { success: false, error: 'Le groupe correspondant n’est plus actif.' };
    }

    // Check if already member
    if (targetGroup.memberUids.includes(currentUser.uid)) {
      return { success: true, group: targetGroup }; // open directly without duplicate
    }

    const now = new Date().toISOString();

    // Increment invite uses
    setGroupInvites((prev) =>
      prev.map((inv) => (inv.id === invite.id ? { ...inv, usesCount: inv.usesCount + 1 } : inv))
    );

    // Update group
    setGroups((prev) =>
      prev.map((g) =>
        g.id === targetGroup.id
          ? {
              ...g,
              memberUids: [...g.memberUids, currentUser.uid],
              memberCount: g.memberCount + 1,
              updatedAt: now,
            }
          : g
      )
    );

    // Add member
    const newMember: GroupMember = {
      uid: currentUser.uid,
      role: 'member',
      joinedAt: now,
      status: 'active',
      displayName: currentUser.displayName,
    };
    setGroupMembers((prev) => [newMember, ...prev]);

    // Send notification to group owner
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        uid: targetGroup.ownerUid,
        type: 'group_joined',
        title: {
          fr: `${currentUser.displayName} a rejoint ${targetGroup.name}`,
          en: `${currentUser.displayName} joined ${targetGroup.name}`,
        },
        body: {
          fr: 'Votre escouade s’agrandit ! Préparez vos prochains défis partagés.',
          en: 'Your squad grows! Prepare your next shared challenges.',
        },
        targetPath: `/app/groups/${targetGroup.id}`,
        eventId: `evt-join-${targetGroup.id}-${currentUser.uid}`,
        createdAt: now,
        status: 'unread',
      },
      ...prev,
    ]);

    return { success: true, group: targetGroup };
  };

  const revokeInvite = (inviteId: string) => {
    if (!currentUser) return;
    setGroupInvites((prev) =>
      prev.map((inv) =>
        inv.id === inviteId ? { ...inv, status: 'revoked', revokedAt: new Date().toISOString() } : inv
      )
    );
  };

  const regenerateInvite = (groupId: string) => {
    if (!currentUser) return '';
    const newCode = generateInviteCode();
    const newInvite: GroupInvite = {
      id: `inv-${Date.now()}`,
      code: newCode,
      groupId,
      createdBy: currentUser.uid,
      createdAt: new Date().toISOString(),
      expiresAt: null,
      revokedAt: null,
      maxUses: 20,
      usesCount: 0,
      status: 'active',
    };
    setGroupInvites((prev) => [newInvite, ...prev]);
    return newCode;
  };

  const leaveGroup = (groupId: string) => {
    if (!currentUser) return;
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              memberUids: g.memberUids.filter((id) => id !== currentUser.uid),
              memberCount: Math.max(0, g.memberCount - 1),
            }
          : g
      )
    );
    setGroupMembers((prev) =>
      prev.filter((m) => !(m.uid === currentUser.uid && m.role !== 'owner'))
    );
  };

  // Challenges methods
  const createChallenge = (data: {
    groupId: string;
    title: string;
    description: string;
    proofPolicy: Challenge['proofPolicy'];
    validationPolicy: Challenge['validationPolicy'];
    xpReward: number;
    dueAt?: string | null;
  }) => {
    if (!currentUser) return { success: false, error: 'Non authentifié' };
    const group = groups.find((g) => g.id === data.groupId);
    if (!group) return { success: false, error: 'Groupe introuvable' };

    const challengeId = `chal-${Date.now()}`;
    const now = new Date().toISOString();

    const newChallenge: Challenge = {
      id: challengeId,
      groupId: data.groupId,
      title: data.title.trim(),
      description: data.description.trim(),
      createdBy: currentUser.uid,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      dueAt: data.dueAt || null,
      proofPolicy: data.proofPolicy,
      validationPolicy: data.validationPolicy,
      xpReward: Math.min(500, Math.max(25, data.xpReward || 100)),
      participantUids: group.memberUids,
      gameId: 'fortnite',
    };

    setChallenges((prev) => [newChallenge, ...prev]);

    // Initial participants entries
    const newParticipants: ChallengeParticipant[] = group.memberUids.map((uid) => ({
      uid,
      challengeId,
      status: 'not_started',
      xpAwarded: 0,
      updatedAt: now,
    }));
    setParticipants((prev) => [...newParticipants, ...prev]);

    // Notify other group members
    group.memberUids
      .filter((uid) => uid !== currentUser.uid)
      .forEach((memberUid) => {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}-${memberUid}`,
            uid: memberUid,
            type: 'challenge_new',
            title: {
              fr: `Nouveau défi : ${newChallenge.title}`,
              en: `New challenge: ${newChallenge.title}`,
            },
            body: {
              fr: `Lancé dans votre groupe "${group.name}". Récompense : +${newChallenge.xpReward} XP.`,
              en: `Launched in squad "${group.name}". Reward: +${newChallenge.xpReward} XP.`,
            },
            targetPath: `/app/challenges/${challengeId}`,
            eventId: `evt-chal-new-${challengeId}-${memberUid}`,
            createdAt: now,
            status: 'unread',
          },
          ...prev,
        ]);
      });

    return { success: true, challenge: newChallenge };
  };

  const submitChallengeClaim = (
    challengeId: string,
    options: { hasProof: boolean; proofUrl?: string; notes?: string }
  ) => {
    if (!currentUser) return { success: false, error: 'Non authentifié' };
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) return { success: false, error: 'Défi introuvable' };

    const now = new Date().toISOString();

    if (challenge.proofPolicy === 'required' && !options.hasProof) {
      return { success: false, error: 'Ce défi requiert obligatoirement une preuve capture ou vidéo.' };
    }

    if (options.hasProof) {
      // Status submitted with proof awaiting review
      const proofItem = {
        id: `proof-${Date.now()}`,
        mediaType: 'image' as const,
        mediaUrl: options.proofUrl || '/src/assets/images/fn_victory_crown_1792263047262.jpg',
        uploadedAt: now,
        uploadedBy: currentUser.uid,
        status: 'pending' as const,
        notes: options.notes,
      };

      setParticipants((prev) =>
        prev.map((p) =>
          p.challengeId === challengeId && p.uid === currentUser.uid
            ? {
                ...p,
                status: 'submitted',
                submittedAt: now,
                proof: proofItem,
                updatedAt: now,
              }
            : p
        )
      );

      // Notify challenge creator / group owner
      if (challenge.createdBy !== currentUser.uid) {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            uid: challenge.createdBy,
            type: 'proof_submitted',
            title: {
              fr: `${currentUser.displayName} a soumis une preuve`,
              en: `${currentUser.displayName} submitted proof`,
            },
            body: {
              fr: `Pour le défi "${challenge.title}". En attente de validation.`,
              en: `For challenge "${challenge.title}". Awaiting review.`,
            },
            targetPath: `/app/challenges/${challengeId}`,
            eventId: `evt-submit-${challengeId}-${currentUser.uid}`,
            createdAt: now,
            status: 'unread',
          },
          ...prev,
        ]);
      }
    } else {
      // Completed unverified (honor code)
      const xpEarned = calculateXpReward({
        proofPolicy: challenge.proofPolicy,
        baseReward: challenge.xpReward,
        status: 'completed_unverified',
      });

      setParticipants((prev) =>
        prev.map((p) =>
          p.challengeId === challengeId && p.uid === currentUser.uid
            ? {
                ...p,
                status: 'completed_unverified',
                submittedAt: now,
                completedAt: now,
                xpAwarded: xpEarned,
                xpAwardedAt: now,
                updatedAt: now,
              }
            : p
        )
      );

      if (xpEarned > 0) {
        setUsers((prev) =>
          prev.map((u) => (u.uid === currentUser.uid ? { ...u, xp: u.xp + xpEarned } : u))
        );
        setLedger((prev) => [
          {
            id: `ledger-${Date.now()}`,
            uid: currentUser.uid,
            challengeId,
            groupId: challenge.groupId,
            reason: 'Déclaration sur l’honneur (sans preuve)',
            amount: xpEarned,
            createdAt: now,
            idempotencyKey: `unverified-${challengeId}-${currentUser.uid}`,
          },
          ...prev,
        ]);
      }
    }

    return { success: true };
  };

  const reviewProof = (
    challengeId: string,
    participantUid: string,
    decision: 'accept' | 'reject',
    reason?: string
  ) => {
    if (!currentUser) return { success: false, error: 'Non authentifié' };
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) return { success: false, error: 'Défi introuvable' };

    // Enforcement of spec 16.7: self-validation forbidden
    const check = canValidateProof({
      reviewerUid: currentUser.uid,
      participantUid,
      isOwnerOrAdmin: challenge.createdBy === currentUser.uid || currentUser.role === 'admin',
    });

    if (!check.allowed) {
      if (check.reasonKey === 'cannot_validate_own_proof') {
        return { success: false, error: 'Vous ne pouvez pas valider votre propre preuve.' };
      }
      return { success: false, error: 'Seul le créateur du défi ou un administrateur peut valider.' };
    }

    const now = new Date().toISOString();

    if (decision === 'accept') {
      const xpAward = challenge.xpReward;

      setParticipants((prev) =>
        prev.map((p) =>
          p.challengeId === challengeId && p.uid === participantUid
            ? {
                ...p,
                status: 'completed_verified',
                completedAt: now,
                verifiedAt: now,
                verifiedBy: currentUser.uid,
                xpAwarded: xpAward,
                xpAwardedAt: now,
                proof: p.proof ? { ...p.proof, status: 'accepted' } : undefined,
                updatedAt: now,
              }
            : p
        )
      );

      // Award XP to participant
      setUsers((prev) =>
        prev.map((u) => (u.uid === participantUid ? { ...u, xp: u.xp + xpAward } : u))
      );

      // Ledger entry
      setLedger((prev) => [
        {
          id: `ledger-${Date.now()}`,
          uid: participantUid,
          challengeId,
          groupId: challenge.groupId,
          reason: `Preuve validée par ${currentUser.displayName}`,
          amount: xpAward,
          createdAt: now,
          idempotencyKey: `verified-${challengeId}-${participantUid}`,
        },
        ...prev,
      ]);

      // Notification to participant
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          uid: participantUid,
          type: 'proof_accepted',
          title: {
            fr: `Preuve validée ! (+${xpAward} XP)`,
            en: `Proof accepted! (+${xpAward} XP)`,
          },
          body: {
            fr: `${currentUser.displayName} a approuvé votre réussite pour "${challenge.title}".`,
            en: `${currentUser.displayName} approved your achievement for "${challenge.title}".`,
          },
          targetPath: `/app/challenges/${challengeId}`,
          eventId: `evt-accept-${challengeId}-${participantUid}`,
          createdAt: now,
          status: 'unread',
        },
        ...prev,
      ]);
    } else {
      // Reject proof with mandatory reason
      if (!reason?.trim()) {
        return { success: false, error: 'Un motif de refus est obligatoire.' };
      }

      setParticipants((prev) =>
        prev.map((p) =>
          p.challengeId === challengeId && p.uid === participantUid
            ? {
                ...p,
                status: 'rejected',
                rejectionReason: reason.trim(),
                proof: p.proof ? { ...p.proof, status: 'rejected', reviewReason: reason.trim() } : undefined,
                updatedAt: now,
              }
            : p
        )
      );

      // Notification to participant
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          uid: participantUid,
          type: 'proof_rejected',
          title: {
            fr: `Preuve refusée : ${challenge.title}`,
            en: `Proof rejected: ${challenge.title}`,
          },
          body: {
            fr: `Motif : ${reason.trim()}. Vous pouvez contester cette décision.`,
            en: `Reason: ${reason.trim()}. You can contest this decision.`,
          },
          targetPath: `/app/challenges/${challengeId}`,
          eventId: `evt-reject-${challengeId}-${participantUid}`,
          createdAt: now,
          status: 'unread',
        },
        ...prev,
      ]);
    }

    return { success: true };
  };

  const contestRejection = (challengeId: string, contestReason: string) => {
    if (!currentUser) return { success: false, error: 'Non authentifié' };
    if (!contestReason.trim()) return { success: false, error: 'Veuillez préciser le motif de contestation.' };

    const now = new Date().toISOString();

    setParticipants((prev) =>
      prev.map((p) =>
        p.challengeId === challengeId && p.uid === currentUser.uid
          ? {
                ...p,
                status: 'contested',
                contestedAt: now,
                contestReason: contestReason.trim(),
                updatedAt: now,
              }
          : p
      )
    );

    const chal = challenges.find((c) => c.id === challengeId);
    if (chal && chal.createdBy !== currentUser.uid) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          uid: chal.createdBy,
          type: 'contest_opened',
          title: {
            fr: `Contestation ouverte par ${currentUser.displayName}`,
            en: `Contest filed by ${currentUser.displayName}`,
          },
          body: {
            fr: `Pour le défi "${chal.title}". Motif : ${contestReason.trim()}`,
            en: `For challenge "${chal.title}". Reason: ${contestReason.trim()}`,
          },
          targetPath: `/app/challenges/${challengeId}`,
          eventId: `evt-contest-${challengeId}-${currentUser.uid}`,
          createdAt: now,
          status: 'unread',
        },
        ...prev,
      ]);
    }

    return { success: true };
  };

  // Notification actions
  const unreadCount = currentUser
    ? notifications.filter((n) => n.uid === currentUser.uid && n.status === 'unread').length
    : 0;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status: 'read', readAt: new Date().toISOString() } : n
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    const now = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((n) => (n.uid === currentUser.uid ? { ...n, status: 'read', readAt: now } : n))
    );
  };

  const sendAdminBroadcast = (
    titleFr: string,
    titleEn: string,
    bodyFr: string,
    bodyEn: string,
    targetPath = '/app'
  ) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    const now = new Date().toISOString();

    const newNotifs: AppNotification[] = users.map((u) => ({
      id: `notif-broadcast-${Date.now()}-${u.uid}`,
      uid: u.uid,
      type: 'admin_broadcast',
      title: { fr: titleFr, en: titleEn },
      body: { fr: bodyFr, en: bodyEn },
      targetPath,
      eventId: `evt-broadcast-${Date.now()}`,
      createdAt: now,
      status: 'unread',
    }));

    setNotifications((prev) => [...newNotifs, ...prev]);

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        actorUid: currentUser.uid,
        actorName: currentUser.displayName,
        action: 'BROADCAST_SENT',
        targetType: 'system',
        targetId: 'all_users',
        createdAt: now,
        details: { titleFr, recipientCount: users.length },
      },
      ...prev,
    ]);
  };

  // Reports & Administration
  const resolveReport = (id: string, resolution: string, status: Report['status']) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    const now = new Date().toISOString();
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              resolution,
              status,
              assignedTo: currentUser.uid,
              resolvedAt: status === 'resolved' || status === 'rejected' ? now : undefined,
            }
          : r
      )
    );
  };

  const toggleUserSuspension = (uid: string, reason: string) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    const now = new Date().toISOString();
    setUsers((prev) =>
      prev.map((u) => {
        if (u.uid === uid) {
          const nextStatus = u.accountStatus === 'suspended' ? 'active' : 'suspended';
          return { ...u, accountStatus: nextStatus, updatedAt: now };
        }
        return u;
      })
    );

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        actorUid: currentUser.uid,
        actorName: currentUser.displayName,
        action: 'USER_STATUS_TOGGLED',
        targetType: 'user',
        targetId: uid,
        createdAt: now,
        details: { reason },
      },
      ...prev,
    ]);
  };

  const changeUserRole = (uid: string, role: UserProfile['role']) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    const now = new Date().toISOString();
    setUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, role, updatedAt: now } : u))
    );

    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        actorUid: currentUser.uid,
        actorName: currentUser.displayName,
        action: 'USER_ROLE_CHANGED',
        targetType: 'user',
        targetId: uid,
        createdAt: now,
        details: { newRole: role },
      },
      ...prev,
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        language,
        setLanguage,
        t,
        users,
        switchDemoUser,
        login,
        signup,
        logout,
        completeOnboarding,
        updateProfile,
        deleteAccount,
        news,
        categories: initialCategories,
        savedNewsIds,
        toggleSaveNews,
        createNews,
        updateNews,
        deleteNews,
        archiveNews,
        groups,
        groupMembers,
        groupInvites,
        createGroup,
        joinGroupWithCode,
        revokeInvite,
        regenerateInvite,
        leaveGroup,
        challenges,
        participants,
        createChallenge,
        submitChallengeClaim,
        reviewProof,
        contestRejection,
        notifications,
        unreadCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        sendAdminBroadcast,
        ledger,
        auditLogs,
        reports,
        resolveReport,
        toggleUserSuspension,
        changeUserRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
