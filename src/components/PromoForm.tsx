'use client';

import React, { useState } from 'react';
import { Promo } from '@/types';
import { MOCK_PROMOS } from '@/data/mockGames';
import { Tag, Sparkles, AlertCircle, X, ChevronDown, ChevronUp, Gift, Loader2 } from 'lucide-react';

interface PromoFormProps {
  gameSlug: string;
  itemPrice: number;
  appliedPromo: Promo | null;
  discountAmount: number;
  onApplyPromo: (promo: Promo | null) => void;
}

export default function PromoForm({
  gameSlug,
  itemPrice,
  appliedPromo,
  discountAmount,
  onApplyPromo,
}: PromoFormProps) {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showAvailablePromos, setShowAvailablePromos] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const checkIsExpired = (endsAt?: string | null) => {
    if (!endsAt) return false;
    const end = new Date(endsAt);
    if (endsAt.length <= 10) end.setHours(23, 59, 59, 999);
    return Date.now() > end.getTime();
  };

  // Available promos for this game
  const availablePromos = MOCK_PROMOS.filter(
    (p) => p.isActive && (!p.gameSlug || p.gameSlug === gameSlug || (p.gameSlug === 'mobile-legends' && gameSlug.includes('mobile-legends')))
  );

  const handleApply = async (codeToTest?: string) => {
    const code = (codeToTest || inputCode).trim().toUpperCase();
    setError(null);

    if (!code) {
      setError('Masukkan kode promo terlebih dahulu');
      return;
    }

    setIsValidating(true);

    try {
      // 1. Always validate via backend API first (checks live Turso DB, expiration, minPurchase & restrictions)
      const res = await fetch('/api/promos/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          gameSlug,
          amount: itemPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.valid) {
        setError(data.message || `Kode promo ${code} tidak valid atau sudah kedaluwarsa`);
        return;
      }

      onApplyPromo(data.promo);
      setInputCode(data.promo.code);
      setShowAvailablePromos(false);
    } catch {
      // 2. Fallback local validation if network is interrupted
      const found = MOCK_PROMOS.find(
        (p) => p.code.toUpperCase() === code && p.isActive
      );

      if (!found) {
        setError('Kode promo tidak ditemukan atau sudah tidak aktif');
        return;
      }

      // Check expiration in fallback
      if (checkIsExpired(found.endsAt)) {
        const end = new Date(found.endsAt!);
        const formattedEnd = new Intl.DateTimeFormat('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(end);
        setError(`Kode promo ${found.code} sudah kedaluwarsa (berakhir pada ${formattedEnd})`);
        return;
      }

      if (found.gameSlug && found.gameSlug !== gameSlug && !gameSlug.includes(found.gameSlug)) {
        setError(`Kode promo ini khusus untuk game ${found.gameSlug}`);
        return;
      }

      if (itemPrice < found.minPurchase) {
        setError(
          `Minimal transaksi untuk promo ini adalah Rp ${found.minPurchase.toLocaleString('id-ID')}`
        );
        return;
      }

      onApplyPromo(found);
      setInputCode(found.code);
      setShowAvailablePromos(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemove = () => {
    onApplyPromo(null);
    setInputCode('');
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Input box */}
      {!appliedPromo ? (
        <div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputCode}
                disabled={isValidating}
                onChange={(e) => {
                  setInputCode(e.target.value.toUpperCase());
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApply();
                  }
                }}
                placeholder="Masukkan kode voucher (misal: TOKOGEMMLBB)"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white text-sm uppercase font-mono outline-none transition"
              />
            </div>
            <button
              type="button"
              disabled={isValidating}
              onClick={() => handleApply()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Cek...</span>
                </>
              ) : (
                <span>Gunakan</span>
              )}
            </button>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 mt-2 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Toggle Available Promos Dropdown */}
          {availablePromos.length > 0 && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowAvailablePromos(!showAvailablePromos)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Lihat {availablePromos.length} Voucher Promo Tersedia</span>
                {showAvailablePromos ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {showAvailablePromos && (
                <div className="mt-3 space-y-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 animate-in fade-in duration-150">
                  {availablePromos.map((p) => {
                    const expired = checkIsExpired(p.endsAt);
                    const isEligible = !expired && itemPrice >= p.minPurchase;
                    return (
                      <div
                        key={p.id}
                        className={`p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition ${
                          expired
                            ? 'bg-slate-950/40 border-slate-800/60 opacity-65'
                            : 'bg-slate-950/80 border-slate-800'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                              expired
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20 line-through'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {p.code}
                            </span>
                            <span className="font-semibold text-white truncate">
                              {p.title}
                            </span>
                            {expired ? (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                                Kedaluwarsa
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Aktif
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-1.5">
                            {p.description} &bull; Min. transaksi Rp {p.minPurchase.toLocaleString('id-ID')}
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={!isEligible || isValidating}
                          onClick={() => handleApply(p.code)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs shrink-0 transition cursor-pointer ${
                            expired
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                              : isEligible
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-sm'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {expired ? 'Kedaluwarsa' : isEligible ? 'Gunakan' : 'Min Belum Cukup'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Applied Promo Banner */
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/30 border border-emerald-500/40 flex items-center justify-between animate-in fade-in duration-200 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold text-sm text-emerald-300">
                  {appliedPromo.code}
                </span>
                <span className="px-2 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  DITERAPKAN
                </span>
              </div>
              <p className="text-xs text-emerald-300 font-bold mt-0.5">
                Hemat Rp {discountAmount.toLocaleString('id-ID')} ({appliedPromo.discountType === 'percent' ? `${appliedPromo.amount}%` : `Potongan Rp ${appliedPromo.amount.toLocaleString('id-ID')}`})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white hover:bg-red-500/20 hover:border-red-500/40 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Hapus Voucher"
          >
            <X className="w-3.5 h-3.5" />
            <span>Hapus</span>
          </button>
        </div>
      )}
    </div>
  );
}
