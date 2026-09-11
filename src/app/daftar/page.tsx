'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Zap, 
  User, 
  Mail, 
  Smartphone, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Crown,
  Sparkles,
  Check,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function DaftarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const { login } = useAuth();

  const [role, setRole] = useState<'member' | 'reseller'>('member');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Nama lengkap wajib diisi');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Alamat email tidak valid');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 9) {
      setError('Nomor WhatsApp tidak valid');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Kata sandi minimal 6 karakter');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok');
      return;
    }
    if (!formData.agreeTerms) {
      setError('Kamu harus menyetujui Syarat & Ketentuan Layanan');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      login({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role,
        memberLevel: role === 'reseller' ? 'VIP Platinum' : 'Gold',
        balance: role === 'reseller' ? 250000 : 50000,
        gemPoints: role === 'reseller' ? 1000 : 300,
      });

      setTimeout(() => {
        router.push(redirectUrl);
      }, 1200);
    }, 900);
  };

  return (
    <div className="py-8 sm:py-14">
      <div className="max-w-lg mx-auto px-4 sm:px-6 space-y-5">
        <div className="rounded-3xl bg-[#0f172a] border border-slate-800 p-6 sm:p-9 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Daftar Akun TokoGem
            </h1>
            <p className="text-xs text-slate-400">
              Bergabung sekarang untuk mendapatkan harga murah &amp; sistem saldo digital
            </p>
          </div>

          {/* Account Type Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Pilih Tipe Akun:</label>
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setRole('member')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  role === 'member'
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </span>
                  {role === 'member' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Akun Member</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Diskon member + saldo dompet digital</p>
                </div>
              </div>

              <div
                onClick={() => setRole('reseller')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                  role === 'reseller'
                    ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Crown className="w-4 h-4" />
                  </span>
                  {role === 'reseller' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-300">Mitra Reseller</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Harga grosir termurah untuk jualan lagi</p>
                </div>
              </div>
            </div>
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
              <h3 className="text-base font-bold text-white">Pendaftaran Berhasil!</h3>
              <p className="text-xs text-slate-300">
                Selamat! Akun {role === 'reseller' ? 'Mitra Reseller' : 'Member'} TokoGem kamu siap digunakan.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nama lengkap kamu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Alamat Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nomor WhatsApp Aktif</label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="081234567890"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Kata Sandi</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 6 karakter"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white outline-none transition"
                      required
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

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Ulangi Kata Sandi</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Konfirmasi sandi"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white outline-none transition"
                      required
                    />
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 text-slate-400 text-[11px] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-blue-500 focus:ring-0 cursor-pointer"
                />
                <span>Saya menyetujui Syarat &amp; Ketentuan serta Kebijakan Privasi TokoGem</span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Mendaftarkan Akun...
                  </span>
                ) : (
                  <>
                    <span>Daftar sebagai {role === 'reseller' ? 'Mitra Reseller' : 'Member'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Sudah punya akun?{' '}
              <Link
                href={`/masuk${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
                className="text-cyan-400 font-bold hover:underline"
              >
                Masuk di Sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DaftarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DaftarForm />
    </Suspense>
  );
}
