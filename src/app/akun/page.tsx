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
  LogOut,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  CheckCircle2,
  X,
  CreditCard,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilPenggunaPage() {
  const { 
    user, 
    login, 
    logout, 
    isGuest, 
    isMember, 
    isReseller, 
    walletTransactions, 
    depositBalance, 
    upgradeToReseller,
    switchRole 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'dompet' | 'profil' | 'game_id' | 'keamanan'>('dompet');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Deposit modal state
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(50000);
  const [customAmount, setCustomAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('QRIS Instant (Semua E-Wallet & Bank)');
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositSuccess, setDepositSuccess] = useState(false);

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

  const PRESET_AMOUNTS = [25000, 50000, 100000, 200000, 500000, 1000000];

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

  const handleProcessDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? Number(customAmount) : depositAmount;
    if (!finalAmount || finalAmount < 10000) {
      return;
    }

    setIsDepositing(true);
    setTimeout(async () => {
      await depositBalance(finalAmount, depositMethod);
      setIsDepositing(false);
      setDepositSuccess(true);
      setTimeout(() => {
        setDepositSuccess(false);
        setShowDepositModal(false);
        setCustomAmount('');
      }, 1500);
    }, 800);
  };

  if (!user) {
    return (
      <div className="py-16 text-center max-w-md mx-auto px-4 space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-white">Kamu Sedang Dalam Mode Guest</h2>
        <p className="text-xs text-slate-400">
          Masuk ke akun TokoGem kamu untuk melihat saldo, riwayat transaksi, dan menikmati diskon member/reseller.
        </p>
        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            href="/masuk"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-blue-500/20"
          >
            Masuk ke Akun
          </Link>
          <button
            onClick={() => switchRole('member')}
            className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800"
          >
            Aktifkan Akun Demo Member
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Hero Banner */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160'}
                  alt={user.name}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-blue-500/40 shadow-xl shadow-blue-500/10"
                />
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold shadow-md">
                  {isReseller ? <Crown className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    {user.name}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    isReseller
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-md'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 shadow-md'
                  }`}>
                    {isReseller ? '👑 MITRA VIP RESELLER' : '👤 MEMBER RESMI'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 font-mono">
                  {user.email} &bull; {user.phone}
                </p>

                <div className="flex items-center gap-2 text-[11px] pt-1">
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> Akun Terverifikasi
                  </span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-slate-400">Level: {user.memberLevel || 'Gold'}</span>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {isMember && (
                <button
                  onClick={upgradeToReseller}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade ke Reseller (+Rp 100rb)</span>
                </button>
              )}
              <Link
                href="/riwayat"
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
              >
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Riwayat Pesanan</span>
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

          {/* Quick Demo Switcher Widget for Tester */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 text-[11px]">
              Ganti peran akun untuk mencoba tier harga:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => switchRole('member')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  isMember ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Member (Diskon)
              </button>
              <button
                onClick={() => switchRole('reseller')}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  isReseller ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                VIP Reseller (Grosir)
              </button>
              <button
                onClick={() => switchRole('guest')}
                className="px-3 py-1 rounded-lg text-[11px] font-bold bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                Mode Guest (Tamu)
              </button>
            </div>
          </div>
        </div>

        {/* WALLET SALDO HIGHLIGHT CARD */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0f172a] to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>Saldo Dompet TokoGem</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Rp {user.balance.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Aktif &amp; Siap Pakai
                </span>
              </div>
              <p className="text-xs text-slate-400 pt-1">
                Gunakan saldo untuk top up game instan 1 detik dengan <strong className="text-emerald-400">Rp 0 Biaya Admin</strong>.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDepositModal(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Top Up / Isi Saldo</span>
              </button>
            </div>
          </div>

          {/* Quick Wallet Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-800/80 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 text-[11px] block">GemPoints Reward</span>
              <span className="text-base font-extrabold text-amber-400 mt-1 block">
                {user.gemPoints.toLocaleString('id-ID')} PTS
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Tier Diskon</span>
              <span className="text-base font-extrabold text-cyan-400 mt-1 block">
                {isReseller ? 'Grosir s/d 12%' : 'Member 4%'}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Biaya Admin Saldo</span>
              <span className="text-base font-extrabold text-emerald-400 mt-1 block">
                Rp 0 (Gratis)
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Total Transaksi</span>
              <span className="text-base font-extrabold text-white mt-1 block">
                {user.totalTransactions} Pesanan
              </span>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'dompet', label: 'Riwayat Mutasi Saldo' },
            { id: 'profil', label: 'Informasi Profil' },
            { id: 'game_id', label: 'ID Game Tersimpan' },
            { id: 'keamanan', label: 'Keamanan Akun' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: RIWAYAT MUTASI SALDO */}
        {activeTab === 'dompet' && (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base">Mutasi Saldo Dompet Digital</h3>
                <p className="text-xs text-slate-400">Catatan transaksi pengisian deposit dan pembayaran game</p>
              </div>
              <button
                onClick={() => setShowDepositModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Isi Saldo</span>
              </button>
            </div>

            {walletTransactions.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <Wallet className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                <p className="text-sm font-semibold">Belum ada mutasi saldo</p>
                <p className="text-xs mt-1">Lakukan deposit saldo pertama untuk menikmati bayar instan</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {walletTransactions.map((tx) => {
                  const isPositive = tx.type === 'topup' || tx.type === 'bonus' || tx.type === 'refund';

                  return (
                    <div
                      key={tx.id}
                      className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isPositive
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {isPositive ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-white block text-sm">
                            {tx.description}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                            {tx.createdAt} &bull; Ref: {tx.referenceId || tx.id}
                          </span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span
                          className={`font-black text-sm block ${
                            isPositive ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isPositive ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                          Sisa Saldo: Rp {tx.balanceAfter.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROFIL */}
        {activeTab === 'profil' && (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-5">
            <h3 className="font-bold text-white text-base pb-3 border-b border-slate-800">
              Ubah Data Diri
            </h3>
            {isSaved && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Perubahan profil berhasil disimpan!</span>
              </div>
            )}
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nomor WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: GAME ID */}
        {activeTab === 'game_id' && (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 text-xs">
            <h3 className="font-bold text-white text-base pb-3 border-b border-slate-800">
              ID Game Favorit Tersimpan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {gameAccounts.map((acc) => (
                <div key={acc.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="font-bold text-white block">{acc.game}</span>
                  <span className="text-cyan-400 font-mono block">ID: {acc.gameUserId}</span>
                  {acc.server && <span className="text-slate-400 font-mono block">Zone: {acc.server}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: KEAMANAN */}
        {activeTab === 'keamanan' && (
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-5 text-xs max-w-lg">
            <h3 className="font-bold text-white text-base pb-3 border-b border-slate-800">
              Ganti Kata Sandi
            </h3>
            {passwordSaved && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Kata sandi berhasil diperbarui!</span>
              </div>
            )}
            <form onSubmit={handleSavePassword} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Kata Sandi Baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 6 karakter"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Konfirmasi Kata Sandi Baru</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi sandi baru"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Simpan Sandi Baru</span>
              </button>
            </form>
          </div>
        )}

      </div>

      {/* DEPOSIT / TOP UP SALDO MODAL */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">Top Up Saldo Dompet</h3>
                  <p className="text-slate-400 text-[11px]">Saldo TokoGem langsung terisi otomatis</p>
                </div>
              </div>
              <button
                onClick={() => setShowDepositModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {depositSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-black text-white text-base">Top Up Saldo Berhasil!</h4>
                <p className="text-slate-300 text-xs">
                  Saldo akun kamu berhasil ditambahkan. Selamat bertransaksi!
                </p>
              </div>
            ) : (
              <form onSubmit={handleProcessDeposit} className="space-y-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-2">
                    Pilih Nominal Deposit:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setDepositAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                          depositAmount === amt && !customAmount
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        Rp {amt.toLocaleString('id-ID')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Atau Masukkan Nominal Lain (Min. Rp 10.000):
                  </label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="Contoh: 150000"
                    min={10000}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Metode Pembayaran Deposit:
                  </label>
                  <select
                    value={depositMethod}
                    onChange={(e) => setDepositMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-emerald-500"
                  >
                    <option value="QRIS Instant (Semua E-Wallet & Bank)">QRIS Instant (Semua E-Wallet &amp; Bank) - Rp 0 Fee</option>
                    <option value="BCA Virtual Account">BCA Virtual Account</option>
                    <option value="Mandiri Virtual Account">Mandiri Virtual Account</option>
                    <option value="GoPay">GoPay</option>
                    <option value="DANA">DANA</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Total Bayar:</span>
                  <span className="text-base font-black text-emerald-400">
                    Rp {(customAmount ? Number(customAmount) : depositAmount).toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isDepositing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isDepositing ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Memproses Deposit...
                    </span>
                  ) : (
                    <span>Bayar &amp; Masukkan ke Saldo</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-center text-xs">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-base">Keluar dari Akun?</h4>
            <p className="text-slate-400">
              Kamu akan kembali ke Mode Guest (Tamu). Kamu bisa masuk kembali kapan saja.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowLogoutModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
