'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Gem, DollarSign } from 'lucide-react';

interface ItemModalProps {
  isOpen: boolean;
  item?: any | null; // if provided, edit mode
  games: any[];
  defaultGameId?: number;
  onClose: () => void;
  onSave: (itemData: any) => Promise<void>;
}

export default function ItemModal({
  isOpen,
  item,
  games,
  defaultGameId,
  onClose,
  onSave,
}: ItemModalProps) {
  const isEdit = Boolean(item);

  const [formData, setFormData] = useState({
    gameId: defaultGameId || (games[0]?.id ?? 1),
    name: '',
    nominal: 0,
    price: 15000,
    originalPrice: '',
    currency: 'IDR',
    isPopular: false,
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setFormData({
        gameId: item.gameId || defaultGameId || 1,
        name: item.name || '',
        nominal: item.nominal || 0,
        price: item.price || 0,
        originalPrice: item.originalPrice ? String(item.originalPrice) : '',
        currency: item.currency || 'IDR',
        isPopular: Boolean(item.isPopular),
        isActive: item.isActive !== undefined ? Boolean(item.isActive) : true,
      });
    } else {
      setFormData({
        gameId: defaultGameId || (games[0]?.id ?? 1),
        name: '',
        nominal: 0,
        price: 15000,
        originalPrice: '',
        currency: 'IDR',
        isPopular: false,
        isActive: true,
      });
    }
    setError(null);
  }, [item, defaultGameId, games, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || formData.price <= 0) {
      setError('Nama item dan harga jual wajib diisi dengan benar.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        ...formData,
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                {isEdit ? `Edit Nominal Item` : 'Tambah Nominal Item'}
              </h3>
              <p className="text-xs text-slate-400">Atur nominal dan harga produk game</p>
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
          {/* Pilih Game */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Pilih Game <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.gameId}
              onChange={(e) => setFormData({ ...formData, gameId: Number(e.target.value) })}
              disabled={isEdit}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white outline-none cursor-pointer disabled:opacity-60"
            >
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.publisher})
                </option>
              ))}
            </select>
          </div>

          {/* Nama Item */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Nama Item / Produk <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: 86 Diamonds atau Weekly Diamond Pass"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white outline-none"
              required
            />
          </div>

          {/* Nominal Angka & Mata Uang */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Nominal (Angka)</label>
              <input
                type="number"
                value={formData.nominal}
                onChange={(e) => setFormData({ ...formData, nominal: Number(e.target.value) })}
                placeholder="86"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white outline-none"
                min={0}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Mata Uang</label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white outline-none"
              />
            </div>
          </div>

          {/* Harga Jual & Harga Coret */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Harga Jual (Rp) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="23000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 font-bold text-cyan-300 outline-none"
                required
                min={1}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Harga Coret / Promo (Rp)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="25000 (opsional)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-slate-400 outline-none"
                min={0}
              />
            </div>
          </div>

          {/* Popular & Active Switches */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span className="font-semibold text-white">Item Populer (Laris)</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600"
              />
              <span className="font-semibold text-white">Status Aktif</span>
            </label>
          </div>

          {/* Action buttons */}
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
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Menyimpan...
                </span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEdit ? 'Simpan Item' : 'Tambah Item'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
