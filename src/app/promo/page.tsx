'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_PROMOS } from '@/data/mockGames';
import { 
  Tag, 
  Copy, 
  Check, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Info,
  Gift,
  HelpCircle,
  Flame
} from 'lucide-react';

export default function PromoListPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'semua' | 'percent' | 'fixed' | 'game'>('semua');

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const filteredPromos = MOCK_PROMOS.filter((p) => {
    if (activeFilter === 'percent') return p.discountType === 'percent';
    if (activeFilter === 'fixed') return p.discountType === 'fixed';
    if (activeFilter === 'game') return Boolean(p.gameSlug);
    return true;
  });

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-blue-950/50 border border-slate-800 p-8 sm:p-12 mb-10 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
            <Gift className="w-4 h-4" />
            <span>Kupon &amp; Diskon Terlengkap</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Pusat Promo &amp; Voucher TokoGem
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-6">
            Hemat lebih banyak dengan voucher diskon langsung dan cashback setiap kali top up game favorit kamu.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center items-center gap-2">
            <button
              onClick={() => setActiveFilter('semua')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeFilter === 'semua'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Semua Promo ({MOCK_PROMOS.length})
            </button>
            <button
              onClick={() => setActiveFilter('percent')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeFilter === 'percent'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Diskon Persen (%)
            </button>
            <button
              onClick={() => setActiveFilter('fixed')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeFilter === 'fixed'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Potongan Nominal (Rp)
            </button>
            <button
              onClick={() => setActiveFilter('game')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeFilter === 'game'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Khusus Game Tertentu
            </button>
          </div>
        </div>

        {/* Promo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredPromos.map((promo) => (
            <div
              key={promo.id}
              className="rounded-2xl bg-[#111827] border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:shadow-emerald-500/10 group"
            >
              {/* Promo Banner Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                <img
                  src={promo.imageUrl}
                  alt={promo.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                
                {/* Discount Tag */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-extrabold shadow-lg">
                  {promo.discountType === 'percent'
                    ? `DISKON ${promo.amount}%`
                    : `POTONGAN Rp ${(promo.amount / 1000).toFixed(0)}RB`}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Berlaku hingga: {promo.endsAt}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                    {promo.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {promo.description}
                  </p>

                  {/* Syarat & Ketentuan */}
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Syarat &amp; Ketentuan:
                    </span>
                    <ul className="text-xs text-slate-400 space-y-1">
                      {promo.terms.map((term, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span>{term}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Promo Code & Action */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex-1 bg-slate-900 border border-dashed border-slate-700 rounded-xl px-3 py-2 flex items-center justify-between">
                    <span className="font-mono font-bold text-xs sm:text-sm text-cyan-300">
                      {promo.code}
                    </span>
                    <button
                      onClick={() => handleCopy(promo.code)}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
                      title="Salin Kode Promo"
                    >
                      {copiedCode === promo.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>

                  <Link
                    href={promo.gameSlug ? `/game/${promo.gameSlug}` : '/#katalog'}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition flex items-center gap-1 shrink-0"
                  >
                    <span>Pakai</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Cara Memakai Kode Promo di TokoGem</h2>
              <p className="text-xs text-slate-400">Ikuti panduan mudah ini untuk menikmati diskon instan</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="font-bold text-blue-400 block">Langkah 1</span>
              <p className="text-white font-semibold">Salin Kode Promo</p>
              <p className="text-slate-400">Pilih voucher yang ingin digunakan lalu klik tombol &quot;Salin&quot;.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="font-bold text-blue-400 block">Langkah 2</span>
              <p className="text-white font-semibold">Pilih Game &amp; Nominal</p>
              <p className="text-slate-400">Buka halaman top up game, isi User ID, dan pilih nominal item yang sesuai minimal pembelian.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="font-bold text-blue-400 block">Langkah 3</span>
              <p className="text-white font-semibold">Tempelkan &amp; Terapkan</p>
              <p className="text-slate-400">Masukkan kode promo di kolom kupon lalu klik Terapkan. Total bayar akan langsung terpotong!</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
