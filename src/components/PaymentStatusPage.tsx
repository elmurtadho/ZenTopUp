'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw, 
  Home,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Zap,
  AlertCircle,
  FlaskConical
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export type StatusType = 'success' | 'pending' | 'failed';

interface PaymentStatusPageProps {
  orderId: string;
  status: StatusType;
  gameName?: string;
  itemName?: string;
  totalAmount?: number;
  paymentMethod?: string;
  onRetry?: () => void;
}

const STATUS_CONFIG = {
  success: {
    icon: <CheckCircle2 className="w-10 h-10 text-emerald-400" />,
    bgColor: 'border-emerald-500/40 bg-emerald-500/5',
    iconBg: 'bg-emerald-500/20 border-emerald-500/30',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    badgeText: '✓ Pembayaran Berhasil',
    title: 'Transaksi Sukses & Item Terkirim!',
    description: 'Item top up telah otomatis ditambahkan ke akun game kamu. Terima kasih telah menggunakan TokoGem!',
  },
  pending: {
    icon: <Clock className="w-10 h-10 text-amber-400" />,
    bgColor: 'border-amber-500/30 bg-amber-500/5',
    iconBg: 'bg-amber-500/20 border-amber-500/30',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    badgeText: '⏳ Menunggu Konfirmasi',
    title: 'Pembayaran Sedang Diproses',
    description: 'Sistem kami sedang memverifikasi pembayaranmu. Item akan dikirim segera setelah transfer diverifikasi.',
  },
  failed: {
    icon: <XCircle className="w-10 h-10 text-red-400" />,
    bgColor: 'border-red-500/30 bg-red-500/5',
    iconBg: 'bg-red-500/20 border-red-500/30',
    badge: 'bg-red-500/10 text-red-400 border-red-500/30',
    badgeText: '✕ Pembayaran Gagal',
    title: 'Transaksi Tidak Berhasil',
    description: 'Pembayaranmu tidak dapat diproses. Pastikan saldo mencukupi dan koneksi internet stabil, kemudian coba lagi.',
  },
};

export default function PaymentStatusPage({
  orderId = 'GEM-000000',
  status = 'success',
  gameName = 'Mobile Legends: Bang Bang',
  itemName = 'Weekly Diamond Pass',
  totalAmount = 79000,
  paymentMethod = 'BCA Virtual Account',
  onRetry,
}: Partial<PaymentStatusPageProps>) {
  const router = useRouter();
  const { success, error, info } = useToast();
  const [currentStatus, setCurrentStatus] = useState<StatusType>(status);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  const config = STATUS_CONFIG[currentStatus];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`);
      const json = await res.json();
      if (json.data?.status === 'berhasil') {
        setCurrentStatus('success');
        success('Status Terverifikasi', 'Pembayaran telah sukses diverifikasi.');
      } else if (json.data?.status === 'gagal') {
        setCurrentStatus('failed');
        error('Pembayaran Gagal', 'Pesanan ditolak atau kadaluarsa.');
      } else {
        info('Menunggu Pembayaran', 'Pesanan masih dalam status menunggu pembayaran.');
      }
    } catch {
      // Fallback
    } finally {
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  const handleSwitchStatus = async (newStatus: StatusType) => {
    setCurrentStatus(newStatus);
    const dbStatus = newStatus === 'success' ? 'berhasil' : (newStatus === 'failed' ? 'gagal' : 'pending');

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: dbStatus }),
      });

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('notification-updated', {
          detail: { orderId, status: dbStatus }
        }));
      }

      if (newStatus === 'success') {
        success('Simulasi Berhasil', `Pesanan ${orderId} (${itemName}) berstatus Berhasil.`);
      } else if (newStatus === 'failed') {
        error('Simulasi Gagal', `Pesanan ${orderId} berstatus Gagal / Dibatalkan.`);
      } else {
        info('Simulasi Menunggu', `Pesanan ${orderId} berstatus Menunggu Pembayaran.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-xl mx-auto px-4 sm:px-6 space-y-4">

        {/* Sandbox Status Preview Switcher */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-lg">
          <span className="text-indigo-300 font-bold flex items-center gap-1.5">
            <FlaskConical className="w-4 h-4 text-indigo-400" />
            <span>Sandbox Preview Switcher:</span>
          </span>
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleSwitchStatus('success')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl font-extrabold text-xs transition text-center cursor-pointer ${
                currentStatus === 'success'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              🟢 Berhasil
            </button>
            <button
              type="button"
              onClick={() => handleSwitchStatus('pending')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl font-extrabold text-xs transition text-center cursor-pointer ${
                currentStatus === 'pending'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              ⏳ Menunggu
            </button>
            <button
              type="button"
              onClick={() => handleSwitchStatus('failed')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl font-extrabold text-xs transition text-center cursor-pointer ${
                currentStatus === 'failed'
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/25'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              🔴 Gagal
            </button>
          </div>
        </div>

        {/* Main Status Card */}
        <div className={`rounded-3xl border p-8 sm:p-10 text-center shadow-2xl space-y-6 ${config.bgColor}`}>
          
          {/* Icon */}
          <div className={`w-20 h-20 rounded-full ${config.iconBg} border flex items-center justify-center mx-auto`}>
            {config.icon}
          </div>

          {/* Badge */}
          <div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold ${config.badge}`}>
              {config.badgeText}
            </span>
          </div>

          {/* Title & Description */}
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
              {config.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed max-w-sm mx-auto">
              {config.description}
            </p>
          </div>

          {/* Order Details */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-left space-y-2.5 max-w-sm mx-auto w-full">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">No. Pesanan</span>
              <span className="font-mono font-bold text-white">{orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Game</span>
              <span className="font-semibold text-white">{gameName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Item</span>
              <span className="font-semibold text-white">{itemName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Metode Bayar</span>
              <span className="font-semibold text-white">{paymentMethod}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <span className="font-bold text-slate-300">Total</span>
              <span className="text-base font-extrabold text-cyan-400">Rp {totalAmount?.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2 max-w-sm mx-auto w-full">
            {currentStatus === 'pending' && (
              <button
                type="button"
                onClick={handleRefresh}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Perbarui Status</span>
              </button>
            )}

            {currentStatus === 'failed' && (
              <button
                type="button"
                onClick={onRetry || (() => router.push('/'))}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Coba Bayar Lagi</span>
              </button>
            )}

            {currentStatus === 'success' && (
              <Link
                href="/"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition"
              >
                <Zap className="w-4 h-4" />
                <span>Top Up Game Lainnya</span>
              </Link>
            )}

            <Link
              href="/"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition"
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dilindungi oleh sistem keamanan enkripsi TokoGem</span>
          </div>
        </div>
      </div>
    </div>
  );
}
