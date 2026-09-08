'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_PAYMENT_METHODS } from '@/data/mockPayments';
import { 
  CreditCard, 
  ShieldCheck, 
  Zap, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  Info,
  HelpCircle,
  Building2,
  Wallet,
  QrCode,
  Store
} from 'lucide-react';

export default function PaymentMethodsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'QRIS', 'E-Wallet', 'Virtual Account', 'Convenience Store'];

  const filteredMethods = MOCK_PAYMENT_METHODS.filter((m) => {
    if (selectedCategory === 'Semua') return true;
    return m.category === selectedCategory;
  });

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-slate-800 p-8 sm:p-12 mb-10 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-4">
            <CreditCard className="w-4 h-4" />
            <span>Kemitraan Resmi &amp; Terpercaya</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Metode Pembayaran Resmi TokoGem
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Bayar top up game dengan cepat, aman, dan mudah lewat berbagai saluran pembayaran favorit kamu di Indonesia.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredMethods.map((method) => (
            <div
              key={method.id}
              className="rounded-2xl bg-[#111827] border border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[11px] font-bold">
                    {method.category}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Instan 1 Detik
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{method.name}</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Biaya Admin: {method.adminFee > 0 ? `Rp ${method.adminFee.toLocaleString('id-ID')}` : 'Gratis 0 Rupiah'}
                </p>

                {/* Instructions preview */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
                  <span className="font-bold text-slate-300 block text-[11px] uppercase tracking-wider">
                    Cara Pembayaran:
                  </span>
                  <ol className="list-decimal list-inside text-slate-400 space-y-1">
                    {method.instructions.map((ins, i) => (
                      <li key={i} className="line-clamp-2">
                        {ins}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verifikasi Otomatis
                </span>
                <Link
                  href="/topup"
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
                >
                  <span>Mulai Top Up</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
