'use client';

import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

type StatusType = 'success' | 'pending' | 'failed';

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
    description: 'Sistem kami sedang memverifikasi pembayaranmu. Biasanya selesai dalam 1-5 menit. Halaman ini akan otomatis diperbarui.',
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const config = STATUS_CONFIG[status];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
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
            {status === 'pending' && (
              <button
                type="button"
                onClick={handleRefresh}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Perbarui Status</span>
              </button>
            )}

            {status === 'failed' && onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Coba Bayar Lagi</span>
              </button>
            )}

            {status === 'success' && (
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
