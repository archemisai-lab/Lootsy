import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LootsyLogo } from './LootsyLogo';
import { Menu, X, Bell, Shield, User, LogIn, LogOut, ChevronDown } from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, navigate }) => {
  const { currentUser, t, unreadCount, language, setLanguage, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isAuthRoute =
    currentRoute === '/login' ||
    currentRoute === '/signup' ||
    currentRoute === '/forgot-password' ||
    currentRoute === '/onboarding';

  const isAppRoute = currentRoute.startsWith('/app') || currentRoute.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 bg-[#171513]/95 backdrop-blur-md border-b border-[#302923]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => navigate(currentUser ? '/app' : '/')}
          className="flex items-center gap-2.5 text-left focus-visible:outline-none shrink-0"
        >
          <LootsyLogo size={32} showWordmark={true} wordmarkClassName="text-xl" />
        </button>

        {/* Zone 2: 4–5 single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-[#B5AA9C]">
          {!currentUser ? (
            <>
              <button
                onClick={() => navigate('/features')}
                className={`transition-colors whitespace-nowrap hover:text-[#F6F0E7] ${
                  currentRoute === '/features' ? 'text-[#FF6538]' : ''
                }`}
              >
                {t('nav', 'features')}
              </button>
              <button
                onClick={() => navigate('/how-it-works')}
                className={`transition-colors whitespace-nowrap hover:text-[#F6F0E7] ${
                  currentRoute === '/how-it-works' ? 'text-[#FF6538]' : ''
                }`}
              >
                {t('nav', 'howItWorks')}
              </button>
              <button
                onClick={() => navigate('/news')}
                className={`transition-colors whitespace-nowrap hover:text-[#F6F0E7] ${
                  currentRoute.startsWith('/news') ? 'text-[#FF6538]' : ''
                }`}
              >
                {t('nav', 'news')}
              </button>
              <button
                onClick={() => navigate('/faq')}
                className={`transition-colors whitespace-nowrap hover:text-[#F6F0E7] ${
                  currentRoute === '/faq' ? 'text-[#FF6538]' : ''
                }`}
              >
                {t('nav', 'faq')}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/app')}
                className={`transition-colors whitespace-nowrap hover:text-[#F6F0E7] ${
                  currentRoute === '/app' ? 'text-[#FF6538]' : ''
                }`}
              >
                {t('common', 'dashboard')}
              </button>
              <button
                onClick={() => navigate('/app/news')}
                className={`transition-colors whitespace-nowrap hover:text-[#F6F0E7] ${
                  currentRoute.startsWith('/app/news') || currentRoute.startsWith('/app/saved')
                    ? 'text-[#FF6538]'
                    : ''
                }`}
              >
                {t('common', 'radar')}
              </button>
              <button
                onClick={() => navigate('/app/groups')}
                className={`transition-colors whitespace-nowrap hover:text-[#F6F0E7] ${
                  currentRoute.startsWith('/app/groups') ? 'text-[#FF6538]' : ''
                }`}
              >
                {t('common', 'groups')}
              </button>
              <button
                onClick={() => navigate('/app/challenges')}
                className={`transition-colors whitespace-nowrap hover:text-[#F6F0E7] ${
                  currentRoute.startsWith('/app/challenges') ? 'text-[#FF6538]' : ''
                }`}
              >
                {t('common', 'challenges')}
              </button>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className={`flex items-center gap-1.5 transition-colors whitespace-nowrap hover:text-[#F6F0E7] ${
                    currentRoute.startsWith('/admin') ? 'text-[#FF6538]' : ''
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-[#FF6538]" />
                  <span>{t('common', 'admin')}</span>
                </button>
              )}
            </>
          )}
        </nav>

        {/* Zone 3: Actions & Language */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 text-xs border border-[#302923] rounded-lg px-2 py-1 bg-[#100E0D] shrink-0">
            <button
              onClick={() => setLanguage('fr')}
              className={`transition-colors font-semibold ${language === 'fr' ? 'text-[#FF6538]' : 'text-[#B5AA9C] hover:text-[#F6F0E7]'}`}
            >
              FR
            </button>
            <span className="text-[#302923]">|</span>
            <button
              onClick={() => setLanguage('en')}
              className={`transition-colors font-semibold ${language === 'en' ? 'text-[#FF6538]' : 'text-[#B5AA9C] hover:text-[#F6F0E7]'}`}
            >
              EN
            </button>
          </div>

          {!currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/login')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#F6F0E7] hover:text-[#FF6538] transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('common', 'signIn')}</span>
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="hidden sm:inline-flex px-4 py-2 text-xs font-bold text-white bg-[#FF6538] hover:bg-[#ff7a53] active:bg-[#e0542a] rounded-lg transition-colors shadow-sm"
              >
                {t('nav', 'joinLootsy')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notifications shortcut */}
              <button
                onClick={() => navigate('/app/notifications')}
                className="relative p-2 rounded-lg text-[#B5AA9C] hover:text-[#F6F0E7] hover:bg-[#302923] transition-colors shrink-0"
                aria-label={t('common', 'notifications')}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6538]" />
                )}
              </button>

              {/* User profile dropdown (desktop & tablet) */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg bg-[#302923]/70 hover:bg-[#302923] border border-[#302923] text-left transition-colors"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName}
                      className="w-6 h-6 rounded-full object-cover border border-[#B5AA9C]/30 shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#171513] border border-[#B5AA9C]/30 flex items-center justify-center text-xs font-bold text-[#F6F0E7] shrink-0">
                      {currentUser.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-medium text-[#F6F0E7] max-w-[120px] truncate flex items-center gap-1.5">
                    <span className="truncate">{currentUser.displayName}</span>
                    {currentUser.isVerified && (
                      <VerifiedBadge size="xs" variant="blue" title="Compte certifié officiel" />
                    )}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#B5AA9C]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1f1b18] border border-[#302923] rounded-lg shadow-xl py-1 z-50 text-xs">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/app/profile');
                      }}
                      className="w-full text-left px-3 py-2 text-[#F6F0E7] hover:bg-[#302923] flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-[#B5AA9C]" />
                      <span>{t('common', 'profile')}</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/app/settings');
                      }}
                      className="w-full text-left px-3 py-2 text-[#F6F0E7] hover:bg-[#302923] flex items-center gap-2"
                    >
                      <span>{t('common', 'settings')}</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/app/help');
                      }}
                      className="w-full text-left px-3 py-2 text-[#F6F0E7] hover:bg-[#302923] flex items-center gap-2"
                    >
                      <span>{t('common', 'help')}</span>
                    </button>
                    <div className="border-t border-[#302923] my-1" />
                    <button
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        await logout();
                        navigate('/');
                      }}
                      className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      <span>{t('common', 'signOut')}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile menu button (3 horizontal bars) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#B5AA9C] hover:text-[#F6F0E7] hover:bg-[#302923]/60 rounded-lg shrink-0 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#302923] bg-[#171513] px-4 py-4 space-y-2 text-sm font-bold">
          {!currentUser ? (
            <>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/features');
                }}
                className="block w-full text-left py-2 text-[#B5AA9C] hover:text-[#F6F0E7]"
              >
                {t('nav', 'features')}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/how-it-works');
                }}
                className="block w-full text-left py-2 text-[#B5AA9C] hover:text-[#F6F0E7]"
              >
                {t('nav', 'howItWorks')}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/news');
                }}
                className="block w-full text-left py-2 text-[#B5AA9C] hover:text-[#F6F0E7]"
              >
                {t('nav', 'news')}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/faq');
                }}
                className="block w-full text-left py-2 text-[#B5AA9C] hover:text-[#F6F0E7]"
              >
                {t('nav', 'faq')}
              </button>
              <div className="pt-3 border-t border-[#302923] flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/signup');
                  }}
                  className="w-full py-2.5 text-center text-xs font-bold text-white bg-[#FF6538] hover:bg-[#ff7a53] active:bg-[#e0542a] rounded-lg transition-colors shadow-sm"
                >
                  {t('nav', 'joinLootsy')}
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full py-2 text-center text-xs font-semibold text-[#F6F0E7] hover:text-[#FF6538] transition-colors"
                >
                  {t('common', 'signIn')}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* User Identity Header Card */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1f1b18] border border-[#302923] mb-3">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName}
                    className="w-8 h-8 rounded-full object-cover border border-[#B5AA9C]/30 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#171513] border border-[#B5AA9C]/30 flex items-center justify-center text-xs font-bold text-[#F6F0E7] shrink-0">
                    {currentUser.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-[#F6F0E7] truncate flex items-center gap-1.5">
                    <span>{currentUser.displayName}</span>
                    {currentUser.isVerified && (
                      <VerifiedBadge size="sm" variant="blue" title="Compte certifié officiel" />
                    )}
                  </div>
                  <div className="text-xs text-[#B5AA9C] truncate">{currentUser.email}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/app');
                }}
                className="block w-full text-left py-2 text-[#F6F0E7] hover:text-[#FF6538]"
              >
                {t('common', 'dashboard')}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/app/news');
                }}
                className="block w-full text-left py-2 text-[#B5AA9C] hover:text-[#F6F0E7]"
              >
                {t('common', 'radar')}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/app/groups');
                }}
                className="block w-full text-left py-2 text-[#B5AA9C] hover:text-[#F6F0E7]"
              >
                {t('common', 'groups')}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/app/challenges');
                }}
                className="block w-full text-left py-2 text-[#B5AA9C] hover:text-[#F6F0E7]"
              >
                {t('common', 'challenges')}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/app/notifications');
                }}
                className="block w-full text-left py-2 text-[#B5AA9C] hover:text-[#F6F0E7]"
              >
                {t('common', 'notifications')} {unreadCount > 0 && `(${unreadCount})`}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/app/profile');
                }}
                className="block w-full text-left py-2 text-[#B5AA9C] hover:text-[#F6F0E7]"
              >
                {t('common', 'profile')}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/app/settings');
                }}
                className="block w-full text-left py-2 text-[#B5AA9C] hover:text-[#F6F0E7]"
              >
                {t('common', 'settings')}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/app/help');
                }}
                className="block w-full text-left py-2 text-[#B5AA9C] hover:text-[#F6F0E7]"
              >
                {t('common', 'help')}
              </button>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/admin');
                  }}
                  className="block w-full text-left py-2 text-[#FF6538] font-semibold"
                >
                  {t('common', 'admin')}
                </button>
              )}
              <div className="border-t border-[#302923] pt-2">
                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                    navigate('/');
                  }}
                  className="block w-full text-left py-2 text-rose-400 font-semibold"
                >
                  {t('common', 'signOut')}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};
