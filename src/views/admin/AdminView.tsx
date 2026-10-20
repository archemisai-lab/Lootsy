import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GameUpdate,
  NewsStatus,
  UserProfile,
  UserBadge,
  UserRole,
  Group,
  GroupMember,
  Challenge,
} from '../../types';
import { UserBadgeTag } from '../../components/UserBadgeTag';
import { VerifiedBadge } from '../../components/VerifiedBadge';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Shield,
  FileText,
  Send,
  Users,
  Flag,
  History,
  Plus,
  Trash2,
  Archive,
  CheckCircle2,
  AlertCircle,
  Eye,
  Settings,
  Layers,
  Swords,
  Coins,
  Search,
  UserPlus,
  UserMinus,
  Check,
  X,
  AlertTriangle,
  Lock,
  Unlock,
  Ban,
  Clock,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Filter,
} from 'lucide-react';

interface AdminViewProps {
  navigate: (route: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ navigate }) => {
  const {
    currentUser,
    news,
    createNews,
    updateNews,
    deleteNews,
    categories,
    users,
    groups,
    groupMembers,
    challenges,
    participants,
    ledger,
    auditLogs,
    reports,
    resolveReport,
    sendAdminBroadcast,
    systemSettings,
    adminCreateGroup,
    adminUpdateGroup,
    adminArchiveGroup,
    adminDeleteGroup,
    adminTransferGroupOwnership,
    adminAddUserToGroup,
    adminRemoveUserFromGroup,
    adminSetGroupMemberRole,
    adminCreateChallenge,
    adminUpdateChallenge,
    adminCancelChallenge,
    adminArchiveChallenge,
    adminDeleteChallenge,
    adminForceExpireChallenge,
    adminReviewProof,
    adminAssignRole,
    adminAssignBadge,
    adminRevokeBadge,
    adminSuspendUser,
    adminBanUser,
    adminReactivateUser,
    adminTriggerUserDeletion,
    adminRevokePushTokens,
    adminCorrectXp,
    adminUpdateSystemSettings,
    language,
    t,
  } = useApp();

  type TabType =
    | 'overview'
    | 'groups'
    | 'challenges'
    | 'users'
    | 'news'
    | 'broadcast'
    | 'reports'
    | 'xp'
    | 'config'
    | 'audit';

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const isFr = language === 'fr';

  // Feedback banner state
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Security guard: Only authorized admin
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Shield className="w-12 h-12 text-[#FF6538] mx-auto" />
        <h2 className="text-xl font-extrabold text-[#F6F0E7]">
          {isFr ? 'Accès Administrateur Restreint' : 'Admin Access Restricted'}
        </h2>
        <p className="text-xs text-[#B5AA9C]">
          {isFr
            ? 'Cette console est strictement réservée au compte administrateur officiel de Lootsy.'
            : 'This console is strictly reserved for the official Lootsy administration account.'}
        </p>
        <button
          onClick={() => navigate('/app')}
          className="px-4 py-2 rounded-lg bg-[#FF6538] text-white text-xs font-bold hover:bg-[#ff7a53] transition-colors"
        >
          {isFr ? 'Retourner à l’application' : 'Return to app'}
        </button>
      </div>
    );
  }

  // --- SUB-STATES ---
  // 1. News state
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsTitleFr, setNewsTitleFr] = useState('');
  const [newsTitleEn, setNewsTitleEn] = useState('');
  const [newsSummaryFr, setNewsSummaryFr] = useState('');
  const [newsSummaryEn, setNewsSummaryEn] = useState('');
  const [newsBodyFr, setNewsBodyFr] = useState('');
  const [newsBodyEn, setNewsBodyEn] = useState('');
  const [newsCategory, setNewsCategory] = useState(categories[0]?.id || 'seasons');
  const [newsSourceUrl, setNewsSourceUrl] = useState('https://www.fortnite.com/news');
  const [newsSourceName, setNewsSourceName] = useState('Epic Games Official');
  const [newsStatus, setNewsStatus] = useState<NewsStatus>('published');

  // 2. Broadcast state
  const [broadcastTitleFr, setBroadcastTitleFr] = useState('');
  const [broadcastTitleEn, setBroadcastTitleEn] = useState('');
  const [broadcastBodyFr, setBroadcastBodyFr] = useState('');
  const [broadcastBodyEn, setBroadcastBodyEn] = useState('');
  const [broadcastTargetPath, setBroadcastTargetPath] = useState('/app');
  const [showBroadcastConfirm, setShowBroadcastConfirm] = useState(false);

  // System settings form state
  const [localSettings, setLocalSettings] = useState(systemSettings);
  useEffect(() => {
    setLocalSettings(systemSettings);
  }, [systemSettings]);

  // 3. User search & modal
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [suspensionDays, setSuspensionDays] = useState(7);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [badgeMotif, setBadgeMotif] = useState('');

  // 4. Groups state
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const [deleteGroupReason, setDeleteGroupReason] = useState('');
  const [transferOwnerUid, setTransferOwnerUid] = useState('');

  // 5. Challenges state
  const [challengeSearchQuery, setChallengeSearchQuery] = useState('');
  const [showCreateChallengeModal, setShowCreateChallengeModal] = useState(false);
  const [targetChallengeGroup, setTargetChallengeGroup] = useState(groups[0]?.id || '');
  const [newChallengeTitle, setNewChallengeTitle] = useState('');
  const [newChallengeDesc, setNewChallengeDesc] = useState('');
  const [newChallengeXp, setNewChallengeXp] = useState(50);
  const [newChallengeProofPolicy, setNewChallengeProofPolicy] = useState<Challenge['proofPolicy']>('optional');
  const [newChallengeDueDays, setNewChallengeDueDays] = useState(7);
  const [cancelReasonModal, setCancelReasonModal] = useState<{ challengeId: string } | null>(null);
  const [cancelReasonText, setCancelReasonText] = useState('');

  // 6. XP Correction state
  const [xpTargetUid, setXpTargetUid] = useState('');
  const [xpCorrectionAmount, setXpCorrectionAmount] = useState(50);
  const [xpCorrectionReason, setXpCorrectionReason] = useState('');

  // 7. Audit Log filter
  const [auditFilterAction, setAuditFilterAction] = useState('ALL');

  // --- COMPUTED VALUES ---
  const filteredUsers = useMemo(() => {
    const q = userSearchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.displayName?.toLowerCase().includes(q) ||
        u.uid.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.epicGamesId?.toLowerCase().includes(q)
    );
  }, [users, userSearchQuery]);

  const filteredGroups = useMemo(() => {
    const q = groupSearchQuery.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter((g) => g.name.toLowerCase().includes(q) || g.id.toLowerCase().includes(q));
  }, [groups, groupSearchQuery]);

  const filteredChallenges = useMemo(() => {
    const q = challengeSearchQuery.trim().toLowerCase();
    if (!q) return challenges;
    return challenges.filter((c) => c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
  }, [challenges, challengeSearchQuery]);

  const filteredAuditLogs = useMemo(() => {
    if (auditFilterAction === 'ALL') return auditLogs;
    return auditLogs.filter((log) => log.action === auditFilterAction);
  }, [auditLogs, auditFilterAction]);

  // Selected Group Members
  const currentGroupMembersList = useMemo(() => {
    if (!selectedGroup) return [];
    return groupMembers.filter((m) => (selectedGroup.memberUids || []).includes(m.uid));
  }, [selectedGroup, groupMembers]);

  // --- ACTIONS HANDLERS ---
  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitleFr.trim() || !newsBodyFr.trim() || !newsSourceUrl.trim()) {
      showFeedback('error', 'Le titre, le corps et l’URL source officielle sont obligatoires.');
      return;
    }

    const slug = newsTitleFr
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    createNews({
      gameId: 'fortnite',
      slug,
      categoryId: newsCategory,
      title: { fr: newsTitleFr, en: newsTitleEn || newsTitleFr },
      summary: { fr: newsSummaryFr, en: newsSummaryEn || newsSummaryFr },
      body: { fr: newsBodyFr, en: newsBodyEn || newsBodyFr },
      sourceUrl: newsSourceUrl,
      sourceName: newsSourceName || 'Epic Games',
      status: newsStatus,
      publishedAt: new Date().toISOString(),
      languageAvailability: ['fr', 'en'],
      imagePath: '/src/assets/images/fn_underworld_fortress_1792263045549.jpg',
    });

    setShowNewsModal(false);
    setNewsTitleFr('');
    setNewsTitleEn('');
    setNewsSummaryFr('');
    setNewsSummaryEn('');
    setNewsBodyFr('');
    setNewsBodyEn('');
    showFeedback('success', 'Actualité créée et journalisée.');
  };

  const handleBroadcastSubmit = () => {
    if (!broadcastTitleFr.trim() || !broadcastBodyFr.trim()) return;
    sendAdminBroadcast(
      broadcastTitleFr,
      broadcastTitleEn || broadcastTitleFr,
      broadcastBodyFr,
      broadcastBodyEn || broadcastBodyFr,
      broadcastTargetPath || '/app'
    );
    setShowBroadcastConfirm(false);
    setBroadcastTitleFr('');
    setBroadcastTitleEn('');
    setBroadcastBodyFr('');
    setBroadcastBodyEn('');
    showFeedback('success', 'Annonce globale diffusée avec succès auprès de tous les utilisateurs.');
  };

  const handleCreateGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const res = await adminCreateGroup(newGroupName, newGroupDesc);
    if (res.success) {
      setShowCreateGroupModal(false);
      setNewGroupName('');
      setNewGroupDesc('');
      showFeedback('success', `Groupe « ${newGroupName} » créé avec succès.`);
    } else {
      showFeedback('error', res.error || 'Erreur lors de la création du groupe');
    }
  };

  const handleDeleteGroupSubmit = async () => {
    if (!selectedGroup) return;
    if (!deleteGroupReason.trim()) {
      showFeedback('error', 'Un motif est obligatoire pour supprimer un groupe.');
      return;
    }
    const res = await adminDeleteGroup(selectedGroup.id, deleteGroupReason);
    if (res.success) {
      setShowDeleteGroupModal(false);
      setSelectedGroup(null);
      setDeleteGroupReason('');
      showFeedback('success', 'Groupe supprimé et consigné dans le journal d’audit.');
    } else {
      showFeedback('error', res.error || 'Erreur');
    }
  };

  const handleCreateChallengeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChallengeTitle.trim() || !targetChallengeGroup) return;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + newChallengeDueDays);
    const res = await adminCreateChallenge({
      groupId: targetChallengeGroup,
      title: newChallengeTitle,
      description: newChallengeDesc,
      proofPolicy: newChallengeProofPolicy,
      validationPolicy: 'creator_or_admin',
      xpReward: newChallengeXp,
      dueAt: dueDate.toISOString(),
    });
    if (res.success) {
      setShowCreateChallengeModal(false);
      setNewChallengeTitle('');
      setNewChallengeDesc('');
      showFeedback('success', 'Défi officiel créé dans le groupe.');
    } else {
      showFeedback('error', res.error || 'Erreur');
    }
  };

  const handleCancelChallengeSubmit = async () => {
    if (!cancelReasonModal) return;
    if (!cancelReasonText.trim()) {
      showFeedback('error', 'Un motif est requis pour annuler un défi.');
      return;
    }
    const res = await adminCancelChallenge(cancelReasonModal.challengeId, cancelReasonText);
    if (res.success) {
      setCancelReasonModal(null);
      setCancelReasonText('');
      showFeedback('success', 'Défi annulé avec motif consigné.');
    } else {
      showFeedback('error', res.error || 'Erreur');
    }
  };

  const handleSuspendSubmit = async () => {
    if (!selectedUser) return;
    if (!suspensionReason.trim()) {
      showFeedback('error', 'Le motif de suspension est requis.');
      return;
    }
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + suspensionDays);
    const res = await adminSuspendUser(selectedUser.uid, endDate.toISOString(), suspensionReason);
    if (res.success) {
      setShowSuspendModal(false);
      setSuspensionReason('');
      showFeedback('success', `Joueur ${selectedUser.displayName} suspendu jusqu’au ${endDate.toLocaleDateString()}.`);
    } else {
      showFeedback('error', res.error || 'Erreur');
    }
  };

  const handleBanSubmit = async () => {
    if (!selectedUser) return;
    if (!banReason.trim()) {
      showFeedback('error', 'Le motif écrit de bannissement est obligatoire.');
      return;
    }
    const res = await adminBanUser(selectedUser.uid, banReason);
    if (res.success) {
      setShowBanModal(false);
      setBanReason('');
      showFeedback('success', `Joueur ${selectedUser.displayName} banni définitivement. Recours consigné.`);
    } else {
      showFeedback('error', res.error || 'Erreur');
    }
  };

  const handleXpCorrectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!xpTargetUid || !xpCorrectionReason.trim() || xpCorrectionAmount === 0) {
      showFeedback('error', 'Veuillez sélectionner un joueur, renseigner le motif et un montant non nul.');
      return;
    }
    const res = await adminCorrectXp(xpTargetUid, xpCorrectionAmount, xpCorrectionReason);
    if (res.success) {
      setXpTargetUid('');
      setXpCorrectionReason('');
      showFeedback('success', `Correction XP appliquée et consignée dans le registre xpLedger.`);
    } else {
      showFeedback('error', res.error || 'Erreur');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs font-semibold flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-[#1e2417] text-[#D8E5B0] border-[#D8E5B0]/40'
              : 'bg-rose-950/60 text-rose-300 border-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-current hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header with Admin Identity & Brand Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#302923] pb-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <Shield className="w-6 h-6 text-[#FF6538]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F6F0E7] tracking-tight">
              Console d’Administration Lootsy
            </h1>
            <UserBadgeTag badge="creator" size="sm" showLabel={true} />
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#302923] text-[#F6F0E7]">
              Root Admin
            </span>
          </div>
          <p className="text-xs text-[#B5AA9C]">
            Connecté en tant que <span className="text-[#F6F0E7] font-semibold">{currentUser.displayName}</span> ({currentUser.email}).
            Gestion officielle complète avec garde-fous stricts et audit immutable.
          </p>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setShowNewsModal(true)}
            className="px-3.5 py-2 rounded-lg bg-[#25201c] hover:bg-[#302923] border border-[#302923] text-xs font-bold text-[#F6F0E7] inline-flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#FF6538]" />
            <span>Actualité</span>
          </button>
          <button
            onClick={() => setShowCreateGroupModal(true)}
            className="px-3.5 py-2 rounded-lg bg-[#25201c] hover:bg-[#302923] border border-[#302923] text-xs font-bold text-[#F6F0E7] inline-flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-[#FF6538]" />
            <span>Nouveau Groupe</span>
          </button>
          <button
            onClick={() => setShowCreateChallengeModal(true)}
            className="px-3.5 py-2 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Nouveau Défi</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (10 Sections) */}
      <div className="flex items-center gap-1.5 border-b border-[#302923] pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Vue d’ensemble', icon: Shield },
          { id: 'groups', label: `Groupes (${groups.length})`, icon: Layers },
          { id: 'challenges', label: `Défis (${challenges.length})`, icon: Swords },
          { id: 'users', label: `Utilisateurs (${users.length})`, icon: Users },
          { id: 'news', label: `Actualités (${news.length})`, icon: FileText },
          { id: 'broadcast', label: 'Notifications', icon: Send },
          { id: 'reports', label: `Signalements (${reports.length})`, icon: Flag },
          { id: 'xp', label: `Registre XP (${ledger.length})`, icon: Coins },
          { id: 'config', label: 'Configuration', icon: Settings },
          { id: 'audit', label: `Audit (${auditLogs.length})`, icon: History },
        ].map((item) => {
          const Icon = item.icon;
          const isCurrent = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap inline-flex items-center gap-1.5 ${
                isCurrent
                  ? 'bg-[#FF6538] text-white shadow-sm'
                  : 'bg-transparent text-[#B5AA9C] hover:text-[#F6F0E7] hover:bg-[#25201c]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------- TAB 1: OVERVIEW ---------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-1">
              <span className="text-[11px] text-[#B5AA9C] font-semibold block">Joueurs inscrits</span>
              <span className="text-2xl font-display text-[#F6F0E7] tabular-nums block">{users.length}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-1">
              <span className="text-[11px] text-[#B5AA9C] font-semibold block">Groupes actifs</span>
              <span className="text-2xl font-display text-[#D8E5B0] tabular-nums block">
                {groups.filter((g) => g.status === 'active').length}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-1">
              <span className="text-[11px] text-[#B5AA9C] font-semibold block">Défis en cours</span>
              <span className="text-2xl font-display text-[#FF6538] tabular-nums block">
                {challenges.filter((c) => c.status === 'active').length}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-1">
              <span className="text-[11px] text-[#B5AA9C] font-semibold block">Actualités radar</span>
              <span className="text-2xl font-display text-[#F6F0E7] tabular-nums block">{news.length}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-1">
              <span className="text-[11px] text-[#B5AA9C] font-semibold block">Signalements ouverts</span>
              <span className="text-2xl font-display text-amber-400 tabular-nums block">
                {reports.filter((r) => r.status === 'new' || r.status === 'in_progress').length}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-1">
              <span className="text-[11px] text-[#B5AA9C] font-semibold block">Entrées d’Audit</span>
              <span className="text-2xl font-display text-purple-400 tabular-nums block">{auditLogs.length}</span>
            </div>
          </div>

          {/* Maintenance Mode Alert Banner if Active */}
          {systemSettings.maintenanceMode && (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/50 text-amber-200 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold block">Mode Maintenance Actif</span>
                  <p className="text-[11px] text-amber-300/90">{systemSettings.maintenanceMessage.fr}</p>
                </div>
              </div>
              <button
                onClick={() => adminUpdateSystemSettings({ maintenanceMode: false }, 'Désactivation de maintenance')}
                className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shrink-0"
              >
                Désactiver
              </button>
            </div>
          )}

          {/* Quick Rules & Architecture Guardrails Card */}
          <div className="p-6 rounded-2xl bg-[#1e1a17] border border-[#302923] space-y-4">
            <h3 className="text-sm font-extrabold text-[#F6F0E7] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#FF6538]" />
              <span>Garde-fous stricts d’administration</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#B5AA9C]">
              <div className="p-3.5 rounded-lg bg-[#171513] border border-[#302923] space-y-1">
                <span className="font-bold text-[#F6F0E7] block">Protection de la marque Lootsy</span>
                <p className="leading-relaxed">
                  Le terme « Lootsy » est protégé au niveau applicatif et Firestore. Aucun utilisateur hormis l’administrateur officiel (<code className="text-[#FF6538]">archemis.ai@gmail.com</code>) ne peut l’enregistrer comme pseudonyme.
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-[#171513] border border-[#302923] space-y-1">
                <span className="font-bold text-[#F6F0E7] block">Intégrité des Preuves et XP</span>
                <p className="leading-relaxed">
                  L’administrateur ne peut jamais valider sa propre preuve s'il participe à un défi. Toute modification d’XP passe exclusivement par une écriture auditée dans <code className="text-[#D8E5B0]">xpLedger</code>.
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-[#171513] border border-[#302923] space-y-1">
                <span className="font-bold text-[#F6F0E7] block">Rôles et Sécurité RBAC</span>
                <p className="leading-relaxed">
                  La création d’un autre compte admin est bloquée (nécessite une procédure serveur). L’admin peut uniquement attribuer les rôles limités : <code className="text-purple-300">moderator</code>, <code className="text-purple-300">editor</code>, <code className="text-purple-300">group_manager</code>.
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-[#171513] border border-[#302923] space-y-1">
                <span className="font-bold text-[#F6F0E7] block">Immutabilité des Journaux</span>
                <p className="leading-relaxed">
                  Les journaux d’audit sont strictement inaltérables dans les règles de sécurité Firestore. Aucune suppression ni modification d’audit n’est possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TAB 2: GROUPS ---------------- */}
      {activeTab === 'groups' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#B5AA9C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={groupSearchQuery}
                onChange={(e) => setGroupSearchQuery(e.target.value)}
                placeholder="Rechercher par nom de groupe ou ID…"
                className="w-full bg-[#1e1a17] border border-[#302923] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none"
              />
            </div>

            <button
              onClick={() => setShowCreateGroupModal(true)}
              className="px-4 py-2 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Créer un groupe</span>
            </button>
          </div>

          <div className="border border-[#302923] rounded-xl bg-[#1e1a17] overflow-hidden divide-y divide-[#302923]">
            {filteredGroups.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#B5AA9C]">Aucun groupe trouvé.</div>
            ) : (
              filteredGroups.map((g) => (
                <div key={g.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#F6F0E7]">{g.name}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          g.status === 'archived'
                            ? 'bg-amber-950/60 text-amber-300'
                            : g.status === 'deleted'
                            ? 'bg-rose-950/60 text-rose-300'
                            : 'bg-emerald-950/60 text-emerald-300'
                        }`}
                      >
                        {g.status}
                      </span>
                    </div>
                    {g.description && <p className="text-xs text-[#B5AA9C]">{g.description}</p>}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#B5AA9C]">
                      <span>ID : <code className="text-[#F6F0E7]">{g.id}</code></span>
                      <span>·</span>
                      <span>Membres : {g.memberCount || g.memberUids?.length || 0}</span>
                      <span>·</span>
                      <span>Créé le : {new Date(g.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setSelectedGroup(g)}
                      className="px-3 py-1.5 rounded-lg bg-[#25201c] hover:bg-[#302923] border border-[#302923] text-xs font-semibold text-[#F6F0E7] inline-flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5 text-[#FF6538]" />
                      <span>Gérer membres</span>
                    </button>

                    <button
                      onClick={() => adminArchiveGroup(g.id, 'Changement d’état administratif')}
                      className="px-3 py-1.5 rounded-lg bg-[#25201c] hover:bg-[#302923] border border-[#302923] text-xs font-semibold text-[#B5AA9C] hover:text-[#F6F0E7] inline-flex items-center gap-1"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>{g.status === 'archived' ? 'Désarchiver' : 'Archiver'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedGroup(g);
                        setShowDeleteGroupModal(true);
                      }}
                      className="p-1.5 rounded-lg bg-[#25201c] hover:bg-rose-950/40 text-[#B5AA9C] hover:text-rose-400 border border-[#302923]"
                      title="Supprimer définitivement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ---------------- TAB 3: CHALLENGES & PROOFS ---------------- */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#B5AA9C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={challengeSearchQuery}
                onChange={(e) => setChallengeSearchQuery(e.target.value)}
                placeholder="Rechercher par titre de défi…"
                className="w-full bg-[#1e1a17] border border-[#302923] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none"
              />
            </div>

            <button
              onClick={() => setShowCreateChallengeModal(true)}
              className="px-4 py-2 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Créer un défi dans un groupe</span>
            </button>
          </div>

          <div className="border border-[#302923] rounded-xl bg-[#1e1a17] overflow-hidden divide-y divide-[#302923]">
            {filteredChallenges.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#B5AA9C]">Aucun défi trouvé.</div>
            ) : (
              filteredChallenges.map((c) => {
                const groupName = groups.find((g) => g.id === c.groupId)?.name || c.groupId;
                const challengeParts = participants.filter((p) => p.challengeId === c.id);

                return (
                  <div key={c.id} className="p-5 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-[#FF6538]">{groupName}</span>
                          <span>·</span>
                          <span className="font-semibold text-[#D8E5B0]">+{c.xpReward} XP</span>
                          <span>·</span>
                          <span
                            className={`font-semibold text-[10px] uppercase px-1.5 py-0.5 rounded ${
                              c.status === 'active'
                                ? 'bg-emerald-950/60 text-emerald-300'
                                : c.status === 'cancelled'
                                ? 'bg-rose-950/60 text-rose-300'
                                : 'bg-[#302923] text-[#B5AA9C]'
                            }`}
                          >
                            {c.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#F6F0E7]">{c.title}</h4>
                        <p className="text-xs text-[#B5AA9C] leading-relaxed">{c.description}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {c.status === 'active' && (
                          <>
                            <button
                              onClick={() => {
                                setCancelReasonModal({ challengeId: c.id });
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-[#25201c] hover:bg-rose-950/40 text-rose-300 border border-[#302923] text-xs font-semibold"
                            >
                              Annuler
                            </button>
                            <button
                              onClick={() => adminForceExpireChallenge(c.id, 'Expiration forcée administrative')}
                              className="px-2.5 py-1.5 rounded-lg bg-[#25201c] hover:bg-[#302923] text-[#B5AA9C] hover:text-[#F6F0E7] border border-[#302923] text-xs font-semibold"
                            >
                              Forcer expiration
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => adminArchiveChallenge(c.id, 'Archivage administratif')}
                          className="px-2.5 py-1.5 rounded-lg bg-[#25201c] hover:bg-[#302923] text-[#B5AA9C] hover:text-[#F6F0E7] border border-[#302923] text-xs font-semibold"
                        >
                          Archiver
                        </button>
                        <button
                          onClick={() => adminDeleteChallenge(c.id, 'Suppression définitive')}
                          className="p-1.5 rounded-lg bg-[#25201c] hover:bg-rose-950/40 text-rose-300 border border-[#302923]"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Participants & Proof Review Section */}
                    {challengeParts.length > 0 && (
                      <div className="pt-2 border-t border-[#302923]/60 space-y-2">
                        <span className="text-[11px] font-bold text-[#F6F0E7] block">
                          Participations & Preuves soumises ({challengeParts.length}) :
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {challengeParts.map((p) => {
                            const partUser = users.find((u) => u.uid === p.uid);
                            const isSelf = currentUser.uid === p.uid;

                            return (
                              <div
                                key={p.id || p.uid}
                                className="p-3 rounded-lg bg-[#171513] border border-[#302923] flex items-center justify-between gap-3"
                              >
                                <div>
                                  <span className="font-bold text-[#F6F0E7] block">
                                    {partUser?.displayName || p.uid}
                                  </span>
                                  <span className="text-[11px] text-[#B5AA9C]">
                                    Statut : <span className="text-[#FF6538] font-semibold">{p.status}</span>
                                    {p.notes && ` · « ${p.notes} »`}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  {p.status === 'submitted' && (
                                    <>
                                      {isSelf ? (
                                        <span className="text-[10px] text-amber-400 font-semibold" title="Garde-fou : validation de sa propre preuve interdite">
                                          Auto-validation interdite
                                        </span>
                                      ) : (
                                        <>
                                          <button
                                            onClick={() => adminReviewProof(c.id, p.uid, 'accept')}
                                            className="px-2 py-1 rounded bg-[#1e2417] text-[#D8E5B0] font-bold text-[11px] border border-[#D8E5B0]/30 hover:bg-[#28321e]"
                                          >
                                            Valider
                                          </button>
                                          <button
                                            onClick={() =>
                                              adminReviewProof(c.id, p.uid, 'reject', 'Preuve incomplète')
                                            }
                                            className="px-2 py-1 rounded bg-[#25201c] text-rose-300 font-bold text-[11px] border border-[#302923] hover:bg-rose-950/30"
                                          >
                                            Refuser
                                          </button>
                                        </>
                                      )}
                                    </>
                                  )}
                                  {(p.proofUrl || p.proof?.mediaUrl) && (
                                    <a
                                      href={p.proofUrl || p.proof?.mediaUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1 text-[#B5AA9C] hover:text-[#F6F0E7]"
                                      title="Consulter la preuve"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ---------------- TAB 4: USERS & BADGES ---------------- */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-[#B5AA9C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              placeholder="Rechercher par pseudo, UID ou email..."
              className="w-full bg-[#1e1a17] border border-[#302923] rounded-lg pl-9 pr-3 py-2 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none"
            />
          </div>

          <div className="border border-[#302923] rounded-xl bg-[#1e1a17] overflow-hidden divide-y divide-[#302923]">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#B5AA9C]">Aucun joueur trouvé.</div>
            ) : (
              filteredUsers.map((u) => (
                <div key={u.uid} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-[#F6F0E7] text-sm flex items-center gap-1.5">
                        <span>{u.displayName}</span>
                        {u.isVerified && (
                          <VerifiedBadge size="xs" variant="blue" title="Compte certifié" />
                        )}
                      </span>
                      {u.badges?.map((b) => (
                        <UserBadgeTag key={b} badge={b} size="sm" />
                      ))}
                      <StatusBadge status={u.role} language={language} />
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          u.accountStatus === 'suspended'
                            ? 'bg-amber-950/60 text-amber-300'
                            : u.accountStatus === 'banned'
                            ? 'bg-rose-950/60 text-rose-300'
                            : u.accountStatus === 'pendingDeletion'
                            ? 'bg-purple-950/60 text-purple-300'
                            : 'bg-emerald-950/60 text-emerald-300'
                        }`}
                      >
                        {u.accountStatus}
                      </span>
                    </div>

                    <div className="text-[#B5AA9C] space-x-2 text-[11px]">
                      <span>UID : <code className="text-[#F6F0E7]">{u.uid.slice(0, 8)}...</code></span>
                      <span>·</span>
                      <span>{u.xp} XP</span>
                      {u.epicGamesId && (
                        <>
                          <span>·</span>
                          <span>Fortnite : {u.epicGamesId}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="px-3 py-1.5 rounded-lg bg-[#25201c] hover:bg-[#302923] border border-[#302923] text-xs font-semibold text-[#F6F0E7] inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#FF6538]" />
                      <span>Fiche Joueur</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ---------------- TAB 5: RADAR & NEWS ---------------- */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#B5AA9C]">
              Toutes les actualités doivent obligatoirement comporter une source officielle (Epic Games).
            </span>
            <button
              onClick={() => setShowNewsModal(true)}
              className="px-4 py-2 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Rédiger une actualité</span>
            </button>
          </div>

          <div className="divide-y divide-[#302923] border border-[#302923] rounded-xl bg-[#1e1a17] overflow-hidden">
            {news.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-[#FF6538] uppercase text-[10px]">
                      {item.categoryId}
                    </span>
                    <span>·</span>
                    <span className="text-[#B5AA9C]">{new Date(item.publishedAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span className="font-semibold text-[#F6F0E7]">{item.status}</span>
                    <span>·</span>
                    <span className="text-[#B5AA9C]">Source : {item.sourceName}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#F6F0E7]">{item.title.fr}</h4>
                  <p className="text-xs text-[#B5AA9C] line-clamp-1">{item.summary.fr}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'published' ? (
                    <button
                      onClick={() => updateNews(item.id, { status: 'archived' })}
                      className="px-2.5 py-1.5 rounded-lg bg-[#25201c] hover:bg-[#302923] text-xs text-[#B5AA9C] hover:text-[#F6F0E7]"
                    >
                      Archiver
                    </button>
                  ) : (
                    <button
                      onClick={() => updateNews(item.id, { status: 'published' })}
                      className="px-2.5 py-1.5 rounded-lg bg-[#25201c] hover:bg-[#302923] text-xs text-[#D8E5B0]"
                    >
                      Publier
                    </button>
                  )}

                  <button
                    onClick={() => deleteNews(item.id)}
                    className="p-1.5 rounded-lg bg-[#25201c] hover:bg-rose-950/40 text-[#B5AA9C] hover:text-rose-400"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- TAB 6: BROADCAST ---------------- */}
      {activeTab === 'broadcast' && (
        <div className="max-w-2xl p-6 sm:p-8 rounded-2xl bg-[#1e1a17] border border-[#302923] space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-[#F6F0E7]">Notification & Annonce Globale</h3>
            <p className="text-xs text-[#B5AA9C]">
              Diffusez une annonce instantanée aux joueurs avec confirmation explicite préalable.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block font-semibold text-[#F6F0E7]">
                Titre de l’annonce (FR) <span className="text-[#FF6538]">*</span>
              </label>
              <input
                type="text"
                value={broadcastTitleFr}
                onChange={(e) => setBroadcastTitleFr(e.target.value)}
                placeholder="Ex : Nouvelle mise à jour du radar disponible"
                className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-[#F6F0E7]">Titre de l’annonce (EN)</label>
              <input
                type="text"
                value={broadcastTitleEn}
                onChange={(e) => setBroadcastTitleEn(e.target.value)}
                placeholder="e.g., New radar update available"
                className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-[#F6F0E7]">
                Corps du message (FR) <span className="text-[#FF6538]">*</span>
              </label>
              <textarea
                rows={3}
                value={broadcastBodyFr}
                onChange={(e) => setBroadcastBodyFr(e.target.value)}
                placeholder="Détaillez le message envoyé à tous les joueurs…"
                className="w-full bg-[#171513] border border-[#302923] rounded-lg p-3 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-[#F6F0E7]">Corps du message (EN)</label>
              <textarea
                rows={3}
                value={broadcastBodyEn}
                onChange={(e) => setBroadcastBodyEn(e.target.value)}
                placeholder="English translation…"
                className="w-full bg-[#171513] border border-[#302923] rounded-lg p-3 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-semibold text-[#F6F0E7]">Lien de redirection dans l’app</label>
              <input
                type="text"
                value={broadcastTargetPath}
                onChange={(e) => setBroadcastTargetPath(e.target.value)}
                placeholder="/app ou /news"
                className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none font-mono"
              />
            </div>

            <div className="p-3.5 rounded-lg bg-[#171513] border border-[#302923] flex items-center justify-between">
              <span className="text-[#B5AA9C]">Destinataires estimés :</span>
              <span className="font-bold text-[#D8E5B0] tabular-nums">{users.length} comptes actifs</span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!broadcastTitleFr.trim() || !broadcastBodyFr.trim()) {
                  showFeedback('error', 'Veuillez saisir un titre et un corps de message en français.');
                  return;
                }
                setShowBroadcastConfirm(true);
              }}
              className="w-full py-2.5 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Prévisualiser et diffuser l’annonce</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------------- TAB 7: REPORTS ---------------- */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="border border-[#302923] rounded-xl bg-[#1e1a17] overflow-hidden divide-y divide-[#302923]">
            {reports.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#B5AA9C]">Aucun signalement en attente.</div>
            ) : (
              reports.map((rep) => (
                <div key={rep.id} className="p-4 sm:p-5 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#F6F0E7] text-sm">
                      Signalement · Cible : {rep.targetType} (ID : {rep.targetId})
                    </span>
                    <span
                      className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded ${
                        rep.status === 'resolved'
                          ? 'bg-[#1e2417] text-[#D8E5B0]'
                          : rep.status === 'rejected'
                          ? 'bg-[#25201c] text-[#B5AA9C]'
                          : 'bg-amber-950/60 text-amber-300'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </div>

                  <p className="text-[#F6F0E7] bg-[#171513] p-3 rounded-lg border border-[#302923]">
                    <strong className="text-[#FF6538]">Motif :</strong> {rep.reason}
                    {rep.description && <span className="block text-[#B5AA9C] mt-1">{rep.description}</span>}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      onClick={() => resolveReport(rep.id, 'Traité par sanction administrative', 'resolved')}
                      className="px-3 py-1.5 rounded-lg bg-[#1e2417] text-[#D8E5B0] font-bold text-xs border border-[#D8E5B0]/30 hover:bg-[#28321e]"
                    >
                      Marquer Résolu
                    </button>
                    <button
                      onClick={() => resolveReport(rep.id, 'Non fondé après examen', 'rejected')}
                      className="px-3 py-1.5 rounded-lg bg-[#25201c] text-[#B5AA9C] hover:text-[#F6F0E7] font-semibold text-xs border border-[#302923]"
                    >
                      Rejeter
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ---------------- TAB 8: XP REGISTRY & CORRECTIONS ---------------- */}
      {activeTab === 'xp' && (
        <div className="space-y-6">
          {/* XP Correction Form */}
          <div className="max-w-xl p-6 rounded-2xl bg-[#1e1a17] border border-[#302923] space-y-4">
            <h3 className="text-sm font-extrabold text-[#F6F0E7] flex items-center gap-2">
              <Coins className="w-4 h-4 text-[#D8E5B0]" />
              <span>Correction d’XP auditée</span>
            </h3>
            <p className="text-xs text-[#B5AA9C]">
              Toute modification d’XP crée une écriture irréversible dans le registre comptable <code className="text-[#D8E5B0]">xpLedger</code> avec motif obligatoire.
            </p>

            <form onSubmit={handleXpCorrectionSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="block font-semibold text-[#F6F0E7]">Sélectionner un joueur</label>
                <select
                  value={xpTargetUid}
                  onChange={(e) => setXpTargetUid(e.target.value)}
                  required
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
                >
                  <option value="">-- Choisir un joueur --</option>
                  {users.map((u) => (
                    <option key={u.uid} value={u.uid}>
                      {u.displayName} ({u.xp} XP) - {u.uid.slice(0, 8)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block font-semibold text-[#F6F0E7]">Ajustement (+ ou - XP)</label>
                  <input
                    type="number"
                    value={xpCorrectionAmount}
                    onChange={(e) => setXpCorrectionAmount(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] font-mono tabular-nums focus:border-[#FF6538] focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-semibold text-[#F6F0E7]">Type d’ajustement</label>
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setXpCorrectionAmount(Math.abs(xpCorrectionAmount))}
                      className={`px-2.5 py-1 rounded font-bold ${xpCorrectionAmount >= 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-600' : 'bg-[#25201c] text-[#B5AA9C]'}`}
                    >
                      Crédit (+)
                    </button>
                    <button
                      type="button"
                      onClick={() => setXpCorrectionAmount(-Math.abs(xpCorrectionAmount))}
                      className={`px-2.5 py-1 rounded font-bold ${xpCorrectionAmount < 0 ? 'bg-rose-950 text-rose-300 border border-rose-600' : 'bg-[#25201c] text-[#B5AA9C]'}`}
                    >
                      Débit (-)
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-[#F6F0E7]">
                  Motif documenté obligatoire <span className="text-[#FF6538]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={xpCorrectionReason}
                  onChange={(e) => setXpCorrectionReason(e.target.value)}
                  placeholder="Ex : Réparation suite à validation manuelle du Top 1 sur clip vérifié"
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Appliquer la correction auditée</span>
              </button>
            </form>
          </div>

          {/* Ledger Table */}
          <div className="border border-[#302923] rounded-xl bg-[#1e1a17] overflow-hidden divide-y divide-[#302923]">
            <div className="p-4 bg-[#141210] text-xs font-bold text-[#F6F0E7]">
              Historique complet des transactions XP ({ledger.length})
            </div>
            {ledger.slice(0, 50).map((l) => (
              <div key={l.id} className="p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#F6F0E7]">{l.reason}</span>
                  <span className="text-[11px] text-[#B5AA9C] block">
                    Joueur : <code className="text-[#F6F0E7]">{l.userUid || l.uid}</code> · {new Date(l.createdAt).toLocaleString()}
                  </span>
                </div>
                <span className={`font-mono font-bold tabular-nums text-sm ${l.amount >= 0 ? 'text-[#D8E5B0]' : 'text-rose-400'}`}>
                  {l.amount >= 0 ? `+${l.amount}` : l.amount} XP
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- TAB 9: CONFIGURATION ---------------- */}
      {activeTab === 'config' && (
        <div className="max-w-2xl p-6 sm:p-8 rounded-2xl bg-[#1e1a17] border border-[#302923] space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-[#F6F0E7]">Configuration Système & Paramètres</h3>
            <p className="text-xs text-[#B5AA9C]">
              Gestion du mode maintenance, limites de jeu et drapeaux système.
            </p>
          </div>

          <div className="space-y-5 text-xs">
            {/* Maintenance Mode Toggle */}
            <div className="p-4 rounded-xl bg-[#171513] border border-[#302923] flex items-center justify-between">
              <div className="space-y-0.5 max-w-sm">
                <span className="font-bold text-[#F6F0E7] block">Mode Maintenance de la Plateforme</span>
                <p className="text-[11px] text-[#B5AA9C]">
                  Affiche une alerte globale en haut de l’écran et restreint les écritures critiques.
                </p>
              </div>
              <button
                onClick={() =>
                  adminUpdateSystemSettings(
                    { maintenanceMode: !systemSettings.maintenanceMode },
                    `Basculement mode maintenance : ${!systemSettings.maintenanceMode ? 'ACTIF' : 'INACTIF'}`
                  )
                }
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                  systemSettings.maintenanceMode
                    ? 'bg-amber-500 text-black hover:bg-amber-400'
                    : 'bg-[#25201c] text-[#F6F0E7] hover:bg-[#302923]'
                }`}
              >
                {systemSettings.maintenanceMode ? 'Désactiver' : 'Activer'}
              </button>
            </div>

            {/* Custom Maintenance Message */}
            <div className="space-y-1.5">
              <label className="block font-semibold text-[#F6F0E7]">Message de maintenance public (FR)</label>
              <input
                type="text"
                value={localSettings.maintenanceMessage?.fr || ''}
                onChange={(e) =>
                  setLocalSettings((prev) => ({
                    ...prev,
                    maintenanceMessage: { ...prev.maintenanceMessage, fr: e.target.value },
                  }))
                }
                className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
              />
            </div>

            {/* XP Limits */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-semibold text-[#F6F0E7]">XP minimum par défi</label>
                <input
                  type="number"
                  value={localSettings.minXpReward}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, minXpReward: parseInt(e.target.value) || 10 }))
                  }
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] font-mono focus:border-[#FF6538] focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block font-semibold text-[#F6F0E7]">XP maximum par défi</label>
                <input
                  type="number"
                  value={localSettings.maxXpReward}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({ ...prev, maxXpReward: parseInt(e.target.value) || 500 }))
                  }
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] font-mono focus:border-[#FF6538] focus:outline-none"
                />
              </div>
            </div>

            {/* File upload limit */}
            <div className="space-y-1.5">
              <label className="block font-semibold text-[#F6F0E7]">Taille limite des fichiers de preuve (Mo)</label>
              <input
                type="number"
                value={localSettings.maxFileUploadMb}
                onChange={(e) =>
                  setLocalSettings((prev) => ({ ...prev, maxFileUploadMb: parseInt(e.target.value) || 15 }))
                }
                className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] font-mono focus:border-[#FF6538] focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                adminUpdateSystemSettings(localSettings, 'Mise à jour des paramètres système');
                showFeedback('success', 'Paramètres système enregistrés et journalisés.');
              }}
              className="w-full py-2.5 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Enregistrer la configuration</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------------- TAB 10: AUDIT LOGS ---------------- */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-[#B5AA9C]">
              Les journaux d’audit sont strictement immutables. Aucune suppression ni altération n’est possible.
            </span>
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#B5AA9C]" />
              <select
                value={auditFilterAction}
                onChange={(e) => setAuditFilterAction(e.target.value)}
                className="bg-[#1e1a17] border border-[#302923] rounded-lg px-2.5 py-1 text-xs text-[#F6F0E7] focus:outline-none"
              >
                <option value="ALL">Toutes les actions ({auditLogs.length})</option>
                <option value="ADMIN_CREATE_GROUP">Créations de groupes</option>
                <option value="ADMIN_DELETE_GROUP">Suppressions de groupes</option>
                <option value="ADMIN_CREATE_CHALLENGE">Créations de défis</option>
                <option value="ADMIN_REVIEW_PROOF">Validations de preuves</option>
                <option value="ADMIN_ASSIGN_ROLE">Attributions de rôles</option>
                <option value="ADMIN_ASSIGN_BADGE">Attributions de badges</option>
                <option value="ADMIN_SUSPEND_USER">Suspensions</option>
                <option value="ADMIN_BAN_USER">Bannissements</option>
                <option value="ADMIN_CORRECT_XP">Corrections XP</option>
                <option value="ADMIN_UPDATE_SYSTEM_SETTINGS">Configuration</option>
              </select>
            </div>
          </div>

          <div className="border border-[#302923] rounded-xl bg-[#1e1a17] overflow-hidden divide-y divide-[#302923]">
            {filteredAuditLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#B5AA9C]">Aucun événement d’audit répertorié.</div>
            ) : (
              filteredAuditLogs.map((log) => (
                <div key={log.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#FF6538] font-mono text-[11px]">{log.action}</span>
                      <span>·</span>
                      <span className="text-[#F6F0E7] font-semibold">{log.targetType} : {log.targetId}</span>
                    </div>
                    {log.details && (
                      <p className="text-[#B5AA9C] text-[11px] font-mono truncate max-w-xl">
                        {typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details)}
                      </p>
                    )}
                  </div>
                  <div className="text-[11px] text-[#B5AA9C] shrink-0 text-right">
                    <span>Par {log.actorName || log.actorUid}</span>
                    <span className="block font-mono">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ---------------- MODALS & DRAWERS ---------------------- */}
      {/* ======================================================== */}

      {/* 1. User Detail Drawer Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="p-6 rounded-2xl bg-[#1e1a17] border border-[#302923] max-w-lg w-full space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#302923] pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF6538]" />
                <h3 className="text-base font-extrabold text-[#F6F0E7]">Fiche Joueur</h3>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-1 text-[#B5AA9C] hover:text-[#F6F0E7]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Metadata Sheet */}
            <div className="p-4 rounded-xl bg-[#171513] border border-[#302923] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#B5AA9C]">Nom d’affichage :</span>
                <span className="font-bold text-[#F6F0E7] flex items-center gap-1.5">
                  <span>{selectedUser.displayName}</span>
                  {selectedUser.isVerified && (
                    <VerifiedBadge size="xs" variant="blue" title="Compte certifié officiel" />
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#B5AA9C]">Email (Confidentiel) :</span>
                <span className="font-mono text-[#F6F0E7]">{selectedUser.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#B5AA9C]">UID :</span>
                <code className="text-[#FF6538] text-[10px]">{selectedUser.uid}</code>
              </div>
              {selectedUser.epicGamesId && (
                <div className="flex items-center justify-between">
                  <span className="text-[#B5AA9C]">Pseudo Fortnite :</span>
                  <span className="font-bold text-[#D8E5B0]">{selectedUser.epicGamesId}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[#B5AA9C]">Inscription :</span>
                <span className="text-[#F6F0E7]">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#B5AA9C]">Statut du compte :</span>
                <span className="font-bold uppercase text-[#FF6538]">{selectedUser.accountStatus}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#B5AA9C]">Rôle système :</span>
                <StatusBadge status={selectedUser.role} language={language} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#B5AA9C]">Total XP :</span>
                <span className="font-bold text-[#D8E5B0] font-mono">{selectedUser.xp} XP</span>
              </div>
            </div>

            {/* Badges Management */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#F6F0E7] block">Badges attribués :</span>
              <div className="flex flex-wrap gap-1.5 pb-2">
                {selectedUser.badges && selectedUser.badges.length > 0 ? (
                  selectedUser.badges.map((b) => (
                    <span key={b} className="inline-flex items-center gap-1">
                      <UserBadgeTag badge={b} size="sm" />
                      <button
                        onClick={async () => {
                          await adminRevokeBadge(selectedUser.uid, b, 'Révocation administrative');
                          setSelectedUser((prev) =>
                            prev ? { ...prev, badges: prev.badges?.filter((item) => item !== b) } : null
                          );
                          showFeedback('success', `Badge ${b} révoqué.`);
                        }}
                        className="p-0.5 text-rose-400 hover:bg-rose-950/40 rounded"
                        title="Révoquer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-[#B5AA9C]">Aucun badge pour le moment.</span>
                )}
              </div>

              {/* Add Badge Dropdown */}
              <div className="flex items-center gap-2">
                <select
                  id="badge-select"
                  className="bg-[#171513] border border-[#302923] rounded-lg px-2.5 py-1 text-xs text-[#F6F0E7] focus:outline-none"
                >
                  <option value="creator">Créateur Certifié (Bleu)</option>
                  <option value="staff">Staff Lootsy</option>
                  <option value="founder">Fondateur</option>
                  <option value="official_group">Groupe Officiel</option>
                  <option value="helpful">Joueur Entraide</option>
                  <option value="veteran">Vétéran</option>
                </select>
                <button
                  type="button"
                  onClick={async () => {
                    const select = document.getElementById('badge-select') as HTMLSelectElement;
                    const b = select.value as UserBadge;
                    await adminAssignBadge(selectedUser.uid, b, 'Attribution administrative');
                    setSelectedUser((prev) =>
                      prev ? { ...prev, badges: Array.from(new Set([...(prev.badges || []), b])) } : null
                    );
                    showFeedback('success', `Badge ${b} attribué avec succès.`);
                  }}
                  className="px-3 py-1 rounded bg-[#25201c] hover:bg-[#302923] text-xs font-semibold text-[#F6F0E7] border border-[#302923]"
                >
                  Attribuer badge
                </button>
              </div>
            </div>

            {/* Role Assignment */}
            <div className="space-y-2 text-xs border-t border-[#302923] pt-3">
              <span className="font-bold text-[#F6F0E7] block">Attribution de rôle limité :</span>
              <div className="flex flex-wrap gap-2">
                {(['user', 'moderator', 'editor', 'group_manager'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={async () => {
                      const res = await adminAssignRole(selectedUser.uid, r, 'Changement de rôle administratif');
                      if (res.success) {
                        setSelectedUser((prev) => (prev ? { ...prev, role: r } : null));
                        showFeedback('success', `Rôle mis à jour vers ${r}.`);
                      } else {
                        showFeedback('error', res.error || 'Erreur');
                      }
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-semibold border ${
                      selectedUser.role === r
                        ? 'bg-[#FF6538] text-white border-[#FF6538]'
                        : 'bg-[#171513] text-[#B5AA9C] border-[#302923] hover:text-[#F6F0E7]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Sanctions & Account Management */}
            <div className="space-y-2 text-xs border-t border-[#302923] pt-3">
              <span className="font-bold text-[#F6F0E7] block">Mesures administratives :</span>
              <div className="flex flex-wrap gap-2">
                {selectedUser.accountStatus === 'suspended' ? (
                  <button
                    onClick={async () => {
                      await adminReactivateUser(selectedUser.uid, 'Réactivation manuelle');
                      setSelectedUser((prev) => (prev ? { ...prev, accountStatus: 'active' } : null));
                      showFeedback('success', 'Compte réactivé.');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-800"
                  >
                    Réactiver le compte
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSuspendModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-amber-950/60 text-amber-300 font-bold border border-amber-800"
                  >
                    Suspendre temporairement
                  </button>
                )}

                {selectedUser.accountStatus !== 'banned' && (
                  <button
                    onClick={() => setShowBanModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-rose-950/60 text-rose-300 font-bold border border-rose-800"
                  >
                    Bannir définitivement
                  </button>
                )}

                <button
                  onClick={async () => {
                    await adminRevokePushTokens(selectedUser.uid, 'Révocation de sécurité');
                    showFeedback('success', 'Jetons push révoqués.');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#25201c] text-[#B5AA9C] hover:text-[#F6F0E7] font-semibold border border-[#302923]"
                >
                  Révoquer jetons push
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Group Details & Member Management Modal */}
      {selectedGroup && !showDeleteGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="p-6 rounded-2xl bg-[#1e1a17] border border-[#302923] max-w-xl w-full space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#302923] pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#F6F0E7]">
                  Gestion du Groupe : {selectedGroup.name}
                </h3>
                <span className="text-[11px] text-[#B5AA9C]">ID : {selectedGroup.id}</span>
              </div>
              <button onClick={() => setSelectedGroup(null)} className="p-1 text-[#B5AA9C] hover:text-[#F6F0E7]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Add User via Public Search */}
            <div className="p-3.5 rounded-xl bg-[#171513] border border-[#302923] space-y-2 text-xs">
              <span className="font-bold text-[#F6F0E7] block">
                Ajouter manuellement un membre (Recherche publique)
              </span>
              <p className="text-[11px] text-[#B5AA9C]">
                Recherche limitée au nom d’affichage et à l’UID public. L’utilisateur recevra une notification et pourra quitter librement.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  placeholder="Tapez un pseudo public…"
                  className="flex-1 bg-[#1e1a17] border border-[#302923] rounded-lg px-3 py-1.5 text-xs text-[#F6F0E7] focus:outline-none"
                />
              </div>

              {/* Suggestions */}
              {memberSearchQuery.trim() && (
                <div className="max-h-32 overflow-y-auto divide-y divide-[#302923] border border-[#302923] rounded-lg mt-2 bg-[#1e1a17]">
                  {users
                    .filter(
                      (u) =>
                        u.displayName.toLowerCase().includes(memberSearchQuery.toLowerCase()) &&
                        !(selectedGroup.memberUids || []).includes(u.uid)
                    )
                    .slice(0, 5)
                    .map((candidate) => (
                      <div key={candidate.uid} className="p-2 flex items-center justify-between">
                        <span className="font-semibold text-[#F6F0E7]">{candidate.displayName}</span>
                        <button
                          onClick={async () => {
                            await adminAddUserToGroup(selectedGroup.id, candidate.uid);
                            setMemberSearchQuery('');
                            showFeedback('success', `${candidate.displayName} ajouté au groupe.`);
                          }}
                          className="px-2 py-1 rounded bg-[#FF6538] text-white font-bold text-[10px]"
                        >
                          Ajouter
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Members List */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#F6F0E7] block">
                Membres actuels ({currentGroupMembersList.length}) :
              </span>
              <div className="divide-y divide-[#302923] border border-[#302923] rounded-xl bg-[#171513] overflow-hidden max-h-60 overflow-y-auto">
                {currentGroupMembersList.map((m) => (
                  <div key={m.uid} className="p-3 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-[#F6F0E7] block">{m.displayName}</span>
                      <span className="text-[11px] text-[#B5AA9C]">Rôle dans le groupe : {m.role}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {m.role !== 'owner' && (
                        <button
                          onClick={async () => {
                            await adminTransferGroupOwnership(selectedGroup.id, m.uid, 'Transfert officiel de propriété');
                            showFeedback('success', `Propriété transférée à ${m.displayName}.`);
                          }}
                          className="px-2 py-1 rounded bg-[#25201c] hover:bg-[#302923] text-[10px] font-semibold text-[#B5AA9C] hover:text-[#F6F0E7] border border-[#302923]"
                        >
                          Transférer owner
                        </button>
                      )}

                      <button
                        onClick={async () => {
                          const newR = m.role === 'moderator' ? 'member' : 'moderator';
                          await adminSetGroupMemberRole(selectedGroup.id, m.uid, newR);
                          showFeedback('success', `Rôle mis à jour (${newR}).`);
                        }}
                        className="px-2 py-1 rounded bg-[#25201c] hover:bg-[#302923] text-[10px] font-semibold text-[#FF6538] border border-[#302923]"
                      >
                        {m.role === 'moderator' ? 'Rétrograder' : 'Passer Modo'}
                      </button>

                      <button
                        onClick={async () => {
                          await adminRemoveUserFromGroup(selectedGroup.id, m.uid, 'Retrait administratif');
                          showFeedback('success', `${m.displayName} retiré du groupe.`);
                        }}
                        className="p-1 rounded bg-[#25201c] hover:bg-rose-950/40 text-rose-300 border border-[#302923]"
                        title="Retirer du groupe"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. News Creation Modal */}
      {showNewsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="p-6 rounded-2xl bg-[#1e1a17] border border-[#302923] max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#302923] pb-3">
              <h3 className="text-base font-extrabold text-[#F6F0E7]">Rédiger une actualité officielle</h3>
              <button onClick={() => setShowNewsModal(false)} className="p-1 text-[#B5AA9C] hover:text-[#F6F0E7]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNews} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-[#F6F0E7]">
                  Titre (FR) <span className="text-[#FF6538]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newsTitleFr}
                  onChange={(e) => setNewsTitleFr(e.target.value)}
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#F6F0E7]">Titre (EN)</label>
                <input
                  type="text"
                  value={newsTitleEn}
                  onChange={(e) => setNewsTitleEn(e.target.value)}
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#F6F0E7]">Catégorie</label>
                <select
                  value={newsCategory}
                  onChange={(e) => setNewsCategory(e.target.value)}
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name.fr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#F6F0E7]">
                  URL Source officielle <span className="text-[#FF6538]">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={newsSourceUrl}
                  onChange={(e) => setNewsSourceUrl(e.target.value)}
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#F6F0E7]">Nom de la source</label>
                <input
                  type="text"
                  value={newsSourceName}
                  onChange={(e) => setNewsSourceName(e.target.value)}
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#F6F0E7]">
                  Résumé (FR) <span className="text-[#FF6538]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newsSummaryFr}
                  onChange={(e) => setNewsSummaryFr(e.target.value)}
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#F6F0E7]">
                  Corps de l’article (FR) <span className="text-[#FF6538]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={newsBodyFr}
                  onChange={(e) => setNewsBodyFr(e.target.value)}
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg p-3 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewsModal(false)}
                  className="w-1/2 py-2 rounded-lg bg-[#25201c] text-xs font-semibold text-[#B5AA9C]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold"
                >
                  Publier l’actualité
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Create Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="p-6 rounded-2xl bg-[#1e1a17] border border-[#302923] max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-[#302923] pb-3">
              <h3 className="text-base font-extrabold text-[#F6F0E7]">Créer un Groupe Officiel</h3>
              <button onClick={() => setShowCreateGroupModal(false)} className="p-1 text-[#B5AA9C] hover:text-[#F6F0E7]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateGroupSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-[#F6F0E7]">Nom de l’escouade / groupe</label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Ex : Squad Royale Tournoi"
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block font-semibold text-[#F6F0E7]">Description (optionnelle)</label>
                <textarea
                  rows={2}
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="Objectifs de la squad…"
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg p-2.5 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateGroupModal(false)}
                  className="w-1/2 py-2 rounded-lg bg-[#25201c] text-xs font-semibold text-[#B5AA9C]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold"
                >
                  Créer le groupe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Create Challenge Modal */}
      {showCreateChallengeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="p-6 rounded-2xl bg-[#1e1a17] border border-[#302923] max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#302923] pb-3">
              <h3 className="text-base font-extrabold text-[#F6F0E7]">Créer un Défi dans un Groupe</h3>
              <button onClick={() => setShowCreateChallengeModal(false)} className="p-1 text-[#B5AA9C] hover:text-[#F6F0E7]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateChallengeSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-[#F6F0E7]">Groupe cible</label>
                <select
                  value={targetChallengeGroup}
                  onChange={(e) => setTargetChallengeGroup(e.target.value)}
                  required
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:outline-none"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="block font-semibold text-[#F6F0E7]">Titre du défi</label>
                <input
                  type="text"
                  required
                  value={newChallengeTitle}
                  onChange={(e) => setNewChallengeTitle(e.target.value)}
                  placeholder="Ex : Top 1 avec élimination finale au fusil à pompe"
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="block font-semibold text-[#F6F0E7]">Règles & Consignes</label>
                <textarea
                  rows={3}
                  required
                  value={newChallengeDesc}
                  onChange={(e) => setNewChallengeDesc(e.target.value)}
                  placeholder="Précisez les critères exacts de validation…"
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg p-2.5 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-[#F6F0E7]">Récompense XP (10-500)</label>
                  <input
                    type="number"
                    min={10}
                    max={500}
                    value={newChallengeXp}
                    onChange={(e) => setNewChallengeXp(parseInt(e.target.value) || 50)}
                    className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] font-mono focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-semibold text-[#F6F0E7]">Règle de preuve</label>
                  <select
                    value={newChallengeProofPolicy}
                    onChange={(e) => setNewChallengeProofPolicy(e.target.value as any)}
                    className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:outline-none"
                  >
                    <option value="optional">Facultative</option>
                    <option value="required">Obligatoire (Capture/Clip)</option>
                    <option value="none">Aucune (Honneur)</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateChallengeModal(false)}
                  className="w-1/2 py-2 rounded-lg bg-[#25201c] text-xs font-semibold text-[#B5AA9C]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold"
                >
                  Lancer le défi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Broadcast Confirmation Modal */}
      {showBroadcastConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="p-6 rounded-2xl bg-[#1e1a17] border border-amber-800/80 max-w-md w-full space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-extrabold text-[#F6F0E7]">Confirmation d’envoi global</h3>
            </div>
            <p className="text-xs text-[#B5AA9C] leading-relaxed">
              Vous êtes sur le point de notifier <strong className="text-[#F6F0E7]">{users.length} comptes actifs</strong> de la plateforme Lootsy.
            </p>
            <div className="p-3 rounded-lg bg-[#171513] border border-[#302923] space-y-1 text-xs">
              <span className="font-bold text-[#F6F0E7] block">{broadcastTitleFr}</span>
              <p className="text-[#B5AA9C]">{broadcastBodyFr}</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBroadcastConfirm(false)}
                className="w-1/2 py-2 rounded-lg bg-[#25201c] text-xs font-semibold text-[#B5AA9C]"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleBroadcastSubmit}
                className="w-1/2 py-2 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold"
              >
                Confirmer et envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Suspend Modal */}
      {showSuspendModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="p-6 rounded-2xl bg-[#1e1a17] border border-amber-800 max-w-md w-full space-y-4">
            <h3 className="text-base font-extrabold text-[#F6F0E7]">
              Suspendre le joueur {selectedUser.displayName}
            </h3>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-[#F6F0E7]">Durée de suspension</label>
                <select
                  value={suspensionDays}
                  onChange={(e) => setSuspensionDays(parseInt(e.target.value))}
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:outline-none"
                >
                  <option value={1}>1 jour</option>
                  <option value={3}>3 jours</option>
                  <option value={7}>7 jours (1 semaine)</option>
                  <option value={14}>14 jours (2 semaines)</option>
                  <option value={30}>30 jours (1 mois)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#F6F0E7]">Motif obligatoire de la sanction</label>
                <textarea
                  rows={3}
                  required
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  placeholder="Précisez la raison…"
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg p-2.5 text-xs text-[#F6F0E7] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSuspendModal(false)}
                  className="w-1/2 py-2 rounded-lg bg-[#25201c] text-xs font-semibold text-[#B5AA9C]"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSuspendSubmit}
                  className="w-1/2 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-black text-xs font-bold"
                >
                  Appliquer suspension
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Ban Modal (Double Confirmation) */}
      {showBanModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="p-6 rounded-2xl bg-[#1e1a17] border border-rose-900 max-w-md w-full space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <Ban className="w-5 h-5" />
              <h3 className="text-base font-extrabold text-[#F6F0E7]">
                Bannissement Définitif de {selectedUser.displayName}
              </h3>
            </div>
            <p className="text-xs text-[#B5AA9C]">
              Action critique soumise à double confirmation et audit systématique. Le joueur perdra immédiatement l’accès à tous ses groupes et défis.
            </p>
            <div className="space-y-1.5 text-xs">
              <label className="block font-semibold text-[#F6F0E7]">Motif écrit circonstancié</label>
              <textarea
                rows={3}
                required
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Rédigez le motif du ban…"
                className="w-full bg-[#171513] border border-[#302923] rounded-lg p-2.5 text-xs text-[#F6F0E7] focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBanModal(false)}
                className="w-1/2 py-2 rounded-lg bg-[#25201c] text-xs font-semibold text-[#B5AA9C]"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleBanSubmit}
                className="w-1/2 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Confirmer le Bannissement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Cancel Challenge Modal */}
      {cancelReasonModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="p-6 rounded-2xl bg-[#1e1a17] border border-[#302923] max-w-md w-full space-y-4">
            <h3 className="text-base font-extrabold text-[#F6F0E7]">Annuler le défi officiel</h3>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-[#F6F0E7]">Motif de l’annulation</label>
                <textarea
                  rows={3}
                  required
                  value={cancelReasonText}
                  onChange={(e) => setCancelReasonText(e.target.value)}
                  placeholder="Ex : Problème d'équilibrage dans le patch récent…"
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg p-2.5 text-xs text-[#F6F0E7] focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelReasonModal(null)}
                  className="w-1/2 py-2 rounded-lg bg-[#25201c] text-xs font-semibold text-[#B5AA9C]"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={handleCancelChallengeSubmit}
                  className="w-1/2 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                >
                  Confirmer l’annulation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. Delete Group Modal */}
      {showDeleteGroupModal && selectedGroup && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="p-6 rounded-2xl bg-[#1e1a17] border border-rose-900 max-w-md w-full space-y-4">
            <h3 className="text-base font-extrabold text-[#F6F0E7]">
              Supprimer le groupe {selectedGroup.name}
            </h3>
            <p className="text-xs text-[#B5AA9C]">
              La suppression est définitive et journalisée. Il est généralement préférable d’archiver le groupe pour préserver l'historique des joueurs.
            </p>
            <div className="space-y-1.5 text-xs">
              <label className="block font-semibold text-[#F6F0E7]">Motif obligatoire de la suppression</label>
              <textarea
                rows={3}
                required
                value={deleteGroupReason}
                onChange={(e) => setDeleteGroupReason(e.target.value)}
                placeholder="Rédigez le motif…"
                className="w-full bg-[#171513] border border-[#302923] rounded-lg p-2.5 text-xs text-[#F6F0E7] focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteGroupModal(false)}
                className="w-1/2 py-2 rounded-lg bg-[#25201c] text-xs font-semibold text-[#B5AA9C]"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteGroupSubmit}
                className="w-1/2 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
