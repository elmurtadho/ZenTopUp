'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function MasukPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
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
      setError('Kata sandi wajib diisi');
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
        memberLevel: 'VIP Platinum',
      });

      setTimeout(() => {
        router.push('/');
      }, 1200);
    }, 1000);
  };

  const handleDemoLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      login({
        name: 'Reza Gamers ID',
        email: 'reza.gamers@example.com',
        phone: '081234567890',
        memberLevel: 'VIP Platinum',
        totalTransactions: 14,
      });

      setTimeout(() => {
        router.push('/');
      }, 1000);
    }, 800);
  };

  return (
    <div className="py-10 sm:py-16">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        
        {/* Card */}
        <div className="rounded-3xl bg-[#111827] border border-slate-800 p-8 sm:p-10 shadow-2xl space-y-6">
          
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              Masuk ke TokoGem
            </h1>
            <p className="text-xs text-slate-400">
              Akses riwayat transaksi instan dan voucher diskon khusus member
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-400 animate-in fade-in duration-200">
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
                Selamat datang kembali di TokoGem. Mengalihkan...
              </p>
            </div>
          ) : (
            <>
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
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-300">Kata Sandi</label>
                    <button
                      type="button"
                      onClick={() => alert('Fitur reset password melalui WhatsApp/Email segera tersedia.')}
                      className="text-[11px] text-blue-400 hover:text-blue-300 transition"
                    >
                      Lupa sandi?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      placeholder="Masukkan kata sandi"
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white text-xs outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <label className="flex items-center gap-2 pt-1 text-xs text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span>Ingat sesi saya di perangkat ini</span>
                </label>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-60 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Memverifikasi...</span>
                  ) : (
                    <>
                      <span>Masuk ke Akun</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>

              {/* Quick Demo Login Option */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-400 hover:text-cyan-300 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>1-Klik Masuk sebagai Demo Member (VIP)</span>
                </button>
              </div>
            </>
          )}

          {/* Register Link */}
          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Belum punya akun? </span>
            <Link href="/daftar" className="text-blue-400 hover:text-blue-300 font-bold">
              Daftar sekarang gratis
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Login terlindungi dengan enkripsi SSL 256-bit</span>
          </div>

        </div>

      </div>
    </div>
  );
}
