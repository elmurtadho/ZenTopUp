'use client';

import React from 'react';
import Link from 'next/link';
import { Game } from '@/types';
import { Star, Flame, ChevronRight } from 'lucide-react';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  // Format price in IDR
  const formattedMinPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(game.minPrice);

  return (
    <Link
      href={`/game/${game.slug}`}
      className="group relative rounded-2xl bg-[#111827]/90 hover:bg-[#162032] border border-slate-800 hover:border-blue-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
    >
      {/* Popular tag badge */}
      {game.isPopular && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[11px] font-extrabold tracking-wide uppercase shadow-md">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>Populer</span>
        </div>
      )}

      {/* Image Thumbnail Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        <img
          src={game.bannerUrl || game.iconUrl}
          alt={game.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
        
        {/* Category Pill */}
        <div className="absolute bottom-2.5 right-3 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-[11px] font-medium text-cyan-300">
          {game.category}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs text-slate-400 font-medium truncate">
              {game.publisher}
            </span>
            {game.rating && (
              <div className="flex items-center gap-1 text-xs text-amber-400 shrink-0 font-semibold">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>{game.rating}</span>
              </div>
            )}
          </div>
          <h3 className="font-bold text-white text-base sm:text-lg group-hover:text-blue-400 transition-colors line-clamp-1">
            {game.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-1 mt-1">
            {game.tagline || 'Top up diamond & kredit resmi'}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
              Mulai dari
            </span>
            <span className="text-sm sm:text-base font-extrabold text-white">
              {formattedMinPrice}
            </span>
          </div>

          <div className="w-8 h-8 rounded-lg bg-blue-600/10 group-hover:bg-blue-600 text-blue-400 group-hover:text-white flex items-center justify-center transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
