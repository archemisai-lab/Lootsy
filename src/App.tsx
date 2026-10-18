import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Public views
import { HomeView } from './views/public/HomeView';
import { FeaturesView } from './views/public/FeaturesView';
import { HowItWorksView } from './views/public/HowItWorksView';
import { RadarView } from './views/public/RadarView';
import { NewsDetailView } from './views/public/NewsDetailView';
import { FaqView } from './views/public/FaqView';
import { ContactView } from './views/public/ContactView';
import { ChangelogView } from './views/public/ChangelogView';
import { LegalView } from './views/public/LegalView';

// Auth views
import { LoginView } from './views/auth/LoginView';
import { SignupView } from './views/auth/SignupView';
import { ForgotPasswordView } from './views/auth/ForgotPasswordView';
import { OnboardingView } from './views/auth/OnboardingView';

// App views
import { DashboardView } from './views/app/DashboardView';
import { GroupsListView } from './views/app/GroupsListView';
import { GroupDetailView } from './views/app/GroupDetailView';
import { NewGroupView } from './views/app/NewGroupView';
import { JoinGroupView } from './views/app/JoinGroupView';
import { ChallengesListView } from './views/app/ChallengesListView';
import { ChallengeDetailView } from './views/app/ChallengeDetailView';
import { NewChallengeView } from './views/app/NewChallengeView';
import { NotificationsView } from './views/app/NotificationsView';
import { SavedNewsView } from './views/app/SavedNewsView';
import { ProfileView } from './views/app/ProfileView';
import { SettingsView } from './views/app/SettingsView';
import { AdminView } from './views/admin/AdminView';

const AppContent: React.FC = () => {
  const { currentUser, authLoading, firebaseError, clearFirebaseError } = useApp();

  // Route state initialized from window.location.pathname or hash
  const [route, setRoute] = useState<string>(() => {
    if (window.location.hash) {
      return window.location.hash.replace('#', '') || '/';
    }
    return window.location.pathname || '/';
  });

  // Sync route changes to URL hash for browser back/forward and deep linking
  const navigate = (newRoute: string) => {
    window.location.hash = newRoute;
    setRoute(newRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const current = window.location.hash.replace('#', '') || '/';
      setRoute(current);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Protect /app and /admin routes once auth is resolved
  useEffect(() => {
    if (!authLoading && !currentUser && (route.startsWith('/app') || route.startsWith('/admin'))) {
      navigate('/login');
    }
  }, [currentUser, authLoading, route]);

  // Route Dispatcher
  const renderView = () => {
    // 1. Public Routes
    if (route === '/') {
      return <HomeView navigate={navigate} />;
    }
    if (route === '/features') {
      return <FeaturesView navigate={navigate} />;
    }
    if (route === '/how-it-works') {
      return <HowItWorksView navigate={navigate} />;
    }
    if (route === '/news') {
      return <RadarView navigate={navigate} isAppView={false} />;
    }
    if (route.startsWith('/news/')) {
      const slug = route.replace('/news/', '');
      return <NewsDetailView slugOrId={slug} navigate={navigate} isAppView={false} />;
    }
    if (route === '/faq') {
      return <FaqView navigate={navigate} />;
    }
    if (route === '/contact') {
      return <ContactView navigate={navigate} />;
    }
    if (route === '/changelog') {
      return <ChangelogView navigate={navigate} />;
    }
    if (route.startsWith('/legal')) {
      const section = route.replace('/legal/', '').replace('/legal', '') || 'index';
      return <LegalView section={section} navigate={navigate} />;
    }

    // 2. Auth Routes
    if (route === '/login') {
      return <LoginView navigate={navigate} />;
    }
    if (route === '/signup') {
      return <SignupView navigate={navigate} />;
    }
    if (route === '/forgot-password') {
      return <ForgotPasswordView navigate={navigate} />;
    }
    if (route === '/onboarding') {
      return <OnboardingView navigate={navigate} />;
    }

    // 3. Connected App Routes
    if (route === '/app') {
      return <DashboardView navigate={navigate} />;
    }
    if (route === '/app/news') {
      return <RadarView navigate={navigate} isAppView={true} />;
    }
    if (route.startsWith('/app/news/')) {
      const id = route.replace('/app/news/', '');
      return <NewsDetailView slugOrId={id} navigate={navigate} isAppView={true} />;
    }
    if (route === '/app/saved') {
      return <SavedNewsView navigate={navigate} />;
    }
    if (route === '/app/notifications' || route === '/app/settings/notifications') {
      return <NotificationsView navigate={navigate} />;
    }
    if (route === '/app/groups') {
      return <GroupsListView navigate={navigate} />;
    }
    if (route === '/app/groups/new') {
      return <NewGroupView navigate={navigate} />;
    }
    if (route === '/app/groups/join') {
      return <JoinGroupView navigate={navigate} />;
    }
    if (route.startsWith('/app/groups/')) {
      const groupId = route.replace('/app/groups/', '');
      return <GroupDetailView groupId={groupId} navigate={navigate} />;
    }
    if (route === '/app/challenges') {
      return <ChallengesListView navigate={navigate} />;
    }
    if (route === '/app/challenges/new') {
      return <NewChallengeView navigate={navigate} />;
    }
    if (route.startsWith('/app/challenges/')) {
      const challengeId = route.replace('/app/challenges/', '');
      return <ChallengeDetailView challengeId={challengeId} navigate={navigate} />;
    }
    if (route === '/app/profile') {
      return <ProfileView navigate={navigate} />;
    }
    if (route === '/app/settings' || route === '/app/settings/security' || route === '/app/settings/privacy') {
      return <SettingsView navigate={navigate} />;
    }
    if (route === '/app/help') {
      return <FaqView navigate={navigate} />;
    }

    // 4. Admin
    if (route.startsWith('/admin')) {
      return <AdminView navigate={navigate} />;
    }

    // Fallback 404
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-extrabold text-[#F6F0E7]">Page introuvable (404)</h2>
        <p className="text-xs text-[#B5AA9C]">La destination demandée n’existe pas ou a été déplacée.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-lg bg-[#FF6538] text-white text-xs font-bold"
        >
          Retour à l’accueil
        </button>
      </div>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#171513] text-[#F6F0E7] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#FF6538] border-t-transparent animate-spin" />
        <p className="text-xs tracking-wider uppercase text-[#B5AA9C] font-semibold">Connexion à Lootsy...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#171513] text-[#F6F0E7]">
      {/* Main Top Bar */}
      <Header currentRoute={route} navigate={navigate} />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {renderView()}
      </main>

      {/* Legal & Brand Footer */}
      <Footer navigate={navigate} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
