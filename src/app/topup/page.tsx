'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_GAMES } from '@/data/mockGames';
import { Gamepad2, Search, Zap, Flame, Sparkles, ChevronRight, ShieldCheck, Tag } from 'lucide-react';
import GameCard from '@/components/GameCard';

export default function TopUpPortalPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const filteredGames = MOCK_GAMES.filter((g) => {
    if (selectedCategory !== 'Semua' && g.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        g.name.toLowerCase().includes(q) ||
        g.publisher.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Up Portal Header */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-900/40 via-slate-900 to-cyan-900/40 border border-slate-800 p-8 sm:p-12 mb-10 text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Pusat Layanan Top Up Game Resmi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Pilih Game &amp; Top Up Detik Ini Juga
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Dapatkan harga termurah, diskon harian, dan bonus item eksklusif. Transaksi diproses 100% otomatis 24 jam non-stop.
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ketik nama game favoritmu (misal: MLBB, Valorant, Free Fire)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none shadow-xl"
            />
          </div>
        </div>

        {/* Quick Popular Game Badges */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Game Terlaris Hari Ini</span>
            </h2>
            <Link href="/" className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1">
              Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {MOCK_GAMES.filter((g) => g.isPopular).slice(0, 4).map((game) => (
              <Link
                key={game.id}
                href={`/game/${game.slug}`}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/50 transition group"
              >
                <img
                  src={game.iconUrl || game.bannerUrl}
                  alt={game.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0 group-hover:scale-105 transition"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition truncate">
                    {game.name}
                  </h3>
                  <span className="text-[11px] text-cyan-400 font-medium">
                    Mulai Rp {game.minPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Top Up Catalog */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-blue-400" />
              <span>Semua Game Top Up</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
