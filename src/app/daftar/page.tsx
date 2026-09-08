'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
  User, 
  Mail, 
  Smartphone, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DaftarPage() {
  const router = useRouter();
  const { login } = useAuth();

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

    // Validation
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

    // Simulate registration
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      login({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        memberLevel: 'Bronze',
        totalTransactions: 0,
      });

      setTimeout(() => {
        router.push('/');
      }, 1500);
    }, 1200);
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
              Daftar Akun TokoGem
            </h1>
            <p className="text-xs text-slate-400">
              Buat akun gratis untuk riwayat transaksi lengkap dan promo eksklusif
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
              <h3 className="text-base font-bold text-white">Pendaftaran Berhasil!</h3>
              <p className="text-xs text-slate-300">
                Selamat bergabung di TokoGem! Mengalihkan ke beranda...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Nama Lengkap</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Contoh: Reza Gamers"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white text-xs outline-none transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Alamat Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="nama@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white text-xs outline-none transition"
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Nomor WhatsApp</label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="081234567890"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white text-xs outline-none transition font-mono"
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimal 6 karakter"
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

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Ulangi Kata Sandi</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Ketik ulang kata sandi"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white text-xs outline-none transition"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2.5 pt-1 text-[11px] text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-0 mt-0.5"
                />
                <span>
                  Saya menyetujui{' '}
                  <Link href="/promo/syarat-ketentuan" className="text-blue-400 hover:underline">
                    Syarat &amp; Ketentuan
                  </Link>{' '}
                  serta Kebijakan Privasi TokoGem.
                </span>
              </label>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-60 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Mendaftarkan Akun...</span>
                ) : (
                  <>
                    <span>Daftar Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}

          {/* Login Link */}
          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            <span>Sudah memiliki akun? </span>
            <Link href="/masuk" className="text-blue-400 hover:text-blue-300 font-bold">
              Masuk di sini
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Data pengguna dienkripsi dengan standar keamanan tinggi</span>
          </div>

        </div>

      </div>
    </div>
  );
}
