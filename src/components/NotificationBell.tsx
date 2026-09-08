'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Info, 
  CheckCheck, 
  ArrowRight, 
  ChevronRight,
  Settings,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { MOCK_NOTIFICATIONS, MockNotification } from '@/data/mockNotifications';

export default function NotificationBell() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<MockNotification[]>(MOCK_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Fetch live notifications on mount if available
  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setNotifications(json.data);
          }
        }
      } catch {
        // Fallback to initial mock notifications
      }
    }
    loadNotifications();
  }, []);

  // Handle clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllAsRead = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    // Sync with API silently
    fetch('/api/notifications/read-all', { method: 'POST' }).catch(() => {});
  };

  const handleNotificationClick = (notif: MockNotification) => {
    // 1. Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );

    // 2. Close popup
    setIsOpen(false);

    // 3. Resolve deeplink: prioritizes direct action deeplink, falls back to detail view
    const targetDeeplink = notif.linkHref || `/notifikasi/${notif.id}`;
    router.push(targetDeeplink);
  };

  const getNotificationIcon = (type: MockNotification['type']) => {
    switch (type) {
      case 'order_success':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'order_created':
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        );
      case 'order_failed':
        return (
          <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
            <XCircle className="w-4 h-4" />
          </div>
        );
      case 'promo':
        return (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500/25 to-purple-500/25 text-pink-400 border border-pink-500/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
        );
      case 'system':
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition cursor-pointer ${
          isOpen
            ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
        title="Notifikasi & Pembaruan"
        aria-label="Pemberitahuan"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5" />

        {/* Pulsing Unread Indicator Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-gradient-to-r from-red-500 to-pink-500 text-[9px] font-extrabold text-white items-center justify-center shadow-md shadow-red-500/50">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Popover / Popup Modal Container */}
      {isOpen && (
        <>
          {/* Mobile backdrop overlay */}
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Popup card */}
          <div className="fixed left-3 right-3 top-18 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2.5 sm:w-96 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl shadow-black/80 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Popover Header */}
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Notifikasi</span>
                {unreadCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30">
                    {unreadCount} Baru
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-medium">
                    Semua Terbaca
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer transition"
                    title="Tandai semua pesan sudah dibaca"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Baca Semua</span>
                  </button>
                )}
              </div>
            </div>

            {/* List of recent notifications with Deeplink Redirection */}
            <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-800/60 scrollbar-thin">
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 hover:bg-slate-800/70 transition-all flex items-start gap-3 cursor-pointer group select-none ${
                      !notif.isRead ? 'bg-blue-500/10 border-l-2 border-l-blue-500' : 'opacity-85 hover:opacity-100'
                    }`}
                  >
                    {/* Status Icon */}
                    <div className="mt-0.5">
                      {getNotificationIcon(notif.type)}
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="font-bold text-xs text-white group-hover:text-blue-400 transition-colors truncate">
                          {notif.title}
                        </h4>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                        )}
                      </div>

                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>

                      <div className="flex items-center justify-between pt-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-500 font-medium">
                          {notif.createdAt}
                        </span>

                        {/* Deeplink Action Indicator */}
                        <div className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 group-hover:text-cyan-300 transition-colors">
                          <span>{notif.linkText || 'Buka'}</span>
                          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <Bell className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-slate-400">Belum ada notifikasi baru</p>
                </div>
              )}
            </div>

            {/* Popover Footer Navigation */}
            <div className="p-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between px-4">
              <Link
                href="/notifikasi/pengaturan"
                onClick={() => setIsOpen(false)}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1.5 transition"
                title="Atur preferensi notifikasi"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Pengaturan</span>
              </Link>

              <Link
                href="/notifikasi"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5 transition group"
              >
                <span>Lihat Semua Notifikasi</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
