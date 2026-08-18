'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
  ChevronDown
} from 'lucide-react';
import SearchModal from './SearchModal';
import NotificationBell from './NotificationBell';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0b0f19]/90 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                  Zen<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">TopUp</span>
                </span>
                <span className="text-[10px] text-slate-400 tracking-wider font-medium uppercase">
                  Fast &amp; Official Gaming TopUp
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <Link 
                href="/" 
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-white hover:bg-slate-800/80 transition-colors flex items-center gap-2"
              >
                <Gamepad2 className="w-4 h-4 text-blue-400" />
                <span>Jelajah Game</span>
              </Link>
              <Link 
                href="/promo" 
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-2"
              >
                <Tag className="w-4 h-4 text-emerald-400" />
                <span>Promo Diskon</span>
              </Link>
              <Link 
                href="/riwayat" 
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Riwayat Transaksi</span>
              </Link>
              <Link 
                href="/metode-pembayaran" 
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Metode Bayar</span>
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600 flex items-center gap-3 text-xs transition group cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300" />
                <span>Cari game apa saja...</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-400">
                  Ctrl K
                </kbd>
              </button>

              <NotificationBell />

              {/* User Account Menu or Login Button */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition cursor-pointer"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
                      alt={user.name}
                      className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                    />
                    <div className="text-left">
                      <span className="text-xs font-bold text-white block leading-tight truncate max-w-[100px]">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-amber-400 font-semibold block">
                        {user.memberLevel || 'Member'}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2.5 border-b border-slate-800 mb-1">
                        <span className="text-xs font-bold text-white block">{user.name}</span>
                        <span className="text-[11px] text-slate-400 block truncate">{user.email}</span>
                      </div>

                      <Link
                        href="/akun"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
                      >
                        <User className="w-4 h-4 text-blue-400" />
                        <span>Profil &amp; Akun Saya</span>
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
                        <span>Pengaturan Notifikasi</span>
                      </Link>

                      <div className="pt-1 mt-1 border-t border-slate-800">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Keluar Akun</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/masuk"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition border border-slate-700/60 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Masuk</span>
                </Link>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
                aria-label="Cari Game"
              >
                <Search className="w-5 h-5 text-blue-400" />
              </button>
              <NotificationBell />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-800 bg-[#0d1322] px-4 pt-3 pb-5 space-y-2">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsSearchOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 text-left"
            >
              <Search className="w-5 h-5 text-blue-400" />
              <span>Cari Game</span>
            </button>
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-white hover:bg-slate-800"
            >
              <Gamepad2 className="w-5 h-5 text-blue-400" />
              <span>Jelajah Game</span>
            </Link>
            <Link
              href="/promo"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <Tag className="w-5 h-5 text-emerald-400" />
              <span>Promo Diskon</span>
            </Link>
            <Link
              href="/riwayat"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <Clock className="w-5 h-5 text-cyan-400" />
              <span>Riwayat Transaksi</span>
            </Link>
            <Link
              href="/metode-pembayaran"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>Metode Pembayaran</span>
            </Link>

            <div className="pt-3 border-t border-slate-800">
              {user ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 bg-slate-900 rounded-xl flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <span className="text-sm font-bold text-white block">{user.name}</span>
                      <span className="text-xs text-amber-400">{user.memberLevel}</span>
                    </div>
                  </div>
                  <Link
                    href="/akun"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800"
                  >
                    <User className="w-5 h-5 text-blue-400" />
                    <span>Profil Saya</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Keluar Akun</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/masuk"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md"
                >
                  <User className="w-4 h-4" />
                  <span>Masuk / Daftar Akun</span>
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
