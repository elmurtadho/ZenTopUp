'use client';

import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Percent,
  Calendar,
  Copy,
  Check,
  Gamepad2,
  Sparkles,
} from 'lucide-react';
import PromoModal from '@/components/admin/PromoModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any | null>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast / Feedback
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [promosRes, gamesRes] = await Promise.all([
        fetch('/api/admin/promos'),
        fetch('/api/admin/games'),
      ]);

      const promosJson = await promosRes.json();
      const gamesJson = await gamesRes.json();

      if (promosJson.success) setPromos(promosJson.data);
      if (gamesJson.success) setGames(gamesJson.data);
    } catch (e: any) {
      showToast('error', 'Gagal memuat data voucher promo');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSavePromo = async (promoData: any) => {
    if (editingPromo) {
      const res = await fetch(`/api/admin/promos/${editingPromo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promoData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast('success', `Voucher '${promoData.code}' berhasil diperbarui!`);
    } else {
      const res = await fetch('/api/admin/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promoData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast('success', `Voucher '${promoData.code}' berhasil dibuat!`);
    }
    fetchData();
  };

  const handleDeletePromo = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/promos/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast('success', `Promo '${deleteTarget.code}' berhasil dihapus.`);
      setDeleteTarget(null);
      fetchData();
    } catch (err: any) {
      showToast('error', err.message || 'Gagal menghapus promo.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (promo: any) => {
    try {
      const nextStatus = !promo.isActive;
      const res = await fetch(`/api/admin/promos/${promo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextStatus }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setPromos((prev) =>
        prev.map((p) => (p.id === promo.id ? { ...p, isActive: nextStatus } : p))
      );
      showToast(
        'success',
        `Promo ${promo.code} kini ${nextStatus ? 'Aktif' : 'Dinonaktifkan'}`
      );
    } catch (e: any) {
      showToast('error', 'Gagal mengubah status promo');
    }
  };

  // Filter promos
  const filteredPromos = promos.filter((promo) => {
    const matchesSearch =
      promo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (promo.description && promo.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? promo.isActive
        : !promo.isActive;

    return matchesSearch && matchesStatus;
  });

  const activeCount = promos.filter((p) => p.isActive).length;

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
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Tag className="w-5 h-5" />
            </span>
            Kelola Promo &amp; Voucher
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Atur kupon potongan harga, cashback, dan promo spesial flash sale TokoGem
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchData}
            title="Refresh Data"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setEditingPromo(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Voucher Baru</span>
          </button>
        </div>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Total Voucher Dibuat</p>
            <p className="text-2xl font-black text-white mt-1">{promos.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Voucher Aktif</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Voucher Nonaktif</p>
            <p className="text-2xl font-black text-slate-400 mt-1">
              {promos.length - activeCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode kupon, judul promo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-amber-500 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950/70 rounded-xl border border-slate-800 self-stretch sm:self-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex-1 sm:flex-none ${
              statusFilter === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua ({promos.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex-1 sm:flex-none ${
              statusFilter === 'active'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Aktif ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex-1 sm:flex-none ${
              statusFilter === 'inactive'
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Nonaktif ({promos.length - activeCount})
          </button>
        </div>
      </div>

      {/* Promos Grid / Table */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">Memuat katalog voucher promo...</span>
        </div>
      ) : filteredPromos.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <Tag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="font-bold text-white text-base">Tidak ada voucher promo ditemukan</p>
          <p className="text-slate-400 text-xs mt-1">
            {searchQuery
              ? 'Coba ganti kata kunci pencarian Anda'
              : 'Mulai buat voucher diskon pertama untuk menarik lebih banyak pembeli'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => {
                setEditingPromo(null);
                setIsModalOpen(true);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Buat Voucher Pertama
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPromos.map((promo) => {
            const isExpired = promo.endsAt && new Date(promo.endsAt) < new Date();
            const targetGame = games.find((g) => g.slug === promo.gameSlug);

            return (
              <div
                key={promo.id}
                className={`relative rounded-2xl bg-slate-900/90 border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                  promo.isActive && !isExpired
                    ? 'border-slate-800 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5'
                    : 'border-slate-800/60 opacity-70 bg-slate-950/60'
                }`}
              >
                {/* Promo Card Top */}
                <div className="p-4 sm:p-5 space-y-3.5">
                  {/* Badge & Code */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-black text-sm flex items-center gap-1.5 tracking-wider">
                        <Tag className="w-3.5 h-3.5" />
                        <span>{promo.code}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(promo.code)}
                        title="Salin Kode"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                      >
                        {copiedCode === promo.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        !promo.isActive
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : isExpired
                          ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {!promo.isActive ? 'Nonaktif' : isExpired ? 'Expired' : 'Aktif'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-white font-bold text-sm line-clamp-1">{promo.title}</h3>
                    <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                      {promo.description || 'Tidak ada deskripsi'}
                    </p>
                  </div>

                  {/* Discount Highlight */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Besar Potongan</span>
                      <span className="text-base font-black text-amber-400">
                        {promo.discountType === 'percent'
                          ? `Diskon ${promo.amount}%`
                          : `Potongan Rp ${Number(promo.amount).toLocaleString('id-ID')}`}
                      </span>
                    </div>
                    {promo.maxDiscount && (
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Maks Diskon</span>
                        <span className="text-xs font-semibold text-slate-300">
                          Rp {Number(promo.maxDiscount).toLocaleString('id-ID')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Rules & Eligibility */}
                  <div className="space-y-1.5 text-[11px] text-slate-400">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Gamepad2 className="w-3.5 h-3.5 text-slate-500" />
                        Game:
                      </span>
                      <span className="font-medium text-slate-300">
                        {targetGame ? targetGame.name : 'Semua Game (Global)'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Min. Transaksi:</span>
                      <span className="font-medium text-slate-300">
                        {promo.minPurchase
                          ? `Rp ${Number(promo.minPurchase).toLocaleString('id-ID')}`
                          : 'Tanpa Minimum'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        Berlaku hingga:
                      </span>
                      <span
                        className={`font-medium ${
                          isExpired ? 'text-red-400' : 'text-slate-300'
                        }`}
                      >
                        {promo.endsAt ? promo.endsAt : 'Selamanya'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-3 sm:px-4 sm:py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2">
                  {/* Quick Toggle Active Switch */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(promo.isActive)}
                      onChange={() => handleToggleStatus(promo)}
                      className="w-3.5 h-3.5 rounded text-amber-500 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-[11px] font-semibold text-slate-400 hover:text-white transition">
                      {promo.isActive ? 'Aktif' : 'Mati'}
                    </span>
                  </label>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingPromo(promo);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1 cursor-pointer"
                      title="Edit Voucher"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() =>
                        setDeleteTarget({
                          id: promo.id,
                          name: `Voucher '${promo.code}' (${promo.title})`,
                        })
                      }
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition text-xs flex items-center gap-1 cursor-pointer"
                      title="Hapus Voucher"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <PromoModal
        isOpen={isModalOpen}
        promo={editingPromo}
        games={games}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPromo(null);
        }}
        onSave={handleSavePromo}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Voucher Promo"
        message={`Apakah Anda yakin ingin menghapus ${deleteTarget?.name}? Kode voucher ini tidak akan dapat digunakan lagi oleh pembeli.`}
        isDeleting={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeletePromo}
      />
    </div>
  );
}
