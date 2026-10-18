import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, ExternalLink, Bookmark, BookmarkCheck, Calendar, Tag } from 'lucide-react';

interface NewsDetailViewProps {
  slugOrId: string;
  navigate: (route: string) => void;
  isAppView?: boolean;
}

export const NewsDetailView: React.FC<NewsDetailViewProps> = ({ slugOrId, navigate, isAppView = false }) => {
  const { news, categories, language, t, currentUser, savedNewsIds, toggleSaveNews } = useApp();

  // Find by slug or id
  const article = news.find((n) => n.slug === slugOrId || n.id === slugOrId);

  if (!article || article.status !== 'published') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-[#F6F0E7]">Cette actualité n’est plus disponible</h2>
        <p className="text-xs text-[#B5AA9C]">L’article a peut-être été déplacé ou archivé.</p>
        <button
          onClick={() => navigate(isAppView ? '/app/news' : '/news')}
          className="text-xs font-semibold text-[#FF6538] hover:underline inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('radar', 'backToRadar')}</span>
        </button>
      </div>
    );
  }

  const category = categories.find((c) => c.id === article.categoryId);
  const isSaved = savedNewsIds.includes(article.id);
  const relatedNews = news
    .filter((n) => n.id !== article.id && n.categoryId === article.categoryId && n.status === 'published')
    .slice(0, 2);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Back button & Action */}
      <div className="flex items-center justify-between border-b border-[#302923] pb-4">
        <button
          onClick={() => navigate(isAppView ? '/app/news' : '/news')}
          className="text-xs font-medium text-[#B5AA9C] hover:text-[#F6F0E7] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF6538]" />
          <span>{t('radar', 'backToRadar')}</span>
        </button>

        {currentUser && (
          <button
            onClick={() => toggleSaveNews(article.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#241f1c] border border-[#302923] text-xs font-semibold text-[#F6F0E7] hover:border-[#FF6538] transition-colors"
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-[#FF6538]" />
                <span>{t('radar', 'savedAction')}</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-[#B5AA9C]" />
                <span>{t('radar', 'saveAction')}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        {/* Unboxed Metadata */}
        <div className="flex items-center gap-3 text-xs text-[#B5AA9C]">
          <span className="text-[#FF6538] font-bold">
            {category?.name[language] || article.categoryId}
          </span>
          <span aria-hidden="true">·</span>
          <span>{t('radar', 'publishedOn')} {new Date(article.publishedAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F6F0E7] tracking-tight leading-tight">
          {article.title[language]}
        </h1>

        <p className="text-sm sm:text-base text-[#B5AA9C] font-medium leading-relaxed bg-[#1d1917] p-4 rounded-xl border border-[#302923]">
          {article.summary[language]}
        </p>
      </div>

      {/* Featured Media */}
      {article.imagePath && (
        <div className="rounded-2xl overflow-hidden border border-[#302923] max-h-96 w-full bg-[#12100E]">
          <img
            src={article.imagePath}
            alt={article.title[language]}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* Full Content */}
      <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[#F6F0E7] leading-relaxed whitespace-pre-line space-y-4">
        {article.body[language]}
      </div>

      {/* Official Source Link Card */}
      <div className="p-5 rounded-xl bg-[#1e1a17] border border-[#302923] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#B5AA9C] block">Source d’information officielle :</span>
          <span className="text-sm font-bold text-[#F6F0E7]">{article.sourceName}</span>
        </div>
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#F6F0E7] bg-[#302923] hover:bg-[#3d342c] rounded-lg transition-colors border border-[#302923]"
        >
          <span>{t('radar', 'readSource')}</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#FF6538]" />
        </a>
      </div>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <div className="border-t border-[#302923] pt-8 space-y-4">
          <h3 className="text-base font-extrabold text-[#F6F0E7]">
            {t('radar', 'relatedNews')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedNews.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate(isAppView ? `/app/news/${rel.id}` : `/news/${rel.slug}`)}
                className="p-4 rounded-xl bg-[#1b1715] hover:bg-[#221e1a] border border-[#302923] cursor-pointer transition-colors space-y-1.5"
              >
                <span className="text-[11px] text-[#B5AA9C]">
                  {new Date(rel.publishedAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-[#F6F0E7] hover:text-[#FF6538] transition-colors leading-snug">
                  {rel.title[language]}
                </h4>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
