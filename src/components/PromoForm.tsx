'use client';

import React, { useState } from 'react';
import { Promo } from '@/types';
import { MOCK_PROMOS } from '@/data/mockGames';
import { Tag, Sparkles, Check, AlertCircle, X, ChevronDown, ChevronUp, Gift } from 'lucide-react';

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

  // Available promos for this game
  const availablePromos = MOCK_PROMOS.filter(
    (p) => p.isActive && (!p.gameSlug || p.gameSlug === gameSlug)
  );

  const handleApply = (codeToTest?: string) => {
    const code = (codeToTest || inputCode).trim().toUpperCase();
    setError(null);

    if (!code) {
      setError('Masukkan kode promo terlebih dahulu');
      return;
    }

    const found = MOCK_PROMOS.find(
      (p) => p.code.toUpperCase() === code && p.isActive
    );

    if (!found) {
      setError('Kode promo tidak ditemukan atau sudah tidak aktif');
      return;
    }

    if (found.gameSlug && found.gameSlug !== gameSlug) {
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
                onChange={(e) => {
                  setInputCode(e.target.value.toUpperCase());
                  setError(null);
                }}
                placeholder="Masukkan kode promo (misal: ZENMLBB50)"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white text-sm uppercase font-mono outline-none transition"
              />
            </div>
            <button
              type="button"
              onClick={() => handleApply()}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              Gunakan
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </p>
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
                <div className="mt-3 space-y-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800 animate-in fade-in duration-150">
                  {availablePromos.map((p) => {
                    const isEligible = itemPrice >= p.minPurchase;
                    return (
                      <div
                        key={p.id}
                        className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                              {p.code}
                            </span>
                            <span className="font-semibold text-white truncate">
                              {p.title}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-1">
                            Min. transaksi Rp {p.minPurchase.toLocaleString('id-ID')}
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={!isEligible}
                          onClick={() => handleApply(p.code)}
                          className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition cursor-pointer ${
                            isEligible
                              ? 'bg-blue-600 hover:bg-blue-500 text-white'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {isEligible ? 'Gunakan' : 'Min Belum Cukup'}
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
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono font-bold text-sm text-emerald-300">
                {appliedPromo.code}
              </span>
              <p className="text-xs text-emerald-400 font-medium">
                Voucher berhasil digunakan &bull; Hemat Rp {discountAmount.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-lg bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700 text-xs flex items-center gap-1 cursor-pointer"
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
