'use client';

import React, { useState } from 'react';
import { PaymentMethod } from '@/types';
import { ShieldCheck, ChevronDown, ChevronUp, CheckCircle2, Smartphone, CreditCard, Store, QrCode } from 'lucide-react';

interface PaymentInstructionsProps {
  paymentMethod: PaymentMethod;
}

const METHOD_ICON: Record<string, React.ReactNode> = {
  QRIS: <QrCode className="w-5 h-5 text-orange-400" />,
  'E-Wallet': <Smartphone className="w-5 h-5 text-purple-400" />,
  'Virtual Account': <CreditCard className="w-5 h-5 text-blue-400" />,
  'Convenience Store': <Store className="w-5 h-5 text-yellow-400" />,
};

export default function PaymentInstructions({ paymentMethod }: PaymentInstructionsProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-900/80 transition cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
            {METHOD_ICON[paymentMethod.category] ?? <CreditCard className="w-5 h-5 text-slate-400" />}
          </div>
          <div className="text-left">
            <span className="font-bold text-white text-sm block">
              Cara Bayar via {paymentMethod.name}
            </span>
            <span className="text-[11px] text-slate-400">
              {paymentMethod.instructions.length} langkah mudah · Proses instan
            </span>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        )}
      </button>

      {/* Steps */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-3">
          <div className="space-y-2.5">
            {paymentMethod.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                  {instruction}
                </p>
              </div>
            ))}
          </div>

          {/* Security note */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Pembayaran diverifikasi otomatis oleh sistem ZenTopUp. Item akan dikirim segera setelah konfirmasi.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
