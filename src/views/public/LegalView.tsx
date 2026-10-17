import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, FileText, Lock, Cookie, Scale, Users, Bell, Trash2 } from 'lucide-react';

interface LegalViewProps {
  section?: string;
  navigate: (route: string) => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ section = 'index', navigate }) => {
  const { language, t } = useApp();

  const legalNav = [
    { id: 'index', title: 'Centre Légal', icon: Shield, path: '/legal' },
    { id: 'terms', title: 'Conditions d’Utilisation', icon: FileText, path: '/legal/terms' },
    { id: 'privacy', title: 'Confidentialité & Données', icon: Lock, path: '/legal/privacy' },
    { id: 'cookies', title: 'Cookies & Traceurs', icon: Cookie, path: '/legal/cookies' },
    { id: 'notices', title: 'Mentions Légales', icon: Scale, path: '/legal/notices' },
    { id: 'intellectual-property', title: 'Propriété Intellectuelle', icon: Scale, path: '/legal/intellectual-property' },
    { id: 'community', title: 'Règles de Communauté', icon: Users, path: '/legal/community' },
    { id: 'notifications', title: 'Information Notifications', icon: Bell, path: '/legal/notifications' },
    { id: 'data-deletion', title: 'Suppression des Données', icon: Trash2, path: '/legal/data-deletion' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="space-y-2 border-b border-[#302923] pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F6F0E7]">
          {t('legal', 'indexTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-[#B5AA9C]">
          Cadre juridique officiel régissant l’utilisation de la plateforme Lootsy et la protection de vos données.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="space-y-1">
          {legalNav.map((item) => {
            const Icon = item.icon;
            const isCurrent = section === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                  isCurrent
                    ? 'bg-[#302923] text-[#FF6538] border border-[#FF6538]/40'
                    : 'text-[#B5AA9C] hover:text-[#F6F0E7] hover:bg-[#25201c]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.title}</span>
              </button>
            );
          })}
        </aside>

        {/* Legal Text Content Area */}
        <div className="md:col-span-3 p-6 sm:p-8 rounded-xl bg-[#1e1a17] border border-[#302923] text-xs sm:text-sm text-[#F6F0E7] leading-relaxed space-y-6">
          {section === 'index' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#F6F0E7]">Bienvenue au Centre Légal de Lootsy</h2>
              <p className="text-[#B5AA9C]">
                Chez Lootsy, nous privilégions la transparence, la sécurité et le respect de la vie privée des joueurs. Retrouvez ici l’ensemble de nos engagements juridiques et techniques.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div
                  onClick={() => navigate('/legal/terms')}
                  className="p-4 rounded-lg bg-[#171513] border border-[#302923] cursor-pointer hover:border-[#FF6538]/50 space-y-1"
                >
                  <h4 className="font-bold text-[#F6F0E7]">Conditions d’utilisation</h4>
                  <p className="text-xs text-[#B5AA9C]">Règles régissant l’accès au radar, aux groupes privés et aux défis.</p>
                </div>
                <div
                  onClick={() => navigate('/legal/privacy')}
                  className="p-4 rounded-lg bg-[#171513] border border-[#302923] cursor-pointer hover:border-[#FF6538]/50 space-y-1"
                >
                  <h4 className="font-bold text-[#F6F0E7]">Politique de confidentialité</h4>
                  <p className="text-xs text-[#B5AA9C]">Minimisation des données, absence de revente et sécurité des preuves.</p>
                </div>
                <div
                  onClick={() => navigate('/legal/intellectual-property')}
                  className="p-4 rounded-lg bg-[#171513] border border-[#302923] cursor-pointer hover:border-[#FF6538]/50 space-y-1"
                >
                  <h4 className="font-bold text-[#F6F0E7]">Propriété intellectuelle</h4>
                  <p className="text-xs text-[#B5AA9C]">Clarification de l’absence d’affiliation avec Epic Games ou Fortnite.</p>
                </div>
                <div
                  onClick={() => navigate('/legal/data-deletion')}
                  className="p-4 rounded-lg bg-[#171513] border border-[#302923] cursor-pointer hover:border-[#FF6538]/50 space-y-1"
                >
                  <h4 className="font-bold text-[#F6F0E7]">Suppression des données</h4>
                  <p className="text-xs text-[#B5AA9C]">Modalités d’exercice de votre droit à l’effacement direct.</p>
                </div>
              </div>
            </div>
          )}

          {section === 'terms' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#F6F0E7]">Conditions Générales d’Utilisation</h2>
              <p className="text-[#B5AA9C]">Dernière mise à jour : 17 octobre 2026</p>
              <h3 className="font-bold text-[#F6F0E7] pt-2">1. Objet du Service</h3>
              <p>Lootsy fournit une application web gaming permettant aux utilisateurs de consulter des actualités sur Fortnite, de constituer des groupes privés fermés et de déclarer des défis ludiques.</p>
              <h3 className="font-bold text-[#F6F0E7] pt-2">2. Respect des Règles du Jeu</h3>
              <p>L’utilisation de Lootsy ne dispense en aucun cas du respect des Conditions d’utilisation d’Epic Games. Tout comportement toxique ou contenu illicite dans les groupes privés fait l’objet de sanctions immédiates.</p>
              <h3 className="font-bold text-[#F6F0E7] pt-2">3. Responsabilité des Soumissions</h3>
              <p>Les captures d’écran et vidéos soumises au sein des défis relèvent de la responsabilité de leurs auteurs. Elles ne doivent comporter aucune donnée personnelle sensible ou contenu attentatoire aux droits de tiers.</p>
            </div>
          )}

          {section === 'privacy' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#F6F0E7]">Politique de Confidentialité & RGPD</h2>
              <p className="text-[#B5AA9C]">Dernière mise à jour : 17 octobre 2026</p>
              <h3 className="font-bold text-[#F6F0E7] pt-2">1. Principe de Minimisation</h3>
              <p>Nous ne collectons que les données strictement indispensables au fonctionnement de votre compte : adresse e-mail, pseudonyme de joueur, préférences de langue, appartenance aux groupes privés et historique d’XP.</p>
              <h3 className="font-bold text-[#F6F0E7] pt-2">2. Confidentialité des Groupes Privés</h3>
              <p>Vos groupes et vos déclarations de défi ne sont jamais indexés publiquement sur les moteurs de recherche et ne sont accessibles qu’aux membres expressément autorisés.</p>
              <h3 className="font-bold text-[#F6F0E7] pt-2">3. Absence de Monétisation des Données</h3>
              <p>Lootsy ne revend, ne loue et ne partage aucune donnée personnelle à des courtiers en données ou régies publicitaires tierces.</p>
            </div>
          )}

          {section === 'cookies' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#F6F0E7]">Politique des Cookies & Traceurs</h2>
              <p className="text-[#B5AA9C]">Dernière mise à jour : 17 octobre 2026</p>
              <p>Lootsy n’utilise aucun traceur publicitaire ou outil de profilage tiers intrusif. Seuls des jetons de session strictement nécessaires à l’authentification et à la mémorisation de votre langue locale sont stockés sur votre terminal.</p>
            </div>
          )}

          {section === 'notices' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#F6F0E7]">Mentions Légales</h2>
              <p className="text-[#B5AA9C]">Dernière mise à jour : 17 octobre 2026</p>
              <p><strong>Éditeur du service :</strong> Lootsy Platform Team</p>
              <p><strong>Contact :</strong> support@lootsy.gg ou via notre formulaire de contact dédié.</p>
              <p><strong>Hébergement :</strong> Infrastructure Cloud haute disponibilité avec chiffrement des données au repos et en transit.</p>
            </div>
          )}

          {section === 'intellectual-property' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#F6F0E7]">Propriété Intellectuelle & Fortnite</h2>
              <p className="text-[#B5AA9C]">Dernière mise à jour : 17 octobre 2026</p>
              <div className="p-4 rounded-lg bg-[#171513] border border-[#FF6538]/40 space-y-2">
                <p className="font-bold text-[#FF6538]">Avis de non-affiliation :</p>
                <p className="text-xs text-[#B5AA9C]">
                  {t('legal', 'ipDisclaimer')}
                </p>
              </div>
              <p>
                L’ensemble des marques, logos, images et noms de jeux cités demeurent la propriété exclusive de leurs détenteurs respectifs. Leur mention sur Lootsy a pour unique objet d’identifier le contexte thématique des actualités et des défis.
              </p>
              <p>
                Le logo officiel de Lootsy (emblème circulaire ivoire avec barre diagonale orange) ainsi que l’architecture logicielle du site sont protégés par le droit d’auteur.
              </p>
            </div>
          )}

          {section === 'community' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#F6F0E7]">Règles de Communauté</h2>
              <p className="text-[#B5AA9C]">Dernière mise à jour : 17 octobre 2026</p>
              <p>Le respect mutuel et le fair-play constituent le cœur de Lootsy :</p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-[#B5AA9C]">
                <li>Interdiction absolue du harcèlement, des insultes ou de la discrimination.</li>
                <li>Respect de l’arbitrage des défis entre coéquipiers sans falsification délibérée de captures.</li>
                <li>Tout signalement d’abus est instruit avec impartialité par notre modération.</li>
              </ul>
            </div>
          )}

          {section === 'notifications' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#F6F0E7]">Information sur les Notifications</h2>
              <p className="text-[#B5AA9C]">Dernière mise à jour : 17 octobre 2026</p>
              <p>
                Les notifications internes sont délivrées directement au sein de l’interface Lootsy. Les notifications push web exigent votre accord explicite dans votre navigateur et peuvent être révoquées à tout instant depuis les paramètres de votre compte ou de votre système d’exploitation.
              </p>
            </div>
          )}

          {section === 'data-deletion' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#F6F0E7]">Procédure de Suppression des Données</h2>
              <p className="text-[#B5AA9C]">Dernière mise à jour : 17 octobre 2026</p>
              <p>
                Conformément à l’article 17 du RGPD, vous disposez d’un droit direct et autonome à l’effacement de vos données. L’action est accessible directement dans{' '}
                <button
                  onClick={() => navigate('/app/settings')}
                  className="text-[#FF6538] font-bold hover:underline"
                >
                  Paramètres &gt; Sécurité &amp; Confidentialité
                </button>.
              </p>
              <p className="text-xs text-[#B5AA9C]">
                La validation de la suppression entraîne la suppression immédiate et définitive de votre profil, la révocation de vos participations aux groupes privés et l’anonymisation des traces d’audit.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
