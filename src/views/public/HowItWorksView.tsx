import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface HowItWorksViewProps {
  navigate: (route: string) => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ navigate }) => {
  const { t, currentUser } = useApp();

  const steps = [
    { num: '01', title: t('howItWorksPage', 'step1Title'), text: t('howItWorksPage', 'step1Text') },
    { num: '02', title: t('howItWorksPage', 'step2Title'), text: t('howItWorksPage', 'step2Text') },
    { num: '03', title: t('howItWorksPage', 'step3Title'), text: t('howItWorksPage', 'step3Text') },
    { num: '04', title: t('howItWorksPage', 'step4Title'), text: t('howItWorksPage', 'step4Text') },
    { num: '05', title: t('howItWorksPage', 'step5Title'), text: t('howItWorksPage', 'step5Text') },
    { num: '06', title: t('howItWorksPage', 'step6Title'), text: t('howItWorksPage', 'step6Text') },
    { num: '07', title: t('howItWorksPage', 'step7Title'), text: t('howItWorksPage', 'step7Text') },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F6F0E7]">
          {t('howItWorksPage', 'title')}
        </h1>
        <p className="text-sm sm:text-base text-[#B5AA9C] max-w-xl mx-auto">
          {t('howItWorksPage', 'subtitle')}
        </p>
      </div>

      {/* 7 Steps Linear Flow */}
      <div className="space-y-4">
        {steps.map((s, idx) => (
          <div
            key={s.num}
            className="p-6 rounded-xl bg-[#1e1a17] border border-[#302923] flex items-start gap-4 transition-colors hover:border-[#B5AA9C]/30"
          >
            <div className="w-8 h-8 rounded-lg bg-[#302923] flex items-center justify-center font-display text-sm text-[#FF6538] tracking-wider shrink-0 mt-0.5">
              {s.num}
            </div>
            <div className="space-y-1.5 flex-1">
              <h3 className="text-base font-extrabold text-[#F6F0E7] flex items-center gap-2">
                <span>{s.title}</span>
                {idx === steps.length - 1 && (
                  <CheckCircle2 className="w-4 h-4 text-[#D8E5B0]" />
                )}
              </h3>
              <p className="text-xs sm:text-sm text-[#B5AA9C] leading-relaxed font-normal">
                {s.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Honest Note */}
      <div className="p-6 rounded-xl bg-[#171513] border border-[#302923] text-xs text-[#B5AA9C] space-y-2">
        <p className="font-semibold text-[#F6F0E7]">Principe de transparence Lootsy :</p>
        <p>
          Lootsy ne se connecte pas à l’API officielle Epic Games et ne détecte pas automatiquement vos parties de Fortnite. La déclaration repose sur la confiance et l’examen mutuel au sein de votre groupe privé. Les pièces jointes sont des éléments soumis à l’appréciation de votre escouade, et non des preuves certifiées par machine.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => navigate(currentUser ? '/app' : '/signup')}
          className="px-6 py-3 text-xs sm:text-sm font-bold text-white bg-[#FF6538] hover:bg-[#ff7a53] rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <span>{currentUser ? t('nav', 'goToDashboard') : t('nav', 'joinLootsy')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
