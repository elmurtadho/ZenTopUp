'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Gamepad2,
  Gem,
  Tag,
  CreditCard,
  ShoppingBag,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  X,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-400',
    },
    {
      href: '/admin/games',
      label: 'Katalog Game',
      icon: Gamepad2,
      color: 'text-indigo-400',
    },
    {
      href: '/admin/items',
      label: 'Nominal & Item',
      icon: Gem,
      color: 'text-cyan-400',
    },
    {
      href: '/admin/promos',
      label: 'Promo & Kupon',
      icon: Tag,
      color: 'text-amber-400',
    },
    {
      href: '/admin/payments',
      label: 'Metode Bayar',
      icon: CreditCard,
      color: 'text-emerald-400',
    },
    {
      href: '/admin/orders',
      label: 'Pesanan & Transaksi',
      icon: ShoppingBag,
      color: 'text-rose-400',
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#080d19] border-r border-slate-800 text-slate-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            <Image
              src="/images/tokogem-logo.png"
              alt="TokoGem Logo"
              width={36}
              height={36}
              className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">
                Toko<span className="text-cyan-400">Gem</span>
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
                ADMIN
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block leading-tight">Content Management</span>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Menu Utama
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600/20 text-white border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : item.color}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
            </Link>
          );
        })}
      </div>

      {/* Footer Quick Link to Public Site */}
      <div className="p-4 border-t border-slate-800 bg-[#060a14]/60 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition group"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Lihat Website Toko</span>
          </div>
          <span className="text-[10px] text-slate-500">Live ↗</span>
        </Link>
        <div className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Database Cloud Aktif</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <div className="relative w-64 max-w-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
