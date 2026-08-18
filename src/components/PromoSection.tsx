'use client';

import React, { useState } from 'react';
import { MOCK_PROMOS } from '@/data/mockGames';
import { Tag, Copy, Check, Sparkles, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PromoSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  return (
    <section id="promo-section" className="py-10 bg-gradient-to-b from-[#0b0f19] via-[#0d1424] to-[#0b0f19] border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Kupon & Diskon Spesial</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Promo Hemat Top Up Hari Ini
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Gunakan kode promo saat checkout untuk mendapatkan potongan harga langsung.
            </p>
          </div>
        </div>

        {/* Promo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_PROMOS.map((promo) => (
            <div
              key={promo.id}
              className="rounded-2xl bg-[#111827] border border-slate-800 hover:border-emerald-500/40 transition-all duration-300 p-5 sm:p-6 flex flex-col justify-between shadow-lg hover:shadow-emerald-500/10 group"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>
                      {promo.discountType === 'percent'
                        ? `DISKON ${promo.amount}%`
                        : `POTONGAN Rp ${(promo.amount / 1000).toFixed(0)}RB`}
                    </span>
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>s/d {promo.endsAt}</span>
                  </div>
                </div>

                <h3 className="font-bold text-white text-base sm:text-lg group-hover:text-emerald-400 transition-colors mb-2">
                  {promo.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {promo.description}
                </p>

                {/* Terms list */}
                <ul className="text-[11px] text-slate-400 space-y-1 mb-4 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  {promo.terms.map((term, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Promo code copy box */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex-1 bg-slate-900 border border-dashed border-slate-700 rounded-xl px-3 py-2 flex items-center justify-between">
                  <span className="font-mono font-bold text-xs sm:text-sm text-cyan-300">
                    {promo.code}
                  </span>
                  <button
                    onClick={() => handleCopy(promo.code)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition"
                    title="Salin Kode"
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

                {promo.gameSlug && (
                  <Link
                    href={`/game/${promo.gameSlug}`}
                    className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition"
                    title="Buka Game"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
