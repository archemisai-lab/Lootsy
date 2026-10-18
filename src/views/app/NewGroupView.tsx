import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Users, AlertCircle } from 'lucide-react';

interface NewGroupViewProps {
  navigate: (route: string) => void;
}

export const NewGroupView: React.FC<NewGroupViewProps> = ({ navigate }) => {
  const { createGroup, t } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Le nom du groupe est obligatoire.');
      return;
    }

    setIsLoading(true);
    const res = await createGroup(name, description);
    setIsLoading(false);
    if (res.success && res.group) {
      navigate(`/app/groups/${res.group.id}`);
    } else {
      setError(res.error || 'Erreur lors de la création du groupe.');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <button
        onClick={() => navigate('/app/groups')}
        className="text-xs text-[#B5AA9C] hover:text-[#F6F0E7] inline-flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-[#FF6538]" />
        <span>Retour aux groupes</span>
      </button>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F6F0E7] tracking-tight">
          {t('groups', 'createTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-[#B5AA9C] font-normal">
          Créez un espace privé et confidentiel pour vos amis et vos sessions Fortnite.
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

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#F6F0E7]">
            {t('groups', 'nameLabel')} <span className="text-[#FF6538]">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('groups', 'namePlaceholder')}
            maxLength={60}
            className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3.5 py-2 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#F6F0E7]">
            {t('groups', 'descLabel')}
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('groups', 'descPlaceholder')}
            maxLength={250}
            className="w-full bg-[#171513] border border-[#302923] rounded-lg p-3.5 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none"
          />
        </div>

        <div className="p-4 rounded-lg bg-[#171513] border border-[#302923] text-[11px] text-[#B5AA9C] space-y-1">
          <p className="font-semibold text-[#F6F0E7]">Paramètres automatiques :</p>
          <p>• Vous devenez le propriétaire officiel de ce groupe.</p>
          <p>• Un code d’invitation unique sera automatiquement généré pour inviter vos amis.</p>
          <p>• Ce groupe reste strictement privé et non indexé sur le web.</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/app/groups')}
            className="px-4 py-2 text-xs font-semibold text-[#B5AA9C] hover:text-[#F6F0E7]"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] disabled:opacity-50 text-white text-xs font-bold transition-colors"
          >
            {isLoading ? 'Création en cours…' : t('groups', 'createSubmit')}
          </button>
        </div>
      </form>
    </div>
  );
};
