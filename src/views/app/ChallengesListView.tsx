import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Trophy, Plus, Clock, Filter, ChevronRight } from 'lucide-react';

interface ChallengesListViewProps {
  navigate: (route: string) => void;
}

export const ChallengesListView: React.FC<ChallengesListViewProps> = ({ navigate }) => {
  const { currentUser, challenges, groups, participants, t, language } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');

  if (!currentUser) return null;

  // Filter user's accessible groups
  const myGroups = groups.filter((g) => g.memberUids.includes(currentUser.uid));
  const myGroupIds = myGroups.map((g) => g.id);

  const filtered = challenges
    .filter((c) => myGroupIds.includes(c.groupId))
    .filter((c) => {
      if (statusFilter === 'all') return true;
      return c.status === statusFilter;
    })
    .filter((c) => {
      if (groupFilter === 'all') return true;
      return c.groupId === groupFilter;
    });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#302923] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F6F0E7]">
            {t('challenges', 'title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#B5AA9C] mt-1">
            {t('challenges', 'subtitle')}
          </p>
        </div>

        <button
          onClick={() => navigate('/app/challenges/new')}
          className="px-4 py-2 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('challenges', 'createChallenge')}</span>
        </button>
      </div>

      {/* Filters Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Status segmented controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'Tous' },
            { id: 'active', label: 'En cours' },
            { id: 'completed', label: 'Terminés' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === item.id
                  ? 'bg-[#FF6538] text-white'
                  : 'bg-[#1e1a17] text-[#B5AA9C] hover:text-[#F6F0E7] border border-[#302923]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Group Selector */}
        {myGroups.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#B5AA9C]">Groupe :</span>
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="bg-[#1e1a17] border border-[#302923] text-xs text-[#F6F0E7] rounded-lg px-2.5 py-1.5 focus:border-[#FF6538] focus:outline-none"
            >
              <option value="all">Tous les groupes</option>
              {myGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Challenges List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#1e1a17] border border-[#302923] space-y-3">
          <p className="text-sm font-bold text-[#F6F0E7]">Aucun défi trouvé</p>
          <p className="text-xs text-[#B5AA9C]">Modifiez vos filtres ou lancez un nouveau défi pour votre groupe.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((chal) => {
            const group = groups.find((g) => g.id === chal.groupId);
            const myPart = participants.find(
              (p) => p.challengeId === chal.id && p.uid === currentUser.uid
            );

            return (
              <div
                key={chal.id}
                onClick={() => navigate(`/app/challenges/${chal.id}`)}
                className="group p-5 rounded-xl bg-[#1e1a17] hover:bg-[#25201c] border border-[#302923] cursor-pointer transition-colors space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#B5AA9C]">
                    <span className="font-semibold text-[#F6F0E7] truncate max-w-[200px]">
                      {group?.name || 'Groupe'}
                    </span>
                    <span className="font-mono font-bold text-[#FF6538] tabular-nums">
                      +{chal.xpReward} XP
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#F6F0E7] group-hover:text-[#FF6538] transition-colors leading-snug">
                    {chal.title}
                  </h3>

                  <p className="text-xs text-[#B5AA9C] line-clamp-2 leading-relaxed">
                    {chal.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#302923]/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[#B5AA9C]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{chal.dueAt ? new Date(chal.dueAt).toLocaleDateString() : 'Pas d’échéance'}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge
                      status={myPart?.status || 'not_started'}
                      language={language}
                    />
                    <ChevronRight className="w-4 h-4 text-[#B5AA9C] group-hover:text-[#FF6538] transition-colors" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
