import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bookmark, BookmarkCheck, ExternalLink, ArrowUpDown } from 'lucide-react';

interface RadarViewProps {
  navigate: (route: string) => void;
  isAppView?: boolean;
}

export const RadarView: React.FC<RadarViewProps> = ({ navigate, isAppView = false }) => {
  const { news, categories, language, t, currentUser, savedNewsIds, toggleSaveNews } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filter published news only
  const filtered = news
    .filter((n) => n.status === 'published')
    .filter((n) => {
      if (selectedCategory === 'all') return true;
      return n.categoryId === selectedCategory;
    })
    .filter((n) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const title = (n.title[language] || '').toLowerCase();
      const summary = (n.summary[language] || '').toLowerCase();
      return title.includes(q) || summary.includes(q);
    })
    .sort((a, b) => {
      const timeA = new Date(a.publishedAt).getTime();
      const timeB = new Date(b.publishedAt).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F6F0E7]">
          {t('radar', 'title')}
        </h1>
        <p className="text-sm text-[#B5AA9C]">
          {t('radar', 'subtitle')}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#302923] pb-6">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#B5AA9C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('radar', 'searchPlaceholder')}
            className="w-full bg-[#1c1816] border border-[#302923] rounded-lg pl-9 pr-4 py-2 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none transition-colors"
          />
        </div>

        {/* Sort & Quick Bookmarks Link */}
        <div className="flex items-center gap-3">
          {currentUser && isAppView && (
            <button
              onClick={() => navigate('/app/saved')}
              className="text-xs font-medium text-[#B5AA9C] hover:text-[#F6F0E7] flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#25201c] border border-[#302923]"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#FF6538]" />
              <span>Actualités enregistrées ({savedNewsIds.length})</span>
            </button>
          )}

          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="text-xs text-[#B5AA9C] hover:text-[#F6F0E7] flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#1c1816] border border-[#302923]"
            title="Inverser le tri par date"
          >
            <ArrowUpDown className="w-3 h-3 text-[#FF6538]" />
            <span>{sortOrder === 'desc' ? 'Plus récentes' : 'Plus anciennes'}</span>
          </button>
        </div>
      </div>

      {/* Categories Horizontal Tabs (Interactive Filter Controls) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-[#FF6538] text-white'
              : 'bg-[#201c19] text-[#B5AA9C] hover:text-[#F6F0E7] border border-[#302923]'
          }`}
        >
          {t('radar', 'filterAll')}
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-[#FF6538] text-white'
                  : 'bg-[#201c19] text-[#B5AA9C] hover:text-[#F6F0E7] border border-[#302923]'
              }`}
            >
              {cat.name[language]}
            </button>
          );
        })}
      </div>

      {/* Articles Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#1e1a17] border border-[#302923] space-y-3">
          <p className="text-sm text-[#F6F0E7] font-semibold">{t('radar', 'noNewsFound')}</p>
          <p className="text-xs text-[#B5AA9C]">Essayez de modifier votre filtre ou terme de recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const cat = categories.find((c) => c.id === item.categoryId);
            const isSaved = savedNewsIds.includes(item.id);

            return (
              <article
                key={item.id}
                className="group bg-[#1e1a17] hover:bg-[#25201c] border border-[#302923] rounded-xl overflow-hidden transition-colors flex flex-col justify-between"
              >
                {/* Media Image */}
                {item.imagePath && (
                  <div
                    onClick={() => navigate(isAppView ? `/app/news/${item.id}` : `/news/${item.slug}`)}
                    className="h-44 w-full bg-[#171513] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.imagePath}
                      alt={item.title[language]}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    {/* Unboxed Metadata (Zero-Pill Rule) */}
                    <div className="flex items-center justify-between text-xs text-[#B5AA9C]">
                      <div className="flex items-center gap-2">
                        <span className="text-[#F6F0E7] font-medium">{cat?.name[language] || item.categoryId}</span>
                        <span aria-hidden="true">·</span>
                        <span>{new Date(item.publishedAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</span>
                      </div>

                      {currentUser && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveNews(item.id);
                          }}
                          className="p-1 rounded text-[#B5AA9C] hover:text-[#FF6538] transition-colors"
                          title={isSaved ? t('radar', 'savedAction') : t('radar', 'saveAction')}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4 text-[#FF6538]" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Title */}
                    <h2
                      onClick={() => navigate(isAppView ? `/app/news/${item.id}` : `/news/${item.slug}`)}
                      className="text-base font-bold text-[#F6F0E7] group-hover:text-[#FF6538] cursor-pointer transition-colors leading-snug"
                    >
                      {item.title[language]}
                    </h2>

                    {/* Summary */}
                    <p className="text-xs text-[#B5AA9C] line-clamp-3 leading-relaxed">
                      {item.summary[language]}
                    </p>
                  </div>

                  {/* Footer Source info */}
                  <div className="pt-3 border-t border-[#302923]/60 flex items-center justify-between text-[11px] text-[#B5AA9C]">
                    <span>Source : {item.sourceName}</span>
                    <button
                      onClick={() => navigate(isAppView ? `/app/news/${item.id}` : `/news/${item.slug}`)}
                      className="text-[#FF6538] font-semibold hover:underline"
                    >
                      Détails
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
