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
import { officialCategories } from '../data/categories';
import {
  calculateLevelFromXp,
  canValidateProof,
  calculateXpReward,
  validateInvite,
  generateInviteCode,
  resolveChallengeStatus,
} from '../utils/rules';
import {
  auth,
  db,
  storage,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signInWithPopup,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  storageRef,
  uploadBytes,
  getDownloadURL,
  FirebaseUser,
} from '../services/firebase';

interface AppContextType {
  currentUser: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  authLoading: boolean;
  firebaseError: string | null;
  clearFirebaseError: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (section: keyof typeof translations.fr, key: string, params?: Record<string, string | number>) => string;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, pass: string, displayName: string, epicGamesId?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  completeOnboarding: (interests: string[]) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  // News
  news: GameUpdate[];
  categories: NewsCategory[];
  savedNewsIds: string[];
  toggleSaveNews: (newsId: string) => Promise<void>;
  createNews: (newsItem: Omit<GameUpdate, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => Promise<{ success: boolean; error?: string }>;
  updateNews: (id: string, updates: Partial<GameUpdate>) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  archiveNews: (id: string) => Promise<void>;
  // Groups
  groups: Group[];
  groupMembers: GroupMember[];
  groupInvites: GroupInvite[];
  createGroup: (name: string, description?: string) => Promise<{ success: boolean; group?: Group; error?: string }>;
  joinGroupWithCode: (code: string) => Promise<{ success: boolean; group?: Group; error?: string }>;
  revokeInvite: (inviteId: string) => Promise<void>;
  regenerateInvite: (groupId: string) => Promise<string>;
  leaveGroup: (groupId: string) => Promise<void>;
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
  }) => Promise<{ success: boolean; challenge?: Challenge; error?: string }>;
  submitChallengeClaim: (
    challengeId: string,
    options: { hasProof: boolean; proofFile?: File; proofUrl?: string; notes?: string }
  ) => Promise<{ success: boolean; error?: string }>;
  reviewProof: (
    challengeId: string,
    participantUid: string,
    decision: 'accept' | 'reject',
    reason?: string
  ) => Promise<{ success: boolean; error?: string }>;
  contestRejection: (challengeId: string, contestReason: string) => Promise<{ success: boolean; error?: string }>;
  // Notifications
  notifications: AppNotification[];
  unreadCount: number;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  sendAdminBroadcast: (titleFr: string, titleEn: string, bodyFr: string, bodyEn: string, targetPath?: string) => Promise<void>;
  // Ledger, Logs & Reports
  users: UserProfile[];
  ledger: XpLedgerEntry[];
  auditLogs: AuditLog[];
  reports: Report[];
  resolveReport: (id: string, resolution: string, status: Report['status']) => Promise<void>;
  toggleUserSuspension: (uid: string, reason: string) => Promise<void>;
  changeUserRole: (uid: string, role: UserProfile['role']) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Locale State
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('lootsy_lang');
    return saved === 'en' || saved === 'fr' ? saved : 'fr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lootsy_lang', lang);
  };

  // Auth State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const clearFirebaseError = () => setFirebaseError(null);

  // Firestore Collections Data State (Initialized empty with zero fake data)
  const [news, setNews] = useState<GameUpdate[]>([]);
  const [savedNewsIds, setSavedNewsIds] = useState<string[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [groupInvites, setGroupInvites] = useState<GroupInvite[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [participants, setParticipants] = useState<ChallengeParticipant[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [ledger, setLedger] = useState<XpLedgerEntry[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  // Translation helper
  const t = (section: keyof typeof translations.fr, key: string, params?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations.fr;
    const sec = (langDict as any)[section];
    let text = sec && sec[key] ? sec[key] : (translations.fr as any)[section]?.[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
      });
    }
    return text;
  };

  // 1. Listen for Firebase Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setCurrentUser(data);
          } else {
            // Check if user is in trusted admin collection
            const adminDocRef = doc(db, 'admins', user.uid);
            const adminSnap = await getDoc(adminDocRef);
            const isAdmin = adminSnap.exists();

            // Create initial profile for newly authenticated user
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'Player'),
              preferredLanguage: language,
              interests: [],
              role: isAdmin ? 'admin' : 'user',
              isVerified: isAdmin,
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
            await setDoc(userDocRef, newProfile, { merge: true });
            setCurrentUser(newProfile);
          }
        } catch (err: any) {
          console.error('[Lootsy Auth Error]:', err);
          setFirebaseError(err.message || 'Erreur de chargement du profil');
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [language]);

  // Real-time listener for current user profile changes
  useEffect(() => {
    if (!firebaseUser) return;
    const unsub = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        setCurrentUser(docSnap.data() as UserProfile);
      }
    }, (err) => {
      console.warn('User doc snapshot error:', err);
    });
    return () => unsub();
  }, [firebaseUser]);

  // 2. Real-time News collection listener (Public read)
  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('publishedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: GameUpdate[] = [];
      snapshot.forEach((docItem) => {
        items.push({ id: docItem.id, ...docItem.data() } as GameUpdate);
      });
      setNews(items);
    }, (err) => {
      console.warn('News snapshot warning:', err.message);
    });
    return () => unsubscribe();
  }, []);

  // 3. User-specific real-time listeners (Groups, Challenges, Saved News, Notifications, Ledger)
  useEffect(() => {
    if (!currentUser) {
      setGroups([]);
      setGroupMembers([]);
      setGroupInvites([]);
      setChallenges([]);
      setParticipants([]);
      setNotifications([]);
      setLedger([]);
      setSavedNewsIds([]);
      setAuditLogs([]);
      setReports([]);
      return;
    }

    // A. Saved news
    const savedUnsub = onSnapshot(
      query(collection(db, 'savedNews'), where('userUid', '==', currentUser.uid)),
      (snapshot) => {
        const ids: string[] = [];
        snapshot.forEach((d) => ids.push(d.data().newsId));
        setSavedNewsIds(ids);
      },
      (err) => console.warn('SavedNews warning:', err.message)
    );

    // B. Groups (All groups visible to user)
    const groupsUnsub = onSnapshot(
      collection(db, 'groups'),
      (snapshot) => {
        const grps: Group[] = [];
        snapshot.forEach((d) => grps.push({ id: d.id, ...d.data() } as Group));
        setGroups(grps);
      },
      (err) => console.warn('Groups warning:', err.message)
    );

    // C. Challenges
    const challengesUnsub = onSnapshot(
      collection(db, 'challenges'),
      (snapshot) => {
        const chs: Challenge[] = [];
        snapshot.forEach((d) => chs.push({ id: d.id, ...d.data() } as Challenge));
        setChallenges(chs);
      },
      (err) => console.warn('Challenges warning:', err.message)
    );

    // D. Notifications for current user
    const notifUnsub = onSnapshot(
      query(collection(db, 'notifications'), where('userUid', '==', currentUser.uid)),
      (snapshot) => {
        const list: AppNotification[] = [];
        snapshot.forEach((d) => list.push({ id: d.id, ...d.data() } as AppNotification));
        list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        setNotifications(list);
      },
      (err) => console.warn('Notifications warning:', err.message)
    );

    // E. XP Ledger for current user
    const ledgerUnsub = onSnapshot(
      query(collection(db, 'xpLedger'), where('userUid', '==', currentUser.uid)),
      (snapshot) => {
        const list: XpLedgerEntry[] = [];
        snapshot.forEach((d) => list.push({ id: d.id, ...d.data() } as XpLedgerEntry));
        list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        setLedger(list);
      },
      (err) => console.warn('Ledger warning:', err.message)
    );

    // F. Admin items if currentUser.role === 'admin'
    let usersUnsub: (() => void) | undefined;
    let auditUnsub: (() => void) | undefined;
    let reportsUnsub: (() => void) | undefined;
    if (currentUser.role === 'admin') {
      usersUnsub = onSnapshot(
        collection(db, 'users'),
        (snapshot) => {
          const uList: UserProfile[] = [];
          snapshot.forEach((d) => uList.push(d.data() as UserProfile));
          setUsers(uList);
        },
        (err) => console.warn('Users warning:', err.message)
      );

      auditUnsub = onSnapshot(
        collection(db, 'auditLogs'),
        (snapshot) => {
          const logs: AuditLog[] = [];
          snapshot.forEach((d) => logs.push({ id: d.id, ...d.data() } as AuditLog));
          logs.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
          setAuditLogs(logs);
        },
        (err) => console.warn('AuditLogs warning:', err.message)
      );

      reportsUnsub = onSnapshot(
        collection(db, 'reports'),
        (snapshot) => {
          const list: Report[] = [];
          snapshot.forEach((d) => list.push({ id: d.id, ...d.data() } as Report));
          list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
          setReports(list);
        },
        (err) => console.warn('Reports warning:', err.message)
      );
    }

    return () => {
      savedUnsub();
      groupsUnsub();
      challengesUnsub();
      notifUnsub();
      ledgerUnsub();
      if (usersUnsub) usersUnsub();
      if (auditUnsub) auditUnsub();
      if (reportsUnsub) reportsUnsub();
    };
  }, [currentUser]);

  // Auth Operations
  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setFirebaseError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      return { success: true };
    } catch (err: any) {
      let message = 'Identifiants invalides. Veuillez vérifier votre e-mail et votre mot de passe.';
      if (err.code === 'auth/operation-not-allowed') {
        message = 'La connexion par e-mail/mot de passe doit être activée dans la console Firebase (Authentication > Providers).';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Adresse e-mail ou mot de passe incorrect.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Compte temporairement bloqué suite à trop de tentatives. Réessayez plus tard.';
      } else if (err.code === 'auth/network-request-failed') {
        message = 'Erreur réseau : impossible de joindre les serveurs Firebase.';
      }
      setFirebaseError(message);
      return { success: false, error: message };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setFirebaseError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      return { success: true };
    } catch (err: any) {
      const message = err.message || 'Erreur lors de la connexion avec Google.';
      setFirebaseError(message);
      return { success: false, error: message };
    }
  };

  const signup = async (
    email: string,
    pass: string,
    displayName: string,
    epicGamesId?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setFirebaseError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const uid = res.user.uid;

      // Check if user is pre-registered in admin table
      const adminSnap = await getDoc(doc(db, 'admins', uid));
      const isAdmin = adminSnap.exists();

      const newProfile: UserProfile = {
        uid,
        email: email.trim().toLowerCase(),
        displayName: displayName.trim(),
        epicGamesId: epicGamesId ? epicGamesId.trim() : '',
        preferredLanguage: language,
        interests: [],
        role: isAdmin ? 'admin' : 'user',
        isVerified: isAdmin,
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

      await setDoc(doc(db, 'users', uid), newProfile);
      setCurrentUser(newProfile);
      return { success: true };
    } catch (err: any) {
      let message = 'Erreur lors de la création du compte.';
      if (err.code === 'auth/email-already-in-use') {
        message = 'Cette adresse e-mail est déjà utilisée par un autre compte.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Le mot de passe doit comporter au moins 6 caractères.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Adresse e-mail invalide.';
      } else if (err.code === 'auth/operation-not-allowed') {
        message = 'Le fournisseur Email/Mot de passe doit être activé dans la console Firebase (Authentication > Providers).';
      }
      setFirebaseError(message);
      return { success: false, error: message };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setFirebaseError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true };
    } catch (err: any) {
      let message = 'Erreur lors de l’envoi de l’e-mail de réinitialisation.';
      if (err.code === 'auth/user-not-found') {
        message = 'Aucun compte n’est associé à cette adresse e-mail.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Adresse e-mail invalide.';
      }
      return { success: false, error: message };
    }
  };

  const completeOnboarding = async (interests: string[]): Promise<void> => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        interests,
        onboardingCompleted: true,
        updatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('completeOnboarding error:', err);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!currentUser) return;
    try {
      // Security: never allow self-elevating role or isVerified via updateProfile
      const safeUpdates = { ...updates };
      delete (safeUpdates as any).role;
      delete (safeUpdates as any).isVerified;
      safeUpdates.updatedAt = new Date().toISOString();

      await updateDoc(doc(db, 'users', currentUser.uid), safeUpdates);
    } catch (err: any) {
      console.error('updateProfile error:', err);
      setFirebaseError(err.message);
    }
  };

  const deleteAccount = async (): Promise<void> => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        accountStatus: 'pendingDeletion',
        updatedAt: new Date().toISOString(),
      });
      await logout();
    } catch (err: any) {
      console.error('deleteAccount error:', err);
    }
  };

  // News Operations
  const toggleSaveNews = async (newsId: string): Promise<void> => {
    if (!currentUser) return;
    try {
      const savedDocId = `${currentUser.uid}_${newsId}`;
      const savedDocRef = doc(db, 'savedNews', savedDocId);
      if (savedNewsIds.includes(newsId)) {
        await deleteDoc(savedDocRef);
      } else {
        await setDoc(savedDocRef, {
          id: savedDocId,
          userUid: currentUser.uid,
          newsId,
          savedAt: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.error('toggleSaveNews error:', err);
    }
  };

  const createNews = async (
    newsItem: Omit<GameUpdate, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Seul un administrateur peut publier une actualité.' };
    }
    try {
      const newsId = `news-${Date.now()}`;
      const fullItem: GameUpdate = {
        ...newsItem,
        id: newsId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: currentUser.uid,
        updatedBy: currentUser.uid,
      };
      await setDoc(doc(db, 'news', newsId), fullItem);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateNews = async (id: string, updates: Partial<GameUpdate>): Promise<void> => {
    if (!currentUser || currentUser.role !== 'admin') return;
    try {
      await updateDoc(doc(db, 'news', id), {
        ...updates,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.uid,
      });
    } catch (err) {
      console.error('updateNews error:', err);
    }
  };

  const deleteNews = async (id: string): Promise<void> => {
    if (!currentUser || currentUser.role !== 'admin') return;
    try {
      await deleteDoc(doc(db, 'news', id));
    } catch (err) {
      console.error('deleteNews error:', err);
    }
  };

  const archiveNews = async (id: string): Promise<void> => {
    await updateNews(id, { status: 'archived' });
  };

  // Group Operations
  const createGroup = async (name: string, description?: string): Promise<{ success: boolean; group?: Group; error?: string }> => {
    if (!currentUser) return { success: false, error: 'Vous devez être connecté.' };
    try {
      const groupId = `grp-${Date.now()}`;
      const newGroup: Group = {
        id: groupId,
        name: name.trim(),
        description: description?.trim() || '',
        ownerUid: currentUser.uid,
        memberUids: [currentUser.uid],
        memberCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
      };

      await setDoc(doc(db, 'groups', groupId), newGroup);

      // Create owner member document in subcollection
      const memberId = `${groupId}_${currentUser.uid}`;
      const memberData: GroupMember = {
        uid: currentUser.uid,
        role: 'owner',
        joinedAt: new Date().toISOString(),
        status: 'active',
        displayName: currentUser.displayName,
      };
      await setDoc(doc(db, 'groups', groupId, 'members', memberId), memberData);

      // Generate initial invite code
      const code = generateInviteCode();
      const inviteData: GroupInvite = {
        id: `inv-${Date.now()}`,
        code,
        groupId,
        createdBy: currentUser.uid,
        createdAt: new Date().toISOString(),
        status: 'active',
        usesCount: 0,
      };
      await setDoc(doc(db, 'groups', groupId, 'invites', inviteData.id), inviteData);

      return { success: true, group: newGroup };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const joinGroupWithCode = async (code: string): Promise<{ success: boolean; group?: Group; error?: string }> => {
    if (!currentUser) return { success: false, error: 'Vous devez être connecté.' };
    try {
      const cleanCode = code.trim().toUpperCase();
      // Look up group with matching code in groups collection
      const allGroups = groups;
      let targetGroup: Group | null = null;

      for (const g of allGroups) {
        const invSnap = await getDocs(
          query(collection(db, 'groups', g.id, 'invites'), where('code', '==', cleanCode), where('status', '==', 'active'))
        );
        if (!invSnap.empty) {
          targetGroup = g;
          break;
        }
      }

      if (!targetGroup) {
        return { success: false, error: 'Code d’invitation invalide, expiré ou révoqué.' };
      }

      // Add user to members
      const memberId = `${targetGroup.id}_${currentUser.uid}`;
      const memberData: GroupMember = {
        uid: currentUser.uid,
        role: 'member',
        joinedAt: new Date().toISOString(),
        status: 'active',
        displayName: currentUser.displayName,
      };
      await setDoc(doc(db, 'groups', targetGroup.id, 'members', memberId), memberData);

      // Update group member count and memberUids
      const updatedUids = Array.from(new Set([...(targetGroup.memberUids || []), currentUser.uid]));
      await updateDoc(doc(db, 'groups', targetGroup.id), {
        memberUids: updatedUids,
        memberCount: updatedUids.length,
        updatedAt: new Date().toISOString(),
      });

      return { success: true, group: targetGroup };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const revokeInvite = async (inviteId: string): Promise<void> => {
    // Marks invite as revoked in Firestore
    try {
      for (const g of groups) {
        const invRef = doc(db, 'groups', g.id, 'invites', inviteId);
        const snap = await getDoc(invRef);
        if (snap.exists()) {
          await updateDoc(invRef, {
            status: 'revoked',
            revokedAt: new Date().toISOString(),
          });
          break;
        }
      }
    } catch (err) {
      console.error('revokeInvite error:', err);
    }
  };

  const regenerateInvite = async (groupId: string): Promise<string> => {
    if (!currentUser) return '';
    try {
      const code = generateInviteCode();
      const inviteData: GroupInvite = {
        id: `inv-${Date.now()}`,
        code,
        groupId,
        createdBy: currentUser.uid,
        createdAt: new Date().toISOString(),
        status: 'active',
        usesCount: 0,
      };
      await setDoc(doc(db, 'groups', groupId, 'invites', inviteData.id), inviteData);
      return code;
    } catch (err) {
      console.error('regenerateInvite error:', err);
      return '';
    }
  };

  const leaveGroup = async (groupId: string): Promise<void> => {
    if (!currentUser) return;
    try {
      const memberId = `${groupId}_${currentUser.uid}`;
      await deleteDoc(doc(db, 'groups', groupId, 'members', memberId));
      const targetGroup = groups.find((g) => g.id === groupId);
      if (targetGroup) {
        const remaining = (targetGroup.memberUids || []).filter((id) => id !== currentUser.uid);
        await updateDoc(doc(db, 'groups', groupId), {
          memberUids: remaining,
          memberCount: remaining.length,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('leaveGroup error:', err);
    }
  };

  // Challenge Operations
  const createChallenge = async (data: {
    groupId: string;
    title: string;
    description: string;
    proofPolicy: Challenge['proofPolicy'];
    validationPolicy: Challenge['validationPolicy'];
    xpReward: number;
    dueAt?: string | null;
  }): Promise<{ success: boolean; challenge?: Challenge; error?: string }> => {
    if (!currentUser) return { success: false, error: 'Vous devez être connecté.' };
    try {
      const challengeId = `chal-${Date.now()}`;
      const newChallenge: Challenge = {
        id: challengeId,
        groupId: data.groupId,
        title: data.title.trim(),
        description: data.description.trim(),
        createdBy: currentUser.uid,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueAt: data.dueAt || null,
        proofPolicy: data.proofPolicy,
        validationPolicy: data.validationPolicy,
        xpReward: data.xpReward,
        participantUids: [currentUser.uid],
        gameId: 'fortnite',
      };

      await setDoc(doc(db, 'challenges', challengeId), newChallenge);

      // Add creator as initial participant
      const participantData: ChallengeParticipant = {
        uid: currentUser.uid,
        challengeId,
        status: 'not_started',
        xpAwarded: 0,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'challenges', challengeId, 'participants', currentUser.uid), participantData);

      return { success: true, challenge: newChallenge };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const submitChallengeClaim = async (
    challengeId: string,
    options: { hasProof: boolean; proofFile?: File; proofUrl?: string; notes?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: 'Vous devez être connecté.' };
    try {
      let finalProofUrl = options.proofUrl || '';
      let storagePath = '';

      // Upload file to Firebase Storage if provided
      if (options.proofFile) {
        const fileExt = options.proofFile.name.split('.').pop() || 'png';
        storagePath = `proofs/${challengeId}/${currentUser.uid}_${Date.now()}.${fileExt}`;
        const fileRef = storageRef(storage, storagePath);
        await uploadBytes(fileRef, options.proofFile);
        finalProofUrl = await getDownloadURL(fileRef);
      }

      const participantRef = doc(db, 'challenges', challengeId, 'participants', currentUser.uid);
      const isProofRequired = challenges.find((c) => c.id === challengeId)?.proofPolicy === 'required';

      const updateData: Partial<ChallengeParticipant> = {
        uid: currentUser.uid,
        challengeId,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (options.hasProof || finalProofUrl) {
        updateData.proof = {
          id: `proof-${Date.now()}`,
          mediaType: options.proofFile?.type.startsWith('video') ? 'video' : 'image',
          mediaUrl: finalProofUrl,
          storagePath,
          uploadedAt: new Date().toISOString(),
          uploadedBy: currentUser.uid,
          status: 'pending',
          notes: options.notes,
        };
      }

      await setDoc(participantRef, updateData, { merge: true });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const reviewProof = async (
    challengeId: string,
    participantUid: string,
    decision: 'accept' | 'reject',
    reason?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: 'Action non autorisée.' };
    const chal = challenges.find((c) => c.id === challengeId);
    if (!chal) return { success: false, error: 'Défi introuvable.' };

    // Anti-cheating rule check from pure rule engine: A participant cannot approve their own proof!
    const validationCheck = canValidateProof({
      reviewerUid: currentUser.uid,
      participantUid,
      isOwnerOrAdmin: chal.createdBy === currentUser.uid || currentUser.role === 'admin',
    });
    if (!validationCheck.allowed) {
      return { success: false, error: 'Vous ne pouvez pas arbitrer votre propre déclaration de défi.' };
    }

    try {
      const participantRef = doc(db, 'challenges', challengeId, 'participants', participantUid);
      const newStatus = decision === 'accept' ? 'completed_verified' : 'rejected';
      const xpAmount = decision === 'accept' ? chal.xpReward : 0;

      await updateDoc(participantRef, {
        status: newStatus,
        verifiedAt: new Date().toISOString(),
        verifiedBy: currentUser.uid,
        rejectionReason: decision === 'reject' ? reason || 'Preuve rejetée par le chef d’escouade.' : null,
        xpAwarded: xpAmount,
        updatedAt: new Date().toISOString(),
      });

      // If accepted, allocate XP in ledger and update target user's profile
      if (decision === 'accept' && xpAmount > 0) {
        // Record in XP Ledger
        const ledgerId = `xp-${Date.now()}`;
        await setDoc(doc(db, 'xpLedger', ledgerId), {
          id: ledgerId,
          userUid: participantUid,
          amount: xpAmount,
          reason: `Défi validé : ${chal.title}`,
          challengeId,
          groupId: chal.groupId,
          createdAt: new Date().toISOString(),
        });

        // Update target user's XP
        const targetUserRef = doc(db, 'users', participantUid);
        const targetSnap = await getDoc(targetUserRef);
        if (targetSnap.exists()) {
          const currentXp = targetSnap.data().xp || 0;
          const newXp = currentXp + xpAmount;
          await updateDoc(targetUserRef, {
            xp: newXp,
            updatedAt: new Date().toISOString(),
          });
        }
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const contestRejection = async (challengeId: string, contestReason: string): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: 'Vous devez être connecté.' };
    try {
      const participantRef = doc(db, 'challenges', challengeId, 'participants', currentUser.uid);
      await updateDoc(participantRef, {
        status: 'contested',
        contestedAt: new Date().toISOString(),
        contestReason: contestReason.trim(),
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Notification Operations
  const markNotificationAsRead = async (id: string): Promise<void> => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (err) {
      console.error('markNotificationAsRead error:', err);
    }
  };

  const markAllNotificationsAsRead = async (): Promise<void> => {
    try {
      const unread = notifications.filter((n) => n.status === 'unread');
      for (const n of unread) {
        await updateDoc(doc(db, 'notifications', n.id), {
          status: 'read',
          readAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('markAllNotificationsAsRead error:', err);
    }
  };

  const sendAdminBroadcast = async (
    titleFr: string,
    titleEn: string,
    bodyFr: string,
    bodyEn: string,
    targetPath?: string
  ): Promise<void> => {
    if (!currentUser || currentUser.role !== 'admin') return;
    try {
      // Create broadcast notification
      const notifId = `notif-${Date.now()}`;
      await setDoc(doc(db, 'notifications', notifId), {
        id: notifId,
        userUid: currentUser.uid, // recorded for sender
        type: 'admin_broadcast',
        title: { fr: titleFr, en: titleEn },
        body: { fr: bodyFr, en: bodyEn },
        link: targetPath || '/news',
        read: false,
        createdAt: new Date().toISOString(),
      });

      // Audit log entry
      const auditId = `audit-${Date.now()}`;
      await setDoc(doc(db, 'auditLogs', auditId), {
        id: auditId,
        adminUid: currentUser.uid,
        adminEmail: currentUser.email,
        action: 'SEND_BROADCAST',
        targetType: 'SYSTEM',
        targetId: notifId,
        details: titleFr,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('sendAdminBroadcast error:', err);
    }
  };

  // Moderation & Admin Operations
  const resolveReport = async (id: string, resolution: string, status: Report['status']): Promise<void> => {
    if (!currentUser || currentUser.role !== 'admin') return;
    try {
      await updateDoc(doc(db, 'reports', id), {
        status,
        resolution,
        resolvedAt: new Date().toISOString(),
        resolvedBy: currentUser.uid,
      });
    } catch (err) {
      console.error('resolveReport error:', err);
    }
  };

  const toggleUserSuspension = async (uid: string, reason: string): Promise<void> => {
    if (!currentUser || currentUser.role !== 'admin') return;
    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const currentStatus = snap.data().accountStatus;
        const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
        await updateDoc(userRef, {
          accountStatus: newStatus,
          updatedAt: new Date().toISOString(),
        });

        // Audit log
        const auditId = `audit-${Date.now()}`;
        await setDoc(doc(db, 'auditLogs', auditId), {
          id: auditId,
          adminUid: currentUser.uid,
          adminEmail: currentUser.email,
          action: newStatus === 'suspended' ? 'SUSPEND_USER' : 'UNSUSPEND_USER',
          targetType: 'USER',
          targetId: uid,
          details: reason,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('toggleUserSuspension error:', err);
    }
  };

  const changeUserRole = async (uid: string, role: UserProfile['role']): Promise<void> => {
    if (!currentUser || currentUser.role !== 'admin') return;
    try {
      await updateDoc(doc(db, 'users', uid), {
        role,
        isVerified: role === 'admin',
        updatedAt: new Date().toISOString(),
      });

      if (role === 'admin') {
        await setDoc(doc(db, 'admins', uid), {
          uid,
          role: 'admin',
          promotedAt: new Date().toISOString(),
        });
      } else {
        await deleteDoc(doc(db, 'admins', uid));
      }

      // Audit log
      const auditId = `audit-${Date.now()}`;
      await setDoc(doc(db, 'auditLogs', auditId), {
        id: auditId,
        adminUid: currentUser.uid,
        adminEmail: currentUser.email,
        action: 'CHANGE_ROLE',
        targetType: 'USER',
        targetId: uid,
        details: `Rôle mis à jour vers : ${role}`,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('changeUserRole error:', err);
    }
  };

  const unreadCount = notifications.filter((n) => n.status === 'unread').length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        firebaseUser,
        authLoading,
        firebaseError,
        clearFirebaseError,
        language,
        setLanguage,
        t,
        login,
        loginWithGoogle,
        signup,
        logout,
        resetPassword,
        completeOnboarding,
        updateProfile,
        deleteAccount,
        // News
        news,
        categories: officialCategories,
        savedNewsIds,
        toggleSaveNews,
        createNews,
        updateNews,
        deleteNews,
        archiveNews,
        // Groups
        groups,
        groupMembers,
        groupInvites,
        createGroup,
        joinGroupWithCode,
        revokeInvite,
        regenerateInvite,
        leaveGroup,
        // Challenges
        challenges,
        participants,
        createChallenge,
        submitChallengeClaim,
        reviewProof,
        contestRejection,
        // Notifications
        notifications,
        unreadCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        sendAdminBroadcast,
        // Ledger & Admin
        users,
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
