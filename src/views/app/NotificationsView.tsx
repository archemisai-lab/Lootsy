import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, ChevronRight, Settings } from 'lucide-react';

interface NotificationsViewProps {
  navigate: (route: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ navigate }) => {
  const { currentUser, notifications, markNotificationAsRead, markAllNotificationsAsRead, t, language } = useApp();

  if (!currentUser) return null;

  const myNotifs = notifications.filter((n) => n.uid === currentUser.uid);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#302923] pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F6F0E7]">
            {t('notifications', 'title')}
          </h1>
          <p className="text-xs text-[#B5AA9C] mt-1">
            {t('notifications', 'subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {myNotifs.some((n) => n.status === 'unread') && (
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs font-semibold text-[#FF6538] hover:underline flex items-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{t('notifications', 'markAllRead')}</span>
            </button>
          )}

          <button
            onClick={() => navigate('/app/settings')}
            className="p-2 rounded-lg bg-[#241f1c] text-[#B5AA9C] hover:text-[#F6F0E7] border border-[#302923] transition-colors"
            title="Paramètres de notification"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {myNotifs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#1e1a17] border border-[#302923] space-y-3">
          <Bell className="w-8 h-8 text-[#B5AA9C] mx-auto opacity-50" />
          <p className="text-xs text-[#B5AA9C]">{t('notifications', 'noNotifications')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myNotifs.map((notif) => {
            const isUnread = notif.status === 'unread';

            return (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationAsRead(notif.id);
                  if (notif.targetPath) {
                    navigate(notif.targetPath);
                  }
                }}
                className={`p-4 rounded-xl border transition-colors cursor-pointer flex items-start justify-between gap-4 ${
                  isUnread
                    ? 'bg-[#221c18] border-[#FF6538]/40 hover:bg-[#28211c]'
                    : 'bg-[#1a1715] border-[#302923] hover:bg-[#201c19]'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-[#FF6538] shrink-0" />
                    )}
                    <h3 className={`text-xs sm:text-sm font-bold ${isUnread ? 'text-[#F6F0E7]' : 'text-[#B5AA9C]'}`}>
                      {notif.title[language] || notif.title.fr}
                    </h3>
                  </div>

                  <p className="text-xs text-[#B5AA9C] leading-relaxed pl-4">
                    {notif.body[language] || notif.body.fr}
                  </p>

                  <span className="text-[11px] text-[#B5AA9C]/70 block pl-4 pt-1">
                    {new Date(notif.createdAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')} à {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <ChevronRight className="w-4 h-4 text-[#B5AA9C] shrink-0 mt-1" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
