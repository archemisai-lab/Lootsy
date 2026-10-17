import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateLevelFromXp } from '../../utils/rules';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Trophy,
  Users,
  Flame,
  PlusCircle,
  UserPlus,
  ArrowRight,
  Clock,
  ChevronRight,
  Award,
} from 'lucide-react';

interface DashboardViewProps {
  navigate: (route: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ navigate }) => {
  const { currentUser, t, language, news, groups, challenges, participants, categories } = useApp();

  if (!currentUser) {
    return null;
  }

  // Calculate level info
  const levelInfo = calculateLevelFromXp(currentUser.xp);

  // User's active groups
  const myGroups = groups.filter((g) => g.memberUids.includes(currentUser.uid) && g.status === 'active');

  // User's active challenges across their groups
  const myGroupIds = myGroups.map((g) => g.id);
  const activeChallenges = challenges
    .filter((c) => myGroupIds.includes(c.groupId) && c.status === 'active')
    .slice(0, 4);

  // Completed challenges count
  const myCompletedCount = participants.filter(
    (p) =>
      p.uid === currentUser.uid &&
      (p.status === 'completed_verified' || p.status === 'completed_unverified')
  ).length;

  // News matching user interests
  const matchingNews = news
    .filter((n) => n.status === 'published')
    .filter((n) => currentUser.interests.length === 0 || currentUser.interests.includes(n.categoryId))
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* 1. Welcome & Level Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#1e1a17] border border-[#302923] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F6F0E7]">
            {t('dashboard', 'welcome', { name: currentUser.displayName })}
          </h1>
          <p className="text-xs sm:text-sm text-[#B5AA9C]">
            Ravi de vous revoir. Voici l’état actuel de vos défis et de votre escouade.
          </p>
        </div>

        {/* Level Progression Indicator */}
        <div className="bg-[#171513] border border-[#302923] rounded-xl p-4 min-w-[240px] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#F6F0E7] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#FF6538]" />
              <span>Niveau {levelInfo.level}</span>
            </span>
            <span className="text-[#FF6538] font-mono tabular-nums">{currentUser.xp} XP</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#302923] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#FF6538] h-full transition-all duration-500 rounded-full"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#B5AA9C]">
            <span>Progression palier</span>
            <span>{levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP</span>
          </div>
        </div>
      </div>

      {/* 2. Key Stats Strip (Real data only) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#1a1715] border border-[#302923] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#B5AA9C] block">{t('dashboard', 'xpEarned')}</span>
            <span className="text-2xl font-mono font-bold text-[#F6F0E7] tabular-nums">{currentUser.xp}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#302923] flex items-center justify-center text-[#FF6538]">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#1a1715] border border-[#302923] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#B5AA9C] block">{t('dashboard', 'completedCount')}</span>
            <span className="text-2xl font-mono font-bold text-[#F6F0E7] tabular-nums">{myCompletedCount}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#302923] flex items-center justify-center text-[#D8E5B0]">
            <Trophy className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#1a1715] border border-[#302923] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#B5AA9C] block">{t('dashboard', 'activeGroupsCount')}</span>
            <span className="text-2xl font-mono font-bold text-[#F6F0E7] tabular-nums">{myGroups.length}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#302923] flex items-center justify-center text-[#F6F0E7]">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Quick Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => navigate('/app/news')}
          className="p-3.5 rounded-xl bg-[#201c19] hover:bg-[#28231f] border border-[#302923] text-left transition-colors flex items-center gap-2.5 text-xs font-semibold text-[#F6F0E7]"
        >
          <Flame className="w-4 h-4 text-[#FF6538] shrink-0" />
          <span className="truncate">{t('dashboard', 'quickRadar')}</span>
        </button>

        <button
          onClick={() => navigate('/app/groups/new')}
          className="p-3.5 rounded-xl bg-[#201c19] hover:bg-[#28231f] border border-[#302923] text-left transition-colors flex items-center gap-2.5 text-xs font-semibold text-[#F6F0E7]"
        >
          <PlusCircle className="w-4 h-4 text-[#D8E5B0] shrink-0" />
          <span className="truncate">{t('dashboard', 'quickNewGroup')}</span>
        </button>

        <button
          onClick={() => navigate('/app/groups/join')}
          className="p-3.5 rounded-xl bg-[#201c19] hover:bg-[#28231f] border border-[#302923] text-left transition-colors flex items-center gap-2.5 text-xs font-semibold text-[#F6F0E7]"
        >
          <UserPlus className="w-4 h-4 text-[#B5AA9C] shrink-0" />
          <span className="truncate">{t('dashboard', 'quickJoinGroup')}</span>
        </button>

        <button
          onClick={() => navigate('/app/challenges/new')}
          className="p-3.5 rounded-xl bg-[#201c19] hover:bg-[#28231f] border border-[#302923] text-left transition-colors flex items-center gap-2.5 text-xs font-semibold text-[#F6F0E7]"
        >
          <Trophy className="w-4 h-4 text-[#FF6538] shrink-0" />
          <span className="truncate">{t('dashboard', 'quickNewChallenge')}</span>
        </button>
      </div>

      {/* 4. Active Challenges Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#302923] pb-3">
          <h2 className="text-lg font-bold text-[#F6F0E7] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#FF6538]" />
            <span>{t('dashboard', 'activeChallengesTitle')}</span>
          </h2>
          <button
            onClick={() => navigate('/app/challenges')}
            className="text-xs font-semibold text-[#FF6538] hover:underline flex items-center gap-1"
          >
            <span>Voir tous les défis</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeChallenges.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-[#1a1715] border border-[#302923] space-y-2">
            <p className="text-xs text-[#B5AA9C]">{t('dashboard', 'noActiveChallenges')}</p>
            <button
              onClick={() => navigate('/app/challenges/new')}
              className="text-xs font-semibold text-[#FF6538] hover:underline"
            >
              Lancer le premier défi de l’escouade
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeChallenges.map((chal) => {
              const group = groups.find((g) => g.id === chal.groupId);
              const myPart = participants.find(
                (p) => p.challengeId === chal.id && p.uid === currentUser.uid
              );

              return (
                <div
                  key={chal.id}
                  onClick={() => navigate(`/app/challenges/${chal.id}`)}
                  className="p-5 rounded-xl bg-[#1e1a17] hover:bg-[#24201c] border border-[#302923] cursor-pointer transition-colors space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-[#B5AA9C]">
                    <span className="font-semibold text-[#F6F0E7] truncate max-w-[180px]">
                      {group?.name || 'Groupe'}
                    </span>
                    <span className="text-[#FF6538] font-bold">+{chal.xpReward} XP</span>
                  </div>

                  <h3 className="text-sm font-bold text-[#F6F0E7] line-clamp-1">
                    {chal.title}
                  </h3>

                  <p className="text-xs text-[#B5AA9C] line-clamp-2 leading-relaxed">
                    {chal.description}
                  </p>

                  <div className="pt-2 border-t border-[#302923]/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#B5AA9C]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{chal.dueAt ? new Date(chal.dueAt).toLocaleDateString() : 'Pas de date limite'}</span>
                    </div>

                    <StatusBadge
                      status={myPart?.status || 'not_started'}
                      language={language}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Recent News Matching Interests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#302923] pb-3">
          <h2 className="text-lg font-bold text-[#F6F0E7] flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#FF6538]" />
            <span>{t('dashboard', 'recentNewsTitle')}</span>
          </h2>
          <button
            onClick={() => navigate('/app/news')}
            className="text-xs font-semibold text-[#FF6538] hover:underline flex items-center gap-1"
          >
            <span>Ouvrir le radar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {matchingNews.map((item) => {
            const cat = categories.find((c) => c.id === item.categoryId);
            return (
              <div
                key={item.id}
                onClick={() => navigate(`/app/news/${item.id}`)}
                className="p-4 rounded-xl bg-[#1b1715] hover:bg-[#221e1a] border border-[#302923] cursor-pointer transition-colors space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] text-[#B5AA9C]">
                    <span className="text-[#FF6538] font-medium">{cat?.name[language]}</span>
                    <span>·</span>
                    <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xs font-bold text-[#F6F0E7] line-clamp-2 leading-snug">
                    {item.title[language]}
                  </h3>
                </div>

                <div className="pt-2 text-[11px] text-[#B5AA9C] flex items-center justify-between border-t border-[#302923]/40">
                  <span>{item.sourceName}</span>
                  <span className="text-[#FF6538]">Lire</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
