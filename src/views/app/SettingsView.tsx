import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Bell,
  Lock,
  Globe,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
} from 'lucide-react';

interface SettingsViewProps {
  navigate: (route: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ navigate }) => {
  const {
    currentUser,
    updateProfile,
    deleteAccount,
    language,
    setLanguage,
    t,
  } = useApp();

  if (!currentUser) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'security'>('profile');
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Notification prefs
  const [notifPrefs, setNotifPrefs] = useState(currentUser.notificationPreferences);

  // Privacy prefs
  const [privacyPrefs, setPrivacyPrefs] = useState(currentUser.privacySettings);

  // Account deletion modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName: displayName.trim(),
      notificationPreferences: notifPrefs,
      privacySettings: privacyPrefs,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmationInput.trim().toUpperCase() !== 'SUPPRIMER' && deleteConfirmationInput.trim().toUpperCase() !== 'DELETE') {
      setDeleteError('Veuillez taper "SUPPRIMER" pour confirmer l’effacement irréversible.');
      return;
    }
    deleteAccount();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="space-y-1 border-b border-[#302923] pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F6F0E7] tracking-tight">
          {t('settings', 'title')}
        </h1>
        <p className="text-xs sm:text-sm text-[#B5AA9C] font-normal">
          Gérez votre profil gamer, vos préférences de notification et la confidentialité de vos données.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-[#1e2417] border border-[#D8E5B0]/40 text-xs text-[#D8E5B0] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Modifications enregistrées avec succès.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#302923] pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-[#FF6538] text-[#FF6538]'
              : 'border-transparent text-[#B5AA9C] hover:text-[#F6F0E7]'
          }`}
        >
          {t('settings', 'accountTab')}
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'border-[#FF6538] text-[#FF6538]'
              : 'border-transparent text-[#B5AA9C] hover:text-[#F6F0E7]'
          }`}
        >
          {t('settings', 'notificationsTab')}
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'privacy'
              ? 'border-[#FF6538] text-[#FF6538]'
              : 'border-transparent text-[#B5AA9C] hover:text-[#F6F0E7]'
          }`}
        >
          {t('settings', 'privacyTab')}
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 text-xs font-bold transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'security'
              ? 'border-[#FF6538] text-[#FF6538]'
              : 'border-transparent text-[#B5AA9C] hover:text-[#F6F0E7]'
          }`}
        >
          {t('settings', 'securityTab')}
        </button>
      </div>

      {/* Profile & Account Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="p-6 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-4">
            <h3 className="text-sm font-bold text-[#F6F0E7]">Informations du profil</h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#F6F0E7]">
                {t('settings', 'displayNameLabel')}
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full max-w-md bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-semibold text-[#F6F0E7]">
                Adresse e-mail (liée au compte)
              </label>
              <input
                type="text"
                disabled
                value={currentUser.email}
                className="w-full max-w-md bg-[#141210] border border-[#302923]/60 rounded-lg px-3 py-2 text-xs text-[#B5AA9C] cursor-not-allowed opacity-80"
              />
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-semibold text-[#F6F0E7]">
                {t('settings', 'languageLabel')}
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLanguage('fr')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    language === 'fr'
                      ? 'bg-[#302923] border-[#FF6538] text-[#F6F0E7]'
                      : 'bg-[#171513] border-[#302923] text-[#B5AA9C]'
                  }`}
                >
                  Français (FR)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    language === 'en'
                      ? 'bg-[#302923] border-[#FF6538] text-[#F6F0E7]'
                      : 'bg-[#171513] border-[#302923] text-[#B5AA9C]'
                  }`}
                >
                  English (EN)
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold transition-colors"
          >
            {t('settings', 'saveChanges')}
          </button>
        </form>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-4">
            <h3 className="text-sm font-bold text-[#F6F0E7]">Notifications push du navigateur</h3>
            <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-[#171513] border border-[#302923]">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#F6F0E7] block">
                  {t('settings', 'pushToggle')}
                </span>
                <p className="text-xs text-[#B5AA9C] leading-relaxed">
                  {t('settings', 'pushNotice')} Les notifications internes dans l’application restent toujours actives.
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs.pushEnabled}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, pushEnabled: e.target.checked })}
                className="rounded border-[#302923] bg-[#171513] text-[#FF6538] focus:ring-[#FF6538] w-4 h-4 mt-1"
              />
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-3">
            <h3 className="text-sm font-bold text-[#F6F0E7]">Événements notifiés</h3>

            {[
              { key: 'newChallenges', label: 'Nouveau défi créé dans mon escouade' },
              { key: 'challengeUpdates', label: 'Modifications importantes d’un défi' },
              { key: 'friendCompletion', label: 'Réussite déclarée ou validée d’un coéquipier' },
              { key: 'dueReminders', label: 'Rappel d’échéance imminente' },
              { key: 'newsCategories', label: 'Nouvelles actualités sur mes catégories préférées' },
              { key: 'adminAnnouncements', label: 'Annonces administratives officielles' },
            ].map((item) => (
              <label key={item.key} className="flex items-center justify-between py-2 border-b border-[#302923]/40 cursor-pointer text-xs">
                <span className="text-[#F6F0E7]">{item.label}</span>
                <input
                  type="checkbox"
                  checked={(notifPrefs as any)[item.key]}
                  onChange={(e) => setNotifPrefs({ ...notifPrefs, [item.key]: e.target.checked })}
                  className="rounded border-[#302923] bg-[#171513] text-[#FF6538] focus:ring-[#FF6538] w-4 h-4"
                />
              </label>
            ))}
          </div>

          <button
            onClick={handleSaveProfile}
            className="px-5 py-2.5 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold transition-colors"
          >
            {t('settings', 'saveChanges')}
          </button>
        </div>
      )}

      {/* Privacy Tab */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-4">
            <h3 className="text-sm font-bold text-[#F6F0E7]">Paramètres de visibilité</h3>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#F6F0E7]">
                {t('settings', 'privacyProfileLabel')}
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 text-xs text-[#B5AA9C] cursor-pointer">
                  <input
                    type="radio"
                    name="profileVisibility"
                    value="public_in_groups"
                    checked={privacyPrefs.profileVisibility === 'public_in_groups'}
                    onChange={() => setPrivacyPrefs({ ...privacyPrefs, profileVisibility: 'public_in_groups' })}
                    className="text-[#FF6538] bg-[#171513] border-[#302923]"
                  />
                  <span>{t('settings', 'privacyPublicInGroups')} (Recommandé)</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs text-[#B5AA9C] cursor-pointer">
                  <input
                    type="radio"
                    name="profileVisibility"
                    value="private"
                    checked={privacyPrefs.profileVisibility === 'private'}
                    onChange={() => setPrivacyPrefs({ ...privacyPrefs, profileVisibility: 'private' })}
                    className="text-[#FF6538] bg-[#171513] border-[#302923]"
                  />
                  <span>{t('settings', 'privacyStrict')}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Account Deletion Area */}
          <div className="p-6 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-3">
            <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>{t('settings', 'deleteAccountTitle')}</span>
            </h3>
            <p className="text-xs text-[#B5AA9C] leading-relaxed">
              {t('settings', 'deleteAccountWarning')}
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
            >
              {t('settings', 'deleteAccountButton')}
            </button>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-4">
            <h3 className="text-sm font-bold text-[#F6F0E7]">Sécurité de la session</h3>
            <div className="p-4 rounded-lg bg-[#171513] border border-[#302923] text-xs text-[#B5AA9C] space-y-2">
              <div className="flex items-center justify-between">
                <span>Session actuelle</span>
                <span className="text-[#D8E5B0] font-semibold">Active · Chiffrement TLS</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Authentification</span>
                <span className="text-[#F6F0E7]">Mot de passe chiffré</span>
              </div>
            </div>

            <p className="text-xs text-[#B5AA9C]">
              Lootsy n’enregistre jamais votre mot de passe en clair et ne transmet aucun identifiant à des régies publicitaires.
            </p>
          </div>
        </div>
      )}

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#1e1a17] border border-rose-900/60 max-w-md w-full space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-950/60 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-[#F6F0E7]">
                {t('settings', 'confirmDeleteTitle')}
              </h3>
              <p className="text-xs text-[#B5AA9C]">
                {t('settings', 'confirmDeleteText')}
              </p>
            </div>

            {deleteError && (
              <p className="text-xs text-rose-400 text-center">{deleteError}</p>
            )}

            <input
              type="text"
              value={deleteConfirmationInput}
              onChange={(e) => setDeleteConfirmationInput(e.target.value)}
              placeholder="SUPPRIMER"
              className="w-full font-mono text-center uppercase bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:border-rose-500 focus:outline-none"
            />

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="w-1/2 py-2 rounded-lg bg-[#302923] text-xs font-semibold text-[#F6F0E7]"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="w-1/2 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white"
              >
                Confirmer l’effacement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
