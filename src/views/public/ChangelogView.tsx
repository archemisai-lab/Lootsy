import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface ChangelogViewProps {
  navigate: (route: string) => void;
}

export const ChangelogView: React.FC<ChangelogViewProps> = () => {
  const { language } = useApp();

  const releases = [
    {
      version: 'v1.0.0',
      date: '17 octobre 2026',
      dateEn: 'October 17, 2026',
      badge: 'Lancement MVP',
      badgeEn: 'MVP Launch',
      highlights: [
        'Radar d’actualités Fortnite officiel avec filtrage par catégorie (Saison, Armes, Carte, Événements, Modes, Défis, Esport).',
        'Création et adhésion de groupes privés avec codes d’invitation cryptographiquement robustes.',
        'Système de défis de groupe avec règles personnalisées et échéances configurables.',
        'Soumission facultative de preuves (capture d’écran ou vidéo) ou déclaration sur l’honneur.',
        'Moteur de validation avec interdiction absolue de l’auto-validation et procédure de contestation.',
        'Formule XP transparente et dérivation de niveaux de joueur sans bonus cachés.',
        'Console d’administration complète pour la publication d’actualités, l’audit et la modération.',
        'Prise en charge intégrale bilingue Français et Anglais.',
      ],
      highlightsEn: [
        'Official Fortnite News Radar with category filtering (Seasons, Weapons, Map, Events, Modes, Quests, Esports).',
        'Private squad creation and joining via cryptographically robust invite codes.',
        'Squad challenges engine with custom criteria, deadlines, and XP rewards.',
        'Optional proof submissions (screenshot, clip) or honor-code unverified declarations.',
        'Peer review engine with strict ban on self-approval and contestation appeals.',
        'Auditable XP ledger and player level progression.',
        'Comprehensive admin console for news publishing, broadcast notices, and audit logs.',
        'Full bilingual support in French and English.',
      ],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-[#F6F0E7]">
          Historique des versions (Changelog)
        </h1>
        <p className="text-xs sm:text-sm text-[#B5AA9C]">
          Toutes les fonctionnalités, correctifs et évolutions publiés sur Lootsy.
        </p>
      </div>

      <div className="space-y-8">
        {releases.map((rel) => (
          <div
            key={rel.version}
            className="p-6 sm:p-8 rounded-xl bg-[#1e1a17] border border-[#302923] space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#302923] pb-3">
              <div className="flex items-center gap-3">
                <span className="text-lg font-mono font-bold text-[#F6F0E7]">
                  {rel.version}
                </span>
                <span className="text-xs font-semibold text-[#FF6538]">
                  {language === 'fr' ? rel.badge : rel.badgeEn}
                </span>
              </div>
              <span className="text-xs text-[#B5AA9C]">
                {language === 'fr' ? rel.date : rel.dateEn}
              </span>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-[#B5AA9C]">
              {(language === 'fr' ? rel.highlights : rel.highlightsEn).map((h, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#D8E5B0] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
