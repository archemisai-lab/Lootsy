import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FaqViewProps {
  navigate: (route: string) => void;
}

interface FaqItem {
  q: { fr: string; en: string };
  a: { fr: string; en: string };
}

export const FaqView: React.FC<FaqViewProps> = ({ navigate }) => {
  const { language } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems: FaqItem[] = [
    {
      q: {
        fr: 'Qu’est-ce que Lootsy ?',
        en: 'What is Lootsy?',
      },
      a: {
        fr: 'Lootsy est une plateforme gaming qui aide les joueurs à suivre les actualités importantes de leurs jeux et à transformer leur envie de jouer en défis partagés avec leurs amis au sein de groupes privés.',
        en: 'Lootsy is a gaming platform that helps players track key game updates and turn their desire to play into shared challenges with friends in private squad groups.',
      },
    },
    {
      q: {
        fr: 'Quels jeux sont disponibles sur Lootsy ?',
        en: 'Which games are supported on Lootsy?',
      },
      a: {
        fr: 'Pour son lancement MVP, Lootsy se concentre exclusivement sur Fortnite afin de perfectionner l’expérience principale (radar, groupes, défis, validations). D’autres titres populaires seront introduits ultérieurement.',
        en: 'For its MVP release, Lootsy focuses exclusively on Fortnite to perfect the core loop (radar, squads, challenges, verifications). Additional games will be rolled out in future phases.',
      },
    },
    {
      q: {
        fr: 'Lootsy est-il affilié à Epic Games ou Fortnite ?',
        en: 'Is Lootsy affiliated with Epic Games or Fortnite?',
      },
      a: {
        fr: 'Non. Lootsy est une plateforme totalement indépendante créée par et pour des joueurs. Lootsy n’est ni affilié, ni sponsorisé, ni validé par Epic Games, Inc. Les noms et marques sont utilisés uniquement pour identifier le jeu.',
        en: 'No. Lootsy is an independent platform built by and for gamers. It is not affiliated with, endorsed, or sponsored by Epic Games, Inc.',
      },
    },
    {
      q: {
        fr: 'Comment rejoindre un groupe d’amis ?',
        en: 'How do I join a squad group?',
      },
      a: {
        fr: 'Le propriétaire du groupe génère un code d’invitation sécurisé (ex: LOOT-VALK-2026). Il vous suffit de vous rendre dans la section Groupes > "Rejoindre avec un code" et de saisir ce code.',
        en: 'The squad owner generates a secure invite code (e.g. LOOT-VALK-2026). Simply go to Squads > "Join with code" and enter the code.',
      },
    },
    {
      q: {
        fr: 'Une preuve (capture ou vidéo) est-elle obligatoire pour valider un défi ?',
        en: 'Is proof (screenshot or clip) mandatory to complete a challenge?',
      },
      a: {
        fr: 'Non, sauf si le créateur du défi a explicitement choisi l’option "Preuve obligatoire". Lootsy permet la déclaration sur l’honneur (réussite non vérifiée) pour privilégier la fluidité entre amis de confiance.',
        en: 'No, unless the challenge creator explicitly selected "Mandatory proof". Lootsy supports honor-code completion (unverified claim) for smooth sessions between trusted friends.',
      },
    },
    {
      q: {
        fr: 'Qui peut voir mes captures d’écran et vidéos de preuve ?',
        en: 'Who can view my screenshot and clip proofs?',
      },
      a: {
        fr: 'Seuls les membres du groupe privé dans lequel le défi a été lancé peuvent voir vos soumissions. Les preuves ne sont jamais publiques sur le web.',
        en: 'Only members of the private squad where the challenge was created can access your proof attachments. Proofs are never public on the open web.',
      },
    },
    {
      q: {
        fr: 'Puis-je valider ma propre preuve de défi ?',
        en: 'Can I approve my own challenge proof?',
      },
      a: {
        fr: 'Jamais. La règle fondamentale de Lootsy interdit formellement à un joueur de valider sa propre preuve. La vérification doit être effectuée par un coéquipier ou le propriétaire du groupe.',
        en: 'Never. Lootsy rules strictly forbid any player from self-approving their own submission. Verification must be performed by a squad teammate or group owner.',
      },
    },
    {
      q: {
        fr: 'Comment supprimer mon compte et mes données personnelles ?',
        en: 'How can I delete my account and personal data?',
      },
      a: {
        fr: 'Vous pouvez demander la suppression définitive de votre compte depuis Paramètres > Confidentialité. Cela effacera votre profil, vos soumissions et vos accès de façon irréversible.',
        en: 'You can request permanent account deletion under Settings > Privacy. This irreversibly purges your profile, claims, and group memberships.',
      },
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 rounded-xl bg-[#302923] flex items-center justify-center text-[#FF6538] mx-auto">
          <HelpCircle className="w-5 h-5" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F6F0E7] tracking-tight">
          Questions fréquentes
        </h1>
        <p className="text-xs sm:text-sm text-[#B5AA9C] font-normal">
          Tout ce que vous devez savoir sur le fonctionnement, les règles et la sécurité de Lootsy.
        </p>
      </div>

      <div className="space-y-3">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-xl bg-[#1e1a17] border border-[#302923] overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 text-sm font-bold text-[#F6F0E7] hover:text-[#FF6538] transition-colors"
              >
                <span>{item.q[language]}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#FF6538] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#B5AA9C] shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#B5AA9C] leading-relaxed border-t border-[#302923]/60 font-normal">
                  {item.a[language]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 rounded-xl bg-[#181513] border border-[#302923] text-center space-y-3">
        <h3 className="text-sm font-extrabold text-[#F6F0E7]">Vous avez une question spécifique ?</h3>
        <p className="text-xs text-[#B5AA9C] font-normal">Notre équipe répond à vos demandes de support et de signalement.</p>
        <button
          onClick={() => navigate('/contact')}
          className="px-4 py-2 text-xs font-bold text-[#F6F0E7] bg-[#302923] hover:bg-[#3d342c] rounded-lg transition-colors border border-[#302923]"
        >
          Contacter le support
        </button>
      </div>
    </div>
  );
};
