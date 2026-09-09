'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  Edit2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Wallet,
  Building2,
  Store,
  QrCode,
  Sparkles,
  Sliders,
} from 'lucide-react';
import PaymentModal from '@/components/admin/PaymentModal';

const CATEGORY_ICONS: Record<string, any> = {
  QRIS: QrCode,
  'E-Wallet': Wallet,
  'Virtual Account': Building2,
  'Convenience Store': Store,
};

export default function AdminPaymentsPage() {
  const [methods, setMethods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<any | null>(null);

  // Toast / Feedback
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/payments');
      const json = await res.json();
      if (json.success) {
        setMethods(json.data);
      }
    } catch (e: any) {
      showToast('error', 'Gagal memuat metode pembayaran');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSavePayment = async (data: any) => {
    if (!editingMethod) return;
    const res = await fetch(`/api/admin/payments/${editingMethod.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);

    showToast('success', `Metode pembayaran '${data.name}' berhasil diperbarui!`);
    fetchPayments();
  };

  const handleToggleStatus = async (method: any) => {
    try {
      const nextStatus = !method.isActive;
      const res = await fetch(`/api/admin/payments/${method.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextStatus }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setMethods((prev) =>
        prev.map((m) => (m.id === method.id ? { ...m, isActive: nextStatus } : m))
      );
      showToast(
        'success',
        `${method.name} berhasil ${nextStatus ? 'Diaktifkan' : 'Dinonaktifkan'}`
      );
    } catch (e: any) {
      showToast('error', 'Gagal mengubah status metode pembayaran');
    }
  };

  const categories = ['Semua', 'QRIS', 'E-Wallet', 'Virtual Account', 'Convenience Store'];

  const filteredMethods = methods.filter((m) => {
    const matchesCategory = selectedCategory === 'Semua' || m.category === selectedCategory;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeCount = methods.filter((m) => m.isActive).length;

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
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
              <CreditCard className="w-5 h-5" />
            </span>
            Metode Pembayaran &amp; Biaya Admin
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Konfigurasi channel pembayaran, biaya admin fee, batas transaksi, dan panduan checkout
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchPayments}
            title="Refresh Data"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Total Channel Pembayaran</p>
            <p className="text-2xl font-black text-white mt-1">{methods.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Channel Aktif</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Channel Nonaktif</p>
            <p className="text-2xl font-black text-slate-400 mt-1">
              {methods.length - activeCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari channel pembayaran (QRIS, GoPay, BCA, dll)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-cyan-500 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none transition"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] || Sliders;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-950/60 text-slate-400 border border-slate-800/80 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Methods List */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">Memuat metode pembayaran...</span>
        </div>
      ) : filteredMethods.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="font-bold text-white text-base">Tidak ada metode pembayaran ditemukan</p>
          <p className="text-slate-400 text-xs mt-1">Coba ganti filter atau kata kunci pencarian</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMethods.map((method) => {
            const CategoryIcon = CATEGORY_ICONS[method.category] || CreditCard;
            return (
              <div
                key={method.id}
                className={`p-4 sm:p-5 rounded-2xl bg-slate-900/90 border transition-all duration-200 flex flex-col justify-between ${
                  method.isActive
                    ? 'border-slate-800 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/5'
                    : 'border-slate-800/50 opacity-60 bg-slate-950/70'
                }`}
              >
                <div className="space-y-3.5">
                  {/* Top Header: Logo / Icon & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md shrink-0">
                        {method.iconUrl ? (
                          <img
                            src={method.iconUrl}
                            alt={method.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <CategoryIcon className="w-6 h-6 text-slate-800" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm line-clamp-1">{method.name}</h3>
                        <span className="inline-flex items-center gap-1 text-[11px] text-cyan-400 font-medium">
                          <CategoryIcon className="w-3 h-3" />
                          {method.category}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        method.isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {method.isActive ? 'Aktif' : 'Off'}
                    </span>
                  </div>

                  {/* Pricing and Limits Box */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Biaya Admin:</span>
                      <span
                        className={`font-black ${
                          method.adminFee === 0 ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {method.adminFee === 0
                          ? 'GRATIS (Rp 0)'
                          : `Rp ${Number(method.adminFee).toLocaleString('id-ID')}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Limit Transaksi:</span>
                      <span className="text-slate-300 font-medium">
                        Rp {Number(method.minAmount).toLocaleString('id-ID')} - Rp{' '}
                        {Number(method.maxAmount).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Panduan Bayar:</span>
                      <span className="text-slate-300 font-medium">
                        {method.instructions?.length || 0} Langkah Tersedia
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(method.isActive)}
                      onChange={() => handleToggleStatus(method)}
                      className="w-4 h-4 rounded text-cyan-500 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-400 hover:text-white transition">
                      {method.isActive ? 'Aktif di Web' : 'Dinonaktifkan'}
                    </span>
                  </label>

                  <button
                    onClick={() => {
                      setEditingMethod(method);
                      setIsModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Fee</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        paymentMethod={editingMethod}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMethod(null);
        }}
        onSave={handleSavePayment}
      />
    </div>
  );
}
