import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LootsyLogo } from '../../components/LootsyLogo';
import { UserPlus, AlertCircle } from 'lucide-react';

interface SignupViewProps {
  navigate: (route: string) => void;
}

export const SignupView: React.FC<SignupViewProps> = ({ navigate }) => {
  const { signup, loginWithGoogle, t, firebaseError, language } = useApp();
  const [displayName, setDisplayName] = useState('');
  const [epicGamesId, setEpicGamesId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!displayName.trim()) {
      setError(language === 'fr' ? 'Veuillez choisir un nom de joueur.' : 'Please choose a gamer tag.');
      return;
    }

    // Brand protection: Nobody except official admin can have "lootsy" in displayName
    if (displayName.trim().toLowerCase().includes('lootsy')) {
      if (email.trim().toLowerCase() !== 'archemis.ai@gmail.com') {
        setError(
          language === 'fr'
            ? 'Ce pseudonyme contient le terme protégé « Lootsy », réservé exclusivement à la marque et à l’administration officielle de la plateforme. Veuillez choisir un autre nom de joueur.'
            : 'This tag contains the protected trademark "Lootsy", strictly reserved for official platform branding and administration. Please select a different gamer tag.'
        );
        return;
      }
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

    const res = await signup(email, password, displayName, epicGamesId);
    setIsLoading(false);
    if (res.success) {
      navigate('/app');
    } else {
      setError(res.error || 'Erreur lors de la création du compte.');
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setIsLoading(true);
    const res = await loginWithGoogle();
    setIsLoading(false);
    if (res.success) {
      navigate('/app');
    } else {
      setError(res.error || 'Erreur lors de l’inscription Google');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <LootsyLogo size={48} className="justify-center" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F6F0E7] tracking-tight">
            {t('auth', 'signupTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-[#B5AA9C] font-normal">
            {t('auth', 'signupSubtitle')}
          </p>
        </div>

        <form
          onSubmit={handleSignup}
          className="p-6 sm:p-8 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-4"
        >
          {(error || firebaseError) && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block">{error || firebaseError}</span>
                {(error?.includes('console Firebase') || firebaseError?.includes('console Firebase')) && (
                  <p className="text-[11px] text-[#B5AA9C]">
                    Activez le fournisseur Email/Mot de passe dans Authentication &gt; Sign-in method de votre console Firebase, ou inscrivez-vous avec Google ci-dessous.
                  </p>
                )}
              </div>
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
              Pseudo Epic Games <span className="text-[#B5AA9C] font-normal text-[11px]">(Optionnel)</span>
            </label>
            <input
              type="text"
              value={epicGamesId}
              onChange={(e) => setEpicGamesId(e.target.value)}
              placeholder="Votre gamertag Fortnite"
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
            className="w-full py-2.5 px-4 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] disabled:opacity-50 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span>Création dans Firebase…</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Créer mon compte</span>
              </>
            )}
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#302923]"></div>
            <span className="flex-shrink mx-3 text-[11px] text-[#B5AA9C]">ou</span>
            <div className="flex-grow border-t border-[#302923]"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-[#171513] hover:bg-[#302923] border border-[#302923] text-[#F6F0E7] text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>S’inscrire avec Google</span>
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
