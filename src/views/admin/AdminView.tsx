import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GameUpdate, NewsStatus, UserProfile } from '../../types';
import {
  Shield,
  FileText,
  Send,
  Users,
  Flag,
  History,
  Plus,
  Trash2,
  Archive,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface AdminViewProps {
  navigate: (route: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ navigate }) => {
  const {
    currentUser,
    news,
    createNews,
    updateNews,
    deleteNews,
    categories,
    users,
    toggleUserSuspension,
    changeUserRole,
    sendAdminBroadcast,
    reports,
    resolveReport,
    auditLogs,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'news' | 'broadcast' | 'users' | 'reports' | 'audit'>('overview');

  // News creation / edit state
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newsTitleFr, setNewsTitleFr] = useState('');
  const [newsTitleEn, setNewsTitleEn] = useState('');
  const [newsSummaryFr, setNewsSummaryFr] = useState('');
  const [newsSummaryEn, setNewsSummaryEn] = useState('');
  const [newsBodyFr, setNewsBodyFr] = useState('');
  const [newsBodyEn, setNewsBodyEn] = useState('');
  const [newsCategory, setNewsCategory] = useState(categories[0]?.id || 'seasons');
  const [newsSourceUrl, setNewsSourceUrl] = useState('https://www.fortnite.com/news');
  const [newsSourceName, setNewsSourceName] = useState('Epic Games Official');
  const [newsStatus, setNewsStatus] = useState<NewsStatus>('published');

  // Broadcast state
  const [broadcastTitleFr, setBroadcastTitleFr] = useState('');
  const [broadcastTitleEn, setBroadcastTitleEn] = useState('');
  const [broadcastBodyFr, setBroadcastBodyFr] = useState('');
  const [broadcastBodyEn, setBroadcastBodyEn] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Security guard
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Shield className="w-12 h-12 text-[#FF6538] mx-auto" />
        <h2 className="text-xl font-bold text-[#F6F0E7]">Accès restreint</h2>
        <p className="text-xs text-[#B5AA9C]">
          Cette zone est réservée aux administrateurs de la plateforme Lootsy.
        </p>
        <button
          onClick={() => navigate('/app')}
          className="text-xs font-semibold text-[#FF6538] hover:underline"
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  // Real computed metrics
  const publishedCount = news.filter((n) => n.status === 'published').length;
  const draftCount = news.filter((n) => n.status === 'draft').length;
  const openReportsCount = reports.filter((r) => r.status === 'new' || r.status === 'in_progress').length;
  const activeGamersCount = users.filter((u) => u.accountStatus === 'active').length;

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitleFr.trim() || !newsBodyFr.trim()) return;

    const slug = newsTitleFr
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    createNews({
      gameId: 'fortnite',
      slug,
      categoryId: newsCategory,
      title: { fr: newsTitleFr, en: newsTitleEn || newsTitleFr },
      summary: { fr: newsSummaryFr, en: newsSummaryEn || newsSummaryFr },
      body: { fr: newsBodyFr, en: newsBodyEn || newsBodyFr },
      sourceUrl: newsSourceUrl,
      sourceName: newsSourceName,
      status: newsStatus,
      publishedAt: new Date().toISOString(),
      languageAvailability: ['fr', 'en'],
      imagePath: '/src/assets/images/fn_underworld_fortress_1792263045549.jpg',
    });

    setShowNewsModal(false);
    setNewsTitleFr('');
    setNewsTitleEn('');
    setNewsSummaryFr('');
    setNewsSummaryEn('');
    setNewsBodyFr('');
    setNewsBodyEn('');
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitleFr.trim() || !broadcastBodyFr.trim()) return;

    sendAdminBroadcast(
      broadcastTitleFr,
      broadcastTitleEn || broadcastTitleFr,
      broadcastBodyFr,
      broadcastBodyEn || broadcastBodyFr,
      '/app'
    );

    setBroadcastSuccess(true);
    setBroadcastTitleFr('');
    setBroadcastTitleEn('');
    setBroadcastBodyFr('');
    setBroadcastBodyEn('');
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#302923] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#FF6538]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F6F0E7] tracking-tight">
              {t('admin', 'title')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#B5AA9C] font-normal">
            {t('admin', 'subtitle')}
          </p>
        </div>

        <button
          onClick={() => setShowNewsModal(true)}
          className="px-4 py-2 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Rédiger une actualité</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#302923] pb-1 overflow-x-auto">
        {[
          { id: 'overview', label: t('admin', 'tabDashboard'), icon: Shield },
          { id: 'news', label: `${t('admin', 'tabNews')} (${news.length})`, icon: FileText },
          { id: 'broadcast', label: t('admin', 'tabBroadcast'), icon: Send },
          { id: 'users', label: `${t('admin', 'tabUsers')} (${users.length})`, icon: Users },
          { id: 'reports', label: `${t('admin', 'tabReports')} (${reports.length})`, icon: Flag },
          { id: 'audit', label: `${t('admin', 'tabAudit')} (${auditLogs.length})`, icon: History },
        ].map((item) => {
          const Icon = item.icon;
          const isCurrent = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`px-3.5 py-2 text-xs font-bold transition-colors border-b-2 whitespace-nowrap inline-flex items-center gap-2 ${
                isCurrent
                  ? 'border-[#FF6538] text-[#FF6538]'
                  : 'border-transparent text-[#B5AA9C] hover:text-[#F6F0E7]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Overview / Metrics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-1">
              <span className="text-xs text-[#B5AA9C] block font-medium">{t('admin', 'publishedNewsCount')}</span>
              <span className="text-3xl font-display text-[#D8E5B0] tracking-wider tabular-nums block mt-1">{publishedCount}</span>
            </div>

            <div className="p-5 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-1">
              <span className="text-xs text-[#B5AA9C] block font-medium">{t('admin', 'draftNewsCount')}</span>
              <span className="text-3xl font-display text-[#F6F0E7] tracking-wider tabular-nums block mt-1">{draftCount}</span>
            </div>

            <div className="p-5 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-1">
              <span className="text-xs text-[#B5AA9C] block font-medium">{t('admin', 'openReportsCount')}</span>
              <span className="text-3xl font-display text-amber-400 tracking-wider tabular-nums block mt-1">{openReportsCount}</span>
            </div>

            <div className="p-5 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-1">
              <span className="text-xs text-[#B5AA9C] block font-medium">{t('admin', 'activeUsersCount')}</span>
              <span className="text-3xl font-display text-[#FF6538] tracking-wider tabular-nums block mt-1">{activeGamersCount}</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-3">
            <h3 className="text-sm font-bold text-[#F6F0E7]">Directives de gestion des actualités</h3>
            <p className="text-xs text-[#B5AA9C] leading-relaxed">
              Toutes les actualités du radar Fortnite doivent impérativement comporter une source vérifiée (Epic Games Newsroom, blog officiel ou compte d’état de service). Aucune actualité automatisée ou rumeur non confirmée ne doit être publiée.
            </p>
          </div>
        </div>
      )}

      {/* Tab: News Management */}
      {activeTab === 'news' && (
        <div className="space-y-4">
          <div className="divide-y divide-[#302923] border border-[#302923] rounded-xl bg-[#1e1a17] overflow-hidden">
            {news.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-[#FF6538] uppercase text-[10px]">
                      {item.categoryId}
                    </span>
                    <span>·</span>
                    <span className="text-[#B5AA9C]">{new Date(item.publishedAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <span className="font-semibold text-[#F6F0E7]">{item.status}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#F6F0E7]">
                    {item.title.fr}
                  </h4>
                  <p className="text-xs text-[#B5AA9C] line-clamp-1">
                    {item.summary.fr}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'published' ? (
                    <button
                      onClick={() => updateNews(item.id, { status: 'archived' })}
                      className="px-2.5 py-1.5 rounded-lg bg-[#25201c] hover:bg-[#302923] text-xs text-[#B5AA9C] hover:text-[#F6F0E7]"
                    >
                      Archiver
                    </button>
                  ) : (
                    <button
                      onClick={() => updateNews(item.id, { status: 'published' })}
                      className="px-2.5 py-1.5 rounded-lg bg-[#25201c] hover:bg-[#302923] text-xs text-[#D8E5B0]"
                    >
                      Publier
                    </button>
                  )}

                  <button
                    onClick={() => deleteNews(item.id)}
                    className="p-1.5 rounded-lg bg-[#25201c] hover:bg-rose-950/40 text-[#B5AA9C] hover:text-rose-400"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Global Broadcast */}
      {activeTab === 'broadcast' && (
        <form onSubmit={handleBroadcast} className="p-6 sm:p-8 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-5 max-w-2xl">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#F6F0E7]">{t('admin', 'broadcastTitle')}</h3>
            <p className="text-xs text-[#B5AA9C]">{t('admin', 'broadcastWarning')}</p>
          </div>

          {broadcastSuccess && (
            <div className="p-3.5 rounded-lg bg-[#1e2417] border border-[#D8E5B0]/40 text-xs text-[#D8E5B0] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Annonce globale diffusée auprès de l’ensemble des joueurs.</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#F6F0E7]">
              Titre de l’annonce (FR) <span className="text-[#FF6538]">*</span>
            </label>
            <input
              type="text"
              required
              value={broadcastTitleFr}
              onChange={(e) => setBroadcastTitleFr(e.target.value)}
              placeholder="Ex: Tournoi spécial ce samedi à 19h"
              className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#F6F0E7]">
              Message détaillé (FR) <span className="text-[#FF6538]">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={broadcastBodyFr}
              onChange={(e) => setBroadcastBodyFr(e.target.value)}
              placeholder="Précisez les consignes…"
              className="w-full bg-[#171513] border border-[#302923] rounded-lg p-3 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold transition-colors"
          >
            {t('admin', 'broadcastSubmit')}
          </button>
        </form>
      )}

      {/* Tab: Users Management */}
      {activeTab === 'users' && (
        <div className="border border-[#302923] rounded-xl bg-[#1e1a17] overflow-hidden divide-y divide-[#302923]">
          {users.map((u) => (
            <div key={u.uid} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <span className="font-bold text-[#F6F0E7] block">{u.displayName} ({u.email})</span>
                <span className="text-[#B5AA9C]">
                  Rôle : {u.role} · Statut : {u.accountStatus} · {u.xp} XP
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleUserSuspension(u.uid, 'Action administrative')}
                  className={`px-3 py-1.5 rounded-lg font-semibold ${
                    u.accountStatus === 'suspended'
                      ? 'bg-[#1e2417] text-[#D8E5B0] border border-[#D8E5B0]/30'
                      : 'bg-[#25201c] text-rose-300 border border-rose-900/40'
                  }`}
                >
                  {u.accountStatus === 'suspended' ? 'Réactiver' : 'Suspendre'}
                </button>

                {u.role !== 'admin' && (
                  <button
                    onClick={() => changeUserRole(u.uid, 'admin')}
                    className="px-3 py-1.5 rounded-lg bg-[#25201c] text-[#FF6538] font-semibold border border-[#302923]"
                  >
                    Promouvoir Admin
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Reports */}
      {activeTab === 'reports' && (
        <div className="border border-[#302923] rounded-xl bg-[#1e1a17] overflow-hidden divide-y divide-[#302923]">
          {reports.map((rep) => (
            <div key={rep.id} className="p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#F6F0E7]">
                  Signalement {rep.targetType} : {rep.reason}
                </span>
                <span className="text-[#FF6538] uppercase font-bold">{rep.status}</span>
              </div>
              {rep.description && <p className="text-[#B5AA9C]">{rep.description}</p>}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => resolveReport(rep.id, 'Traité avec succès', 'resolved')}
                  className="px-3 py-1 rounded bg-[#1e2417] text-[#D8E5B0] font-semibold"
                >
                  Résoudre
                </button>
                <button
                  onClick={() => resolveReport(rep.id, 'Non fondé', 'rejected')}
                  className="px-3 py-1 rounded bg-[#25201c] text-[#B5AA9C]"
                >
                  Rejeter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="border border-[#302923] rounded-xl bg-[#1e1a17] overflow-hidden divide-y divide-[#302923]">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3.5 flex items-center justify-between text-xs text-[#B5AA9C]">
              <div>
                <span className="font-bold text-[#F6F0E7] block">
                  {log.actorName} · <span className="font-mono text-[#FF6538]">{log.action}</span>
                </span>
                <span className="text-[11px]">Cible : {log.targetType} ({log.targetId})</span>
              </div>
              <span className="font-mono text-[11px] tabular-nums">
                {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* News Draft Modal */}
      {showNewsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#1e1a17] border border-[#302923] max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-lg font-bold text-[#F6F0E7]">
              {t('admin', 'createNewsBtn')}
            </h3>

            <form onSubmit={handleCreateNews} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#F6F0E7]">
                    Titre (Français) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newsTitleFr}
                    onChange={(e) => setNewsTitleFr(e.target.value)}
                    className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#F6F0E7]">
                    Titre (English)
                  </label>
                  <input
                    type="text"
                    value={newsTitleEn}
                    onChange={(e) => setNewsTitleEn(e.target.value)}
                    className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#F6F0E7]">
                  Résumé (Français) *
                </label>
                <input
                  type="text"
                  required
                  value={newsSummaryFr}
                  onChange={(e) => setNewsSummaryFr(e.target.value)}
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#F6F0E7]">
                  Corps complet de l’article (Français) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newsBodyFr}
                  onChange={(e) => setNewsBodyFr(e.target.value)}
                  className="w-full bg-[#171513] border border-[#302923] rounded-lg p-3 text-xs text-[#F6F0E7]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#F6F0E7]">Catégorie</label>
                  <select
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                    className="w-full bg-[#171513] border border-[#302923] rounded-lg px-2 py-2 text-xs text-[#F6F0E7]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name.fr}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#F6F0E7]">Source (Nom)</label>
                  <input
                    type="text"
                    value={newsSourceName}
                    onChange={(e) => setNewsSourceName(e.target.value)}
                    className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#F6F0E7]">Statut</label>
                  <select
                    value={newsStatus}
                    onChange={(e) => setNewsStatus(e.target.value as any)}
                    className="w-full bg-[#171513] border border-[#302923] rounded-lg px-2 py-2 text-xs text-[#F6F0E7]"
                  >
                    <option value="published">Publiée</option>
                    <option value="draft">Brouillon</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#302923]">
                <button
                  type="button"
                  onClick={() => setShowNewsModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#B5AA9C]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold"
                >
                  Enregistrer l’actualité
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
