'use client';

import React, { useState } from 'react';
import { 
  FlaskConical, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Loader2, 
  RotateCcw, 
  TimerReset,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export type OrderStatus = 'pending' | 'diproses' | 'berhasil' | 'gagal';

interface SandboxPaymentBarProps {
  orderId: string;
  currentStatus: OrderStatus;
  onStatusChange?: (newStatus: OrderStatus) => void;
  onExpireTimer?: () => void;
  totalAmount?: number;
  gameName?: string;
  itemName?: string;
}

export default function SandboxPaymentBar({
  orderId,
  currentStatus,
  onStatusChange,
  onExpireTimer,
  totalAmount,
  gameName = 'Game',
  itemName = 'Item Top Up',
}: SandboxPaymentBarProps) {
  const { success, error, info, processing, warning } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSimulate = async (newStatus: OrderStatus) => {
    if (isLoading) return;
    setIsLoading(newStatus);

    try {
      // 1. Sync with status API
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      // 2. Dispatch custom event so NotificationBell auto refreshes
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('notification-updated', {
          detail: { orderId, status: newStatus }
        }));
      }

      // 3. Trigger rich floating toast notification
      const amountStr = totalAmount ? `Rp ${totalAmount.toLocaleString('id-ID')}` : '';
      if (newStatus === 'berhasil') {
        success(
          'Pembayaran Berhasil Terverifikasi!',
          `Simulasi transaksi ${orderId} (${amountStr}) sukses. Item ${itemName} telah otomatis dikirimkan ke akun game kamu.`,
          { label: 'Lihat Invoice', href: `/konfirmasi/${orderId}?status=success` }
        );
      } else if (newStatus === 'diproses') {
        processing(
          'Pesanan Sedang Diproses Server',
          `Pembayaran ${orderId} diterima. Sistem TokoGem sedang menyalurkan item ${itemName} ke server resmi ${gameName}.`,
          { label: 'Cek Status', href: `/konfirmasi/${orderId}?status=pending` }
        );
      } else if (newStatus === 'gagal') {
        error(
          'Simulasi Pembayaran Gagal / Ditolak!',
          `Transaksi ${orderId} dibatalkan atau pembayaran ditolak oleh sistem pembayaran. Silakan coba kembali.`,
          { label: 'Coba Lagi', href: `/konfirmasi/${orderId}?status=failed` }
        );
      } else if (newStatus === 'pending') {
        info(
          'Status Direset ke Menunggu Pembayaran',
          `Pesanan ${orderId} (${amountStr}) saat ini kembali menunggu transfer Anda.`,
          { label: 'Bayar Sekarang', href: `/pembayaran/${orderId}` }
        );
      }

      // 4. Notify parent state handler
      onStatusChange?.(newStatus);
    } catch (err) {
      console.error('Error simulating status:', err);
      warning('Gagal Mengubah Status', 'Terjadi kesalahan saat menghubungi API status.');
    } finally {
      setIsLoading(null);
    }
  };

  const handleExpire = () => {
    warning(
      'Batas Waktu Pembayaran Habis!',
      `Batas waktu pembayaran pesanan ${orderId} telah kadaluarsa (Expired).`
    );
    onExpireTimer?.();
    handleSimulate('gagal');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'berhasil':
        return {
          label: 'Berhasil (Success)',
          className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        };
      case 'diproses':
        return {
          label: 'Sedang Diproses',
          className: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        };
      case 'gagal':
        return {
          label: 'Gagal (Failed)',
          className: 'bg-red-500/20 text-red-400 border-red-500/30',
        };
      case 'pending':
      default:
        return {
          label: 'Menunggu Bayar',
          className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        };
    }
  };

  const currentBadge = getStatusBadge(currentStatus);

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/40 p-4 sm:p-5 shadow-2xl shadow-indigo-950/40 animate-in fade-in duration-200">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-indigo-500/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>Sandbox Testing Simulator</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-indigo-500 text-slate-950">
                  DEV TOOL
                </span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Uji coba notifikasi real-time &amp; respons status pesanan #{orderId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${currentBadge.className}`}>
            ● {currentBadge.label}
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title={isExpanded ? 'Sembunyikan panel testing' : 'Tampilkan panel testing'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Action Buttons Panel */}
      {isExpanded && (
        <div className="pt-3.5 space-y-2.5">
          <div className="text-[11px] text-indigo-300/80 font-medium">
            Pilih status pembayaran yang ingin disimulasikan:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            
            {/* 1. Simulasi Berhasil */}
            <button
              type="button"
              disabled={isLoading !== null}
              onClick={() => handleSimulate('berhasil')}
              className={`p-2.5 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                currentStatus === 'berhasil'
                  ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-400 border-emerald-500/30 hover:border-emerald-400'
              }`}
            >
              {isLoading === 'berhasil' ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
              <span className="text-center leading-tight">Simulasi Berhasil</span>
              <span className="text-[9px] font-normal text-emerald-400/70">Status: Berhasil</span>
            </button>

            {/* 2. Simulasi Sedang Diproses */}
            <button
              type="button"
              disabled={isLoading !== null}
              onClick={() => handleSimulate('diproses')}
              className={`p-2.5 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                currentStatus === 'diproses'
                  ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-400 border-cyan-500/30 hover:border-cyan-400'
              }`}
            >
              {isLoading === 'diproses' ? (
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              ) : (
                <Zap className="w-4 h-4 text-cyan-400" />
              )}
              <span className="text-center leading-tight">Sedang Diproses</span>
              <span className="text-[9px] font-normal text-cyan-400/70">Status: Diproses</span>
            </button>

            {/* 3. Simulasi Gagal */}
            <button
              type="button"
              disabled={isLoading !== null}
              onClick={() => handleSimulate('gagal')}
              className={`p-2.5 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                currentStatus === 'gagal'
                  ? 'bg-red-500/30 text-red-300 border-red-400 shadow-md shadow-red-500/20'
                  : 'bg-red-950/30 hover:bg-red-900/40 text-red-400 border-red-500/30 hover:border-red-400'
              }`}
            >
              {isLoading === 'gagal' ? (
                <Loader2 className="w-4 h-4 animate-spin text-red-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
              <span className="text-center leading-tight">Simulasi Gagal</span>
              <span className="text-[9px] font-normal text-red-400/70">Ditolak / Batal</span>
            </button>

            {/* 4. Reset ke Menunggu */}
            <button
              type="button"
              disabled={isLoading !== null}
              onClick={() => handleSimulate('pending')}
              className={`p-2.5 rounded-xl border font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                currentStatus === 'pending'
                  ? 'bg-amber-500/30 text-amber-300 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-amber-950/30 hover:bg-amber-900/40 text-amber-400 border-amber-500/30 hover:border-amber-400'
              }`}
            >
              {isLoading === 'pending' ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              ) : (
                <RotateCcw className="w-4 h-4 text-amber-400" />
              )}
              <span className="text-center leading-tight">Reset Menunggu</span>
              <span className="text-[9px] font-normal text-amber-400/70">Status: Pending</span>
            </button>

          </div>

          {/* Additional quick actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-slate-400">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Notifikasi lonceng &amp; pop-up toast akan terpicu seketika.</span>
            </span>

            {onExpireTimer && (
              <button
                type="button"
                onClick={handleExpire}
                className="text-amber-400 hover:text-amber-300 underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <TimerReset className="w-3.5 h-3.5" />
                <span>Simulasi Batas Waktu Habis (00:00)</span>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
