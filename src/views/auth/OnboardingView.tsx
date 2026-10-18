import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LootsyLogo } from '../../components/LootsyLogo';
import { Check, ArrowRight, Bell, Sparkles } from 'lucide-react';

interface OnboardingViewProps {
  navigate: (route: string) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ navigate }) => {
  const { categories, language, setLanguage, completeOnboarding, t } = useApp();
  const [selectedCats, setSelectedCats] = useState<string[]>(['seasons', 'weapons']);
  const [step, setStep] = useState(1);

  const toggleCategory = (catId: string) => {
    setSelectedCats((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleFinish = () => {
    completeOnboarding(selectedCats);
    navigate('/app');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-3">
          <LootsyLogo size={52} className="justify-center" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F6F0E7] tracking-tight">
            {t('auth', 'onboardingTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-[#B5AA9C] font-normal">
            {t('auth', 'onboardingSubtitle')}
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-display text-[#FF6538] tracking-wider uppercase">Étape 1 sur 2</span>
                <h3 className="text-base font-extrabold text-[#F6F0E7]">
                  Choisissez votre langue préférée
                </h3>
                <p className="text-xs text-[#B5AA9C] font-normal">
                  Vous pourrez modifier ce paramètre à tout moment.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setLanguage('fr')}
                  className={`p-4 rounded-xl border text-center transition-colors ${
                    language === 'fr'
                      ? 'bg-[#302923] border-[#FF6538] text-[#F6F0E7]'
                      : 'bg-[#171513] border-[#302923] text-[#B5AA9C] hover:text-[#F6F0E7]'
                  }`}
                >
                  <span className="block text-sm font-bold">Français</span>
                  <span className="text-[11px] text-[#B5AA9C]">Langue par défaut</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`p-4 rounded-xl border text-center transition-colors ${
                    language === 'en'
                      ? 'bg-[#302923] border-[#FF6538] text-[#F6F0E7]'
                      : 'bg-[#171513] border-[#302923] text-[#B5AA9C] hover:text-[#F6F0E7]'
                  }`}
                >
                  <span className="block text-sm font-bold">English</span>
                  <span className="text-[11px] text-[#B5AA9C]">International</span>
                </button>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Continuer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-display text-[#FF6538] tracking-wider uppercase">Étape 2 sur 2</span>
                <h3 className="text-base font-extrabold text-[#F6F0E7]">
                  {t('auth', 'chooseCategories')}
                </h3>
                <p className="text-xs text-[#B5AA9C] font-normal">
                  Sélectionnez les sujets qui alimenteront votre tableau de bord.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {categories.map((cat) => {
                  const isChecked = selectedCats.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-3 rounded-lg border text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                        isChecked
                          ? 'bg-[#302923] border-[#FF6538] text-[#F6F0E7]'
                          : 'bg-[#171513] border-[#302923] text-[#B5AA9C] hover:text-[#F6F0E7]'
                      }`}
                    >
                      <span>{cat.name[language]}</span>
                      {isChecked && <Check className="w-4 h-4 text-[#FF6538] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#B5AA9C] hover:text-[#F6F0E7]"
                >
                  Retour
                </button>

                <button
                  type="button"
                  onClick={handleFinish}
                  className="px-6 py-2.5 rounded-lg bg-[#FF6538] hover:bg-[#ff7a53] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{t('auth', 'completeOnboarding')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
