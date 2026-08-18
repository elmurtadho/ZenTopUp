'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { MOCK_NOTIFICATIONS, MockNotification } from '@/data/mockNotifications';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Sparkles, 
  Info, 
  CheckCheck, 
  Trash2, 
  ArrowRight,
  ShieldCheck,
  Bell
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DetailNotifikasiPage({ params }: PageProps) {
  const { id } = use(params);

  // Find notification by ID or default to demo template
  const initialNotif = MOCK_NOTIFICATIONS.find((n) => n.id === id) || {
    id,
    type: 'order_success' as const,
    title: 'Top Up Sukses & Item Masuk',
    message: 'Transaksi kamu telah berhasil diverifikasi oleh sistem otomatis ZenTopUp. Item top up telah dikirimkan langsung ke akun game kamu.',
    createdAt: 'Baru saja',
    isRead: true,
    orderId: 'ZEN-928174',
    linkHref: '/riwayat/ZEN-928174',
    linkText: 'Lihat Invoice Transaksi',
  };

  const [notif, setNotif] = useState<MockNotification>({ ...initialNotif, isRead: true });
  const [isDeleted, setIsDeleted] = useState(false);

  const toggleReadStatus = () => {
    setNotif((prev) => ({ ...prev, isRead: !prev.isRead }));
  };

  const handleDelete = () => {
    setIsDeleted(true);
  };

  const getNotifIcon = (type: MockNotification['type']) => {
    switch (type) {
      case 'order_success':
        return (
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        );
      case 'order_created':
        return (
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        );
      case 'order_failed':
        return (
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
        );
      case 'promo':
        return (
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
        );
      case 'system':
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
            <Info className="w-6 h-6" />
          </div>
        );
    }
  };

  if (isDeleted) {
    return (
      <div className="py-16">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
            <Trash2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Notifikasi Telah Dihapus</h2>
          <p className="text-xs text-slate-400">Pemberitahuan ini sudah dihapus dari daftar notifikasi kamu.</p>
          <Link
            href="/notifikasi"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Pusat Notifikasi</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Navigation & Controls */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/notifikasi"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Notifikasi</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleReadStatus}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{notif.isRead ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}</span>
            </button>

            <button
              onClick={handleDelete}
              className="p-2 rounded-xl bg-slate-900 hover:bg-red-500/10 hover:border-red-500/30 border border-slate-800 text-slate-400 hover:text-red-400 text-xs transition cursor-pointer"
              title="Hapus Notifikasi"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notif Details Card */}
        <div className="rounded-3xl bg-[#111827] border border-slate-800 overflow-hidden shadow-2xl p-6 sm:p-10 space-y-6">
          
          <div className="flex items-start gap-4 pb-6 border-b border-slate-800">
            {getNotifIcon(notif.type)}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-slate-400">{notif.createdAt}</span>
                <span className="text-slate-600">&bull;</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400">
                  {notif.type.replace('_', ' ')}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                {notif.title}
              </h1>
            </div>
          </div>

          {/* Body message */}
          <div className="text-slate-300 text-sm leading-relaxed space-y-4">
            <p>{notif.message}</p>

            {notif.orderId && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Nomor Pesanan Terkait:</span>
                  <span className="font-mono font-bold text-white text-sm">{notif.orderId}</span>
                </div>
                <Link
                  href={`/riwayat/${notif.orderId}`}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>Buka Invoice</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Action CTA */}
          {notif.linkHref && (
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Link
                href={notif.linkHref}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
              >
                <span>{notif.linkText || 'Buka Halaman Terkait'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pemberitahuan resmi dari sistem otomatis ZenTopUp</span>
          </div>

        </div>

      </div>
    </div>
  );
}
