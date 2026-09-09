'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Tag } from 'lucide-react';

interface PromoModalProps {
  isOpen: boolean;
  promo?: any | null;
  games?: any[];
  onClose: () => void;
  onSave: (promoData: any) => Promise<void>;
}

export default function PromoModal({ isOpen, promo, games = [], onClose, onSave }: PromoModalProps) {
  const isEdit = Boolean(promo);

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percent',
    amount: 10,
    minPurchase: 20000,
    maxDiscount: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    gameSlug: '',
    startsAt: new Date().toISOString().split('T')[0],
    endsAt: '2026-12-31',
    terms: 'Berlaku 1x per pengguna\nKhusus pembayaran e-wallet & VA',
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (promo) {
      const termsStr = Array.isArray(promo.terms) ? promo.terms.join('\n') : promo.terms || '';
      setFormData({
        code: promo.code || '',
        title: promo.title || '',
        description: promo.description || '',
        discountType: promo.discountType || 'percent',
        amount: promo.amount || 10,
        minPurchase: promo.minPurchase || 0,
        maxDiscount: promo.maxDiscount || 0,
        imageUrl: promo.imageUrl || '',
        gameSlug: promo.gameSlug || '',
        startsAt: promo.startsAt || '',
        endsAt: promo.endsAt || '',
        terms: termsStr,
        isActive: promo.isActive !== undefined ? Boolean(promo.isActive) : true,
      });
    } else {
      setFormData({
        code: '',
        title: '',
        description: '',
        discountType: 'percent',
        amount: 10,
        minPurchase: 20000,
        maxDiscount: 15000,
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
        gameSlug: '',
        startsAt: new Date().toISOString().split('T')[0],
        endsAt: '2026-12-31',
        terms: 'Berlaku 1x per pengguna\nKhusus transaksi di TokoGem',
        isActive: true,
      });
    }
    setError(null);
  }, [promo, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.code.trim() || !formData.title.trim() || formData.amount <= 0) {
      setError('Kode kupon, judul promo, dan jumlah diskon wajib diisi.');
      return;
    }

    try {
      setIsSubmitting(true);
      const termsArray = formData.terms
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean);

      await onSave({
        ...formData,
        code: formData.code.toUpperCase().trim(),
        terms: termsArray,
        gameSlug: formData.gameSlug || null,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan voucher promo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                {isEdit ? `Edit Voucher Promo: ${promo.code}` : 'Buat Voucher Promo Baru'}
              </h3>
              <p className="text-xs text-slate-400">Atur potongan harga kupon diskon</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Kode Kupon <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="GEMKILAT50"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 font-mono font-bold text-amber-400 outline-none uppercase"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Tipe Diskon</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white outline-none cursor-pointer"
              >
                <option value="percent">Persentase (%)</option>
                <option value="fixed">Potongan Tetap (Rp)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Judul Promo <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Diskon Kilat Diamond 15%"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Deskripsi Singkat</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Potongan spesial top up game tanpa syarat ribet..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Besar Diskon {formData.discountType === 'percent' ? '(%)' : '(Rp)'}
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 font-bold text-white outline-none"
                min={1}
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Min. Belanja (Rp)</label>
              <input
                type="number"
                value={formData.minPurchase}
                onChange={(e) => setFormData({ ...formData, minPurchase: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white outline-none"
                min={0}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Maks. Diskon (Rp)</label>
              <input
                type="number"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                placeholder="Opsional"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white outline-none"
                min={0}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Khusus Game Tertentu</label>
              <select
                value={formData.gameSlug}
                onChange={(e) => setFormData({ ...formData, gameSlug: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white outline-none cursor-pointer"
              >
                <option value="">Semua Game (Global)</option>
                {games.map((g) => (
                  <option key={g.slug} value={g.slug}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Berlaku Hingga</label>
              <input
                type="date"
                value={formData.endsAt}
                onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Syarat &amp; Ketentuan (Satu baris per syarat)
            </label>
            <textarea
              rows={3}
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white outline-none resize-none font-mono text-[11px]"
            />
          </div>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500"
            />
            <span className="font-semibold text-white">Voucher Aktif &amp; Dapat Diklaim</span>
          </label>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Menyimpan...
                </span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEdit ? 'Simpan Voucher' : 'Buat Voucher'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
