'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  Gamepad2,
  Tag,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Plus,
  RefreshCw,
  Gem,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/stats');
      const json = await res.json();
      if (json.success) {
        setStats(json.data);
      }
    } catch (e) {
      console.error('Error loading stats:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formattedRevenue = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(stats?.totalRevenue || 0);

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pusat Kendali TokoGem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Selamat Datang di Admin CMS
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Kelola katalog game, nominal produk, kupon promo diskon, metode pembayaran, serta pantau status pesanan secara real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={fetchStats}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
              <span>Perbarui Data</span>
            </button>
            <Link
              href="/admin/games"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Game</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Omset */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Omset Pendapatan</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white block tracking-tight">
              {isLoading ? '...' : formattedRevenue}
            </span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
              <TrendingUp className="w-3 h-3" /> Transaksi sukses terverifikasi
            </span>
          </div>
        </div>

        {/* Total Pesanan */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Pesanan Masuk</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white block tracking-tight">
              {isLoading ? '...' : stats?.totalOrders || 0}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Sukses: <strong className="text-emerald-400">{stats?.successfulOrdersCount || 0}</strong> &bull; Pending:{' '}
              <strong className="text-amber-400">{stats?.pendingOrdersCount || 0}</strong>
            </span>
          </div>
        </div>

        {/* Game Aktif */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Katalog Game Aktif</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white block tracking-tight">
              {isLoading ? '...' : `${stats?.activeGamesCount || 0} Game`}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">
              Total <strong className="text-white">{stats?.totalItems || 0}</strong> variasi nominal item
            </span>
          </div>
        </div>

        {/* Voucher Promo */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Voucher Diskon Aktif</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-white block tracking-tight">
              {isLoading ? '...' : `${stats?.activePromosCount || 0} Kupon`}
            </span>
            <span className="text-[11px] text-cyan-400 block mt-1 font-semibold">
              Siap diklaim oleh pengguna
            </span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/games"
          className="p-5 rounded-2xl bg-[#0d1424] hover:bg-[#111c33] border border-slate-800 hover:border-indigo-500/50 transition-all duration-200 group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Kelola Game &amp; Produk</h4>
              <p className="text-xs text-slate-400 mt-0.5">Tambah game, atur server &amp; status katalog</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/admin/items"
          className="p-5 rounded-2xl bg-[#0d1424] hover:bg-[#111c33] border border-slate-800 hover:border-cyan-500/50 transition-all duration-200 group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Gem className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Kelola Nominal &amp; Harga</h4>
              <p className="text-xs text-slate-400 mt-0.5">Update harga diamond, UC &amp; paket hemat</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          href="/admin/orders"
          className="p-5 rounded-2xl bg-[#0d1424] hover:bg-[#111c33] border border-slate-800 hover:border-rose-500/50 transition-all duration-200 group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Pesanan &amp; Transaksi</h4>
              <p className="text-xs text-slate-400 mt-0.5">Verifikasi pembayaran &amp; status pengiriman</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-3xl bg-[#0f172a] border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-white text-base sm:text-lg">Transaksi Terbaru</h3>
            <p className="text-xs text-slate-400">Daftar pesanan masuk yang perlu dipantau</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition"
          >
            <span>Lihat Semua Pesanan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5 font-bold">No. Pesanan</th>
                <th className="px-5 py-3.5 font-bold">Game &amp; Item</th>
                <th className="px-5 py-3.5 font-bold">User ID Game</th>
                <th className="px-5 py-3.5 font-bold">Total Bayar</th>
                <th className="px-5 py-3.5 font-bold">Status</th>
                <th className="px-5 py-3.5 font-bold">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-slate-850/50 transition">
                    <td className="px-5 py-3.5 font-mono font-bold text-white">
                      <Link href="/admin/orders" className="hover:text-cyan-400 transition">
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-white block">{order.gameName || 'Game'}</span>
                      <span className="text-[11px] text-slate-400">{order.itemName || 'Top Up Item'}</span>
                    </td>
                    <td className="px-5 py-3.5 font-mono">
                      {order.gameUserId}
                      {order.serverId && <span className="text-slate-400"> ({order.serverId})</span>}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-cyan-300">
                      Rp {(order.totalAmount || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-5 py-3.5">
                      {order.status === 'berhasil' || order.status === 'success' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Sukses
                        </span>
                      ) : order.status === 'pending' || order.status === 'menunggu' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold">
                          <Clock className="w-3 h-3" /> Menunggu
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold">
                          <XCircle className="w-3 h-3" /> Gagal
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-[11px]">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID') : 'Hari ini'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    Belum ada riwayat pesanan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
