import React from 'react';
import { useApp } from '../context/AppContext';
import { LootsyLogo } from './LootsyLogo';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { t } = useApp();

  return (
    <footer className="bg-[#12100E] border-t border-[#302923] text-xs text-[#B5AA9C] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-3">
            <LootsyLogo size={28} showWordmark={true} />
            <p className="text-[#B5AA9C] leading-relaxed max-w-xs text-xs">
              {t('common', 'tagline')}. La plateforme de défis gaming privés entre amis, centrée sur Fortnite pour son lancement MVP.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[#F6F0E7] font-semibold mb-3 tracking-wide text-xs">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/features')}
                  className="hover:text-[#F6F0E7] transition-colors"
                >
                  {t('nav', 'features')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/how-it-works')}
                  className="hover:text-[#F6F0E7] transition-colors"
                >
                  {t('nav', 'howItWorks')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/news')}
                  className="hover:text-[#F6F0E7] transition-colors"
                >
                  {t('nav', 'news')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/changelog')}
                  className="hover:text-[#F6F0E7] transition-colors"
                >
                  {t('nav', 'changelog')} (v1.0.0)
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Community */}
          <div>
            <h4 className="text-[#F6F0E7] font-semibold mb-3 tracking-wide text-xs">
              Support & Sécurité
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/faq')}
                  className="hover:text-[#F6F0E7] transition-colors"
                >
                  {t('nav', 'faq')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-[#F6F0E7] transition-colors"
                >
                  {t('nav', 'contact')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/legal/community')}
                  className="hover:text-[#F6F0E7] transition-colors"
                >
                  Règles de communauté
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/legal/data-deletion')}
                  className="hover:text-[#F6F0E7] transition-colors"
                >
                  Suppression des données
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div>
            <h4 className="text-[#F6F0E7] font-semibold mb-3 tracking-wide text-xs">
              Cadre Légal
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/legal/terms')}
                  className="hover:text-[#F6F0E7] transition-colors"
                >
                  Conditions d’utilisation
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/legal/privacy')}
                  className="hover:text-[#F6F0E7] transition-colors"
                >
                  Politique de confidentialité
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/legal/intellectual-property')}
                  className="hover:text-[#F6F0E7] transition-colors"
                >
                  Propriété intellectuelle
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/legal/notices')}
                  className="hover:text-[#F6F0E7] transition-colors"
                >
                  Mentions légales
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-[#302923]/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] text-[#B5AA9C]/80">
          <p className="max-w-2xl leading-normal">
            {t('legal', 'ipDisclaimer')}
          </p>
          <div className="shrink-0 text-right">
            © {new Date().getFullYear()} Lootsy. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
};
