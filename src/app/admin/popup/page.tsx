'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BellRing,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Eye,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Smartphone,
  Laptop,
} from 'lucide-react';
import PopupModal from '@/components/admin/PopupModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function AdminPopupPage() {
  const [popupsList, setPopupsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<any | null>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Test interactive popup modal state
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testActiveIndex, setTestActiveIndex] = useState(0);

  // Toast / Feedback
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchPopups = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/popup');
      const json = await res.json();
      if (json.success) {
        setPopupsList(Array.isArray(json.data) ? json.data : [json.data]);
      }
    } catch (e: any) {
      showToast('error', 'Gagal memuat daftar popup promo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPopups();
  }, []);

  const handleSavePopup = async (popupData: any) => {
    if (editingPopup) {
      const res = await fetch(`/api/admin/popup/${editingPopup.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(popupData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast('success', `Popup '${popupData.title}' berhasil diperbarui!`);
    } else {
      const res = await fetch('/api/admin/popup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(popupData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast('success', `Popup baru '${popupData.title}' berhasil ditambahkan!`);
    }
    fetchPopups();
  };

  const handleDeletePopup = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/popup/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast('success', `Popup '${deleteTarget.title}' berhasil dihapus.`);
      setDeleteTarget(null);
      fetchPopups();
    } catch (err: any) {
      showToast('error', err.message || 'Gagal menghapus popup.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (popup: any) => {
    try {
      const nextStatus = !popup.isActive;
      const res = await fetch(`/api/admin/popup/${popup.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextStatus }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setPopupsList((prev) =>
        prev.map((p) => (p.id === popup.id ? { ...p, isActive: nextStatus } : p))
      );
      showToast(
        'success',
        `Popup '${popup.title}' kini ${nextStatus ? 'Aktif Tayang di Web' : 'Dinonaktifkan'}`
      );
    } catch (e: any) {
      showToast('error', 'Gagal mengubah status popup');
    }
  };

  const activePopups = popupsList.filter((p) => p.isActive);
  const activeCount = activePopups.length;

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
            Popup Promo &amp; Pengumuman Web
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Kelola banyak pop-up promosi, voucher diskon, dan pengumuman yang muncul saat pengunjung pertama kali membuka web
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={fetchPopups}
            title="Refresh Data"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setTestActiveIndex(0);
                setIsTestModalOpen(true);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Tes Slider Popup ({activeCount})</span>
            </button>
          )}
          <button
            onClick={() => {
              setEditingPopup(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-rose-500/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Popup Baru</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Total Popup Promo</p>
            <p className="text-2xl font-black text-white mt-1">{popupsList.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
            <BellRing className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Popup Aktif (Tayang di Web)</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Popup Nonaktif</p>
            <p className="text-2xl font-black text-slate-400 mt-1">
              {popupsList.length - activeCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Popups Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">Memuat katalog popup promo...</span>
        </div>
      ) : popupsList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <BellRing className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="font-bold text-white text-base">Belum ada popup promo dibuat</p>
          <p className="text-slate-400 text-xs mt-1">
            Tambahkan popup promo baru untuk menyambut pengunjung website TokoGem
          </p>
          <button
            onClick={() => {
              setEditingPopup(null);
              setIsModalOpen(true);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Popup Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {popupsList.map((p) => (
            <div
              key={p.id}
              className={`rounded-2xl bg-slate-900/90 border overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                p.isActive
                  ? 'border-slate-800 hover:border-rose-500/50 hover:shadow-xl hover:shadow-rose-500/10'
                  : 'border-slate-800/50 opacity-60 bg-slate-950/80'
              }`}
            >
              {/* Poster Thumbnail */}
              <div className="relative h-44 bg-slate-950 overflow-hidden group">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLElement).style.opacity = '0.3';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-slate-700">
                    <BellRing className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                {/* Badges on Poster */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  {p.tag && (
                    <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-[9px] uppercase tracking-wider shadow">
                      {p.tag}
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      p.isActive
                        ? 'bg-emerald-500/90 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {p.isActive ? 'Aktif' : 'Off'}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-bold text-sm drop-shadow line-clamp-1">{p.title}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2.5 text-xs flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-slate-400 line-clamp-3 leading-relaxed">
                    {p.description || 'Tidak ada pesan deskripsi.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Tombol CTA:</span>
                    <span className="font-semibold text-white truncate max-w-[170px]">
                      {p.buttonText || 'Lihat Promo'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Link Tujuan:</span>
                    <a
                      href={p.buttonUrl || '/promo'}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 max-w-[160px] truncate"
                    >
                      <span>{p.buttonUrl || '/promo'}</span>
                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(p.isActive)}
                    onChange={() => handleToggleStatus(p)}
                    className="w-3.5 h-3.5 rounded text-rose-500 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[11px] font-semibold text-slate-400 hover:text-white transition">
                    {p.isActive ? 'Tayang di Web' : 'Nonaktif'}
                  </span>
                </label>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingPopup(p);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1 cursor-pointer"
                    title="Edit Popup"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() =>
                      setDeleteTarget({
                        id: p.id,
                        name: `Popup '${p.title}'`,
                      })
                    }
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition text-xs flex items-center gap-1 cursor-pointer"
                    title="Hapus Popup"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Multi-Popup Test Slider Interactive Modal */}
      {isTestModalOpen && activePopups.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-700/90 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 text-xs">
            {/* Header info test */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 flex items-center justify-center transition cursor-pointer"
                title="Tutup Simulasi"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Poster Image */}
            {activePopups[testActiveIndex]?.imageUrl && (
              <div className="relative h-44 sm:h-48 bg-slate-950 overflow-hidden">
                <img
                  src={activePopups[testActiveIndex].imageUrl}
                  alt={activePopups[testActiveIndex].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-95" />

                {/* Tag / Badge */}
                {activePopups[testActiveIndex]?.tag && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-[10px] uppercase tracking-wider shadow flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{activePopups[testActiveIndex].tag}</span>
                    </span>
                  </div>
                )}

                {/* Slider Arrows if > 1 popup */}
                {activePopups.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setTestActiveIndex((prev) =>
                          prev === 0 ? activePopups.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 backdrop-blur-sm transition cursor-pointer"
                      title="Promo Sebelumnya"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setTestActiveIndex((prev) =>
                          prev === activePopups.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 backdrop-blur-sm transition cursor-pointer"
                      title="Promo Selanjutnya"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Content Body */}
            <div className="p-5 sm:p-6 space-y-3.5">
              {!activePopups[testActiveIndex]?.imageUrl && (
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-[10px] uppercase tracking-wider">
                    {activePopups[testActiveIndex]?.tag || 'PENGUMUMAN'}
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {activePopups[testActiveIndex]?.title}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed whitespace-pre-line">
                  {activePopups[testActiveIndex]?.description}
                </p>
              </div>

              {/* Slider Dots if > 1 */}
              {activePopups.length > 1 && (
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  {activePopups.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setTestActiveIndex(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === testActiveIndex ? 'w-6 bg-rose-500' : 'w-2 bg-slate-700 hover:bg-slate-500'
                      }`}
                      title={`Promo ${idx + 1}`}
                    />
                  ))}
                  <span className="text-[10px] text-slate-400 ml-2">
                    {testActiveIndex + 1} dari {activePopups.length}
                  </span>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setIsTestModalOpen(false)}
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition cursor-pointer"
                >
                  {activePopups[testActiveIndex]?.buttonText || 'Lihat Penawaran Sekarang'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <PopupModal
        isOpen={isModalOpen}
        popup={editingPopup}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPopup(null);
        }}
        onSave={handleSavePopup}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Popup Promo"
        itemName={deleteTarget?.name}
        description="Popup promo ini akan dihapus permanen dan tidak akan ditampilkan lagi kepada pengunjung web TokoGem."
        isDeleting={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeletePopup}
      />
    </div>
  );
}
