'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Gamepad2,
  Plus,
  Search,
  Edit2,
  Trash2,
  Gem,
  ExternalLink,
  Flame,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Star,
  SlidersHorizontal,
} from 'lucide-react';
import GameModal from '@/components/admin/GameModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import { CATEGORIES } from '@/data/mockGames';

export default function AdminGamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<any | null>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast / feedback message
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchGames = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/games');
      const json = await res.json();
      if (json.success) {
        setGames(json.data);
      }
    } catch (e: any) {
      showToast('error', 'Gagal memuat daftar game');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleSaveGame = async (gameData: any) => {
    if (editingGame) {
      // Update
      const res = await fetch(`/api/admin/games/${editingGame.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast('success', `Game '${gameData.name}' berhasil diperbarui!`);
    } else {
      // Create
      const res = await fetch('/api/admin/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast('success', `Game baru '${gameData.name}' berhasil ditambahkan ke katalog!`);
    }
    fetchGames();
  };

  const handleDeleteGame = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/games/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      showToast('success', `Game '${deleteTarget.name}' berhasil dihapus.`);
      setDeleteTarget(null);
      fetchGames();
    } catch (e: any) {
      showToast('error', e.message || 'Gagal menghapus game');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (game: any) => {
    try {
      const res = await fetch(`/api/admin/games/${game.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !game.isActive }),
      });
      const json = await res.json();
      if (json.success) {
        setGames((prev) =>
          prev.map((g) => (g.id === game.id ? { ...g, isActive: !g.isActive } : g))
        );
        showToast('success', `Status game '${game.name}' diubah menjadi ${!game.isActive ? 'Aktif' : 'Nonaktif'}`);
      }
    } catch (e) {
      showToast('error', 'Gagal mengubah status game');
    }
  };

  const filteredGames = games.filter((g) => {
    if (selectedCategory !== 'Semua' && g.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        g.name.toLowerCase().includes(q) ||
        g.publisher.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        g.slug.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {toastMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-xl transition-all animate-in fade-in slide-in-from-top-2 ${
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

      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Gamepad2 className="w-4 h-4" />
            <span>Katalog Game TokoGem</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Kelola Katalog Game</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tambah game baru, ubah rincian banner, konfigurasi server ID, dan kelola produk.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchGames}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          <button
            onClick={() => {
              setEditingGame(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Game Baru</span>
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
            placeholder="Cari nama game, publisher, atau slug..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 outline-none focus:border-blue-500 cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                Kategori: {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Games Table */}
      <div className="rounded-3xl bg-[#0f172a] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-5 py-4 font-bold">Game</th>
                <th className="px-4 py-4 font-bold">Kategori &amp; Publisher</th>
                <th className="px-4 py-4 font-bold">Item Nominal</th>
                <th className="px-4 py-4 font-bold">Harga Mulai</th>
                <th className="px-4 py-4 font-bold">Server ID</th>
                <th className="px-4 py-4 font-bold">Status</th>
                <th className="px-5 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>Memuat data game...</span>
                  </td>
                </tr>
              ) : filteredGames.length > 0 ? (
                filteredGames.map((game) => (
                  <tr key={game.id} className="hover:bg-slate-850/50 transition group">
                    {/* Game Name & Icon */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={game.iconUrl}
                          alt={game.name}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-800 shrink-0 bg-slate-950"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                              {game.name}
                            </span>
                            {game.isPopular && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 text-[9px] font-extrabold uppercase">
                                Hot
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-cyan-400/80 block">
                            /{game.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category & Publisher */}
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-white block">{game.category}</span>
                      <span className="text-[11px] text-slate-400">{game.publisher}</span>
                    </td>

                    {/* Item nominals count */}
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/admin/items?gameId=${game.id}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 font-semibold transition"
                      >
                        <Gem className="w-3 h-3" />
                        <span>{game.itemsCount || 0} Item</span>
                      </Link>
                    </td>

                    {/* Min price */}
                    <td className="px-4 py-3.5 font-bold text-slate-200">
                      Rp {(game.minPrice || 0).toLocaleString('id-ID')}
                    </td>

                    {/* Server Required */}
                    <td className="px-4 py-3.5">
                      {game.serverRequired ? (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-semibold">
                          Wajib Server
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">Hanya User ID</span>
                      )}
                    </td>

                    {/* Active toggle */}
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => handleToggleActive(game)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                          game.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {game.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Aktif
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> Nonaktif
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/game/${game.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                          title="Lihat Halaman Publik"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => {
                            setEditingGame(game);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition cursor-pointer"
                          title="Edit Game"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(game)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition cursor-pointer"
                          title="Hapus Game"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                    Tidak ada game yang sesuai kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Game Modal (Create / Edit) */}
      <GameModal
        isOpen={isModalOpen}
        game={editingGame}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGame}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Game dari Katalog"
        itemName={deleteTarget?.name || ''}
        description="Semua produk nominal item yang terhubung dengan game ini juga akan otomatis dihapus dari database TokoGem."
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteGame}
      />
    </div>
  );
}
