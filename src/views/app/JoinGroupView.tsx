import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

interface JoinGroupViewProps {
  navigate: (route: string) => void;
}

export const JoinGroupView: React.FC<JoinGroupViewProps> = ({ navigate }) => {
  const { joinGroupWithCode, t } = useApp();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!code.trim()) {
      setError('Veuillez saisir un code d’invitation.');
      return;
    }

    setIsLoading(true);
    const res = await joinGroupWithCode(code);
    setIsLoading(false);
    if (res.success && res.group) {
      navigate(`/app/groups/${res.group.id}`);
    } else {
      setError(res.error || 'Code invalide ou expiré.');
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
          {t('groups', 'joinTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-[#B5AA9C] font-normal">
          Entrez le code d’invitation fourni par le propriétaire du groupe d’amis.
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
            {t('groups', 'codeLabel')} <span className="text-[#FF6538]">*</span>
          </label>
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={t('groups', 'codePlaceholder')}
            className="w-full font-mono uppercase bg-[#171513] border border-[#302923] rounded-lg px-3.5 py-2.5 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none tracking-wider"
          />
        </div>

        <p className="text-[11px] text-[#B5AA9C]">
          Astuce : vous pouvez tester avec le code existant <code className="text-[#FF6538] font-bold">LOOT-VALK-2026</code>.
        </p>

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
            {isLoading ? 'Vérification…' : t('groups', 'joinSubmit')}
          </button>
        </div>
      </form>
    </div>
  );
};
