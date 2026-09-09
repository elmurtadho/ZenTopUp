'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Gamepad2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { CATEGORIES } from '@/data/mockGames';

interface GameModalProps {
  isOpen: boolean;
  game?: any | null; // if provided, edit mode
  onClose: () => void;
  onSave: (gameData: any) => Promise<void>;
}

export default function GameModal({ isOpen, game, onClose, onSave }: GameModalProps) {
  const isEdit = Boolean(game);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    publisher: '',
    category: 'MOBA',
    iconUrl: '',
    bannerUrl: '',
    tagline: '',
    rating: 4.8,
    minPrice: 1500,
    isPopular: false,
    serverRequired: false,
    serverList: '',
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (game) {
      let serverListStr = '';
      if (game.serverList) {
        try {
          const parsed = JSON.parse(game.serverList);
          serverListStr = Array.isArray(parsed) ? parsed.join(', ') : game.serverList;
        } catch {
          serverListStr = game.serverList;
        }
      }
      setFormData({
        name: game.name || '',
        slug: game.slug || '',
        publisher: game.publisher || '',
        category: game.category || 'MOBA',
        iconUrl: game.iconUrl || '',
        bannerUrl: game.bannerUrl || '',
        tagline: game.tagline || '',
        rating: game.rating || 4.8,
        minPrice: game.minPrice || 1500,
        isPopular: Boolean(game.isPopular),
        serverRequired: Boolean(game.serverRequired),
        serverList: serverListStr,
        isActive: game.isActive !== undefined ? Boolean(game.isActive) : true,
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        publisher: '',
        category: 'MOBA',
        iconUrl: '',
        bannerUrl: '',
        tagline: '',
        rating: 4.8,
        minPrice: 1500,
        isPopular: false,
        serverRequired: false,
        serverList: '',
        isActive: true,
      });
    }
    setError(null);
  }, [game, isOpen]);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      name: val,
      // Auto-generate slug if new game
      slug: !isEdit ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.slug.trim() || !formData.publisher.trim() || !formData.iconUrl.trim()) {
      setError('Nama game, slug, publisher, dan Icon URL wajib diisi.');
      return;
    }

    try {
      setIsSubmitting(true);
      const parsedServerList = formData.serverList.trim()
        ? formData.serverList.split(',').map((s) => s.trim()).filter(Boolean)
        : null;

      await onSave({
        ...formData,
        serverList: parsedServerList,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data game.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-700/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">
                {isEdit ? `Edit Game: ${game.name}` : 'Tambah Game Baru'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEdit ? 'Perbarui informasi dan konfigurasi game' : 'Masukkan informasi game ke katalog TokoGem'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Nama Game */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Nama Game <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Contoh: Mobile Legends"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white outline-none"
                required
              />
            </div>

            {/* Slug URL */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Slug URL (Unik) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="mobile-legends"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 font-mono text-cyan-300 outline-none"
                required
              />
            </div>

            {/* Publisher */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Publisher / Developer <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                placeholder="Moonton, Riot Games, Garena..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white outline-none"
                required
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Kategori Game</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white outline-none cursor-pointer"
              >
                {CATEGORIES.filter((c) => c !== 'Semua' && c !== 'Populer').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Action">Action</option>
                <option value="RPG">RPG</option>
                <option value="Simulator">Simulator</option>
              </select>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Tagline Deskripsi Singkat</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Top up diamond resmi, proses 1 detik masuk..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white outline-none"
            />
          </div>

          {/* URLs & Image previews */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Icon URL (Square 1:1) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.iconUrl}
                onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
                placeholder="/images/games/... atau https://..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white outline-none"
                required
              />
              {formData.iconUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={formData.iconUrl}
                    alt="Preview"
                    className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                  <span className="text-[11px] text-slate-400">Preview Icon</span>
                </div>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Banner URL (Landscape 16:9)</label>
              <input
                type="text"
                value={formData.bannerUrl}
                onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                placeholder="/images/games/... atau https://..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white outline-none"
              />
              {formData.bannerUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={formData.bannerUrl}
                    alt="Preview"
                    className="w-16 h-10 rounded-lg object-cover border border-slate-700"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                  <span className="text-[11px] text-slate-400">Preview Banner</span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Harga Mulai Dari (Rp)</label>
              <input
                type="number"
                value={formData.minPrice}
                onChange={(e) => setFormData({ ...formData, minPrice: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white outline-none"
                min={0}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Rating Game (0.0 - 5.0)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white outline-none"
              />
            </div>
          </div>

          {/* Server Settings */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Perlu Server / Zone ID?</span>
                <span className="text-[11px] text-slate-400">
                  Aktifkan jika game memerlukan Server ID / Zone ID (seperti MLBB, Genshin).
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.serverRequired}
                onChange={(e) => setFormData({ ...formData, serverRequired: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 text-blue-600 cursor-pointer"
              />
            </div>

            {formData.serverRequired && (
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Pilihan Server List (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={formData.serverList}
                  onChange={(e) => setFormData({ ...formData, serverList: e.target.value })}
                  placeholder="Asia, America, Europe, TW/HK/MO (kosongkan jika input Zone ID manual)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-white outline-none"
                />
              </div>
            )}
          </div>

          {/* Switches: isPopular & isActive */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-850">
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600"
              />
              <span className="font-semibold text-white">Tandai Populer</span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:bg-slate-850">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600"
              />
              <span className="font-semibold text-white">Status Aktif (Tampil)</span>
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
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Menyimpan...
                </span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEdit ? 'Simpan Perubahan' : 'Tambah Game'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
