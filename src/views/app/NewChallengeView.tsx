import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Trophy, AlertCircle } from 'lucide-react';

interface NewChallengeViewProps {
  navigate: (route: string) => void;
}

export const NewChallengeView: React.FC<NewChallengeViewProps> = ({ navigate }) => {
  const { currentUser, groups, createChallenge, t } = useApp();

  const myGroups = groups.filter((g) => g.memberUids.includes(currentUser?.uid || ''));

  const [groupId, setGroupId] = useState(myGroups[0]?.id || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [proofPolicy, setProofPolicy] = useState<'none' | 'optional' | 'required'>('optional');
  const [xpReward, setXpReward] = useState(150);
  const [dueAt, setDueAt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!groupId) {
      setError('Veuillez sélectionner un groupe d’amis.');
      return;
    }

    if (!title.trim()) {
      setError('L’intitulé du défi est obligatoire.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = createChallenge({
        groupId,
        title,
        description,
        proofPolicy,
        validationPolicy: 'creator_or_admin',
        xpReward,
        dueAt: dueAt ? new Date(dueAt).toISOString() : null,
      });

      setIsLoading(false);

      if (res.success && res.challenge) {
        navigate(`/app/challenges/${res.challenge.id}`);
      } else {
        setError(res.error || 'Erreur lors de la création du défi.');
      }
    }, 300);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <button
        onClick={() => navigate('/app/challenges')}
        className="text-xs text-[#B5AA9C] hover:text-[#F6F0E7] inline-flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-[#FF6538]" />
        <span>Retour aux défis</span>
      </button>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-[#F6F0E7]">
          {t('challenges', 'createChallenge')}
        </h1>
        <p className="text-xs text-[#B5AA9C]">
          Définissez un objectif partagé pour votre escouade avec des conditions de réussite claires.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-5"
      >
        {error && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Group selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#F6F0E7]">
            {t('challenges', 'groupSelectLabel')} <span className="text-[#FF6538]">*</span>
          </label>
          <select
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
          >
            {myGroups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#F6F0E7]">
            {t('challenges', 'titleLabel')} <span className="text-[#FF6538]">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('challenges', 'titlePlaceholder')}
            maxLength={100}
            className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3.5 py-2 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none"
          />
        </div>

        {/* Description & Rules */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#F6F0E7]">
            {t('challenges', 'descLabel')} <span className="text-[#FF6538]">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('challenges', 'descPlaceholder')}
            className="w-full bg-[#171513] border border-[#302923] rounded-lg p-3 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none leading-relaxed"
          />
        </div>

        {/* Proof Policy */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#F6F0E7]">
            {t('challenges', 'proofPolicyLabel')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'optional', label: t('challenges', 'proofOptional') },
              { id: 'required', label: t('challenges', 'proofRequired') },
              { id: 'none', label: t('challenges', 'proofNone') },
            ].map((pol) => (
              <button
                key={pol.id}
                type="button"
                onClick={() => setProofPolicy(pol.id as any)}
                className={`p-3 rounded-lg border text-left text-xs transition-colors ${
                  proofPolicy === pol.id
                    ? 'bg-[#302923] border-[#FF6538] text-[#F6F0E7] font-semibold'
                    : 'bg-[#171513] border-[#302923] text-[#B5AA9C] hover:text-[#F6F0E7]'
                }`}
              >
                {pol.label}
              </button>
            ))}
          </div>
        </div>

        {/* XP Reward & Deadline Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#F6F0E7]">
              {t('challenges', 'xpRewardLabel')}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="50"
                max="500"
                step="25"
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                className="w-full accent-[#FF6538]"
              />
              <span className="font-mono text-sm font-bold text-[#FF6538] tabular-nums shrink-0">
                +{xpReward} XP
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#F6F0E7]">
              {t('challenges', 'dueAtLabel')}
            </label>
            <input
              type="date"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3 py-2 text-xs text-[#F6F0E7] focus:border-[#FF6538] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#302923]">
          <button
            type="button"
            onClick={() => navigate('/app/challenges')}
            className="px-4 py-2 text-xs font-semibold text-[#B5AA9C] hover:text-[#F6F0E7]"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] disabled:opacity-50 text-white text-xs font-bold transition-colors"
          >
            {isLoading ? 'Publication…' : t('challenges', 'createSubmit')}
          </button>
        </div>
      </form>
    </div>
  );
};
