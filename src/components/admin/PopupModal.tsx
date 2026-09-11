'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  BellRing,
  Upload,
  Link as LinkIcon,
  Trash2,
  RefreshCw,
  Sparkles,
  Check,
} from 'lucide-react';
import { compressImageFile } from '@/lib/imageCompression';

interface PopupModalProps {
  isOpen: boolean;
  popup?: any | null;
  onClose: () => void;
  onSave: (popupData: any) => Promise<void>;
}

export default function PopupModal({ isOpen, popup, onClose, onSave }: PopupModalProps) {
  const isEdit = Boolean(popup);

  const [formData, setFormData] = useState({
    title: '',
    tag: 'PROMO SPESIAL',
    description: '',
    imageUrl: '',
    buttonText: 'Ambil Promo Sekarang',
    buttonUrl: '/promo',
    isActive: true,
  });

  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (popup) {
      setFormData({
        title: popup.title || '',
        tag: popup.tag || 'PROMO SPESIAL',
        description: popup.description || '',
        imageUrl: popup.imageUrl || '',
        buttonText: popup.buttonText || 'Ambil Promo Sekarang',
        buttonUrl: popup.buttonUrl || '/promo',
        isActive: popup.isActive !== undefined ? Boolean(popup.isActive) : true,
      });

      if (popup.imageUrl && !popup.imageUrl.startsWith('data:image/')) {
        setImageTab('url');
      } else {
        setImageTab('upload');
      }
      setCompressionInfo(null);
    } else {
      setFormData({
        title: '',
        tag: 'PROMO SPESIAL',
        description: '',
        imageUrl: '',
        buttonText: 'Ambil Promo Sekarang',
        buttonUrl: '/promo',
        isActive: true,
      });
      setImageTab('upload');
      setCompressionInfo(null);
    }
    setError(null);
  }, [popup, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Harap pilih file gambar yang valid (PNG, JPG, WEBP).');
      return;
    }

    try {
      setIsCompressing(true);
      setError(null);
      const result = await compressImageFile(file, {
        maxWidth: 900,
        maxHeight: 700,
        quality: 0.82,
        format: 'image/webp',
      });

      setFormData((prev) => ({ ...prev, imageUrl: result.dataUrl }));
      setCompressionInfo(
        `Foto poster siap (${result.sizeKb} KB, ${result.width}x${result.height}px, dioptimasi dari ${result.originalSizeKb} KB)`
      );
    } catch (err: any) {
      setError(err.message || 'Gagal memproses dan mengompresi gambar.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
    setCompressionInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Judul popup wajib diisi.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Deskripsi pesan popup wajib diisi.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan popup promo.');
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
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                {isEdit ? `Edit Popup: ${popup.title}` : 'Tambah Popup Promo Baru'}
              </h3>
              <p className="text-slate-400 text-xs">Pop-up selamat datang dan promo awal buka web</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Tag / Label Badge
              </label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="e.g. FLASH SALE / PROMO MEMBER"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-rose-500 text-white uppercase font-bold outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Judul Pop-up <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. 🎉 Diskon Kilat Mobile Legends!"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-rose-500 text-white font-bold outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Deskripsi / Pesan Pengumuman <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tuliskan info promo, voucher diskon, atau event yang sedang berlangsung..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-rose-500 text-white outline-none resize-none leading-relaxed"
              required
            />
          </div>

          {/* Image Tabs (Upload or URL) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-slate-300">
                Poster Gambar Popup (Opsional)
              </label>
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition ${
                    imageTab === 'upload'
                      ? 'bg-rose-500 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload Foto</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition ${
                    imageTab === 'url'
                      ? 'bg-rose-500 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Input Link URL</span>
                </button>
              </div>
            </div>

            {/* Tab: Upload File */}
            {imageTab === 'upload' && (
              <div className="space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />

                {!formData.imageUrl ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2.5 ${
                      isDragging
                        ? 'border-rose-400 bg-rose-500/10'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-inner">
                      {isCompressing ? (
                        <RefreshCw className="w-6 h-6 animate-spin text-rose-400" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs">
                        {isCompressing
                          ? 'Mengompresi & Memproses Foto...'
                          : 'Klik untuk upload poster dari Laptop / HP'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Atau drag &amp; drop gambar poster ke area ini
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 space-y-2.5">
                    <div className="relative h-40 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                      <img
                        src={formData.imageUrl}
                        alt="Preview Poster"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1 rounded-lg bg-black/70 hover:bg-black text-white text-[10px] font-bold backdrop-blur-sm border border-white/10 transition cursor-pointer flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Ganti Foto</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-1 rounded-lg bg-red-500/80 hover:bg-red-500 text-white backdrop-blur-sm transition cursor-pointer"
                          title="Hapus Foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {compressionInfo && (
                      <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>{compressionInfo}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab: URL */}
            {imageTab === 'url' && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value });
                    setCompressionInfo(null);
                  }}
                  placeholder="https://images.unsplash.com/... atau /images/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-rose-500 text-white font-mono outline-none"
                />
                {formData.imageUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-800 h-36 bg-slate-950 relative">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.opacity = '0.3';
                      }}
                    />
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-slate-300">
                      Pratinjau Poster
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Teks Tombol Aksi (CTA)
              </label>
              <input
                type="text"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="e.g. Ambil Promo Sekarang"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-rose-500 text-white font-bold outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Link Tujuan Tombol
              </label>
              <input
                type="text"
                value={formData.buttonUrl}
                onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
                placeholder="/promo atau /game/mobile-legends"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-rose-500 text-white font-mono outline-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-rose-500 focus:ring-0"
            />
            <div>
              <span className="font-semibold text-white block">Aktifkan Popup Ini</span>
              <span className="text-[10px] text-slate-400 block">
                Tampilkan popup ini kepada pengunjung ketika membuka website TokoGem
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
              disabled={isSubmitting || isCompressing}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black shadow-lg shadow-rose-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Menyimpan...
                </span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEdit ? 'Simpan Perubahan' : 'Buat Popup Baru'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
