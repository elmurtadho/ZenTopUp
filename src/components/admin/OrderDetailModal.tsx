'use client';

import React from 'react';
import {
  X,
  Receipt,
  Gamepad2,
  User,
  Phone,
  CreditCard,
  Tag,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

interface OrderDetailModalProps {
  isOpen: boolean;
  order: any | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: string) => Promise<void>;
}

export default function OrderDetailModal({
  isOpen,
  order,
  onClose,
  onUpdateStatus,
}: OrderDetailModalProps) {
  const [copied, setCopied] = React.useState<string | null>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  if (!isOpen || !order) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const cleanWa = order.whatsapp.replace(/\D/g, '');
  const waNumber = cleanWa.startsWith('0') ? '62' + cleanWa.slice(1) : cleanWa;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'berhasil':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Berhasil (Sukses)
          </span>
        );
      case 'diproses':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 border border-blue-500/30 text-blue-300">
            <Clock className="w-3.5 h-3.5 text-blue-400 animate-spin" />
            Sedang Diproses
          </span>
        );
      case 'gagal':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 border border-red-500/30 text-red-300">
            <XCircle className="w-3.5 h-3.5 text-red-400" />
            Gagal / Dibatalkan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            Menunggu Pembayaran
          </span>
        );
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      await onUpdateStatus(order.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto my-auto text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Detail Pesanan</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-slate-400">{order.id}</span>
                <button
                  onClick={() => handleCopy(order.id, 'id')}
                  className="text-slate-500 hover:text-white transition"
                  title="Salin ID Pesanan"
                >
                  {copied === 'id' ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status and Timestamp */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Status Saat Ini</span>
            {getStatusBadge(order.status)}
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block mb-1">Waktu Pesanan</span>
            <span className="font-mono text-slate-300">
              {order.createdAt ? new Date(order.createdAt).toLocaleString('id-ID') : '-'}
            </span>
          </div>
        </div>

        {/* Quick Status Updater */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-300 block">Ubah Status Pesanan:</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { key: 'menunggu', label: 'Menunggu', color: 'hover:bg-amber-500/20 text-amber-400' },
              { key: 'diproses', label: 'Diproses', color: 'hover:bg-blue-500/20 text-blue-400' },
              { key: 'berhasil', label: 'Berhasil', color: 'hover:bg-emerald-500/20 text-emerald-400' },
              { key: 'gagal', label: 'Gagal', color: 'hover:bg-red-500/20 text-red-400' },
            ].map((st) => (
              <button
                key={st.key}
                disabled={isUpdating || order.status === st.key}
                onClick={() => handleStatusChange(st.key)}
                className={`py-2 px-1 rounded-xl text-center font-bold border transition cursor-pointer text-[11px] ${
                  order.status === st.key
                    ? 'bg-slate-800 border-slate-600 text-white shadow-inner ring-1 ring-white/20'
                    : `bg-slate-900 border-slate-800 ${st.color}`
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product & Game Details */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
          <h4 className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
            <Gamepad2 className="w-4 h-4 text-blue-400" />
            Produk &amp; Game
          </h4>
          <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400">Game:</span>
            <span className="font-semibold text-white">{order.gameName || 'Game #' + order.gameId}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400">Item / Nominal:</span>
            <span className="font-bold text-amber-400">{order.itemName || 'Item #' + order.itemId}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400">Harga Produk:</span>
            <span className="font-medium text-slate-200">
              Rp {Number(order.itemPrice || 0).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Player Account Details */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
          <h4 className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
            <User className="w-4 h-4 text-cyan-400" />
            Data Akun Pemain
          </h4>
          <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
            <span className="text-slate-400">User ID:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-white">{order.gameUserId}</span>
              <button
                onClick={() => handleCopy(order.gameUserId, 'userid')}
                className="text-slate-500 hover:text-white"
                title="Salin User ID"
              >
                {copied === 'userid' ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          {order.serverId && (
            <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Zone / Server ID:</span>
              <span className="font-mono font-bold text-white">{order.serverId}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-400" />
              WhatsApp:
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-200">{order.whatsapp}</span>
              <a
                href={`https://wa.me/${waNumber}?text=Halo%20kak,%20ini%20admin%20TokoGem%20mengenai%20pesanan%20${order.id}`}
                target="_blank"
                rel="noreferrer"
                className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 font-semibold flex items-center gap-1 text-[11px] transition"
              >
                Chat WA
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Payment & Invoice Breakdown */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <h4 className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-amber-400" />
            Rincian Pembayaran
          </h4>
          <div className="flex items-center justify-between text-slate-400">
            <span>Metode Bayar:</span>
            <span className="font-bold text-white uppercase">{order.paymentMethod}</span>
          </div>
          {order.promoCode && (
            <div className="flex items-center justify-between text-emerald-400">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Kupon ({order.promoCode}):
              </span>
              <span>- Rp {Number(order.discountAmount || 0).toLocaleString('id-ID')}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-slate-400">
            <span>Biaya Layanan/Admin:</span>
            <span>+ Rp {Number(order.adminFee || 0).toLocaleString('id-ID')}</span>
          </div>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="font-bold text-white text-sm">Total Bayar:</span>
            <span className="font-black text-amber-400 text-base">
              Rp {Number(order.totalAmount || 0).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
