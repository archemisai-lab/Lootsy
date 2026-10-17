import React from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, Globe, LogOut } from 'lucide-react';

export const DemoUserBar: React.FC = () => {
  const { currentUser, users, switchDemoUser, logout, language, setLanguage } = useApp();

  return (
    <div className="bg-[#100E0D] border-b border-[#302923]/60 px-4 py-1.5 text-xs text-[#B5AA9C] flex items-center justify-between gap-4 overflow-x-auto whitespace-nowrap">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 font-medium text-[#F6F0E7]">
          <UserCheck className="w-3.5 h-3.5 text-[#FF6538]" />
          <span>Session :</span>
        </span>

        <div className="flex items-center gap-1.5">
          {users.map((user) => {
            const isActive = currentUser?.uid === user.uid;
            return (
              <button
                key={user.uid}
                onClick={() => switchDemoUser(user.uid)}
                className={`px-2 py-0.5 rounded transition-colors text-[11px] ${
                  isActive
                    ? 'bg-[#302923] text-[#F6F0E7] font-semibold border border-[#FF6538]/50'
                    : 'text-[#B5AA9C] hover:text-[#F6F0E7] hover:bg-[#302923]/40'
                }`}
              >
                {user.displayName} {user.role === 'admin' ? '(Admin)' : ''}
              </button>
            );
          })}

          <button
            onClick={logout}
            className={`px-2 py-0.5 rounded transition-colors text-[11px] ${
              currentUser === null
                ? 'bg-[#302923] text-[#F6F0E7] font-semibold border border-[#FF6538]/50'
                : 'text-[#B5AA9C] hover:text-[#F6F0E7] hover:bg-[#302923]/40'
            }`}
          >
            Visiteur non connecté
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1 text-[11px]">
          <Globe className="w-3 h-3 text-[#B5AA9C]" />
          <button
            onClick={() => setLanguage('fr')}
            className={`px-1.5 py-0.5 rounded ${
              language === 'fr' ? 'text-[#FF6538] font-bold' : 'text-[#B5AA9C] hover:text-[#F6F0E7]'
            }`}
          >
            FR
          </button>
          <span>/</span>
          <button
            onClick={() => setLanguage('en')}
            className={`px-1.5 py-0.5 rounded ${
              language === 'en' ? 'text-[#FF6538] font-bold' : 'text-[#B5AA9C] hover:text-[#F6F0E7]'
            }`}
          >
            EN
          </button>
        </div>

        {currentUser && (
          <button
            onClick={logout}
            className="flex items-center gap-1 text-[#B5AA9C] hover:text-[#FF6538] transition-colors text-[11px]"
            title="Se déconnecter"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Quitter</span>
          </button>
        )}
      </div>
    </div>
  );
};
