import React from 'react';
import { useApp } from '../../context/AppContext';
import { Flame, Users, Trophy, Paperclip, Bell, Smartphone, ArrowRight, Shield } from 'lucide-react';

interface FeaturesViewProps {
  navigate: (route: string) => void;
}

export const FeaturesView: React.FC<FeaturesViewProps> = ({ navigate }) => {
  const { t, currentUser } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F6F0E7]">
          {t('featuresPage', 'title')}
        </h1>
        <p className="text-sm sm:text-base text-[#B5AA9C] leading-relaxed">
          {t('featuresPage', 'subtitle')}
        </p>
      </div>

      {/* Scope banner */}
      <div className="p-4 rounded-xl bg-[#201c19] border border-[#302923] text-xs text-[#B5AA9C] flex items-center gap-3">
        <Shield className="w-4 h-4 text-[#FF6538] shrink-0" />
        <span>{t('featuresPage', 'futureScopeNotice')}</span>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Radar */}
        <div className="p-6 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#302923] flex items-center justify-center text-[#FF6538]">
            <Flame className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#F6F0E7]">
            {t('featuresPage', 'radarTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-[#B5AA9C] leading-relaxed">
            {t('featuresPage', 'radarDesc')}
          </p>
        </div>

        {/* Groups */}
        <div className="p-6 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#302923] flex items-center justify-center text-[#D8E5B0]">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#F6F0E7]">
            {t('featuresPage', 'groupsTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-[#B5AA9C] leading-relaxed">
            {t('featuresPage', 'groupsDesc')}
          </p>
        </div>

        {/* Challenges */}
        <div className="p-6 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#302923] flex items-center justify-center text-[#F6F0E7]">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#F6F0E7]">
            {t('featuresPage', 'challengesTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-[#B5AA9C] leading-relaxed">
            {t('featuresPage', 'challengesDesc')}
          </p>
        </div>

        {/* Proofs */}
        <div className="p-6 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#302923] flex items-center justify-center text-[#FF6538]">
            <Paperclip className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#F6F0E7]">
            {t('featuresPage', 'proofsTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-[#B5AA9C] leading-relaxed">
            {t('featuresPage', 'proofsDesc')}
          </p>
        </div>

        {/* Notifications */}
        <div className="p-6 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#302923] flex items-center justify-center text-[#D8E5B0]">
            <Bell className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#F6F0E7]">
            {t('featuresPage', 'notificationsTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-[#B5AA9C] leading-relaxed">
            {t('featuresPage', 'notificationsDesc')}
          </p>
        </div>

        {/* PWA */}
        <div className="p-6 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#302923] flex items-center justify-center text-[#F6F0E7]">
            <Smartphone className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#F6F0E7]">
            {t('featuresPage', 'pwaTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-[#B5AA9C] leading-relaxed">
            {t('featuresPage', 'pwaDesc')}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-8">
        <button
          onClick={() => navigate(currentUser ? '/app' : '/signup')}
          className="px-6 py-3 text-xs sm:text-sm font-bold text-white bg-[#FF6538] hover:bg-[#ff7a53] rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <span>{currentUser ? t('nav', 'goToDashboard') : t('nav', 'joinLootsy')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
