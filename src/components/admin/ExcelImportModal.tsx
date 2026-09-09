'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileUp,
  Trash2,
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ExcelImportModal({
  isOpen,
  onClose,
  onSuccess,
}: ExcelImportModalProps) {
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // 1. Download Template Excel (.xlsx)
  const handleDownloadTemplate = () => {
    try {
      const templateData = [
        {
          'Slug Game': 'mobile-legends',
          'Nama Item': '86 Diamonds',
          Nominal: 86,
          'Harga Jual': 21500,
          'Harga Coret': 24000,
          'Harga Modal': 19500,
          Populer: 'Ya',
        },
        {
          'Slug Game': 'mobile-legends',
          'Nama Item': '172 Diamonds',
          Nominal: 172,
          'Harga Jual': 43000,
          'Harga Coret': 48000,
          'Harga Modal': 39000,
          Populer: 'Ya',
        },
        {
          'Slug Game': 'free-fire',
          'Nama Item': '140 Diamonds',
          Nominal: 140,
          'Harga Jual': 19000,
          'Harga Coret': 22000,
          'Harga Modal': 17000,
          Populer: 'Tidak',
        },
        {
          'Slug Game': 'valorant',
          'Nama Item': '625 Points',
          Nominal: 625,
          'Harga Jual': 75000,
          'Harga Coret': 80000,
          'Harga Modal': 69000,
          Populer: 'Ya',
        },
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(templateData);

      // Set column widths
      ws['!cols'] = [
        { wch: 18 },
        { wch: 22 },
        { wch: 12 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Template Produk');
      XLSX.writeFile(wb, 'Template_Import_Produk_TokoGem.xlsx');
    } catch (err: any) {
      setError('Gagal mengunduh template: ' + err.message);
    }
  };

  // 2. Handle File Upload and Parsing
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setImportResult(null);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawJson: any[] = XLSX.utils.sheet_to_json(ws);

        if (!rawJson || rawJson.length === 0) {
          setError('File Excel kosong atau tidak memiliki baris data.');
          setParsedRows([]);
          return;
        }

        // Normalize keys
        const mapped = rawJson.map((row) => {
          return {
            gameSlug:
              row['Slug Game'] ||
              row['Game'] ||
              row['gameSlug'] ||
              row['game'] ||
              row['Game Slug'] ||
              '',
            name:
              row['Nama Item'] ||
              row['Nama'] ||
              row['name'] ||
              row['Item'] ||
              row['Produk'] ||
              '',
            nominal: Number(row['Nominal'] || row['nominal'] || 0),
            price: Number(
              row['Harga Jual'] || row['Harga'] || row['price'] || row['harga'] || 0
            ),
            originalPrice:
              row['Harga Coret'] || row['originalPrice'] || row['Harga Asli'] || null,
            costPrice: Number(
              row['Harga Modal'] || row['costPrice'] || row['Modal'] || 0
            ),
            isPopular:
              row['Populer'] || row['isPopular'] || row['Popular'] || 'Tidak',
          };
        });

        setParsedRows(mapped);
      } catch (err: any) {
        setError('Gagal membaca file Excel: ' + err.message);
      }
    };
    reader.readAsBinaryString(file);
  };

  // 3. Submit to Bulk API
  const handleBulkImport = async () => {
    if (parsedRows.length === 0) {
      setError('Tidak ada baris data yang valid untuk diimpor.');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const res = await fetch('/api/admin/items/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: parsedRows }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setImportResult(json);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Gagal mengimpor produk.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setParsedRows([]);
    setFileName(null);
    setError(null);
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-700/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto my-auto text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                Tambah Produk Sekaligus via Excel (.xlsx / .csv)
              </h3>
              <p className="text-slate-400 text-xs">
                Unggah spreadsheet untuk menambahkan banyak nominal item game sekaligus
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Download Template */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <span>Langkah 1:</span> Gunakan Template Standar
            </h4>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Unduh contoh spreadsheet dengan format kolom yang sudah disesuaikan
            </p>
          </div>
          <button
            onClick={handleDownloadTemplate}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold border border-emerald-500/30 transition flex items-center gap-1.5 shrink-0 cursor-pointer text-xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Unduh Template (.xlsx)</span>
          </button>
        </div>

        {/* Step 2: Upload File */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-xs">
            <span>Langkah 2:</span> Unggah File Spreadsheet Anda
          </h4>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="hidden"
            id="excel-file-input"
          />

          {!fileName ? (
            <label
              htmlFor="excel-file-input"
              className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-6 flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer bg-slate-950/50 hover:bg-slate-950 transition group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileUp className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">
                  Klik untuk memilih file atau drag file ke sini
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mendukung format .xlsx, .xls, atau .csv (Maks. 500 item per upload)
                </p>
              </div>
            </label>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-white text-xs">{fileName}</p>
                  <p className="text-[11px] text-slate-400">
                    {parsedRows.length} baris produk terdeteksi
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition"
                title="Ganti File"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Feedback / Alerts */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {importResult && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{importResult.message}</span>
            </div>
            {importResult.skippedCount > 0 && (
              <p className="text-amber-400 text-[11px]">
                Perhatian: {importResult.skippedCount} baris dilewati karena format tidak sesuai.
              </p>
            )}
          </div>
        )}

        {/* Step 3: Parsed Rows Preview Table */}
        {parsedRows.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-xs">
                Pratinjau Data ({parsedRows.length} Item)
              </h4>
              <span className="text-[10px] text-slate-500">
                Periksa data sebelum disimpan ke database
              </span>
            </div>

            <div className="max-h-52 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-[11px] text-slate-300">
                <thead className="bg-slate-900 text-slate-400 sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">Slug Game</th>
                    <th className="py-2 px-3">Nama Item</th>
                    <th className="py-2 px-3">Nominal</th>
                    <th className="py-2 px-3">Harga Jual</th>
                    <th className="py-2 px-3">Modal HPP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {parsedRows.slice(0, 50).map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="py-1.5 px-3 font-mono text-cyan-300">{r.gameSlug}</td>
                      <td className="py-1.5 px-3 font-bold text-white">{r.name}</td>
                      <td className="py-1.5 px-3">{r.nominal}</td>
                      <td className="py-1.5 px-3 font-bold text-amber-400">
                        Rp {Number(r.price).toLocaleString('id-ID')}
                      </td>
                      <td className="py-1.5 px-3 text-slate-400">
                        Rp {Number(r.costPrice || 0).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedRows.length > 50 && (
              <p className="text-[10px] text-slate-500 text-right">
                Menampilkan 50 dari total {parsedRows.length} baris
              </p>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition cursor-pointer"
          >
            Tutup
          </button>

          <button
            type="button"
            onClick={handleBulkImport}
            disabled={isProcessing || parsedRows.length === 0}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Mengimpor ke Database...
              </span>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Impor {parsedRows.length} Produk Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
