'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MOCK_NOTIFICATIONS, MockNotification } from '@/data/mockNotifications';
import { 
  Bell, 
  CheckCheck, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Tag, 
  Info, 
  ArrowRight, 
  Trash2, 
  Filter, 
  Sparkles, 
  Zap,
  ChevronRight
} from 'lucide-react';
import EmptyState from '@/components/EmptyState';

export default function NotifikasiPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<MockNotification[]>(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'semua' | 'transaksi' | 'promo' | 'system'>('semua');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    fetch('/api/notifications/read-all', { method: 'POST' }).catch(() => {});
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleCardClick = (notif: MockNotification) => {
    handleMarkAsRead(notif.id);
    const target = notif.linkHref || `/notifikasi/${notif.id}`;
    router.push(target);
  };

  const filteredNotifications = notifications.filter((item) => {
    if (unreadOnly && item.isRead) return false;

    if (activeTab === 'transaksi') {
      return ['order_success', 'order_created', 'order_failed'].includes(item.type);
    }
    if (activeTab === 'promo') {
      return item.type === 'promo';
    }
    if (activeTab === 'system') {
      return item.type === 'system';
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getNotifIcon = (type: MockNotification['type']) => {
    switch (type) {
      case 'order_success':
        return (
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
      case 'order_created':
        return (
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        );
      case 'order_failed':
        return (
          <div className="w-10 h-10 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
        );
      case 'promo':
        return (
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
        );
      case 'system':
      default:
        return (
          <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
                <Bell className="w-4 h-4" />
                <span>Pusat Notifikasi</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-bold">
                    {unreadCount} Baru
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Notifikasi &amp; Pembaruan
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Informasi status transaksi pesanan, diskon voucher promo, dan pengumuman sistem.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer shrink-0"
              >
                <CheckCheck className="w-4 h-4 text-emerald-400" />
                <span>Tandai Semua Dibaca</span>
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'semua', label: 'Semua' },
                { id: 'transaksi', label: 'Transaksi' },
                { id: 'promo', label: 'Promo & Diskon' },
                { id: 'system', label: 'Sistem' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={unreadOnly}
                onChange={(e) => setUnreadOnly(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span>Hanya yang belum dibaca</span>
            </label>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleCardClick(notif)}
                className={`rounded-2xl border p-5 transition duration-200 flex items-start justify-between gap-4 cursor-pointer group ${
                  notif.isRead
                    ? 'bg-[#111827] border-slate-800/80 hover:border-slate-700 opacity-80 hover:opacity-100'
                    : 'bg-slate-900 border-blue-500/40 shadow-lg shadow-blue-500/5'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  {getNotifIcon(notif.type)}

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm font-bold transition-colors ${
                          notif.isRead
                            ? 'text-slate-200 group-hover:text-white'
                            : 'text-white group-hover:text-blue-400'
                        }`}
                      >
                        {notif.title}
                      </h3>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 animate-pulse" />
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] text-slate-500 font-medium">
                        {notif.createdAt}
                      </span>

                      <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 group-hover:text-cyan-300 transition">
                        <span>{notif.linkText || 'Buka Halaman'}</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Bell}
            title={
              unreadOnly
                ? 'Semua Notifikasi Sudah Dibaca'
                : 'Belum Ada Notifikasi'
            }
            description={
              unreadOnly
                ? 'Tidak ada pesan yang belum dibaca saat ini. Kamu sudah up to date dengan seluruh pembaruan akun!'
                : 'Belum ada notifikasi baru untuk kategori ini. Notifikasi pesanan dan promo kamu akan muncul di sini.'
            }
            actionText="Jelajahi Promo Diskon"
            actionHref="/promo"
            secondaryActionText={unreadOnly ? 'Tampilkan Semua' : undefined}
            onSecondaryActionClick={unreadOnly ? () => setUnreadOnly(false) : undefined}
          />
        )}

      </div>
    </div>
  );
}
