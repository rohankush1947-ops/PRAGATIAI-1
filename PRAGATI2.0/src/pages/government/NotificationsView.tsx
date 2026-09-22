import React, { useState } from 'react';
import { usePragati } from '../../context/PragatiContext';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  Filter, 
  AlertCircle, 
  FileCheck, 
  Briefcase, 
  ShoppingCart,
  Award
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = usePragati();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter(n => filter === 'all' || !n.read);

  const getIcon = (type: string) => {
    switch (type) {
      case 'application':
        return UsersIcon;
      case 'pilot':
        return Briefcase;
      case 'evaluation':
        return Award;
      case 'validation':
        return CheckCircle2;
      case 'procurement':
        return ShoppingCart;
      default:
        return Bell;
    }
  };

  const UsersIcon = ({ className }: { className?: string }) => (
    <Bell className={className} />
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 mb-1">
            <Bell className="w-4 h-4" />
            <span>Platform Alerts & Messages</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track real-time system notices, evaluation triggers, and pilot milestone updates.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-sm transition-colors self-start sm:self-auto"
        >
          Mark All Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filter === 'all' ? 'bg-sky-700 text-white font-semibold shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filter === 'unread' ? 'bg-sky-700 text-white font-semibold shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          Unread ({notifications.filter(n => !n.read).length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No notifications to display.
          </div>
        ) : (
          filtered.map((n) => {
            const Icon = getIcon(n.type);
            return (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`py-4 px-3 flex items-start gap-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer ${
                  !n.read ? 'bg-sky-50/50' : ''
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  !n.read ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`font-bold ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {n.time}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                </div>

                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0 mt-2" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
