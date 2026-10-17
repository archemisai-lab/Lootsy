import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateLevelFromXp } from '../../utils/rules';
import { StatusBadge } from '../../components/StatusBadge';
import {
  User,
  Award,
  Trophy,
  Users,
  Settings,
  LogOut,
  Calendar,
  Shield,
  FileCheck2,
} from 'lucide-react';

interface ProfileViewProps {
  navigate: (route: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ navigate }) => {
  const { currentUser, groups, participants, ledger, logout, language } = useApp();

  if (!currentUser) return null;

  const levelInfo = calculateLevelFromXp(currentUser.xp);
  const myGroups = groups.filter((g) => g.memberUids.includes(currentUser.uid));
  const myLedger = ledger.filter((l) => l.uid === currentUser.uid);

  const completedVerified = participants.filter(
    (p) => p.uid === currentUser.uid && p.status === 'completed_verified'
  ).length;

  const completedUnverified = participants.filter(
    (p) => p.uid === currentUser.uid && p.status === 'completed_unverified'
  ).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Profile Card Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#1e1a17] border border-[#302923] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#302923] border border-[#FF6538]/40 flex items-center justify-center text-2xl font-black text-[#F6F0E7]">
            {currentUser.displayName.charAt(0).toUpperCase()}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#F6F0E7]">
                {currentUser.displayName}
              </h1>
              <StatusBadge status={currentUser.role} language={language} />
            </div>

            <p className="text-xs text-[#B5AA9C] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Membre depuis le {new Date(currentUser.createdAt).toLocaleDateString()}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app/settings')}
            className="px-3.5 py-2 rounded-lg bg-[#25201c] hover:bg-[#302923] border border-[#302923] text-xs font-semibold text-[#F6F0E7] inline-flex items-center gap-1.5 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Paramètres</span>
          </button>
          <button
            onClick={logout}
            className="px-3.5 py-2 rounded-lg bg-[#25201c] hover:bg-rose-950/40 text-rose-300 border border-[#302923] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Level & XP Progression Card */}
      <div className="p-6 rounded-2xl bg-[#1e1a17] border border-[#302923] space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs text-[#B5AA9C]">Rang de joueur</span>
            <h2 className="text-xl font-extrabold text-[#F6F0E7] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#FF6538]" />
              <span>Niveau {levelInfo.level}</span>
            </h2>
          </div>
          <span className="font-mono text-xl font-bold text-[#FF6538] tabular-nums">
            {currentUser.xp} XP au total
          </span>
        </div>

        <div className="w-full bg-[#171513] h-3 rounded-full overflow-hidden p-0.5 border border-[#302923]">
          <div
            className="bg-[#FF6538] h-full rounded-full transition-all duration-500"
            style={{ width: `${levelInfo.progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[#B5AA9C]">
          <span>Progression vers le niveau {levelInfo.level + 1}</span>
          <span>{levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP ({levelInfo.progressPercent}%)</span>
        </div>
      </div>

      {/* Authentic Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#1a1715] border border-[#302923] space-y-1">
          <span className="text-xs text-[#B5AA9C]">Réussites vérifiées par preuve</span>
          <span className="text-2xl font-mono font-bold text-[#D8E5B0] tabular-nums block">
            {completedVerified}
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#1a1715] border border-[#302923] space-y-1">
          <span className="text-xs text-[#B5AA9C]">Déclarations sur l’honneur</span>
          <span className="text-2xl font-mono font-bold text-[#F6F0E7] tabular-nums block">
            {completedUnverified}
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#1a1715] border border-[#302923] space-y-1">
          <span className="text-xs text-[#B5AA9C]">Groupes privés d’amis</span>
          <span className="text-2xl font-mono font-bold text-[#FF6538] tabular-nums block">
            {myGroups.length}
          </span>
        </div>
      </div>

      {/* Auditable XP Ledger History */}
      <div className="p-6 rounded-2xl bg-[#1e1a17] border border-[#302923] space-y-4">
        <div className="flex items-center justify-between border-b border-[#302923] pb-3">
          <h2 className="text-base font-bold text-[#F6F0E7] flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-[#FF6538]" />
            <span>Registre d’audit des XP (Historique explicable)</span>
          </h2>
          <span className="text-xs text-[#B5AA9C]">{myLedger.length} entrée(s)</span>
        </div>

        {myLedger.length === 0 ? (
          <p className="text-xs text-[#B5AA9C] py-4 text-center">Aucun gain d’XP enregistré pour le moment.</p>
        ) : (
          <div className="divide-y divide-[#302923] text-xs">
            {myLedger.map((entry) => (
              <div key={entry.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="space-y-0.5">
                  <span className="font-semibold text-[#F6F0E7] block">{entry.reason}</span>
                  <span className="text-[11px] text-[#B5AA9C]">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="font-mono font-bold text-[#D8E5B0]">+{entry.amount} XP</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Squads */}
      <div className="p-6 rounded-2xl bg-[#1e1a17] border border-[#302923] space-y-4">
        <h2 className="text-base font-bold text-[#F6F0E7] flex items-center gap-2">
          <Users className="w-4 h-4 text-[#FF6538]" />
          <span>Vos escouades</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {myGroups.map((g) => (
            <div
              key={g.id}
              onClick={() => navigate(`/app/groups/${g.id}`)}
              className="p-3.5 rounded-xl bg-[#171513] hover:bg-[#201c19] border border-[#302923] cursor-pointer transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#302923] flex items-center justify-center font-bold text-xs text-[#F6F0E7]">
                  {g.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-[#F6F0E7]">{g.name}</span>
              </div>
              <span className="text-[11px] text-[#B5AA9C]">{g.memberCount} membres</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
