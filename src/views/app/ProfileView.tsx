import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateLevelFromXp } from '../../utils/rules';
import { StatusBadge } from '../../components/StatusBadge';
import { UserBadgeTag } from '../../components/UserBadgeTag';
import { AvatarCropModal } from '../../components/AvatarCropModal';
import {
  User,
  Award,
  Trophy,
  Users,
  Settings,
  LogOut,
  Calendar,
  Shield,
  FileCheck2,
  Camera,
  Check,
} from 'lucide-react';

interface ProfileViewProps {
  navigate: (route: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ navigate }) => {
  const { currentUser, updateProfile, groups, participants, ledger, logout, language } = useApp();

  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [avatarSaveMessage, setAvatarSaveMessage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return null;

  const levelInfo = calculateLevelFromXp(currentUser.xp);
  const myGroups = groups.filter((g) => g.memberUids.includes(currentUser.uid));
  const myLedger = ledger.filter((l) => l.uid === currentUser.uid);

  const completedVerified = participants.filter(
    (p) => p.uid === currentUser.uid && p.status === 'completed_verified'
  ).length;

  const completedUnverified = participants.filter(
    (p) => p.uid === currentUser.uid && p.status === 'completed_unverified'
  ).length;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleCropComplete = async (croppedDataUrl: string) => {
    setCropImageSrc(null);
    await updateProfile({ photoURL: croppedDataUrl });
    setAvatarSaveMessage(true);
    setTimeout(() => setAvatarSaveMessage(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Hidden file input for Avatar */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Profile Card Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#1e1a17] border border-[#302923] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Avatar with Camera upload trigger */}
          <div className="relative group shrink-0">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#FF6538]/60 shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#302923] border border-[#FF6538]/40 flex items-center justify-center text-2xl font-display text-[#F6F0E7] tracking-wider">
                {currentUser.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#FF6538] hover:bg-[#ff7a53] text-white shadow-md transition-transform hover:scale-110 cursor-pointer"
              title={language === 'fr' ? 'Changer la photo de profil' : 'Change profile photo'}
              aria-label="Upload profile photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#F6F0E7] tracking-tight">
                {currentUser.displayName}
              </h1>

              {/* Creator Certified Blue Badge & Other Badges */}
              {(currentUser.badges?.includes('creator') || currentUser.displayName === 'LootsyCreator' || currentUser.role === 'admin') && (
                <UserBadgeTag badge="creator" size="sm" showLabel={true} />
              )}
              {currentUser.badges?.filter((b) => b !== 'creator').map((badge) => (
                <UserBadgeTag key={badge} badge={badge} size="sm" />
              ))}

              <StatusBadge status={currentUser.role} language={language} />
            </div>

            <p className="text-xs text-[#B5AA9C] flex items-center gap-1.5 font-normal">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {language === 'fr' ? 'Membre depuis le' : 'Member since'}{' '}
                {new Date(currentUser.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
              </span>
            </p>

            {avatarSaveMessage && (
              <span className="text-[11px] text-[#D8E5B0] font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>{language === 'fr' ? 'Photo de profil mise à jour !' : 'Profile photo updated!'}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app/settings')}
            className="px-3.5 py-2 rounded-lg bg-[#25201c] hover:bg-[#302923] border border-[#302923] text-xs font-bold text-[#F6F0E7] inline-flex items-center gap-1.5 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Paramètres' : 'Settings'}</span>
          </button>
          <button
            onClick={logout}
            className="px-3.5 py-2 rounded-lg bg-[#25201c] hover:bg-rose-950/40 text-rose-300 border border-[#302923] text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Déconnexion' : 'Sign out'}</span>
          </button>
        </div>
      </div>

      {/* Cropping Modal */}
      {cropImageSrc && (
        <AvatarCropModal
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
          onClose={() => setCropImageSrc(null)}
          language={language}
        />
      )}

      {/* Level & XP Progression Card */}
      <div className="p-6 rounded-2xl bg-[#1e1a17] border border-[#302923] space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs text-[#B5AA9C] font-medium">Rang de joueur</span>
            <h2 className="text-xl font-extrabold text-[#F6F0E7] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#FF6538]" />
              <span>Niveau {levelInfo.level}</span>
            </h2>
          </div>
          <span className="font-display text-2xl text-[#FF6538] tracking-wide tabular-nums">
            {currentUser.xp} XP au total
          </span>
        </div>

        <div className="w-full bg-[#171513] h-3 rounded-full overflow-hidden p-0.5 border border-[#302923]">
          <div
            className="bg-[#FF6538] h-full rounded-full transition-all duration-500"
            style={{ width: `${levelInfo.progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-[#B5AA9C]">
          <span>Progression vers le niveau {levelInfo.level + 1}</span>
          <span className="font-medium">{levelInfo.currentLevelXp} / {levelInfo.nextLevelXp} XP ({levelInfo.progressPercent}%)</span>
        </div>
      </div>

      {/* Authentic Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#1a1715] border border-[#302923] space-y-1">
          <span className="text-xs text-[#B5AA9C] font-medium">Réussites vérifiées par preuve</span>
          <span className="text-3xl font-display text-[#D8E5B0] tracking-wider tabular-nums block mt-1">
            {completedVerified}
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#1a1715] border border-[#302923] space-y-1">
          <span className="text-xs text-[#B5AA9C] font-medium">Déclarations sur l’honneur</span>
          <span className="text-3xl font-display text-[#F6F0E7] tracking-wider tabular-nums block mt-1">
            {completedUnverified}
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#1a1715] border border-[#302923] space-y-1">
          <span className="text-xs text-[#B5AA9C] font-medium">Groupes privés d’amis</span>
          <span className="text-3xl font-display text-[#FF6538] tracking-wider tabular-nums block mt-1">
            {myGroups.length}
          </span>
        </div>
      </div>

      {/* Auditable XP Ledger History */}
      <div className="p-6 rounded-2xl bg-[#1e1a17] border border-[#302923] space-y-4">
        <div className="flex items-center justify-between border-b border-[#302923] pb-3">
          <h2 className="text-base font-bold text-[#F6F0E7] flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-[#FF6538]" />
            <span>Registre d’audit des XP (Historique explicable)</span>
          </h2>
          <span className="text-xs text-[#B5AA9C]">{myLedger.length} entrée(s)</span>
        </div>

        {myLedger.length === 0 ? (
          <p className="text-xs text-[#B5AA9C] py-4 text-center">Aucun gain d’XP enregistré pour le moment.</p>
        ) : (
          <div className="divide-y divide-[#302923] text-xs">
            {myLedger.map((entry) => (
              <div key={entry.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="space-y-0.5">
                  <span className="font-semibold text-[#F6F0E7] block">{entry.reason}</span>
                  <span className="text-[11px] text-[#B5AA9C]">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="font-mono font-bold text-[#D8E5B0]">+{entry.amount} XP</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Squads */}
      <div className="p-6 rounded-2xl bg-[#1e1a17] border border-[#302923] space-y-4">
        <h2 className="text-base font-bold text-[#F6F0E7] flex items-center gap-2">
          <Users className="w-4 h-4 text-[#FF6538]" />
          <span>Vos escouades</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {myGroups.map((g) => (
            <div
              key={g.id}
              onClick={() => navigate(`/app/groups/${g.id}`)}
              className="p-3.5 rounded-xl bg-[#171513] hover:bg-[#201c19] border border-[#302923] cursor-pointer transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#302923] flex items-center justify-center font-bold text-xs text-[#F6F0E7]">
                  {g.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-[#F6F0E7]">{g.name}</span>
              </div>
              <span className="text-[11px] text-[#B5AA9C]">{g.memberCount} membres</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
