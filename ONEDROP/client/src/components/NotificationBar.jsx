import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Heart, 
  Sparkles, 
  Trash2, 
  CheckCheck, 
  X, 
  Award, 
  Megaphone,
  Smartphone,
  ExternalLink
} from 'lucide-react';

const formatTimeAgo = (dateInput) => {
  if (!dateInput) return 'Just now';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Just now';
  
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 30) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const NotificationBar = ({
  notifications = [],
  unreadCount = 0,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  isOpen,
  onClose,
  pushEnabled,
  onEnablePush,
  inline = false
}) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'urgent'
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    if (inline) return;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose?.();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, inline]);

  if (!isOpen && !inline) return null;

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'urgent') return notif.type === 'emergency_request' || notif.type === 'warning' || notif.bloodRequest?.emergencyMode;
    return true;
  });

  const getNotifIcon = (type) => {
    switch (type) {
      case 'chat':
      case 'chat_message':
        return <MessageSquare className="w-4 h-4 text-indigo-500" />;
      case 'warning':
      case 'emergency_request':
      case 'new_request':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'request_accepted':
        return <Heart className="w-4 h-4 text-emerald-500" />;
      case 'greeting':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'certificate_issued':
        return <Award className="w-4 h-4 text-yellow-500" />;
      case 'camp_announcement':
      case 'admin_broadcast':
      case 'general_announcement':
        return <Megaphone className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleAction = (notif) => {
    onMarkRead?.(notif._id || notif.id);
    if (!inline) onClose?.();

    if (notif.chatPartnerId || notif.donor?._id || notif.donor) {
      const partnerId = notif.chatPartnerId || notif.donor?._id || notif.donor;
      const chatId = notif.chatId || notif.chat;
      navigate(chatId ? `/chat?chatId=${chatId}` : `/chat?partnerId=${partnerId}`);
    } else if (notif.bloodRequest || notif.requestId) {
      navigate('/donor');
    } else if (notif.type === 'camp_announcement') {
      navigate('/campaigns');
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={
        inline
          ? "w-full bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden"
          : "absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-[70] overflow-hidden transition-all animate-in fade-in slide-in-from-top-2 duration-200"
      }
    >
      {/* Header Bar */}
      <div className="p-4 bg-slate-50/80 dark:bg-dark-850/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 font-sans">Notifications</h3>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAllRead?.();
              }}
              className="text-[11px] font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 font-sans"
              title="Mark all notifications as read"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-dark-900 px-3 pt-2 text-xs font-semibold">
        <button
          onClick={() => setFilter('all')}
          className={`pb-2 px-3 border-b-2 transition-colors ${
            filter === 'all'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`pb-2 px-3 border-b-2 transition-colors ${
            filter === 'unread'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('urgent')}
          className={`pb-2 px-3 border-b-2 transition-colors ${
            filter === 'urgent'
              ? 'border-rose-500 text-rose-600 dark:text-rose-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          🚨 Urgent
        </button>
      </div>

      {/* Enable Device Notifications Banner */}
      {!pushEnabled && (
        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-medium">
            <Smartphone className="w-4 h-4 text-indigo-500 flex-shrink-0 animate-bounce" />
            <span className="text-[11px] leading-tight">Get alerts on mobile status bar</span>
          </div>
          <button
            onClick={onEnablePush}
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[10px] shadow-sm transition-all"
          >
            Enable
          </button>
        </div>
      )}

      {/* Notification Items List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-dark-800 mx-auto flex items-center justify-center text-slate-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">No notifications found</p>
            <p className="text-[11px] text-slate-400">You're all caught up with your blood matches and alerts!</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const notifId = notif._id || notif.id;
            const titleText = notif.title || (notif.type === 'chat' || notif.type === 'chat_message' ? 'New Message' : notif.type === 'new_request' ? 'Blood Request' : 'ONEDROP Alert');
            const isUnread = !notif.read;

            return (
              <div
                key={notifId}
                className={`p-3.5 hover:bg-slate-50/80 dark:hover:bg-dark-800/50 transition-colors flex gap-3 relative group ${
                  isUnread ? 'bg-indigo-50/30 dark:bg-indigo-950/10' : ''
                }`}
              >
                {/* Visual unread dot */}
                {isUnread && (
                  <span className="absolute top-4 right-3 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                )}

                {/* Icon Column */}
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-dark-800 flex items-center justify-center shadow-xs border border-slate-200/50 dark:border-slate-700/50">
                    {getNotifIcon(notif.type)}
                  </div>
                </div>

                {/* Text & Details Column */}
                <div className="flex-grow min-w-0 pr-4">
                  <div className="flex items-center justify-between gap-1">
                    <p className="font-extrabold text-xs text-slate-800 dark:text-slate-100 truncate font-sans">
                      {titleText}
                    </p>
                    <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">
                      {formatTimeAgo(notif.createdAt)}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed line-clamp-2 break-words">
                    {notif.message}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-2">
                    {(notif.chatPartnerId || notif.donor || notif.bloodRequest || notif.type === 'chat_message' || notif.type === 'chat') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(notif);
                        }}
                        className="px-2.5 py-1 bg-primary-600 hover:bg-primary-700 text-white font-extrabold rounded-md text-[10px] flex items-center gap-1 shadow-xs transition-all active:scale-95"
                      >
                        Action <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    )}

                    {isUnread && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkRead?.(notifId);
                        }}
                        className="text-[10px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                      >
                        Mark read
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(notifId);
                      }}
                      className="ml-auto opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-all p-1"
                      title="Delete notification"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-slate-50 dark:bg-dark-850 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-[10px] font-semibold text-slate-400">
          ONEDROP Real-time Alert & Notification Feed
        </p>
      </div>
    </div>
  );
};

export default NotificationBar;
