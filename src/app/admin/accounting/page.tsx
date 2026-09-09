'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Gamepad2,
  CreditCard,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function AdminAccountingPage() {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'all' | 'today' | '7days' | 'month' | 'custom'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState<'games' | 'payments' | 'ledger'>('games');

  // Toast / Feedback
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchAccounting = async () => {
    try {
      setIsLoading(true);
      let url = `/api/admin/accounting?period=${period}`;
      if (period === 'custom' && startDate) {
        url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;
      }

      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (e: any) {
      showToast('error', 'Gagal memuat data keuangan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounting();
  }, [period]);

  const handleCustomDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAccounting();
  };

  // Export to Excel (.xlsx) using SheetJS
  const handleExportExcel = () => {
    if (!data || !data.ledger || data.ledger.length === 0) {
      showToast('error', 'Tidak ada data transaksi untuk diexport.');
      return;
    }

    try {
      // 1. Prepare Summary Sheet
      const summaryRows = [
        { Parameter: 'Periode Laporan', Nilai: period },
        { Parameter: 'Tanggal Cetak', Nilai: new Date().toLocaleString('id-ID') },
        { Parameter: 'Total Transaksi Masuk', Nilai: data.summary.totalOrders },
        { Parameter: 'Transaksi Berhasil', Nilai: data.summary.successCount },
        { Parameter: 'Total Omset Kotor (Rp)', Nilai: data.summary.totalGrossSales },
        { Parameter: 'Total Modal HPP (Rp)', Nilai: data.summary.totalCogs },
        { Parameter: 'Laba Bersih Toko (Rp)', Nilai: data.summary.netProfit },
        { Parameter: 'Margin Keuntungan (%)', Nilai: `${data.summary.profitMargin}%` },
        { Parameter: 'Total Diskon Diberikan (Rp)', Nilai: data.summary.totalDiscount },
        { Parameter: 'Total Biaya Admin/Layanan (Rp)', Nilai: data.summary.totalAdminFees },
      ];

      // 2. Prepare Ledger Sheet
      const ledgerRows = data.ledger.map((row: any, idx: number) => ({
        No: idx + 1,
        'ID Pesanan': row.orderId,
        Waktu: row.createdAt ? new Date(row.createdAt).toLocaleString('id-ID') : '-',
        Game: row.gameName,
        'Item Nominal': row.itemName,
        'User ID Pemain': row.gameUserId,
        'Zone / Server': row.serverId,
        'WhatsApp Pembeli': row.whatsapp,
        'Metode Bayar': row.paymentMethod,
        'Status Pesanan': row.status,
        'Harga Item (Rp)': row.itemPrice,
        'Diskon (Rp)': row.discountAmount,
        'Biaya Admin (Rp)': row.adminFee,
        'Total Bayar Omset (Rp)': row.totalAmount,
        'Modal HPP (Rp)': row.cogs,
        'Laba Bersih (Rp)': row.profit,
      }));

      // 3. Prepare Game Performance Sheet
      const gameRows = (data.gameBreakdown || []).map((g: any) => ({
        'Nama Game': g.name,
        'Jumlah Pesanan': g.count,
        'Total Omset (Rp)': g.omset,
        'Total Modal (Rp)': g.modal,
        'Laba Bersih (Rp)': g.profit,
        'Margin (%)': g.omset > 0 ? ((g.profit / g.omset) * 100).toFixed(1) + '%' : '0%',
      }));

      const wb = XLSX.utils.book_new();

      const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
      const wsLedger = XLSX.utils.json_to_sheet(ledgerRows);
      const wsGames = XLSX.utils.json_to_sheet(gameRows);

      XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan Keuangan');
      XLSX.utils.book_append_sheet(wb, wsLedger, 'Buku Kas & Transaksi');
      XLSX.utils.book_append_sheet(wb, wsGames, 'Performa Game');

      const dateStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `Laporan_Keuangan_TokoGem_${dateStr}.xlsx`);
      showToast('success', 'File Excel (.xlsx) berhasil diunduh!');
    } catch (err: any) {
      showToast('error', 'Gagal membuat file Excel: ' + err.message);
    }
  };

  const summary = data?.summary || {
    totalOrders: 0,
    successCount: 0,
    pendingCount: 0,
    failedCount: 0,
    totalGrossSales: 0,
    totalCogs: 0,
    netProfit: 0,
    profitMargin: 0,
    totalDiscount: 0,
    totalAdminFees: 0,
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-medium animate-in slide-in-from-top-3 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
              : 'bg-red-950/90 border-red-500/50 text-red-300'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <DollarSign className="w-5 h-5" />
            </span>
            Laporan Keuangan &amp; Akuntansi
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Autocount otomatis omset kotor, modal HPP, laba bersih, dan rekap spreadsheet Excel / Google Sheets
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchAccounting}
            title="Refresh Data"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>Rekap ke Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Date Filter Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { key: 'all', label: 'Semua Waktu' },
            { key: 'today', label: 'Hari Ini' },
            { key: '7days', label: '7 Hari Terakhir' },
            { key: 'month', label: 'Bulan Ini' },
            { key: 'custom', label: 'Pilih Tanggal' },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => setPeriod(btn.key as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                period === btn.key
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {period === 'custom' && (
          <form onSubmit={handleCustomDateSubmit} className="flex items-center gap-2 text-xs">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-emerald-500"
              required
            />
            <span className="text-slate-500">s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition cursor-pointer"
            >
              Filter
            </button>
          </form>
        )}
      </div>

      {/* Financial KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Sales Card */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Omset Kotor</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mt-2">
            Rp {Number(summary.totalGrossSales).toLocaleString('id-ID')}
          </p>
          <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-400">
            <span className="font-bold text-slate-200">{summary.successCount} transaksi</span>
            <span>sukses terbayar</span>
          </div>
        </div>

        {/* COGS / Modal Card */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Modal Produk (HPP)</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-400 mt-2">
            Rp {Number(summary.totalCogs).toLocaleString('id-ID')}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span>Estimasi modal dasar pengadaan diamond</span>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/40 relative overflow-hidden shadow-xl shadow-emerald-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400">Laba Bersih Toko (Profit)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-300 mt-2">
            Rp {Number(summary.netProfit).toLocaleString('id-ID')}
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400/90 font-medium">
            <span>Omset - Modal Bersih</span>
          </div>
        </div>

        {/* Profit Margin Card */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Rata-rata Margin</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">
            {summary.profitMargin}%
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
            <span>Rasio keuntungan kotor vs omset</span>
          </div>
        </div>
      </div>

      {/* Breakdown Tabs & Tables */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 sm:p-3 border-b border-slate-800 bg-slate-950/60">
          <button
            onClick={() => setActiveTab('games')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'games'
                ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Performa per Game ({data?.gameBreakdown?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Channel Pembayaran ({data?.paymentBreakdown?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Buku Kas Transaksi ({data?.ledger?.length || 0})</span>
          </button>
        </div>

        {/* Tab 1: Game Breakdown */}
        {activeTab === 'games' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/90 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Nama Game</th>
                  <th className="py-3 px-4">Total Order</th>
                  <th className="py-3 px-4">Omset Penjualan</th>
                  <th className="py-3 px-4">Modal (HPP)</th>
                  <th className="py-3 px-4">Laba Bersih</th>
                  <th className="py-3 px-4">Margin (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {(data?.gameBreakdown || []).map((g: any, i: number) => {
                  const margin = g.omset > 0 ? ((g.profit / g.omset) * 100).toFixed(1) : 0;
                  return (
                    <tr key={i} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>{g.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">{g.count} pesanan</td>
                      <td className="py-3 px-4 font-bold text-amber-400">
                        Rp {Number(g.omset).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-rose-400">
                        Rp {Number(g.modal).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 font-black text-emerald-400">
                        Rp {Number(g.profit).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 font-mono text-[11px]">
                          {margin}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Payments Breakdown */}
        {activeTab === 'payments' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/90 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Channel Pembayaran</th>
                  <th className="py-3 px-4">Frekuensi Transaksi</th>
                  <th className="py-3 px-4">Total Volume Transaksi</th>
                  <th className="py-3 px-4">Porsi Volume (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {(data?.paymentBreakdown || []).map((p: any, i: number) => {
                  const portion =
                    summary.totalGrossSales > 0
                      ? ((p.volume / summary.totalGrossSales) * 100).toFixed(1)
                      : 0;
                  return (
                    <tr key={i} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="uppercase">{p.method}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">{p.count} kali</td>
                      <td className="py-3 px-4 font-black text-amber-400">
                        Rp {Number(p.volume).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">{portion}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Detailed Ledger */}
        {activeTab === 'ledger' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/90 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">ID Transaksi</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Game &amp; Item</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Omset (Rp)</th>
                  <th className="py-3 px-4">Modal HPP (Rp)</th>
                  <th className="py-3 px-4">Laba Toko (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {(data?.ledger || []).map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-white">{row.orderId}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-white">{row.gameName}</p>
                      <p className="text-[11px] text-slate-400">{row.itemName}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          row.status === 'berhasil'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : row.status === 'diproses'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : row.status === 'gagal'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-400">
                      Rp {Number(row.totalAmount).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 text-rose-400">
                      Rp {Number(row.cogs).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 font-black text-emerald-400">
                      Rp {Number(row.profit).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
