'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Gem,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Flame,
  Gamepad2,
  FileSpreadsheet,
} from 'lucide-react';
import ItemModal from '@/components/admin/ItemModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import ExcelImportModal from '@/components/admin/ExcelImportModal';

function AdminItemsContent() {
  const searchParams = useSearchParams();
  const initialGameId = searchParams.get('gameId');

  const [items, setItems] = useState<any[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGameId, setSelectedGameId] = useState<string>(initialGameId || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Delete states
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [itemsRes, gamesRes] = await Promise.all([
        fetch('/api/admin/items'),
        fetch('/api/admin/games'),
      ]);
      const [itemsJson, gamesJson] = await Promise.all([itemsRes.json(), gamesRes.json()]);

      if (itemsJson.success) setItems(itemsJson.data);
      if (gamesJson.success) setGames(gamesJson.data);
    } catch (e) {
      showToast('error', 'Gagal memuat data item');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveItem = async (itemData: any) => {
    if (editingItem) {
      const res = await fetch(`/api/admin/items/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast('success', `Item '${itemData.name}' berhasil diperbarui!`);
    } else {
      const res = await fetch('/api/admin/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast('success', `Item baru '${itemData.name}' berhasil ditambahkan!`);
    }
    loadData();
  };

  const handleDeleteItem = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/items/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast('success', `Item '${deleteTarget.name}' berhasil dihapus.`);
      setDeleteTarget(null);
      loadData();
    } catch (e: any) {
      showToast('error', e.message || 'Gagal menghapus item');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (item: any) => {
    try {
      const res = await fetch(`/api/admin/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      const json = await res.json();
      if (json.success) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isActive: !i.isActive } : i))
        );
        showToast('success', `Status '${item.name}' diubah`);
      }
    } catch (e) {
      showToast('error', 'Gagal mengubah status item');
    }
  };

  const filteredItems = items.filter((item) => {
    if (selectedGameId !== 'all' && item.gameId !== Number(selectedGameId)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(q) ||
        (item.gameName && item.gameName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-xl transition-all ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/80 border-red-500/40 text-red-300'
          }`}
        >
          <span>{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Gem className="w-4 h-4" />
            <span>Katalog Produk TokoGem</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Kelola Nominal &amp; Item</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Atur nominal diamond, kredit game, harga jual, dan diskon coret per game.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={() => setIsExcelModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-bold text-xs transition flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Tambah via Excel</span>
          </button>

          <button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Item Baru</span>
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0f172a] border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama item (misal: 86 Diamonds, Weekly Pass)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedGameId}
            onChange={(e) => setSelectedGameId(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">Semua Game ({items.length} item)</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                Game: {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Items Table */}
      <div className="rounded-3xl bg-[#0f172a] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-5 py-4 font-bold">Game</th>
                <th className="px-4 py-4 font-bold">Nama Item</th>
                <th className="px-4 py-4 font-bold">Nominal</th>
                <th className="px-4 py-4 font-bold">Harga Jual</th>
                <th className="px-4 py-4 font-bold">Harga Coret</th>
                <th className="px-4 py-4 font-bold">Status</th>
                <th className="px-5 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Memuat item nominal...</span>
                  </td>
                </tr>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const discountPercent =
                    item.originalPrice && item.originalPrice > item.price
                      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                      : null;

                  return (
                    <tr key={item.id} className="hover:bg-slate-850/50 transition group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          {item.gameIcon && (
                            <img
                              src={item.gameIcon}
                              alt=""
                              className="w-8 h-8 rounded-lg object-cover border border-slate-800 shrink-0"
                            />
                          )}
                          <span className="font-bold text-white text-xs">{item.gameName || 'Game'}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm">{item.name}</span>
                          {item.isPopular && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 text-[9px] font-extrabold flex items-center gap-0.5">
                              <Flame className="w-2.5 h-2.5 fill-current" />
                              Laris
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-300">
                        {item.nominal > 0 ? item.nominal.toLocaleString('id-ID') : '—'}
                      </td>

                      <td className="px-4 py-3.5 font-extrabold text-cyan-300 text-sm">
                        Rp {item.price.toLocaleString('id-ID')}
                      </td>

                      <td className="px-4 py-3.5">
                        {item.originalPrice ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 line-through text-[11px]">
                              Rp {item.originalPrice.toLocaleString('id-ID')}
                            </span>
                            {discountPercent && (
                              <span className="px-1.5 py-0.2 rounded bg-red-500/10 text-red-400 text-[10px] font-bold">
                                -{discountPercent}%
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Tidak ada</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleToggleActive(item)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition cursor-pointer ${
                            item.isActive
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {item.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{item.isActive ? 'Aktif' : 'Nonaktif'}</span>
                        </button>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition cursor-pointer"
                            title="Edit Item"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition cursor-pointer"
                            title="Hapus Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                    Tidak ada nominal item untuk kriteria ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Modal */}
      <ItemModal
        isOpen={isModalOpen}
        item={editingItem}
        games={games}
        defaultGameId={selectedGameId !== 'all' ? Number(selectedGameId) : undefined}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Nominal Item"
        itemName={deleteTarget?.name || ''}
        description={`Hapus item ${deleteTarget?.name} dari daftar pembelian.`}
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteItem}
      />

      {/* Excel Bulk Import Modal */}
      <ExcelImportModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        onSuccess={() => {
          loadData();
          showToast('success', 'Produk dari file Excel berhasil ditambahkan ke katalog!');
        }}
      />
    </div>
  );
}

export default function AdminItemsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-slate-400">
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Memuat modul item...</span>
        </div>
      }
    >
      <AdminItemsContent />
    </Suspense>
  );
}
