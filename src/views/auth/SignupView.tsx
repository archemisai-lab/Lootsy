import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LootsyLogo } from '../../components/LootsyLogo';
import { UserPlus, AlertCircle } from 'lucide-react';

interface SignupViewProps {
  navigate: (route: string) => void;
}

export const SignupView: React.FC<SignupViewProps> = ({ navigate }) => {
  const { signup, t } = useApp();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim()) {
      setError('Veuillez choisir un nom de joueur.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    if (!termsAccepted) {
      setError('Veuillez accepter les conditions d’utilisation pour continuer.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = signup(email, password, displayName);
      setIsLoading(false);
      if (res.success) {
        navigate('/onboarding');
      } else {
        setError(res.error || 'Erreur lors de la création du compte.');
      }
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <LootsyLogo size={48} className="justify-center" />
          <h1 className="text-2xl font-extrabold text-[#F6F0E7]">
            {t('auth', 'signupTitle')}
          </h1>
          <p className="text-xs text-[#B5AA9C]">
            {t('auth', 'signupSubtitle')}
          </p>
        </div>

        <form
          onSubmit={handleSignup}
          className="p-6 sm:p-8 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-4"
        >
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#F6F0E7]">
              {t('auth', 'displayNameLabel')} <span className="text-[#FF6538]">*</span>
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ex: GhostRider_99"
              className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3.5 py-2 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#F6F0E7]">
              {t('auth', 'emailLabel')} <span className="text-[#FF6538]">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre-email@domaine.com"
              className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3.5 py-2 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#F6F0E7]">
              {t('auth', 'passwordLabel')} <span className="text-[#FF6538]">*</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 caractères"
              className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3.5 py-2 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#F6F0E7]">
              {t('auth', 'confirmPasswordLabel')} <span className="text-[#FF6538]">*</span>
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer votre mot de passe"
              className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3.5 py-2 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 text-xs text-[#B5AA9C] cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded border-[#302923] bg-[#171513] text-[#FF6538] focus:ring-[#FF6538]"
              />
              <span className="leading-tight">
                {t('auth', 'termsAcceptance')}
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] disabled:opacity-50 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 pt-2"
          >
            {isLoading ? (
              <span>Création du compte…</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Créer mon compte</span>
              </>
            )}
          </button>

          <div className="pt-2 text-center text-xs text-[#B5AA9C]">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="hover:text-[#F6F0E7] transition-colors"
            >
              {t('auth', 'hasAccountLink')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
