'use client';

import React, { useState, useMemo } from 'react';
import { Game } from '@/types';
import { CATEGORIES } from '@/data/mockGames';
import GameCard from './GameCard';
import { Search, SlidersHorizontal, Gamepad2, X } from 'lucide-react';

interface GameCatalogProps {
  games: Game[];
}

export default function GameCatalog({ games }: GameCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-asc' | 'name-asc'>('popular');

  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        // Category filter
        if (selectedCategory === 'Populer') {
          if (!game.isPopular) return false;
        } else if (selectedCategory !== 'Semua') {
          if (game.category !== selectedCategory) return false;
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = game.name.toLowerCase().includes(q);
          const matchPublisher = game.publisher.toLowerCase().includes(q);
          const matchCategory = game.category.toLowerCase().includes(q);
          if (!matchName && !matchPublisher && !matchCategory) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        }
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === 'price-asc') {
          return a.minPrice - b.minPrice;
        }
        if (sortBy === 'name-asc') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [games, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="katalog" className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <Gamepad2 className="w-4 h-4" />
              <span>Katalog Game Lengkap</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pilih Game Favorit Kamu
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Top up diamond, credits, voucher, pass game termurah & tercepat.
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari game (ML, FF, Valo...)"
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white placeholder-slate-500 outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-300 focus:border-blue-500 outline-none cursor-pointer appearance-none pr-8"
              >
                <option value="popular">Urutkan: Terpopuler</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="price-asc">Harga Termurah</option>
                <option value="name-asc">Nama A-Z</option>
              </select>
              <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-800/80 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
          <span>
            Menampilkan <strong className="text-white">{filteredGames.length}</strong> game
            {selectedCategory !== 'Semua' && ` dalam kategori "${selectedCategory}"`}
            {searchQuery && ` untuk "${searchQuery}"`}
          </span>
        </div>

        {/* Game Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 text-center rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Game Tidak Ditemukan</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              Tidak ada game yang sesuai dengan pencarian atau filter yang kamu pilih. Coba gunakan kata kunci lain.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Semua');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition shadow-lg shadow-blue-600/20"
            >
              Reset Semua Filter
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
