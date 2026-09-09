'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Sliders,
  Eye,
} from 'lucide-react';
import BannerModal from '@/components/admin/BannerModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function AdminBannersPage() {
  const [bannersList, setBannersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast / Feedback
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/banners');
      const json = await res.json();
      if (json.success) {
        setBannersList(json.data);
      }
    } catch (e: any) {
      showToast('error', 'Gagal memuat daftar banner');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSaveBanner = async (bannerData: any) => {
    if (editingBanner) {
      const res = await fetch(`/api/admin/banners/${editingBanner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast('success', `Banner '${bannerData.title}' berhasil diperbarui!`);
    } else {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast('success', `Banner baru '${bannerData.title}' berhasil ditambahkan!`);
    }
    fetchBanners();
  };

  const handleDeleteBanner = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/banners/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast('success', `Banner '${deleteTarget.title}' berhasil dihapus.`);
      setDeleteTarget(null);
      fetchBanners();
    } catch (err: any) {
      showToast('error', err.message || 'Gagal menghapus banner.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (banner: any) => {
    try {
      const nextStatus = !banner.isActive;
      const res = await fetch(`/api/admin/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextStatus }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setBannersList((prev) =>
        prev.map((b) => (b.id === banner.id ? { ...b, isActive: nextStatus } : b))
      );
      showToast(
        'success',
        `Banner '${banner.title}' kini ${nextStatus ? 'Aktif di Web' : 'Dinonaktifkan'}`
      );
    } catch (e: any) {
      showToast('error', 'Gagal mengubah status banner');
    }
  };

  const activeCount = bannersList.filter((b) => b.isActive).length;

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
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
              <ImageIcon className="w-5 h-5" />
            </span>
            Banner Event &amp; Carousel
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Atur banner event promosi, flash sale, dan poster carousel yang tampil di halaman depan website TokoGem
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchBanners}
            title="Refresh Data"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setEditingBanner(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Banner Baru</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Total Banner</p>
            <p className="text-2xl font-black text-white mt-1">{bannersList.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Banner Aktif (Slide Web)</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Banner Nonaktif</p>
            <p className="text-2xl font-black text-slate-400 mt-1">
              {bannersList.length - activeCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Banners Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">Memuat katalog banner event...</span>
        </div>
      ) : bannersList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="font-bold text-white text-base">Belum ada banner event dibuat</p>
          <p className="text-slate-400 text-xs mt-1">
            Tambahkan banner baru agar halaman depan TokoGem lebih menarik
          </p>
          <button
            onClick={() => {
              setEditingBanner(null);
              setIsModalOpen(true);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Banner Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bannersList.map((b) => (
            <div
              key={b.id}
              className={`rounded-2xl bg-slate-900/90 border overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                b.isActive
                  ? 'border-slate-800 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10'
                  : 'border-slate-800/50 opacity-60 bg-slate-950/80'
              }`}
            >
              {/* Card Banner Image Preview */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden group">
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.opacity = '0.3';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                {/* Badges on Banner */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  {b.badgeText && (
                    <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-black text-[10px] uppercase tracking-wider shadow">
                      {b.badgeText}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-slate-300 font-mono text-[10px]">
                    Posisi #{b.position}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      b.isActive
                        ? 'bg-emerald-500/90 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {b.isActive ? 'Aktif' : 'Off'}
                  </span>
                </div>

                {/* Banner bottom title on thumbnail */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-bold text-sm drop-shadow line-clamp-1">{b.title}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2.5 text-xs flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-slate-400 line-clamp-2">
                    {b.subtitle || 'Tidak ada deskripsi/subtitle.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Link Tujuan:</span>
                  <a
                    href={b.targetUrl || '/'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 max-w-[160px] truncate"
                  >
                    <span>{b.targetUrl || '/'}</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </a>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(b.isActive)}
                    onChange={() => handleToggleStatus(b)}
                    className="w-3.5 h-3.5 rounded text-indigo-500 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[11px] font-semibold text-slate-400 hover:text-white transition">
                    {b.isActive ? 'Tayang di Web' : 'Nonaktif'}
                  </span>
                </label>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingBanner(b);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1 cursor-pointer"
                    title="Edit Banner"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() =>
                      setDeleteTarget({
                        id: b.id,
                        name: `Banner '${b.title}'`,
                      })
                    }
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition text-xs flex items-center gap-1 cursor-pointer"
                    title="Hapus Banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <BannerModal
        isOpen={isModalOpen}
        banner={editingBanner}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBanner(null);
        }}
        onSave={handleSaveBanner}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Banner Event"
        itemName={deleteTarget?.name}
        description="Banner ini akan dihapus permanen dari perputaran carousel halaman depan website TokoGem."
        isDeleting={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteBanner}
      />
    </div>
  );
}
