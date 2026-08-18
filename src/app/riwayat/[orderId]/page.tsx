'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { MOCK_TRANSACTIONS } from '@/data/mockOrders';
import TransactionStatusBadge from '@/components/TransactionStatusBadge';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  FileText, 
  Printer, 
  Share2, 
  ShieldCheck, 
  HelpCircle, 
  CreditCard,
  Zap,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default function DetailTransaksiPage({ params }: PageProps) {
  const { orderId } = use(params);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Find transaction or fallback to demo template
  const tx = MOCK_TRANSACTIONS.find((t) => t.id === orderId) || {
    id: orderId,
    gameName: 'Mobile Legends: Bang Bang',
    gameSlug: 'mobile-legends',
    gameIcon: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80',
    itemName: 'Weekly Diamond Pass (WDP)',
    gameUserId: '128492019',
    serverId: '2648',
    whatsapp: '081234567890',
    paymentMethod: 'BCA Virtual Account',
    totalAmount: 28000,
    status: 'berhasil' as const,
    createdAt: new Date().toLocaleString('id-ID'),
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Navigation back */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/riwayat"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Riwayat Transaksi</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak Invoice</span>
            </button>
          </div>
        </div>

        {/* Invoice Card */}
        <div className="rounded-3xl bg-[#111827] border border-slate-800 overflow-hidden shadow-2xl">
          
          {/* Invoice Header */}
          <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 p-6 sm:p-8 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-extrabold text-lg text-white tracking-tight">ZenTopUp</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
                    Official Receipt
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Bukti Pembayaran &amp; Pengiriman
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Transaksi resmi yang diproses oleh sistem otomatis ZenTopUp
                </p>
              </div>

              <div className="sm:text-right">
                <TransactionStatusBadge status={tx.status} size="lg" />
              </div>
            </div>
          </div>

          {/* Body details */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Game & Item Summary */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <img
                src={tx.gameIcon}
                alt={tx.gameName}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-blue-400 block">{tx.gameName}</span>
                <h3 className="text-base font-bold text-white truncate">{tx.itemName}</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">
                  Player ID: {tx.gameUserId} {tx.serverId && `(${tx.serverId})`}
                </p>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800 text-xs">
              
              <div className="p-3.5 flex justify-between bg-slate-900/40">
                <span className="text-slate-400">Nomor Pesanan</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-white">
                  <span>{tx.id}</span>
                  <button
                    onClick={() => handleCopy(tx.id, 'orderId')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedField === 'orderId' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3.5 flex justify-between">
                <span className="text-slate-400">Waktu Transaksi</span>
                <span className="text-white font-medium">{tx.createdAt}</span>
              </div>

              <div className="p-3.5 flex justify-between bg-slate-900/40">
                <span className="text-slate-400">Metode Pembayaran</span>
                <span className="text-white font-semibold flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                  {tx.paymentMethod}
                </span>
              </div>

              <div className="p-3.5 flex justify-between">
                <span className="text-slate-400">Nomor WhatsApp Pengguna</span>
                <span className="text-white font-mono">{tx.whatsapp}</span>
              </div>

              <div className="p-3.5 flex justify-between bg-slate-900/40">
                <span className="text-slate-400">Status Layanan</span>
                <span className="text-emerald-400 font-bold">100% Item Berhasil Terkirim</span>
              </div>

              <div className="p-4 flex justify-between bg-slate-950 text-sm">
                <span className="font-bold text-white">Total Tagihan Dibayar</span>
                <span className="font-extrabold text-cyan-400 text-lg">
                  Rp {tx.totalAmount.toLocaleString('id-ID')}
                </span>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/game/${tx.gameSlug}`}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4" />
                <span>Beli Lagi Item Ini</span>
              </Link>
              <Link
                href="https://wa.me/6281234567890"
                target="_blank"
                className="py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs text-center transition flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>Butuh Bantuan CS?</span>
              </Link>
            </div>

            {/* Guarantee footnote */}
            <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bukti invoice ini sah dan dikeluarkan otomatis oleh ZenTopUp Indonesia.</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
