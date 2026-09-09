'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, CreditCard, HelpCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  paymentMethod?: any | null;
  onClose: () => void;
  onSave: (paymentData: any) => Promise<void>;
}

export default function PaymentModal({
  isOpen,
  paymentMethod,
  onClose,
  onSave,
}: PaymentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    adminFee: 0,
    minAmount: 1000,
    maxAmount: 50000000,
    instructions: '',
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paymentMethod) {
      const instStr = Array.isArray(paymentMethod.instructions)
        ? paymentMethod.instructions.join('\n')
        : paymentMethod.instructions || '';

      setFormData({
        name: paymentMethod.name || '',
        category: paymentMethod.category || 'E-Wallet',
        adminFee: paymentMethod.adminFee || 0,
        minAmount: paymentMethod.minAmount || 1000,
        maxAmount: paymentMethod.maxAmount || 50000000,
        instructions: instStr,
        isActive: paymentMethod.isActive !== undefined ? Boolean(paymentMethod.isActive) : true,
      });
    }
    setError(null);
  }, [paymentMethod, isOpen]);

  if (!isOpen || !paymentMethod) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Nama metode pembayaran wajib diisi.');
      return;
    }

    try {
      setIsSubmitting(true);
      const instructionsArr = formData.instructions
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      await onSave({
        ...formData,
        adminFee: Number(formData.adminFee),
        minAmount: Number(formData.minAmount),
        maxAmount: Number(formData.maxAmount),
        instructions: instructionsArr,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui metode pembayaran.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto my-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                Edit Metode Pembayaran
              </h3>
              <p className="text-xs text-slate-400 font-mono">ID: {paymentMethod.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Nama Channel Pembayaran
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white font-medium outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Kategori</label>
              <input
                type="text"
                value={formData.category}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 outline-none cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Biaya Admin (Rp)
              </label>
              <input
                type="number"
                value={formData.adminFee}
                onChange={(e) => setFormData({ ...formData, adminFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 font-bold text-amber-400 outline-none"
                min={0}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Min. Nominal (Rp)
              </label>
              <input
                type="number"
                value={formData.minAmount}
                onChange={(e) => setFormData({ ...formData, minAmount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white outline-none"
                min={0}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Maks. Nominal (Rp)
              </label>
              <input
                type="number"
                value={formData.maxAmount}
                onChange={(e) => setFormData({ ...formData, maxAmount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white outline-none"
                min={0}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-300">
                Panduan / Instruksi Bayar
              </label>
              <span className="text-[10px] text-slate-500">1 baris per langkah</span>
            </div>
            <textarea
              rows={4}
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="1. Buka aplikasi e-wallet&#10;2. Scan kode QRIS&#10;3. Konfirmasi pembayaran"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 text-white outline-none resize-none font-mono text-[11px]"
            />
          </div>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-cyan-500 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-white block">Metode Pembayaran Aktif</span>
              <span className="text-[10px] text-slate-400 block">
                Jika dinonaktifkan, metode ini tidak akan muncul pada halaman checkout publik
              </span>
            </div>
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
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Menyimpan...
                </span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
