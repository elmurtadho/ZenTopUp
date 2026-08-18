'use client';

import React from 'react';
import { CheckCircle2, Clock, XCircle, RefreshCw, AlertCircle } from 'lucide-react';

export type TransactionStatus =
  | 'berhasil'
  | 'success'
  | 'paid'
  | 'pending'
  | 'menunggu'
  | 'diproses'
  | 'processing'
  | 'gagal'
  | 'failed'
  | 'cancelled';

interface TransactionStatusBadgeProps {
  status: TransactionStatus | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  pulse?: boolean;
  className?: string;
}

export default function TransactionStatusBadge({
  status,
  size = 'md',
  showIcon = true,
  pulse = true,
  className = '',
}: TransactionStatusBadgeProps) {
  const normalized = status.toLowerCase();

  // Determine styles & copy
  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
  let label = 'Status Tidak Diketahui';
  let icon = <AlertCircle className="w-3.5 h-3.5" />;
  let dotColor = 'bg-slate-400';

  if (['berhasil', 'success', 'paid'].includes(normalized)) {
    colorClasses =
      'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/15';
    label = 'Sukses Masuk';
    icon = <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />;
    dotColor = 'bg-emerald-400';
  } else if (['pending', 'menunggu'].includes(normalized)) {
    colorClasses =
      'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/15';
    label = 'Menunggu Bayar';
    icon = <Clock className="w-3.5 h-3.5 shrink-0 text-amber-400" />;
    dotColor = 'bg-amber-400';
  } else if (['diproses', 'processing'].includes(normalized)) {
    colorClasses =
      'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/15';
    label = 'Sedang Diproses';
    icon = <RefreshCw className="w-3.5 h-3.5 shrink-0 text-blue-400 animate-spin" />;
    dotColor = 'bg-blue-400';
  } else if (['gagal', 'failed', 'cancelled'].includes(normalized)) {
    colorClasses =
      'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/15';
    label = 'Gagal / Batal';
    icon = <XCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />;
    dotColor = 'bg-red-400';
  }

  // Sizing
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-[10px] gap-1',
    md: 'px-3 py-1 text-xs gap-1.5',
    lg: 'px-4 py-1.5 text-sm gap-2 font-bold',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold tracking-wide transition-colors ${sizeClasses} ${colorClasses} ${className}`}
    >
      {showIcon && icon}
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`}
          />
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColor}`} />
        </span>
      )}
      <span>{label}</span>
    </span>
  );
}
