import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LootsyLogo } from '../../components/LootsyLogo';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  navigate: (route: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ navigate }) => {
  const { login, t } = useApp();
  const [email, setEmail] = useState('alex@lootsy.gg');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (res.success) {
        navigate('/app');
      } else {
        setError(res.error || 'Identifiants invalides');
      }
    }, 400);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <LootsyLogo size={48} className="justify-center" />
          <h1 className="text-2xl font-extrabold text-[#F6F0E7]">
            {t('auth', 'loginTitle')}
          </h1>
          <p className="text-xs text-[#B5AA9C]">
            {t('auth', 'loginSubtitle')}
          </p>
        </div>

        <form
          onSubmit={handleLogin}
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
              {t('auth', 'emailLabel')}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="gamer@exemple.com"
              className="w-full bg-[#171513] border border-[#302923] rounded-lg px-3.5 py-2 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#F6F0E7]">
                {t('auth', 'passwordLabel')}
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-[11px] text-[#FF6538] hover:underline"
              >
                {t('auth', 'forgotPasswordLink')}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#171513] border border-[#302923] rounded-lg pl-3.5 pr-10 py-2 text-xs text-[#F6F0E7] placeholder-[#B5AA9C]/60 focus:border-[#FF6538] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B5AA9C] hover:text-[#F6F0E7]"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] disabled:opacity-50 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Connexion…</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{t('common', 'signIn')}</span>
              </>
            )}
          </button>

          <div className="pt-2 text-center text-xs text-[#B5AA9C]">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="hover:text-[#F6F0E7] transition-colors"
            >
              {t('auth', 'noAccountLink')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
