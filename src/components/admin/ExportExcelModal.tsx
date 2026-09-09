'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Calendar,
  CheckCircle2,
  Sparkles,
  Layers,
  Filter,
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface ExportExcelModalProps {
  isOpen: boolean;
  defaultStartDate?: string;
  defaultEndDate?: string;
  onClose: () => void;
  showToast: (type: 'success' | 'error', text: string) => void;
}

export default function ExportExcelModal({
  isOpen,
  defaultStartDate = '',
  defaultEndDate = '',
  onClose,
  showToast,
}: ExportExcelModalProps) {
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [isExporting, setIsExporting] = useState(false);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeLedger, setIncludeLedger] = useState(true);
  const [includeGames, setIncludeGames] = useState(true);
  const [includePayments, setIncludePayments] = useState(true);

  // Quick preset shortcuts
  const applyPreset = (preset: string) => {
    const now = new Date();
    if (preset === 'feb-mar-2026') {
      // User's explicit example: 1 Februari 2026 - 1 Maret 2026
      setStartDate('2026-02-01');
      setEndDate('2026-03-01');
    } else if (preset === 'this-month') {
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const lastDay = new Date(y, now.getMonth() + 1, 0).getDate();
      setStartDate(`${y}-${m}-01`);
      setEndDate(`${y}-${m}-${String(lastDay).padStart(2, '0')}`);
    } else if (preset === 'last-month') {
      const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const y = prev.getFullYear();
      const m = String(prev.getMonth() + 1).padStart(2, '0');
      const lastDay = new Date(y, prev.getMonth() + 1, 0).getDate();
      setStartDate(`${y}-${m}-01`);
      setEndDate(`${y}-${m}-${String(lastDay).padStart(2, '0')}`);
    } else if (preset === 'this-year') {
      const y = now.getFullYear();
      setStartDate(`${y}-01-01`);
      setEndDate(`${y}-12-31`);
    } else if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    }
  };

  useEffect(() => {
    if (isOpen) {
      setStartDate(defaultStartDate);
      setEndDate(defaultEndDate);
    }
  }, [isOpen, defaultStartDate, defaultEndDate]);

  if (!isOpen) return null;

  const formatDateIndo = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatCleanFileDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    const day = d.getDate();
    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    return `${day}_${months[d.getMonth()]}_${d.getFullYear()}`;
  };

  const handleDownloadExcel = async () => {
    try {
      setIsExporting(true);

      // Fetch accounting ledger data specifically for chosen range
      let url = '/api/admin/accounting?period=custom';
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      if (!startDate && !endDate) url = '/api/admin/accounting?period=all';

      const res = await fetch(url);
      const json = await res.json();

      if (!json.success || !json.data) {
        throw new Error('Gagal mengambil data laporan');
      }

      const { summary, ledger, gameBreakdown, paymentBreakdown, periodLabel } = json.data;

      if (!ledger || ledger.length === 0) {
        showToast('error', 'Tidak ada transaksi pada rentang tanggal yang dipilih.');
        return;
      }

      const wb = XLSX.utils.book_new();

      // 1. Sheet Ringkasan
      if (includeSummary) {
        const summaryRows = [
          { Parameter: 'Nama Toko', Nilai: 'TokoGem Official Store' },
          { Parameter: 'Jenis Dokumen', Nilai: 'Laporan Rekapitulasi Keuangan & Transaksi' },
          { Parameter: 'Periode Laporan', Nilai: periodLabel || 'Semua Waktu' },
          { Parameter: 'Tanggal Cetak File', Nilai: new Date().toLocaleString('id-ID') },
          { Parameter: '----------------------------------------', Nilai: '----------------------------------------' },
          { Parameter: 'Total Transaksi Masuk', Nilai: summary.totalOrders },
          { Parameter: 'Transaksi Sukses (Berhasil)', Nilai: summary.successCount },
          { Parameter: 'Transaksi Menunggu Pembayaran', Nilai: summary.pendingCount },
          { Parameter: 'Transaksi Gagal / Batal', Nilai: summary.failedCount },
          { Parameter: '----------------------------------------', Nilai: '----------------------------------------' },
          { Parameter: 'Total Omset Kotor / Penjualan (Rp)', Nilai: summary.totalGrossSales },
          { Parameter: 'Total Modal Produk / HPP (Rp)', Nilai: summary.totalCogs },
          { Parameter: 'Laba Bersih Toko (Rp)', Nilai: summary.netProfit },
          { Parameter: 'Margin Keuntungan Toko (%)', Nilai: `${summary.profitMargin}%` },
          { Parameter: 'Total Diskon Voucher Promo (Rp)', Nilai: summary.totalDiscount },
          { Parameter: 'Total Biaya Admin Fee (Rp)', Nilai: summary.totalAdminFees },
        ];
        const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
        wsSummary['!cols'] = [{ wch: 35 }, { wch: 45 }];
        XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan Keuangan');
      }

      // 2. Sheet Buku Kas & Ledger
      if (includeLedger) {
        const ledgerRows = ledger.map((row: any, idx: number) => ({
          No: idx + 1,
          'ID Pesanan': row.orderId,
          Waktu: row.createdAt ? new Date(row.createdAt).toLocaleString('id-ID') : '-',
          Game: row.gameName,
          'Item Nominal': row.itemName,
          'User ID Pemain': row.gameUserId,
          'Server ID': row.serverId || '-',
          'WhatsApp Pembeli': row.whatsapp,
          'Metode Bayar': row.paymentMethod,
          Status: row.status,
          'Harga Item (Rp)': row.itemPrice,
          'Diskon (Rp)': row.discountAmount,
          'Biaya Admin (Rp)': row.adminFee,
          'Total Omset Bayar (Rp)': row.totalAmount,
          'Modal HPP (Rp)': row.cogs,
          'Laba Bersih (Rp)': row.profit,
        }));
        const wsLedger = XLSX.utils.json_to_sheet(ledgerRows);
        wsLedger['!cols'] = [
          { wch: 6 },
          { wch: 16 },
          { wch: 20 },
          { wch: 22 },
          { wch: 20 },
          { wch: 16 },
          { wch: 12 },
          { wch: 16 },
          { wch: 18 },
          { wch: 12 },
          { wch: 16 },
          { wch: 14 },
          { wch: 14 },
          { wch: 20 },
          { wch: 16 },
          { wch: 16 },
        ];
        XLSX.utils.book_append_sheet(wb, wsLedger, 'Buku Kas & Transaksi');
      }

      // 3. Sheet Performa Game
      if (includeGames) {
        const gameRows = (gameBreakdown || []).map((g: any) => ({
          'Nama Game': g.name,
          'Jumlah Pesanan': g.count,
          'Total Omset Penjualan (Rp)': g.omset,
          'Total Modal HPP (Rp)': g.modal,
          'Laba Bersih Toko (Rp)': g.profit,
          'Margin Keuntungan (%)':
            g.omset > 0 ? ((g.profit / g.omset) * 100).toFixed(1) + '%' : '0%',
        }));
        const wsGames = XLSX.utils.json_to_sheet(gameRows);
        wsGames['!cols'] = [
          { wch: 24 },
          { wch: 16 },
          { wch: 26 },
          { wch: 22 },
          { wch: 22 },
          { wch: 20 },
        ];
        XLSX.utils.book_append_sheet(wb, wsGames, 'Performa Game');
      }

      // 4. Sheet Payment Methods
      if (includePayments) {
        const paymentRows = (paymentBreakdown || []).map((p: any) => ({
          'Channel Pembayaran': p.method,
          'Frekuensi Transaksi': p.count,
          'Total Volume Transaksi (Rp)': p.volume,
          'Porsi Volume (%)':
            summary.totalGrossSales > 0
              ? ((p.volume / summary.totalGrossSales) * 100).toFixed(1) + '%'
              : '0%',
        }));
        const wsPayments = XLSX.utils.json_to_sheet(paymentRows);
        wsPayments['!cols'] = [
          { wch: 24 },
          { wch: 20 },
          { wch: 26 },
          { wch: 18 },
        ];
        XLSX.utils.book_append_sheet(wb, wsPayments, 'Metode Bayar');
      }

      // Build Clean Filename
      let filename = 'Laporan_Keuangan_TokoGem';
      if (startDate && endDate) {
        filename += `_${formatCleanFileDate(startDate)}_sd_${formatCleanFileDate(endDate)}`;
      } else if (startDate) {
        filename += `_Mulai_${formatCleanFileDate(startDate)}`;
      } else if (endDate) {
        filename += `_Hingga_${formatCleanFileDate(endDate)}`;
      } else {
        filename += '_Semua_Waktu';
      }
      filename += '.xlsx';

      XLSX.writeFile(wb, filename);
      showToast('success', `File Excel '${filename}' berhasil diunduh!`);
      onClose();
    } catch (err: any) {
      showToast('error', 'Gagal mengekspor laporan Excel: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const periodDisplay =
    startDate && endDate
      ? `${formatDateIndo(startDate)} s/d ${formatDateIndo(endDate)}`
      : startDate
      ? `Mulai ${formatDateIndo(startDate)}`
      : endDate
      ? `Hingga ${formatDateIndo(endDate)}`
      : 'Semua Waktu';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto my-auto text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                Export Rekap Laporan Keuangan
              </h3>
              <p className="text-slate-400 text-xs">
                Pilih rentang tanggal untuk spreadsheet Excel (.xlsx) / Google Sheets
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2">
          <label className="font-bold text-slate-300 block">Pilihan Cepat Periode:</label>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => applyPreset('feb-mar-2026')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-semibold text-[11px] transition cursor-pointer"
            >
              ⭐ 1 Feb 2026 - 1 Mar 2026
            </button>
            <button
              type="button"
              onClick={() => applyPreset('this-month')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold text-[11px] transition cursor-pointer"
            >
              Bulan Ini
            </button>
            <button
              type="button"
              onClick={() => applyPreset('last-month')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold text-[11px] transition cursor-pointer"
            >
              Bulan Lalu
            </button>
            <button
              type="button"
              onClick={() => applyPreset('this-year')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold text-[11px] transition cursor-pointer"
            >
              Tahun 2026
            </button>
            <button
              type="button"
              onClick={() => applyPreset('all')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold text-[11px] transition cursor-pointer"
            >
              Semua Waktu
            </button>
          </div>
        </div>

        {/* Date Range Inputs */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dari Tanggal:</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-emerald-500 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sampai Tanggal:</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-emerald-500 font-mono text-xs"
              />
            </div>
          </div>

          {/* Active Period Label Display */}
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
            <span className="text-slate-400 text-[11px]">Rentang Rekap:</span>
            <span className="font-bold text-emerald-300 font-mono text-xs">
              {periodDisplay}
            </span>
          </div>
        </div>

        {/* Sheet Options */}
        <div className="space-y-2">
          <label className="font-bold text-slate-300 block flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Pilih Lembar Kerja (Sheets) yang Disertakan:</span>
          </label>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSummary}
                onChange={(e) => setIncludeSummary(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-500"
              />
              <span className="text-slate-300 font-medium">Ringkasan Finansial</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includeLedger}
                onChange={(e) => setIncludeLedger(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-500"
              />
              <span className="text-slate-300 font-medium">Buku Kas / Transaksi</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includeGames}
                onChange={(e) => setIncludeGames(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-500"
              />
              <span className="text-slate-300 font-medium">Performa per Game</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={includePayments}
                onChange={(e) => setIncludePayments(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-500"
              />
              <span className="text-slate-300 font-medium">Metode Pembayaran</span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleDownloadExcel}
            disabled={isExporting}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isExporting ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Mengekspor...
              </span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Unduh File Excel (.xlsx)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
