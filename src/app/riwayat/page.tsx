'use client';

import React, { useState, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MOCK_TRANSACTIONS, MockTransaction } from '@/data/mockOrders';
import { 
  Search, 
  Receipt, 
  ArrowRight, 
  CreditCard, 
  Zap, 
  FileText,
  Copy,
  Check,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Gamepad2
} from 'lucide-react';
import TransactionCard from '@/components/TransactionCard';
import EmptyState from '@/components/EmptyState';

function RiwayatContent() {
  const searchParams = useSearchParams();
  const queryOrderId = searchParams.get('orderId');

  const [searchQuery, setSearchQuery] = useState(queryOrderId || '');
  const [activeStatus, setActiveStatus] = useState<string>('semua');
  const [selectedGame, setSelectedGame] = useState<string>('semua');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'price-desc' | 'price-asc'>('latest');
  const [selectedTx, setSelectedTx] = useState<MockTransaction | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Distinct games from transactions
  const gameOptions = useMemo(() => {
    const games = Array.from(new Set(MOCK_TRANSACTIONS.map((t) => t.gameName)));
    return ['semua', ...games];
  }, []);

  const filteredTransactions = useMemo(() => {
    let list = [...MOCK_TRANSACTIONS];

    // Status filter
    if (activeStatus !== 'semua') {
      list = list.filter((tx) => tx.status === activeStatus);
    }

    // Game filter
    if (selectedGame !== 'semua') {
      list = list.filter((tx) => tx.gameName === selectedGame);
    }

    // Search query filter (Order ID, game name, User ID, WhatsApp)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (tx) =>
          tx.id.toLowerCase().includes(q) ||
          tx.gameName.toLowerCase().includes(q) ||
          tx.gameUserId.toLowerCase().includes(q) ||
          tx.whatsapp.includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-desc') {
      list.sort((a, b) => b.totalAmount - a.totalAmount);
    } else if (sortBy === 'price-asc') {
      list.sort((a, b) => a.totalAmount - b.totalAmount);
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    } else {
      // Latest first
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    return list;
  }, [activeStatus, selectedGame, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveStatus('semua');
    setSelectedGame('semua');
    setSortBy('latest');
  };

  const hasActiveFilters = searchQuery || activeStatus !== 'semua' || selectedGame !== 'semua';

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
              <Receipt className="w-4 h-4" />
              <span>Cek Status &amp; Riwayat Pesanan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Riwayat Transaksi Top Up
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Pantau status pengiriman item, verifikasi pembayaran, dan unduh invoice resmi transaksi kamu.
            </p>
          </div>

          {/* Search bar & Controls */}
          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Nomor Pesanan (mis: GEM-847291) atau No. WhatsApp..."
                className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white text-sm outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                  title="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Game Selector Filter */}
            <div className="grid grid-cols-2 sm:flex gap-2 w-full md:w-auto">
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="w-full sm:w-auto px-3 sm:px-4 py-3 sm:py-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white text-xs font-semibold outline-none cursor-pointer truncate"
              >
                <option value="semua">Semua Game</option>
                {gameOptions.filter((g) => g !== 'semua').map((game) => (
                  <option key={game} value={game}>
                    {game}
                  </option>
                ))}
              </select>

              {/* Sort selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto px-3 sm:px-4 py-3 sm:py-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 focus:border-blue-500 text-white text-xs font-semibold outline-none cursor-pointer truncate"
              >
                <option value="latest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="price-desc">Harga Tertinggi</option>
                <option value="price-asc">Harga Terendah</option>
              </select>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800/80">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'semua', label: 'Semua Status' },
                { id: 'berhasil', label: 'Berhasil' },
                { id: 'pending', label: 'Menunggu Bayar' },
                { id: 'gagal', label: 'Gagal' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveStatus(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeStatus === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">
                Ditemukan: <strong className="text-white">{filteredTransactions.length}</strong> transaksi
              </span>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline cursor-pointer"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Transaction List */}
        {filteredTransactions.length > 0 ? (
          <div className="space-y-4">
            {filteredTransactions.map((tx) => (
              <TransactionCard
                key={tx.id}
                transaction={tx}
                onViewInvoice={(transaction) => setSelectedTx(transaction)}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <EmptyState
            icon={Receipt}
            title={
              hasActiveFilters
                ? 'Tidak Ada Transaksi yang Cocok'
                : 'Belum Ada Riwayat Transaksi'
            }
            description={
              hasActiveFilters
                ? `Tidak ditemukan transaksi yang cocok dengan kriteria pencarian dan filter yang kamu pilih.`
                : 'Kamu belum pernah melakukan transaksi top up di TokoGem. Pilih game favorit kamu dan nikmati proses top up instan dalam hitungan detik!'
            }
            actionText="Mulai Top Up Game"
            actionHref="/#katalog"
            secondaryActionText={hasActiveFilters ? 'Reset Pencarian' : undefined}
            onSecondaryActionClick={hasActiveFilters ? handleResetFilters : undefined}
          />
        )}

        {/* Invoice Detail Modal */}
        {selectedTx && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto my-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold text-white text-base">Invoice Resmi TokoGem</h3>
                </div>
                <button
                  onClick={() => setSelectedTx(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Nomor Pesanan:</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-white">
                    <span>{selectedTx.id}</span>
                    <button
                      onClick={() => handleCopy(selectedTx.id, 'invoiceId')}
                      className="text-slate-400 hover:text-white cursor-pointer"
                      title="Salin"
                    >
                      {copiedId === 'invoiceId' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-emerald-400">100% SUKSES &amp; TERKIRIM</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Game:</span>
                  <span className="font-semibold text-white">{selectedTx.gameName}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Item:</span>
                  <span className="font-semibold text-white">{selectedTx.itemName}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">User ID Game:</span>
                  <span className="font-mono text-white">{selectedTx.gameUserId}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Metode Bayar:</span>
                  <span className="text-white">{selectedTx.paymentMethod}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Waktu:</span>
                  <span className="text-white">{selectedTx.createdAt}</span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between text-sm">
                  <span className="font-bold text-white">Total Bayar:</span>
                  <span className="font-extrabold text-cyan-400">
                    Rp {selectedTx.totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setSelectedTx(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition cursor-pointer"
                >
                  Tutup
                </button>
                <Link
                  href={`/game/${selectedTx.gameSlug}`}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center shadow-lg shadow-blue-600/30 transition"
                >
                  Beli Lagi
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function RiwayatPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs">Memuat riwayat transaksi...</p>
        </div>
      }
    >
      <RiwayatContent />
    </Suspense>
  );
}
