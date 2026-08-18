'use client';

import React, { useState } from 'react';
import { GameItem } from '@/types';
import { Flame, Check, Sparkles, Gem } from 'lucide-react';

interface ItemSelectorProps {
  items: GameItem[];
  selectedItem: GameItem | null;
  onSelectItem: (item: GameItem) => void;
}

export default function ItemSelector({
  items,
  selectedItem,
  onSelectItem,
}: ItemSelectorProps) {
  const [activeTab, setActiveTab] = useState<'semua' | 'populer' | 'pass'>('semua');

  const filteredItems = items.filter((item) => {
    if (activeTab === 'populer') return item.isPopular;
    if (activeTab === 'pass') return item.name.toLowerCase().includes('pass') || item.name.toLowerCase().includes('membership');
    return true;
  });

  const hasPasses = items.some(
    (i) => i.name.toLowerCase().includes('pass') || i.name.toLowerCase().includes('membership')
  );

  return (
    <div className="space-y-4">
      {/* Sub-tabs if game has pass/membership */}
      {hasPasses && (
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('semua')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'semua'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Semua Nominal ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('populer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              activeTab === 'populer'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-400" />
            Paling Laris
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pass')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              activeTab === 'pass'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Pass &amp; Membership
          </button>
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        {filteredItems.map((item) => {
          const isSelected = selectedItem?.id === item.id;
          const discountPercent =
            item.originalPrice && item.originalPrice > item.price
              ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
              : null;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectItem(item)}
              className={`relative p-4 rounded-xl text-left transition-all duration-200 flex flex-col justify-between border group cursor-pointer ${
                isSelected
                  ? 'bg-blue-600/15 border-blue-500 ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Badge */}
              {item.isPopular && (
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                  <Flame className="w-3 h-3 fill-current" /> Populer
                </span>
              )}

              {discountPercent && !item.isPopular && (
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-extrabold shadow-sm">
                  Hemat {discountPercent}%
                </span>
              )}

              <div className="mb-3">
                <div className="flex items-center gap-1.5 text-blue-400 text-xs mb-1">
                  <Gem className="w-3.5 h-3.5" />
                  <span className="font-semibold text-slate-300 group-hover:text-white transition">
                    Item Resmi
                  </span>
                </div>
                <span className="font-bold text-sm text-white block leading-snug">
                  {item.name}
                </span>
                {item.originalPrice && (
                  <span className="text-[11px] text-slate-500 line-through mt-0.5 block">
                    Rp {item.originalPrice.toLocaleString('id-ID')}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-sm font-extrabold text-cyan-400">
                  Rp {item.price.toLocaleString('id-ID')}
                </span>
                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <Check className="w-3 h-3" />
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500 group-hover:text-slate-300 transition">
                    Pilih
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
