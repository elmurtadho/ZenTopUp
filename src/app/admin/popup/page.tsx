'use client';

import React, { useState, useEffect } from 'react';
import {
  BellRing,
  Save,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  Sparkles,
  ExternalLink,
  X,
  Smartphone,
  Laptop,
} from 'lucide-react';

export default function AdminPopupPage() {
  const [formData, setFormData] = useState({
    title: '',
    tag: 'PROMO SPESIAL',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    buttonText: 'Ambil Voucher & Top Up Sekarang',
    buttonUrl: '/promo',
    isActive: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchPopupConfig = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/popup');
      const json = await res.json();
      if (json.success && json.data) {
        setFormData({
          title: json.data.title || '',
          tag: json.data.tag || 'PROMO SPESIAL',
          description: json.data.description || '',
          imageUrl: json.data.imageUrl || '',
          buttonText: json.data.buttonText || 'Ambil Promo',
          buttonUrl: json.data.buttonUrl || '/promo',
          isActive: Boolean(json.data.isActive),
        });
      }
    } catch (e: any) {
      showToast('error', 'Gagal memuat konfigurasi popup');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPopupConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await fetch('/api/admin/popup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast('success', 'Konfigurasi popup selamat datang berhasil disimpan!');
    } catch (err: any) {
      showToast('error', err.message || 'Gagal menyimpan konfigurasi popup');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-medium animate-in slide-in-from-top-3 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
              : 'bg-red-950/90 border-red-500/50 text-red-300'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
              <BellRing className="w-5 h-5" />
            </span>
            Popup Pengumuman &amp; Promo Awal Buka Web
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Atur pesan pop-up selamat datang yang muncul otomatis saat pengunjung pertama kali membuka website TokoGem
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchPopupConfig}
            title="Refresh Data"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setIsTestModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Tes Popup Interaktif</span>
          </button>
        </div>
      </div>

      {/* Main Form & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: 7 Cols */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base">Pengaturan Konten Popup</h3>
              <p className="text-xs text-slate-400">Ubah teks, gambar promo, tombol CTA, dan status tampil</p>
            </div>

            {/* Active Toggle Switch */}
            <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-rose-500 focus:ring-0"
              />
              <span className={`text-xs font-bold ${formData.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                {formData.isActive ? 'Status: Aktif' : 'Status: Nonaktif'}
              </span>
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Tag / Label Badge
                </label>
                <input
                  type="text"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  placeholder="e.g. PROMO MEMBER BARU / FLASH SALE"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-rose-500 text-white font-bold outline-none uppercase"
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
                  placeholder="e.g. 🎉 Promo Spesial Selamat Datang!"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-rose-500 text-white font-bold outline-none"
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
                placeholder="Tuliskan detail info promo, syarat singkat, atau voucher..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-rose-500 text-white outline-none resize-none leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                URL Gambar / Poster Pop-up
              </label>
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/... atau /images/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-rose-500 text-white font-mono outline-none"
              />
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-rose-500 text-white font-bold outline-none"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-rose-500 text-white font-mono outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
              <p className="text-[11px] text-slate-500">
                Pengunjung hanya melihat pop-up 1x per sesi kunjungan agar tetap nyaman.
              </p>

              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black shadow-lg shadow-rose-500/20 transition flex items-center gap-2 cursor-pointer shrink-0"
              >
                {isSaving ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Menyimpan...
                  </span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Pengaturan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Live Preview: 5 Cols */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Live Preview Tampilan
            </span>

            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                  previewMode === 'desktop'
                    ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                  previewMode === 'mobile'
                    ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          {/* Live Preview Box */}
          <div
            className={`mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-4 shadow-2xl relative transition-all duration-300 ${
              previewMode === 'mobile' ? 'max-w-[320px]' : 'w-full'
            }`}
          >
            {/* Modal Mockup Inside Preview */}
            <div className="rounded-2xl bg-[#0f172a] border border-slate-700/80 overflow-hidden shadow-2xl space-y-3 text-xs">
              {/* Poster Image */}
              {formData.imageUrl && (
                <div className="relative h-36 bg-slate-900 overflow-hidden">
                  <img
                    src={formData.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.opacity = '0.3';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-[9px] uppercase tracking-wider shadow">
                      {formData.tag || 'PROMO'}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center">
                    <X className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}

              {/* Text content */}
              <div className="p-4 pt-1 space-y-2">
                <h4 className="font-extrabold text-white text-sm leading-snug">
                  {formData.title || 'Judul Popup Anda'}
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-3">
                  {formData.description || 'Deskripsi pengumuman atau promo yang ingin disampaikan...'}
                </p>

                {/* CTA Button */}
                <div className="pt-2">
                  <div className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-center text-xs shadow-md shadow-blue-500/20">
                    {formData.buttonText || 'Ambil Promo'}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-center text-slate-500 mt-3">
              {formData.isActive ? '🟢 Popup Aktif di Website' : '🔴 Popup Dinonaktifkan'}
            </p>
          </div>
        </div>
      </div>

      {/* Test Interactive Modal Overlay */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            {formData.imageUrl && (
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                <img src={formData.imageUrl} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white font-black text-[10px] uppercase tracking-wider shadow">
                    {formData.tag || 'PROMO'}
                  </span>
                </div>
                <button
                  onClick={() => setIsTestModalOpen(false)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="p-6 space-y-3">
              <h3 className="font-black text-white text-lg">{formData.title}</h3>
              <p className="text-slate-300 text-xs leading-relaxed">{formData.description}</p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setIsTestModalOpen(false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition cursor-pointer"
                >
                  {formData.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
