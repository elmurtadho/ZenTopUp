'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Flame, ArrowRight, Gamepad2, Sparkles } from 'lucide-react';
import { MOCK_GAMES } from '@/data/mockGames';
import { Game } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent can toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? MOCK_GAMES.filter((g) => {
        const q = query.toLowerCase();
        return (
          g.name.toLowerCase().includes(q) ||
          g.publisher.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.slug.toLowerCase().includes(q)
        );
      })
    : MOCK_GAMES.filter((g) => g.isPopular);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-sm transition-opacity">
      <div 
        className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-[#131d35]">
          <Search className="w-5 h-5 text-blue-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari game (contoh: Mobile Legends, Valorant, Free Fire)..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded bg-slate-800 text-[11px] font-mono text-slate-400 hover:text-white border border-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Quick popular chips */}
        <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Cepat:
          </span>
          {['Mobile Legends', 'Free Fire', 'Valorant', 'PUBG', 'Genshin'].map((name) => (
            <button
              key={name}
              onClick={() => setQuery(name)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600/30 hover:text-blue-300 text-slate-300 text-xs transition whitespace-nowrap"
            >
              {name}
            </button>
          ))}
        </div>

        {/* Search Results list */}
        <div className="max-h-[60vh] overflow-y-auto p-2 sm:p-3 space-y-1.5">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {query.trim() ? `Hasil Pencarian (${results.length})` : 'Game Populer Rekomendasi'}
          </div>

          {results.length > 0 ? (
            results.map((game) => (
              <Link
                key={game.id}
                href={`/game/${game.slug}`}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/90 border border-transparent hover:border-slate-700/80 transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={game.iconUrl || game.bannerUrl}
                    alt={game.name}
                    className="w-11 h-11 rounded-xl object-cover bg-slate-800 shrink-0 border border-slate-700"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors truncate">
                        {game.name}
                      </h4>
                      {game.isPopular && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5 fill-amber-400" />
                          Populer
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {game.publisher} &bull; <span className="text-cyan-400">{game.category}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-slate-500 uppercase block">Mulai</span>
                    <span className="text-xs font-bold text-slate-200">
                      Rp {game.minPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 group-hover:bg-blue-600 text-blue-400 group-hover:text-white flex items-center justify-center transition">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400">
              <Gamepad2 className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="font-semibold text-white text-sm">Tidak ada game ditemukan</p>
              <p className="text-xs text-slate-500 mt-1">
                Coba gunakan kata kunci game lain seperti &ldquo;MLBB&rdquo;, &ldquo;FF&rdquo;, atau &ldquo;Valorant&rdquo;.
              </p>
            </div>
          )}
        </div>

        {/* Footer tip */}
        <div className="px-4 py-2 bg-[#090d16] border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Gunakan panah untuk navigasi &amp; Enter untuk memilih</span>
          <span>TokoGem Search</span>
        </div>
      </div>
    </div>
  );
}
