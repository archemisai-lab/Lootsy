import React from 'react';
import { useApp } from '../../context/AppContext';
import { LootsyLogo } from '../../components/LootsyLogo';
import {
  ShieldCheck,
  Trophy,
  Flame,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface HomeViewProps {
  navigate: (route: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ navigate }) => {
  const { t, news, categories, language, currentUser } = useApp();

  // Published news sorted by date desc
  const publishedNews = news
    .filter((n) => n.status === 'published')
    .slice(0, 3);

  return (
    <div className="space-y-24 py-8 md:py-16">
      {/* 1. Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
        {/* Subtle Game Scope Kicker */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#FF6538] uppercase tracking-wider">
          <span>{t('home', 'badgeGame')}</span>
        </div>

        {/* Hero Title & Value Prop */}
        <h1 className="text-hero text-[#F6F0E7] max-w-4xl mx-auto text-balance">
          {t('home', 'heroTitle')}
        </h1>

        <p className="text-base sm:text-lg text-[#B5AA9C] max-w-2xl mx-auto leading-relaxed font-normal">
          {t('home', 'heroSubtitle')}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => navigate(currentUser ? '/app' : '/signup')}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-white bg-[#FF6538] hover:bg-[#ff7a53] active:bg-[#e0542a] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#FF6538]/10"
          >
            <span>{currentUser ? t('nav', 'goToDashboard') : t('home', 'ctaJoin')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/news')}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-[#F6F0E7] bg-[#302923] hover:bg-[#3d342c] border border-[#302923] rounded-lg transition-colors"
          >
            {t('home', 'ctaDiscoverRadar')}
          </button>
        </div>
      </section>

      {/* 2. Three Core Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="border-t border-[#302923] pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Pillar 1 */}
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#302923] flex items-center justify-center text-[#FF6538]">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-[#F6F0E7]">
                {t('home', 'pillar1Title')}
              </h3>
              <p className="text-sm text-[#B5AA9C] leading-relaxed font-normal">
                {t('home', 'pillar1Desc')}
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#302923] flex items-center justify-center text-[#D8E5B0]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-[#F6F0E7]">
                {t('home', 'pillar2Title')}
              </h3>
              <p className="text-sm text-[#B5AA9C] leading-relaxed font-normal">
                {t('home', 'pillar2Desc')}
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#302923] flex items-center justify-center text-[#F6F0E7]">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-[#F6F0E7]">
                {t('home', 'pillar3Title')}
              </h3>
              <p className="text-sm text-[#B5AA9C] leading-relaxed font-normal">
                {t('home', 'pillar3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Real Radar Preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#302923] pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F6F0E7] tracking-tight">
              {t('home', 'radarPreviewTitle')}
            </h2>
            <p className="text-sm text-[#B5AA9C] mt-1 font-normal">
              {t('home', 'radarPreviewSubtitle')}
            </p>
          </div>
          <button
            onClick={() => navigate('/news')}
            className="text-xs font-semibold text-[#FF6538] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>{t('home', 'seeAllNews')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {publishedNews.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#B5AA9C] bg-[#1c1816] rounded-xl border border-[#302923]">
            Aucune actualité publiée pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {publishedNews.map((item) => {
              const cat = categories.find((c) => c.id === item.categoryId);
              return (
                <article
                  key={item.id}
                  onClick={() => navigate(`/news/${item.slug}`)}
                  className="group bg-[#1e1a17] hover:bg-[#25201c] border border-[#302923] rounded-xl overflow-hidden cursor-pointer transition-colors flex flex-col justify-between"
                >
                  {item.imagePath && (
                    <div className="h-44 w-full bg-[#171513] overflow-hidden">
                      <img
                        src={item.imagePath}
                        alt={item.title[language]}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      {/* Zero-Pill Unboxed Metadata */}
                      <div className="flex items-center gap-2 text-xs text-[#B5AA9C]">
                        <span>{cat?.name[language] || item.categoryId}</span>
                        <span aria-hidden="true">·</span>
                        <span>{new Date(item.publishedAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</span>
                      </div>

                      <h3 className="text-base font-bold text-[#F6F0E7] group-hover:text-[#FF6538] transition-colors leading-snug">
                        {item.title[language]}
                      </h3>

                      <p className="text-xs text-[#B5AA9C] line-clamp-3 leading-relaxed">
                        {item.summary[language]}
                      </p>
                    </div>

                    <div className="pt-2 text-[11px] text-[#B5AA9C] flex items-center justify-between border-t border-[#302923]/60">
                      <span>Source : {item.sourceName}</span>
                      <span className="text-[#FF6538] font-medium group-hover:underline flex items-center gap-0.5">
                        Lire l’article
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. How It Works (7 Steps Overview) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F6F0E7] tracking-tight">
            {t('home', 'howItWorksTitle')}
          </h2>
          <p className="text-sm text-[#B5AA9C] font-normal">
            Un parcours simple et fluide pensé pour les vraies sessions de jeu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-xl bg-[#1c1816] border border-[#302923] space-y-2">
            <span className="text-base font-display text-[#FF6538] tracking-wider">01</span>
            <h4 className="text-sm font-extrabold text-[#F6F0E7]">{t('home', 'step1')}</h4>
            <p className="text-xs text-[#B5AA9C] leading-relaxed font-normal">{t('home', 'step1Desc')}</p>
          </div>

          <div className="p-5 rounded-xl bg-[#1c1816] border border-[#302923] space-y-2">
            <span className="text-base font-display text-[#FF6538] tracking-wider">02</span>
            <h4 className="text-sm font-extrabold text-[#F6F0E7]">{t('home', 'step2')}</h4>
            <p className="text-xs text-[#B5AA9C] leading-relaxed font-normal">{t('home', 'step2Desc')}</p>
          </div>

          <div className="p-5 rounded-xl bg-[#1c1816] border border-[#302923] space-y-2">
            <span className="text-base font-display text-[#FF6538] tracking-wider">03</span>
            <h4 className="text-sm font-extrabold text-[#F6F0E7]">{t('home', 'step3')}</h4>
            <p className="text-xs text-[#B5AA9C] leading-relaxed font-normal">{t('home', 'step3Desc')}</p>
          </div>

          <div className="p-5 rounded-xl bg-[#1c1816] border border-[#302923] space-y-2">
            <span className="text-base font-display text-[#D8E5B0] tracking-wider">04</span>
            <h4 className="text-sm font-extrabold text-[#F6F0E7]">{t('home', 'step4')}</h4>
            <p className="text-xs text-[#B5AA9C] leading-relaxed font-normal">{t('home', 'step4Desc')}</p>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/how-it-works')}
            className="text-xs font-bold text-[#FF6538] hover:underline inline-flex items-center gap-1"
          >
            <span>Découvrir le guide complet en 7 étapes</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 5. Privacy Pledge */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-2xl bg-[#181513] border border-[#302923] text-center space-y-4">
          <ShieldCheck className="w-8 h-8 text-[#D8E5B0] mx-auto" />
          <h3 className="text-xl font-extrabold text-[#F6F0E7] tracking-tight">
            {t('home', 'privacyPledgeTitle')}
          </h3>
          <p className="text-sm text-[#B5AA9C] leading-relaxed max-w-xl mx-auto font-normal">
            {t('home', 'privacyPledgeDesc')}
          </p>
        </div>
      </section>

      {/* 6. Final Call to Action */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F6F0E7] tracking-tight">
          Prêt à défier votre escouade ?
        </h2>
        <p className="text-sm text-[#B5AA9C] max-w-md mx-auto font-normal">
          Inscrivez-vous en quelques instants et organisez vos parties sans pub, sans scraping automatisé et sans classement factice.
        </p>
        <button
          onClick={() => navigate(currentUser ? '/app' : '/signup')}
          className="px-8 py-3.5 text-sm font-bold text-white bg-[#FF6538] hover:bg-[#ff7a53] rounded-lg transition-colors shadow-lg shadow-[#FF6538]/10"
        >
          {currentUser ? t('nav', 'goToDashboard') : t('nav', 'joinLootsy')}
        </button>
      </section>
    </div>
  );
};
