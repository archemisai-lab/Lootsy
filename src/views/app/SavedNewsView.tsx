import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bookmark, BookmarkX, ArrowLeft, ChevronRight } from 'lucide-react';

interface SavedNewsViewProps {
  navigate: (route: string) => void;
}

export const SavedNewsView: React.FC<SavedNewsViewProps> = ({ navigate }) => {
  const { news, savedNewsIds, toggleSaveNews, categories, language } = useApp();

  const savedArticles = news.filter((n) => savedNewsIds.includes(n.id));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <button
        onClick={() => navigate('/app/news')}
        className="text-xs text-[#B5AA9C] hover:text-[#F6F0E7] inline-flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-[#FF6538]" />
        <span>Retour au radar</span>
      </button>

      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-[#F6F0E7]">
          Actualités enregistrées
        </h1>
        <p className="text-xs text-[#B5AA9C]">
          Vos articles et mises à jour Fortnite épinglés pour consultation ultérieure.
        </p>
      </div>

      {savedArticles.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#1e1a17] border border-[#302923] space-y-3">
          <Bookmark className="w-8 h-8 text-[#B5AA9C] mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-[#F6F0E7]">Aucune actualité enregistrée</h3>
          <p className="text-xs text-[#B5AA9C] max-w-sm mx-auto">
            Sur le radar Fortnite, cliquez sur l’icône de signet pour garder un article sous la main.
          </p>
          <button
            onClick={() => navigate('/app/news')}
            className="text-xs font-semibold text-[#FF6538] hover:underline pt-2 block mx-auto"
          >
            Explorer le radar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedArticles.map((item) => {
            const cat = categories.find((c) => c.id === item.categoryId);
            return (
              <div
                key={item.id}
                className="p-5 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#B5AA9C]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#FF6538] font-semibold">{cat?.name[language]}</span>
                      <span>·</span>
                      <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                    </div>

                    <button
                      onClick={() => toggleSaveNews(item.id)}
                      className="text-[#B5AA9C] hover:text-rose-400 transition-colors p-1"
                      title="Retirer des enregistrements"
                    >
                      <BookmarkX className="w-4 h-4" />
                    </button>
                  </div>

                  <h3
                    onClick={() => navigate(`/app/news/${item.id}`)}
                    className="text-sm font-bold text-[#F6F0E7] hover:text-[#FF6538] cursor-pointer transition-colors leading-snug"
                  >
                    {item.title[language]}
                  </h3>

                  <p className="text-xs text-[#B5AA9C] line-clamp-2 leading-relaxed">
                    {item.summary[language]}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#302923]/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#B5AA9C]">Source : {item.sourceName}</span>
                  <button
                    onClick={() => navigate(`/app/news/${item.id}`)}
                    className="text-[#FF6538] font-semibold hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>Consulter</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
