import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LootsyLogo } from './LootsyLogo';
import { Menu, X, Bell, Shield, User, LogIn, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, navigate }) => {
  const { currentUser, t, unreadCount } = useApp();
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => navigate(currentUser ? '/app' : '/')}
          className="flex items-center gap-2.5 text-left focus-visible:outline-none shrink-0"
        >
          <LootsyLogo size={32} showWordmark={true} wordmarkClassName="text-xl" />
        </button>

        {/* Zone 2: 4–5 single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#B5AA9C]">
          {!currentUser ? (
            <>
              <button
                onClick={() => navigate('/features')}
                className={`transition-colors whitespace-nowrap hover:text-[#F6F0E7] ${
                  currentRoute === '/features' ? 'text-[#FF6538] font-semibold' : ''
                }`}
              >
                {t('nav', 'features')}
              </button>
              <button
                onClick={() => navigate('/how-it-works')}
                className={`transition-colors whitespace-nowrap hover:text-[#F6F0E7] ${
                  currentRoute === '/how-it-works' ? 'text-[#FF6538] font-semibold' : ''
                }`}
              >
                {t('nav', 'howItWorks')}
              </button>
              <button
                onClick={() => navigate('/news')}
                className={`transition-colors whitespace-nowrap hover:text-[#F6F0E7] ${
                  currentRoute.startsWith('/news') ? 'text-[#FF6538] font-semibold' : ''
                }`}
              >
                {t('nav', 'news')}
              </button>
              <button
                onClick={() => navigate('/faq')}
                className={`transition-colors whitespace-nowrap hover:text-[#F6F0E7] ${
                  currentRoute === '/faq' ? 'text-[#FF6538] font-semibold' : ''
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
                  currentRoute === '/app' ? 'text-[#FF6538] font-semibold' : ''
                }`}
              >
                {t('common', 'dashboard')}
              </button>
              <button
                onClick={() => navigate('/app/news')}
                className={`transition-colors whitespace-nowrap hover:text-[#F6F0E7] ${
                  currentRoute.startsWith('/app/news') || currentRoute.startsWith('/app/saved')
                    ? 'text-[#FF6538] font-semibold'
                    : ''
                }`}
              >
                {t('common', 'radar')}
              </button>
              <button
                onClick={() => navigate('/app/groups')}
                className={`transition-colors whitespace-nowrap hover:text-[#F6F0E7] ${
                  currentRoute.startsWith('/app/groups') ? 'text-[#FF6538] font-semibold' : ''
                }`}
              >
                {t('common', 'groups')}
              </button>
              <button
                onClick={() => navigate('/app/challenges')}
                className={`transition-colors whitespace-nowrap hover:text-[#F6F0E7] ${
                  currentRoute.startsWith('/app/challenges') ? 'text-[#FF6538] font-semibold' : ''
                }`}
              >
                {t('common', 'challenges')}
              </button>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className={`flex items-center gap-1.5 transition-colors whitespace-nowrap hover:text-[#F6F0E7] ${
                    currentRoute.startsWith('/admin') ? 'text-[#FF6538] font-semibold' : ''
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-[#FF6538]" />
                  <span>{t('common', 'admin')}</span>
                </button>
              )}
            </>
          )}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {!currentUser ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#F6F0E7] hover:text-[#FF6538] transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('common', 'signIn')}</span>
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 text-xs font-bold text-white bg-[#FF6538] hover:bg-[#ff7a53] active:bg-[#e0542a] rounded-lg transition-colors shadow-sm"
              >
                {t('nav', 'joinLootsy')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Notifications shortcut */}
              <button
                onClick={() => navigate('/app/notifications')}
                className="relative p-2 rounded-lg text-[#B5AA9C] hover:text-[#F6F0E7] hover:bg-[#302923] transition-colors"
                aria-label={t('common', 'notifications')}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6538]" />
                )}
              </button>

              {/* User profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg bg-[#302923]/70 hover:bg-[#302923] border border-[#302923] text-left transition-colors"
                >
                  <div className="w-6 h-6 rounded-md bg-[#171513] border border-[#B5AA9C]/30 flex items-center justify-center text-xs font-bold text-[#F6F0E7]">
                    {currentUser.displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-xs font-medium text-[#F6F0E7] max-w-[100px] truncate">
                    {currentUser.displayName}
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
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#B5AA9C] hover:text-[#F6F0E7] rounded-lg"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#302923] bg-[#171513] px-4 py-4 space-y-2 text-sm">
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
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="block w-full text-left py-2 text-[#FF6538] font-semibold"
              >
                {t('common', 'signIn')}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/app');
                }}
                className="block w-full text-left py-2 text-[#F6F0E7]"
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
                {t('common', 'notifications')} ({unreadCount})
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
            </>
          )}
        </div>
      )}
    </header>
  );
};
