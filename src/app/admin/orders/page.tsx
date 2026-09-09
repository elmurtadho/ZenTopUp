'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Eye,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  DollarSign,
  Gamepad2,
} from 'lucide-react';
import OrderDetailModal from '@/components/admin/OrderDetailModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Delete target
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast / Feedback
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/orders');
      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
      }
    } catch (e: any) {
      showToast('error', 'Gagal memuat data transaksi pesanan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev: any) => (prev ? { ...prev, status: newStatus } : null));
      }

      showToast('success', `Status pesanan #${orderId} diubah menjadi '${newStatus}'!`);
    } catch (err: any) {
      showToast('error', err.message || 'Gagal mengubah status pesanan');
    }
  };

  const handleDeleteOrder = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/orders/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      showToast('success', `Pesanan #${deleteTarget.id} berhasil dihapus.`);
      setDeleteTarget(null);
      fetchOrders();
    } catch (err: any) {
      showToast('error', err.message || 'Gagal menghapus pesanan');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    let matchesStatus = true;
    if (statusFilter === 'menunggu') {
      matchesStatus = order.status === 'pending' || order.status === 'menunggu';
    } else if (statusFilter !== 'semua') {
      matchesStatus = order.status === statusFilter;
    }

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.id.toLowerCase().includes(q) ||
      (order.gameName && order.gameName.toLowerCase().includes(q)) ||
      (order.itemName && order.itemName.toLowerCase().includes(q)) ||
      (order.gameUserId && order.gameUserId.toLowerCase().includes(q)) ||
      (order.whatsapp && order.whatsapp.includes(q));

    return matchesStatus && matchesSearch;
  });

  // Calculate Metrics
  const totalRevenue = orders
    .filter((o) => o.status === 'berhasil')
    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  const pendingCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'menunggu'
  ).length;

  const processingCount = orders.filter((o) => o.status === 'diproses').length;
  const successCount = orders.filter((o) => o.status === 'berhasil').length;

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'berhasil':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Berhasil
          </span>
        );
      case 'diproses':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Clock className="w-3 h-3 text-blue-400 animate-spin" />
            Diproses
          </span>
        );
      case 'gagal':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/10 border border-red-500/30 text-red-400">
            <XCircle className="w-3 h-3 text-red-400" />
            Gagal
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            Menunggu
          </span>
        );
    }
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
              <ShoppingBag className="w-5 h-5" />
            </span>
            Pesanan &amp; Transaksi
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Pantau pesanan masuk secara real-time, ubah status pesanan, dan kelola data transaksi pemain
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchOrders}
            title="Refresh Data"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Total Transaksi</p>
            <p className="text-2xl font-black text-white mt-1">{orders.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Transaksi Berhasil</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{successCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Sedang Diproses</p>
            <p className="text-2xl font-black text-blue-400 mt-1">{processingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Total Omset Sukses</p>
            <p className="text-xl font-black text-amber-400 mt-1">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
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
              placeholder="Cari ID Pesanan, Game, User ID Pemain, atau No WhatsApp..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-emerald-500 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none transition"
            />
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { key: 'semua', label: `Semua (${orders.length})` },
            { key: 'menunggu', label: `Menunggu (${pendingCount})` },
            { key: 'diproses', label: `Diproses (${processingCount})` },
            { key: 'berhasil', label: `Berhasil (${successCount})` },
            {
              key: 'gagal',
              label: `Gagal (${orders.filter((o) => o.status === 'gagal').length})`,
            },
          ].map((st) => (
            <button
              key={st.key}
              onClick={() => setStatusFilter(st.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                statusFilter === st.key
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 border border-slate-800/80 hover:text-white hover:border-slate-700'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">Memuat daftar transaksi pesanan...</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="font-bold text-white text-base">Tidak ada transaksi ditemukan</p>
          <p className="text-slate-400 text-xs mt-1">Coba sesuaikan filter status atau pencarian Anda</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">ID Pesanan</th>
                <th className="py-3 px-4">Game &amp; Item</th>
                <th className="py-3 px-4">Akun Pemain</th>
                <th className="py-3 px-4">Total &amp; Bayar</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredOrders.map((order) => {
                const cleanWa = order.whatsapp?.replace(/\D/g, '') || '';
                const waNumber = cleanWa.startsWith('0') ? '62' + cleanWa.slice(1) : cleanWa;

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-800/40 transition duration-150 group"
                  >
                    {/* Order ID */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-white">{order.id}</span>
                        <button
                          onClick={() => handleCopy(order.id)}
                          className="text-slate-500 hover:text-white transition cursor-pointer"
                          title="Salin ID Pesanan"
                        >
                          {copiedId === order.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Game & Item */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {order.gameIcon ? (
                          <img
                            src={order.gameIcon}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover bg-slate-800 border border-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                            <Gamepad2 className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white leading-tight">
                            {order.gameName || 'Game #' + order.gameId}
                          </p>
                          <p className="text-[11px] text-amber-400 font-medium">
                            {order.itemName || 'Item #' + order.itemId}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* User ID & WA */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-mono text-slate-200">
                          ID: <span className="font-bold text-white">{order.gameUserId}</span>
                          {order.serverId && (
                            <span className="text-slate-400 ml-1">({order.serverId})</span>
                          )}
                        </div>
                        {order.whatsapp && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-slate-400 font-mono">
                              {order.whatsapp}
                            </span>
                            <a
                              href={`https://wa.me/${waNumber}?text=Halo%20kak,%20ini%20admin%20TokoGem%20mengenai%20pesanan%20${order.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 hover:text-emerald-300"
                              title="Chat WhatsApp"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Total Amount & Payment */}
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-black text-amber-400">
                          Rp {Number(order.totalAmount || 0).toLocaleString('id-ID')}
                        </p>
                        <span className="inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-medium text-slate-300 uppercase mt-0.5">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </td>

                    {/* Status with Quick Dropdown */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {renderStatusBadge(order.status)}
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          className="p-1 text-[11px] rounded bg-slate-900 border border-slate-700 text-slate-300 outline-none cursor-pointer opacity-80 group-hover:opacity-100 transition"
                        >
                          <option value="pending">Pending</option>
                          <option value="menunggu">Menunggu</option>
                          <option value="diproses">Diproses</option>
                          <option value="berhasil">Berhasil</option>
                          <option value="gagal">Gagal</option>
                        </select>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '-'}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition cursor-pointer"
                          title="Lihat Detail Pesanan"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteTarget({
                              id: order.id,
                              name: `Pesanan #${order.id} (${order.gameName || 'Game'})`,
                            })
                          }
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition cursor-pointer"
                          title="Hapus Pesanan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      <OrderDetailModal
        isOpen={isDetailOpen}
        order={selectedOrder}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedOrder(null);
        }}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Hapus Data Pesanan"
        message={`Apakah Anda yakin ingin menghapus data ${deleteTarget?.name}? Data riwayat transaksi ini akan dihapus secara permanen.`}
        isDeleting={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteOrder}
      />
    </div>
  );
}
