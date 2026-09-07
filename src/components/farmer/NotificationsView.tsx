import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  Truck,
  MessageSquareText,
  TrendingUp,
  Warehouse,
  Coins,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { NotificationItem, FarmerDashboardTab } from '../../types/farmer';
import { LanguageCode } from '../../types';
import { getFarmerTranslations } from '../../data/farmerTranslations';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectTab: (tab: FarmerDashboardTab) => void;
  currentLanguage: LanguageCode;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllAsRead,
  onSelectTab,
  currentLanguage,
}) => {
  const [filter, setFilter] = useState<'All' | 'Unread'>('All');

  const t = getFarmerTranslations(currentLanguage);
  const nT = t.notificationsView;

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'Unread') return !n.read;
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'pickup':
        return <Truck className="w-5 h-5 text-[#245C3A]" />;
      case 'enquiry':
        return <MessageSquareText className="w-5 h-5 text-[#B86F4B]" />;
      case 'price_alert':
        return <TrendingUp className="w-5 h-5 text-[#D6A63A]" />;
      case 'storage':
        return <Warehouse className="w-5 h-5 text-[#5F8F45]" />;
      default:
        return <Coins className="w-5 h-5 text-[#245C3A]" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-[#EEF3E8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔔</span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#26332B]">
              {nT.title}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#68736B] mt-0.5">
            {nT.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAllAsRead}
            className="px-3.5 py-2 rounded-xl bg-[#EEF3E8] hover:bg-[#245C3A] hover:text-white text-[#245C3A] text-xs font-bold transition-colors cursor-pointer"
          >
            {nT.markAllReadBtn}
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifs.length === 0 ? (
        <div className="p-10 bg-white rounded-3xl border border-[#EEF3E8] text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-[#26332B]">{nT.noNotifications}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                !notif.read
                  ? 'bg-white border-[#5F8F45]/40 shadow-xs ring-1 ring-[#5F8F45]/20'
                  : 'bg-[#FBFAF4] border-[#EEF3E8]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white border border-[#EEF3E8] shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#26332B]">{notif.title}</h4>
                  <p className="text-xs text-[#68736B] mt-0.5">{notif.message}</p>
                  <span className="text-[10px] text-gray-400 font-medium block mt-1">
                    {notif.timestamp}
                  </span>
                </div>
              </div>

              {notif.actionTab && (
                <button
                  onClick={() => onSelectTab(notif.actionTab!)}
                  className="px-3 py-1.5 rounded-xl bg-[#245C3A] hover:bg-[#1B432B] text-white text-xs font-bold shrink-0 cursor-pointer"
                >
                  {t.home.sections.viewAll}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
