import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Users, Plus, UserPlus, ChevronRight, Shield } from 'lucide-react';

interface GroupsListViewProps {
  navigate: (route: string) => void;
}

export const GroupsListView: React.FC<GroupsListViewProps> = ({ navigate }) => {
  const { currentUser, groups, challenges, t, language } = useApp();

  if (!currentUser) return null;

  // Filter groups where user is member
  const myGroups = groups.filter((g) => g.memberUids.includes(currentUser.uid) && g.status === 'active');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#302923] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F6F0E7] tracking-tight">
            {t('groups', 'title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#B5AA9C] mt-1 font-normal">
            {t('groups', 'subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app/groups/join')}
            className="px-3.5 py-2 rounded-lg bg-[#25201c] hover:bg-[#2e2823] border border-[#302923] text-xs font-bold text-[#F6F0E7] flex items-center gap-1.5 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#B5AA9C]" />
            <span>{t('groups', 'joinGroup')}</span>
          </button>

          <button
            onClick={() => navigate('/app/groups/new')}
            className="px-4 py-2 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('groups', 'createGroup')}</span>
          </button>
        </div>
      </div>

      {/* Groups Grid */}
      {myGroups.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#1e1a17] border border-[#302923] space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-xl bg-[#302923] flex items-center justify-center text-[#FF6538] mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#F6F0E7]">
            {t('groups', 'noGroups')}
          </h3>
          <p className="text-xs text-[#B5AA9C] leading-relaxed">
            Rejoignez l’escouade d’un ami avec son code d’invitation ou créez votre propre groupe privé dès maintenant.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/app/groups/join')}
              className="px-3.5 py-2 rounded-lg bg-[#302923] text-[#F6F0E7] text-xs font-semibold hover:bg-[#3d342c]"
            >
              {t('groups', 'joinGroup')}
            </button>
            <button
              onClick={() => navigate('/app/groups/new')}
              className="px-4 py-2 rounded-lg bg-[#FF6538] text-white text-xs font-bold hover:bg-[#ff7a53]"
            >
              {t('groups', 'createGroup')}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myGroups.map((group) => {
            const isOwner = group.ownerUid === currentUser.uid;
            const activeChallengesCount = challenges.filter(
              (c) => c.groupId === group.id && c.status === 'active'
            ).length;

            return (
              <div
                key={group.id}
                onClick={() => navigate(`/app/groups/${group.id}`)}
                className="group p-6 rounded-xl bg-[#1e1a17] hover:bg-[#25201c] border border-[#302923] cursor-pointer transition-colors space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    {/* Squad initial badge */}
                    <div className="w-12 h-12 rounded-xl bg-[#302923] border border-[#FF6538]/30 flex items-center justify-center text-lg font-display text-[#F6F0E7] tracking-wider">
                      {group.name.slice(0, 2).toUpperCase()}
                    </div>

                    <StatusBadge
                      status={isOwner ? 'owner' : 'member'}
                      language={language}
                    />
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-[#F6F0E7] group-hover:text-[#FF6538] transition-colors leading-snug">
                      {group.name}
                    </h3>
                    {group.description && (
                      <p className="text-xs text-[#B5AA9C] line-clamp-2 mt-1 leading-relaxed">
                        {group.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#302923]/60 flex items-center justify-between text-xs text-[#B5AA9C]">
                  <div className="flex items-center gap-3">
                    <span>{group.memberCount} {t('groups', 'membersCount')}</span>
                    <span>·</span>
                    <span>{activeChallengesCount} {t('groups', 'activeChallengesCount')}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#B5AA9C] group-hover:text-[#FF6538] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
