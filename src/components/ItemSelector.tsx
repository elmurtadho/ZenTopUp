'use client';

import React, { useState } from 'react';
import { GameItem, UserRole } from '@/types';
import { Flame, Check, Sparkles, Crown, User, Tag } from 'lucide-react';

interface ItemSelectorProps {
  items: GameItem[];
  selectedItem: GameItem | null;
  onSelectItem: (item: GameItem) => void;
  userRole?: UserRole;
}

function getItemBadge(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('pass') || lower.includes('membership') || lower.includes('card') || lower.includes('welkin')) {
    return { label: 'Pass / Langganan', color: 'text-amber-400', icon: '🎫' };
  }
  if (lower.includes('diamond')) {
    return { label: 'Diamond Resmi', color: 'text-cyan-400', icon: '💎' };
  }
  if (lower.includes('uc')) {
    return { label: 'UC Resmi', color: 'text-yellow-400', icon: '🪙' };
  }
  if (lower.includes('vp')) {
    return { label: 'Valorant Points', color: 'text-rose-400', icon: '⚡' };
  }
  if (lower.includes('crystal')) {
    return { label: 'Genesis Crystal', color: 'text-indigo-300', icon: '✨' };
  }
  if (lower.includes('token')) {
    return { label: 'Token Resmi', color: 'text-amber-300', icon: '🪙' };
  }
  if (lower.includes('robux')) {
    return { label: 'Robux Resmi', color: 'text-emerald-400', icon: '💠' };
  }
  if (lower.includes('fc point') || lower.includes('silver')) {
    return { label: 'FC Points Resmi', color: 'text-green-400', icon: '⚽' };
  }
  return { label: 'Item Resmi', color: 'text-blue-400', icon: '💎' };
}

export function getItemPriceForRole(item: GameItem, role?: UserRole): number {
  if (role === 'reseller') {
    return item.resellerPrice || Math.round(item.price * 0.90);
  }
  if (role === 'member') {
    return item.memberPrice || Math.round(item.price * 0.96);
  }
  return item.price;
}

export default function ItemSelector({
  items,
  selectedItem,
  onSelectItem,
  userRole = 'guest',
}: ItemSelectorProps) {
  const [activeTab, setActiveTab] = useState<'semua' | 'populer' | 'pass'>('semua');

  const filteredItems = items.filter((item) => {
    if (activeTab === 'populer') return item.isPopular;
    if (activeTab === 'pass') {
      const lower = item.name.toLowerCase();
      return lower.includes('pass') || lower.includes('membership') || lower.includes('card') || lower.includes('welkin');
    }
    return true;
  });

  const hasPasses = items.some((i) => {
    const lower = i.name.toLowerCase();
    return lower.includes('pass') || lower.includes('membership') || lower.includes('card') || lower.includes('welkin');
  });

  return (
    <div className="space-y-4">
      {/* Sub-tabs if game has pass/membership */}
      {hasPasses && (
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('semua')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition cursor-pointer ${
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition cursor-pointer ${
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
        {filteredItems.map((item) => {
          const isSelected = selectedItem?.id === item.id;
          const badge = getItemBadge(item.name);

          const normalPrice = item.price;
          const effectivePrice = getItemPriceForRole(item, userRole);
          const memberP = getItemPriceForRole(item, 'member');
          const resellerP = getItemPriceForRole(item, 'reseller');

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectItem(item)}
              className={`relative p-3 sm:p-4 rounded-xl text-left transition-all duration-200 flex flex-col justify-between border group cursor-pointer ${
                isSelected
                  ? 'bg-blue-600/15 border-blue-500 ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Badges */}
              {userRole === 'reseller' ? (
                <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 text-[9px] font-black flex items-center gap-1 shadow">
                  <Crown className="w-2.5 h-2.5" /> VIP Reseller
                </span>
              ) : userRole === 'member' ? (
                <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[9px] font-black flex items-center gap-1 shadow">
                  <Tag className="w-2.5 h-2.5" /> Member Diskon
                </span>
              ) : item.isPopular ? (
                <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[9px] font-extrabold flex items-center gap-1 shadow-sm">
                  <Flame className="w-2.5 h-2.5 fill-current" /> Populer
                </span>
              ) : null}

              <div className="mb-2.5">
                <div className="flex items-center gap-1.5 text-xs mb-1.5">
                  <span className="text-xs leading-none">{badge.icon}</span>
                  <span className={`font-semibold transition ${badge.color}`}>
                    {badge.label}
                  </span>
                </div>
                <span className="font-bold text-xs sm:text-sm text-white block leading-snug">
                  {item.name}
                </span>

                {/* Strikethrough if discounted */}
                {effectivePrice < normalPrice && (
                  <span className="text-[10px] text-slate-500 line-through mt-0.5 block">
                    Rp {normalPrice.toLocaleString('id-ID')}
                  </span>
                )}

                {/* Teaser for Guest */}
                {userRole === 'guest' && (
                  <span className="text-[9px] text-cyan-400/90 block mt-0.5 font-mono">
                    Member: Rp {memberP.toLocaleString('id-ID')}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div>
                  <span
                    className={`text-xs sm:text-sm font-black ${
                      userRole === 'reseller'
                        ? 'text-amber-400'
                        : userRole === 'member'
                        ? 'text-cyan-400'
                        : 'text-white'
                    }`}
                  >
                    Rp {effectivePrice.toLocaleString('id-ID')}
                  </span>
                </div>

                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-500 group-hover:text-slate-300 transition shrink-0">
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
