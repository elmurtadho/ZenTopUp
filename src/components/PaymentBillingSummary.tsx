'use client';

import React from 'react';
import { PaymentMethod, GameItem, Promo } from '@/types';
import { ShieldCheck, Tag, Zap } from 'lucide-react';

interface PaymentBillingSummaryProps {
  orderId: string;
  gameName: string;
  itemName: string;
  itemPrice: number;
  paymentMethod: PaymentMethod | null;
  promo?: Partial<Promo> | null;
  discountAmount: number;
  onPayNow?: () => void;
  isProcessing?: boolean;
}

export default function PaymentBillingSummary({
  orderId,
  gameName,
  itemName,
  itemPrice,
  paymentMethod,
  promo,
  discountAmount,
  onPayNow,
  isProcessing = false,
}: PaymentBillingSummaryProps) {
  const adminFee = paymentMethod?.adminFee ?? 0;
  const total = Math.max(0, itemPrice - discountAmount) + adminFee;

  const rows: { label: string; value: string; color?: string }[] = [
    { label: 'Game', value: gameName },
    { label: 'Item', value: itemName },
    { label: 'Harga Item', value: `Rp ${itemPrice.toLocaleString('id-ID')}` },
  ];

  if (discountAmount > 0) {
    rows.push({
      label: promo?.code ? `Diskon (${promo.code})` : 'Diskon Promo',
      value: `-Rp ${discountAmount.toLocaleString('id-ID')}`,
      color: 'text-emerald-400',
    });
  }

  rows.push({
    label: 'Biaya Admin',
    value: adminFee > 0 ? `Rp ${adminFee.toLocaleString('id-ID')}` : 'Gratis',
    color: adminFee === 0 ? 'text-emerald-400' : undefined,
  });

  return (
    <div className="rounded-2xl bg-[#111827] border border-slate-800 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
        <Zap className="w-4 h-4 text-blue-400" />
        <h3 className="font-bold text-white text-sm">Tagihan Pesanan</h3>
        <span className="ml-auto font-mono text-[11px] text-slate-400">{orderId}</span>
      </div>

      {/* Rows */}
      <div className="px-5 py-4 space-y-2.5">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{row.label}</span>
            <span className={`font-semibold ${row.color ?? 'text-white'}`}>{row.value}</span>
          </div>
        ))}

        {paymentMethod && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Metode Bayar</span>
            <span className="font-semibold text-white">{paymentMethod.name}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="px-5 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/50">
        <span className="text-sm font-bold text-white">Total Pembayaran</span>
        <span className="text-xl font-extrabold text-cyan-400">
          Rp {total.toLocaleString('id-ID')}
        </span>
      </div>

      {/* CTA (optional) */}
      {onPayNow && (
        <div className="px-5 pb-5 pt-1 space-y-3">
          <button
            type="button"
            disabled={isProcessing}
            onClick={onPayNow}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <span className="animate-pulse">Memproses...</span>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Bayar Sekarang</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dijamin 100% aman &amp; terenkripsi</span>
          </div>
        </div>
      )}
    </div>
  );
}
