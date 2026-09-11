'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Zap, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Crown,
  Wallet,
  Users,
  Check
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function MasukForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const { login, setGuestMode } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'member' | 'reseller'>('member');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError('Email atau Nomor WhatsApp wajib diisi');
      return;
    }
    if (!password || password.length < 4) {
      setError('Kata sandi minimal 4 karakter');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      login({
        name: identifier.includes('@') ? identifier.split('@')[0] : 'Reza Gamers ID',
        email: identifier.includes('@') ? identifier : 'user@example.com',
        phone: !identifier.includes('@') ? identifier : '081234567890',
        role: selectedRole,
        memberLevel: selectedRole === 'reseller' ? 'VIP Platinum' : 'Gold',
        balance: selectedRole === 'reseller' ? 350000 : 75000,
      });

      setTimeout(() => {
        router.push(redirectUrl);
      }, 1000);
    }, 800);
  };

  const handleQuickLogin = (role: 'member' | 'reseller') => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (role === 'reseller') {
        login({
          name: 'Mitra Agen TopUp (Reseller VIP)',
          email: 'reseller.vip@tokogem.com',
          phone: '088899990000',
          role: 'reseller',
          memberLevel: 'VIP Platinum',
          balance: 350000,
          gemPoints: 1250,
        });
      } else {
        login({
          name: 'Reza Gamers ID',
          email: 'reza.gamers@example.com',
          phone: '081234567890',
          role: 'member',
          memberLevel: 'Gold',
          balance: 75000,
          gemPoints: 420,
        });
      }

      setTimeout(() => {
        router.push(redirectUrl);
      }, 900);
    }, 600);
  };

  const handleContinueAsGuest = () => {
    setGuestMode();
    router.push(redirectUrl);
  };

  return (
    <div className="py-8 sm:py-14">
      <div className="max-w-lg mx-auto px-4 sm:px-6 space-y-5">
        {/* Card */}
        <div className="rounded-3xl bg-[#0f172a] border border-slate-800 p-6 sm:p-9 shadow-2xl space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Masuk ke TokoGem
            </h1>
            <p className="text-xs text-slate-400">
              Pilih tipe akun untuk menikmati harga spesial &amp; sistem saldo digital
            </p>
          </div>

          {/* Role Choice Selector */}
          <div className="grid grid-cols-2 gap-2.5 p-1.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setSelectedRole('member')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                selectedRole === 'member'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Akun Member</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('reseller')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                selectedRole === 'reseller'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>Mitra Reseller</span>
            </button>
          </div>

          {/* Benefits Box per Selected Role */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-[11px]">
            {selectedRole === 'reseller' ? (
              <>
                <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
                  <span className="flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" />
                    Keuntungan Akun Reseller:
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                    Grosir Termurah
                  </span>
                </div>
                <div className="text-slate-300 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Harga grosir termurah (diskon s/d 12% untuk dijual kembali)</span>
                </div>
                <div className="text-slate-300 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Sistem Saldo Reseller: Bayar 1-klik tanpa biaya admin</span>
                </div>
                <div className="text-slate-300 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Badge VIP Reseller &amp; prioritas antrian server 1 detik</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between text-cyan-400 font-bold mb-1">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Keuntungan Akun Member:
                  </span>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                    Diskon Langsung
                  </span>
                </div>
                <div className="text-slate-300 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Harga khusus member lebih murah dari harga Guest</span>
                </div>
                <div className="text-slate-300 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Sistem Saldo TokoGem: Bayar instan 0 biaya admin</span>
                </div>
                <div className="text-slate-300 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Dapatkan GemPoints reward setiap kali top up</span>
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Login Berhasil!</h3>
              <p className="text-xs text-slate-300">
                Selamat datang kembali di TokoGem. Mengalihkan ke tujuan...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email atau No. WhatsApp</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setError(null);
                    }}
                    placeholder="nama@email.com / 0812..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white text-xs outline-none transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Kata Sandi</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white text-xs outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Memverifikasi Akun...
                  </span>
                ) : (
                  <>
                    <span>Masuk sebagai {selectedRole === 'reseller' ? 'VIP Reseller' : 'Member'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Demo Login Switcher */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
            <p className="text-[11px] text-center text-slate-400">
              Ingin langsung mencoba fitur saldo &amp; harga role?
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('member')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-cyan-400">Member Demo</span>
                  <span className="text-[10px] text-emerald-400 font-bold">Rp 75.000</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Saldo aktif + harga member</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('reseller')}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" /> Reseller VIP
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold">Rp 350.000</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Harga grosir termurah</p>
              </button>
            </div>
          </div>

          {/* Continue as Guest Button */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span>Lanjutkan sebagai Guest (Tanpa Akun)</span>
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Belum punya akun?{' '}
              <Link
                href={`/daftar${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
                className="text-cyan-400 font-bold hover:underline"
              >
                Daftar Member / Reseller
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MasukPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <MasukForm />
    </Suspense>
  );
}
