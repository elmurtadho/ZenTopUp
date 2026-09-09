'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import Image from 'next/image';
import { Lock, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const auth = localStorage.getItem('tokogem_admin_session');
      if (auth === 'active') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);

    // Default PIN: tokogem2026 or admin123
    if (pinInput.trim() === 'tokogem2026' || pinInput.trim() === 'admin123') {
      try {
        localStorage.setItem('tokogem_admin_session', 'active');
      } catch {}
      setIsAuthenticated(true);
    } else {
      setPinError('PIN Administrator salah. Silakan periksa kembali.');
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('tokogem_admin_session');
    } catch {}
    setIsAuthenticated(false);
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated screen (PIN Gateway)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060a14] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0d1322] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <Image
              src="/images/tokogem-logo.png"
              alt="TokoGem"
              width={64}
              height={64}
              className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]"
            />
          </div>

          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              TokoGem Admin Panel
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
              Masuk Akses Administrator
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Masukkan PIN Admin untuk mengakses pengelolaan konten website.
            </p>
          </div>

          {pinError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {pinError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>PIN / Password Administrator</span>
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Masukkan PIN (default: tokogem2026)"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white font-mono text-sm outline-none"
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Buka Dashboard Admin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>PIN Default: <strong className="text-slate-300 font-mono">tokogem2026</strong></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="TokoGem Admin Central"
          subtitle="Pusat Manajemen Konten, Katalog & Pesanan"
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
