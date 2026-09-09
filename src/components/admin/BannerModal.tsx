'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, Link as LinkIcon, Sparkles } from 'lucide-react';

interface BannerModalProps {
  isOpen: boolean;
  banner?: any | null;
  onClose: () => void;
  onSave: (bannerData: any) => Promise<void>;
}

export default function BannerModal({ isOpen, banner, onClose, onSave }: BannerModalProps) {
  const isEdit = Boolean(banner);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    targetUrl: '/#katalog',
    badgeText: 'EVENT SPESIAL',
    position: 1,
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        imageUrl: banner.imageUrl || '',
        targetUrl: banner.targetUrl || '/#katalog',
        badgeText: banner.badgeText || '',
        position: banner.position !== undefined ? banner.position : 1,
        isActive: banner.isActive !== undefined ? Boolean(banner.isActive) : true,
      });
    } else {
      setFormData({
        title: '',
        subtitle: '',
        imageUrl: '',
        targetUrl: '/#katalog',
        badgeText: 'EVENT SPESIAL',
        position: 1,
        isActive: true,
      });
    }
    setError(null);
  }, [banner, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      setError('Judul banner dan URL gambar wajib diisi.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        ...formData,
        position: Number(formData.position) || 0,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan banner.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto my-auto text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                {isEdit ? `Edit Banner: ${banner.title}` : 'Tambah Banner Event Baru'}
              </h3>
              <p className="text-slate-400 text-xs">Banner promosi carousel di halaman depan web</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Judul Banner Event <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Diskon Kilat Mobile Legends 30%"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-white font-medium outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Deskripsi / Subtitle</label>
            <textarea
              rows={2}
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Top up diamond MLBB termurah proses instan 1 detik..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-white outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Badge / Tag Text
              </label>
              <input
                type="text"
                value={formData.badgeText}
                onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                placeholder="HOT PROMO / FLASH SALE"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-white uppercase font-bold outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Urutan Tampil (Posisi)
              </label>
              <input
                type="number"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-white font-bold outline-none"
                min={1}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              URL Gambar Banner (Landscape 16:9) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="/images/games/mlbb-banner.webp atau https://..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-white font-mono outline-none"
              required
            />
            {formData.imageUrl && (
              <div className="mt-2.5 rounded-xl overflow-hidden border border-slate-800 h-32 bg-slate-950 relative">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.opacity = '0.3';
                  }}
                />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-slate-300">
                  Pratinjau Banner
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Target Link Saat Banner Diklik
            </label>
            <input
              type="text"
              value={formData.targetUrl}
              onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
              placeholder="/game/mobile-legends atau /promo"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-white font-mono outline-none"
            />
          </div>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-500 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-white block">Banner Aktif</span>
              <span className="text-[10px] text-slate-400 block">
                Tampilkan banner ini di rotasi slide Hero Banner halaman utama
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
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Menyimpan...
                </span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEdit ? 'Simpan Banner' : 'Buat Banner'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
