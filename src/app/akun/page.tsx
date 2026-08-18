'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Smartphone, 
  ShieldCheck, 
  Crown, 
  Zap, 
  Receipt, 
  Tag, 
  Coins, 
  Gamepad2, 
  Lock, 
  Edit3, 
  Save, 
  Check, 
  Plus, 
  ExternalLink,
  Settings,
  Clock,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilPenggunaPage() {
  const { user, login, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'profil' | 'game_id' | 'keamanan'>('profil');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Profile form state
  const [name, setName] = useState(user?.name || 'Reza Gamers ID');
  const [email, setEmail] = useState(user?.email || 'reza.gamers@example.com');
  const [phone, setPhone] = useState(user?.phone || '081234567890');
  const [isSaved, setIsSaved] = useState(false);

  // Linked game accounts
  const [gameAccounts, setGameAccounts] = useState([
    { id: '1', game: 'Mobile Legends', gameUserId: '128492019', server: '2648', isDefault: true },
    { id: '2', game: 'Valorant', gameUserId: 'ShadowBlade#IDN', server: '', isDefault: true },
    { id: '3', game: 'Genshin Impact', gameUserId: '812938475', server: 'Asia', isDefault: true },
  ]);

  // Security form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      name,
      email,
      phone,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      setPasswordSaved(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSaved(false), 2500);
    }
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* User Hero Banner */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160'}
                  alt={user?.name || 'Gamer'}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-blue-500/40 shadow-xl shadow-blue-500/10"
                />
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold shadow-md">
                  <Crown className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                    {user?.name || 'Reza Gamers ID'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold">
                    {user?.memberLevel || 'VIP Platinum'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-mono">
                  {user?.email} &bull; {user?.phone}
                </p>

                <div className="flex items-center gap-1 text-[11px] text-emerald-400 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Akun Terverifikasi Resmi</span>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/riwayat"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
              >
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Riwayat Pesanan</span>
              </Link>
              <Link
                href="/notifikasi/pengaturan"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
              >
                <Settings className="w-4 h-4 text-purple-400" />
                <span>Pengaturan</span>
              </Link>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/30 transition flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Receipt className="w-3.5 h-3.5 text-blue-400" />
                <span>Total Transaksi</span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-white">
                {user?.totalTransactions || 14} Pesanan
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>ZenPoints Reward</span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-amber-400">
                12.500 PTS
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Voucher Tersedia</span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-emerald-400">
                3 Kupon Aktif
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cashback Tier</span>
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-cyan-400">
                5% Setiap Top Up
              </span>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-800 pb-3">
          {[
            { id: 'profil', label: 'Informasi Profil' },
            { id: 'game_id', label: 'ID Game Tersimpan' },
            { id: 'keamanan', label: 'Keamanan Akun' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Profile Form */}
        {activeTab === 'profil' && (
          <div className="rounded-3xl bg-[#111827] border border-slate-800 p-6 sm:p-8 shadow-xl max-w-2xl">
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-blue-400" />
              <span>Edit Data Pribadi</span>
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white text-xs outline-none transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Alamat Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white text-xs outline-none transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Nomor WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white text-xs outline-none transition font-mono"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-2 cursor-pointer mt-2"
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Profil Berhasil Disimpan!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Saved Game IDs */}
        {activeTab === 'game_id' && (
          <div className="rounded-3xl bg-[#111827] border border-slate-800 p-6 sm:p-8 shadow-xl max-w-2xl space-y-5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-blue-400" />
                <span>Akun Game Tersimpan</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Data ID game yang tersimpan akan otomatis terisi saat kamu checkout top up.
              </p>
            </div>

            <div className="space-y-3">
              {gameAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">{acc.game}</span>
                    <span className="text-xs text-slate-300 font-mono">
                      ID: {acc.gameUserId} {acc.server && `(${acc.server})`}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Otomatis Terisi
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => alert('Fitur tambah akun game kustom aktif di form top up game!')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah ID Game Baru</span>
            </button>
          </div>
        )}

        {/* Tab 3: Security */}
        {activeTab === 'keamanan' && (
          <div className="rounded-3xl bg-[#111827] border border-slate-800 p-6 sm:p-8 shadow-xl max-w-2xl space-y-5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>Ubah Kata Sandi</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Pastikan menggunakan kombinasi kata sandi yang kuat untuk melindungi akun kamu.
              </p>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Masukkan kata sandi lama"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white text-xs outline-none transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white text-xs outline-none transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Konfirmasi Kata Sandi Baru</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang kata sandi baru"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white text-xs outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-2 cursor-pointer mt-2"
              >
                {passwordSaved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Kata Sandi Berhasil Diubah!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Perbarui Kata Sandi</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl text-center animate-in zoom-in-95 duration-150">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
                <LogOut className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Keluar dari Akun?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Kamu harus masuk kembali untuk melihat riwayat pesanan dan diskon khusus member.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowLogoutModal(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition cursor-pointer shadow-lg shadow-red-600/30"
                >
                  Ya, Keluar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
