import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Users,
  Trophy,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  Plus,
  Shield,
  Clock,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';

interface GroupDetailViewProps {
  groupId: string;
  navigate: (route: string) => void;
}

export const GroupDetailView: React.FC<GroupDetailViewProps> = ({ groupId, navigate }) => {
  const {
    currentUser,
    groups,
    groupMembers,
    groupInvites,
    challenges,
    regenerateInvite,
    revokeInvite,
    leaveGroup,
    t,
    language,
    auditLogs,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'challenges' | 'members' | 'history'>('overview');
  const [copied, setCopied] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

  const group = groups.find((g) => g.id === groupId);

  if (!currentUser || !group) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#F6F0E7]">Groupe introuvable ou inaccessible</h2>
        <p className="text-xs text-[#B5AA9C]">Vous ne faites pas partie de ce groupe ou celui-ci a été dissous.</p>
        <button
          onClick={() => navigate('/app/groups')}
          className="text-xs font-semibold text-[#FF6538] hover:underline"
        >
          Retour aux groupes
        </button>
      </div>
    );
  }

  const isOwner = group.ownerUid === currentUser.uid;
  const activeInvite = groupInvites.find((inv) => inv.groupId === group.id && inv.status === 'active');
  const groupChallenges = challenges.filter((c) => c.groupId === group.id);
  const members = groupMembers.filter((m) => group.memberUids.includes(m.uid));
  const groupAudit = auditLogs.filter(
    (l) => l.targetId === group.id || l.details?.groupId === group.id
  );

  const handleCopyCode = () => {
    if (!activeInvite) return;
    navigator.clipboard.writeText(activeInvite.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = () => {
    leaveGroup(group.id);
    navigate('/app/groups');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Return navigation */}
      <button
        onClick={() => navigate('/app/groups')}
        className="text-xs text-[#B5AA9C] hover:text-[#F6F0E7] inline-flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-[#FF6538]" />
        <span>Retour à la liste des groupes</span>
      </button>

      {/* Group Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#1e1a17] border border-[#302923] space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#302923] border border-[#FF6538]/30 flex items-center justify-center text-2xl font-black text-[#F6F0E7] shrink-0">
              {group.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F6F0E7]">
                  {group.name}
                </h1>
                <StatusBadge status={isOwner ? 'owner' : 'member'} language={language} />
              </div>
              {group.description && (
                <p className="text-xs sm:text-sm text-[#B5AA9C] leading-relaxed max-w-2xl">
                  {group.description}
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/app/challenges/new')}
              className="px-4 py-2 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouveau défi</span>
            </button>

            {!isOwner && (
              <button
                onClick={() => setShowLeaveConfirm(true)}
                className="px-3 py-2 rounded-lg bg-[#28221e] hover:bg-rose-950/40 text-rose-300 border border-[#302923] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Quitter</span>
              </button>
            )}
          </div>
        </div>

        {/* Invite Code Box */}
        <div className="p-4 rounded-xl bg-[#171513] border border-[#302923] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-[#B5AA9C] uppercase tracking-wider block">
              {t('groups', 'inviteCodeLabel')}
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-[#FF6538] tracking-widest">
              {activeInvite ? activeInvite.code : 'Aucun code actif'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {activeInvite && (
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-[#25201c] hover:bg-[#302923] border border-[#302923] text-xs font-semibold text-[#F6F0E7] inline-flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#D8E5B0]" /> : <Copy className="w-3.5 h-3.5 text-[#FF6538]" />}
                <span>{copied ? 'Copié !' : 'Copier le code'}</span>
              </button>
            )}

            {isOwner && (
              <>
                <button
                  onClick={() => regenerateInvite(group.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#25201c] hover:bg-[#302923] border border-[#302923] text-xs font-semibold text-[#B5AA9C] hover:text-[#F6F0E7] inline-flex items-center gap-1.5 transition-colors"
                  title="Générer un nouveau code"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Renouveler</span>
                </button>
                {activeInvite && (
                  <button
                    onClick={() => revokeInvite(activeInvite.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#25201c] hover:bg-rose-950/40 border border-[#302923] text-xs text-rose-300 transition-colors"
                    title="Révoquer ce code"
                  >
                    Révoquer
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#302923] pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-[#FF6538] text-[#FF6538]'
              : 'border-transparent text-[#B5AA9C] hover:text-[#F6F0E7]'
          }`}
        >
          {t('groups', 'tabOverview')}
        </button>

        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'challenges'
              ? 'border-[#FF6538] text-[#FF6538]'
              : 'border-transparent text-[#B5AA9C] hover:text-[#F6F0E7]'
          }`}
        >
          {t('groups', 'tabChallenges')} ({groupChallenges.length})
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'members'
              ? 'border-[#FF6538] text-[#FF6538]'
              : 'border-transparent text-[#B5AA9C] hover:text-[#F6F0E7]'
          }`}
        >
          {t('groups', 'tabMembers')} ({members.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'history'
              ? 'border-[#FF6538] text-[#FF6538]'
              : 'border-transparent text-[#B5AA9C] hover:text-[#F6F0E7]'
          }`}
        >
          {t('groups', 'tabHistory')}
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#F6F0E7]">Défis actifs dans l’escouade</h3>
            <button
              onClick={() => navigate('/app/challenges/new')}
              className="text-xs font-semibold text-[#FF6538] hover:underline"
            >
              + Lancer un défi
            </button>
          </div>

          {groupChallenges.filter((c) => c.status === 'active').length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-[#1e1a17] border border-[#302923] text-xs text-[#B5AA9C] space-y-2">
              <p>{t('groups', 'noChallengesInGroup')}</p>
              <button
                onClick={() => navigate('/app/challenges/new')}
                className="text-[#FF6538] font-bold hover:underline"
              >
                Créer un premier défi pour vos amis
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupChallenges
                .filter((c) => c.status === 'active')
                .map((chal) => (
                  <div
                    key={chal.id}
                    onClick={() => navigate(`/app/challenges/${chal.id}`)}
                    className="p-5 rounded-xl bg-[#1e1a17] hover:bg-[#25201c] border border-[#302923] cursor-pointer transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#FF6538] font-bold">+{chal.xpReward} XP</span>
                      <StatusBadge status="active" language={language} />
                    </div>
                    <h4 className="text-sm font-bold text-[#F6F0E7] line-clamp-1">
                      {chal.title}
                    </h4>
                    <p className="text-xs text-[#B5AA9C] line-clamp-2 leading-relaxed">
                      {chal.description}
                    </p>
                    <div className="pt-2 border-t border-[#302923]/60 flex items-center justify-between text-[11px] text-[#B5AA9C]">
                      <span>Échéance : {chal.dueAt ? new Date(chal.dueAt).toLocaleDateString() : 'Aucune'}</span>
                      <span className="text-[#FF6538] font-semibold">Ouvrir</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Challenges List */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          {groupChallenges.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-[#1e1a17] border border-[#302923] text-xs text-[#B5AA9C]">
              Aucun défi enregistré dans ce groupe.
            </div>
          ) : (
            <div className="space-y-3">
              {groupChallenges.map((chal) => (
                <div
                  key={chal.id}
                  onClick={() => navigate(`/app/challenges/${chal.id}`)}
                  className="p-4 sm:p-5 rounded-xl bg-[#1e1a17] hover:bg-[#25201c] border border-[#302923] cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-sm font-bold text-[#F6F0E7]">
                        {chal.title}
                      </h4>
                      <StatusBadge status={chal.status} language={language} />
                    </div>
                    <p className="text-xs text-[#B5AA9C] line-clamp-1 max-w-xl">
                      {chal.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0">
                    <span className="font-mono font-bold text-[#FF6538]">+{chal.xpReward} XP</span>
                    <button className="px-3 py-1.5 rounded-lg bg-[#302923] hover:bg-[#3d342c] text-[#F6F0E7] font-semibold">
                      Détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Members */}
      {activeTab === 'members' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#1e1a17] border border-[#302923] divide-y divide-[#302923]">
            {members.map((m) => (
              <div key={m.uid} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#302923] flex items-center justify-center font-bold text-xs text-[#F6F0E7]">
                    {m.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#F6F0E7] block">
                      {m.displayName}
                    </span>
                    <span className="text-[11px] text-[#B5AA9C]">
                      Membre depuis le {new Date(m.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <StatusBadge status={m.role} language={language} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: History / Audit */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-3">
            <h4 className="text-xs font-bold text-[#F6F0E7] uppercase tracking-wider">
              Historique des actions de l’escouade
            </h4>
            <div className="space-y-2 text-xs text-[#B5AA9C]">
              <div className="flex items-center justify-between py-2 border-b border-[#302923]/40">
                <span>Groupe créé par le propriétaire</span>
                <span>{new Date(group.createdAt).toLocaleDateString()}</span>
              </div>
              {groupAudit.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-[#302923]/40">
                  <span>{log.actorName} · {log.action}</span>
                  <span>{new Date(log.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Leave group confirmation modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="p-6 rounded-2xl bg-[#1e1a17] border border-[#302923] max-w-sm w-full space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-950/60 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-[#F6F0E7]">Quitter le groupe ?</h3>
              <p className="text-xs text-[#B5AA9C]">
                Vous perdrez l’accès aux défis en cours et à l’historique partagé de cette escouade.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="w-1/2 py-2 rounded-lg bg-[#302923] text-xs font-semibold text-[#F6F0E7]"
              >
                Annuler
              </button>
              <button
                onClick={handleLeave}
                className="w-1/2 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
