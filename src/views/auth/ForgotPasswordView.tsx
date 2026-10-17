import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LootsyLogo } from '../../components/LootsyLogo';
import { KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';

interface ForgotPasswordViewProps {
  navigate: (route: string) => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ navigate }) => {
  const { t } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <LootsyLogo size={48} className="justify-center" />
          <h1 className="text-2xl font-extrabold text-[#F6F0E7]">
            {t('auth', 'forgotTitle')}
          </h1>
          <p className="text-xs text-[#B5AA9C]">
            {t('auth', 'forgotSubtitle')}
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-5">
          {submitted ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-10 h-10 text-[#D8E5B0] mx-auto" />
              <p className="text-xs sm:text-sm text-[#B5AA9C] leading-relaxed">
                {t('auth', 'forgotSuccess')}
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-2.5 px-4 rounded-lg bg-[#302923] hover:bg-[#3d342c] text-[#F6F0E7] text-xs font-semibold transition-colors"
              >
                {t('auth', 'backToLogin')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#F6F0E7]">
                  {t('auth', 'emailLabel')}
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] disabled:opacity-50 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>Vérification…</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>{t('auth', 'forgotSubmit')}</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-xs text-[#B5AA9C] hover:text-[#F6F0E7] inline-flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t('auth', 'backToLogin')}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
