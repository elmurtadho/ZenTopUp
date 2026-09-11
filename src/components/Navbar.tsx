'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Zap, 
  Search, 
  Tag, 
  Clock, 
  ShieldCheck, 
  Menu, 
  X, 
  User, 
  Gamepad2,
  LogOut,
  Settings,
  Receipt,
  Sparkles,
  ChevronDown,
  Flame
} from 'lucide-react';
import SearchModal from './SearchModal';
import NotificationBell from './NotificationBell';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    {
      href: '/',
      label: 'Katalog Game',
      icon: Gamepad2,
      iconColor: 'text-blue-400',
    },
    {
      href: '/promo',
      label: 'Promo Kilat',
      icon: Flame,
      iconColor: 'text-amber-400',
      badge: 'HOT',
    },
    {
      href: '/riwayat',
      label: 'Lacak Pesanan',
      icon: Clock,
      iconColor: 'text-cyan-400',
    },
    {
      href: '/metode-pembayaran',
      label: 'Cara Bayar',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
    },
  ];

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0b0f19]/85 border-b border-slate-800/80 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main single-line container */}
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* 1. Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/images/tokogem-logo.png"
                  alt="TokoGem Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(34,211,238,0.35)] group-hover:drop-shadow-[0_0_14px_rgba(34,211,238,0.6)] transition-all duration-200"
                  priority
                />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Toko<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">Gem</span>
                </span>
                <span className="hidden xl:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-500/10 text-cyan-400 border border-blue-500/20">
                  Resmi 24 Jam
                </span>
              </div>
            </Link>

            {/* 2. Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 uppercase tracking-tight shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* 3. Action Group (Search, Notifications, Profile/Login) */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              
              {/* Quick Search Spotlight Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/60 hover:border-slate-500 text-slate-400 hover:text-white text-xs transition cursor-pointer group shadow-sm"
                title="Cari game (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <span className="hidden md:inline">Cari game...</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-400">
                  Ctrl K
                </kbd>
              </button>

              {/* Mobile search icon button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="sm:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
                aria-label="Cari Game"
              >
                <Search className="w-5 h-5 text-blue-400" />
              </button>

              {/* Notifications */}
              <NotificationBell />

              {/* Saldo Pill if logged in */}
              {user && (
                <Link
                  href="/akun"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition shadow-sm"
                  title="Saldo Dompet TokoGem - Klik untuk isi saldo"
                >
                  <span className="text-xs">💰</span>
                  <span>Rp {user.balance.toLocaleString('id-ID')}</span>
                </Link>
              )}

              {/* User Profile Dropdown or Login */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 sm:pr-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
                      alt={user.name}
                      className="w-7 h-7 rounded-lg object-cover border border-slate-700"
                    />
                    <div className="hidden md:block text-left leading-tight">
                      <span className="text-xs font-bold text-white block truncate max-w-[90px]">
                        {user.name.split(' ')[0]}
                      </span>
                      <span className={`text-[9px] font-bold block uppercase tracking-wider ${
                        user.role === 'reseller' ? 'text-amber-400' : 'text-cyan-400'
                      }`}>
                        {user.role === 'reseller' ? 'VIP Reseller' : 'Member'}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2.5 border-b border-slate-800 mb-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white block truncate">{user.name}</span>
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                            user.role === 'reseller' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                          }`}>
                            {user.role === 'reseller' ? 'VIP' : 'MEMBER'}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block truncate">{user.email}</span>
                        <div className="pt-1.5 flex items-center justify-between text-xs">
                          <span className="text-slate-400 text-[11px]">Saldo Dompet:</span>
                          <span className="font-bold text-emerald-400">Rp {user.balance.toLocaleString('id-ID')}</span>
                        </div>
                      </div>

                      <Link
                        href="/akun"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
                      >
                        <User className="w-4 h-4 text-blue-400" />
                        <span>Profil &amp; Dompet Saldo</span>
                      </Link>

                      <Link
                        href="/riwayat"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
                      >
                        <Receipt className="w-4 h-4 text-cyan-400" />
                        <span>Riwayat Pesanan</span>
                      </Link>

                      <Link
                        href="/notifikasi/pengaturan"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
                      >
                        <Settings className="w-4 h-4 text-purple-400" />
                        <span>Pengaturan Akun</span>
                      </Link>

                      <div className="pt-1 mt-1 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Keluar ke Mode Guest</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/masuk"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-md shadow-blue-600/20 hover:shadow-blue-500/40 transition flex items-center gap-1.5 whitespace-nowrap"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </Link>
              )}

              {/* Mobile Hamburger Toggle Button */}
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-800/90 bg-[#0d1322]/95 backdrop-blur-xl px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${item.iconColor}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 uppercase tracking-tight">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-800">
              {user ? (
                <div className="space-y-1.5">
                  <div className="px-3.5 py-2 bg-slate-900/90 rounded-xl flex items-center gap-3 border border-slate-800">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
                      alt={user.name}
                      className="w-9 h-9 rounded-lg object-cover"
                    />
                    <div className="leading-tight">
                      <span className="text-sm font-bold text-white block">{user.name}</span>
                      <span className="text-xs text-amber-400 font-semibold">{user.memberLevel}</span>
                    </div>
                  </div>
                  <Link
                    href="/akun"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    <User className="w-4 h-4 text-blue-400" />
                    <span>Profil Saya</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar Akun</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/masuk"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-md transition"
                >
                  <User className="w-4 h-4" />
                  <span>Masuk Akun</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Spotlight Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
