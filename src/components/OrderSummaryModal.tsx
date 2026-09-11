'use client';

import React from 'react';
import { Game, GameItem, PaymentMethod, Promo } from '@/types';
import { 
  ShieldCheck, 
  Lock, 
  X, 
  Smartphone, 
  Gamepad2, 
  CreditCard, 
  Tag, 
  Sparkles, 
  CheckCircle, 
  ArrowRight,
  Receipt
} from 'lucide-react';

interface OrderSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (testMode?: 'pending' | 'berhasil' | 'gagal') => void;
  isProcessing: boolean;
  game: Game;
  item: GameItem | null;
  payment: PaymentMethod | null;
  userId: string;
  serverId?: string;
  whatsapp: string;
  promo: Promo | null;
  itemPrice: number;
  discountAmount: number;
  adminFee: number;
  totalPrice: number;
}

export default function OrderSummaryModal({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  game,
  item,
  payment,
  userId,
  serverId,
  whatsapp,
  promo,
  itemPrice,
  discountAmount,
  adminFee,
  totalPrice,
}: OrderSummaryModalProps) {
  const [testMode, setTestMode] = React.useState<'pending' | 'berhasil' | 'gagal'>('pending');

  if (!isOpen || !item || !payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md transition-all overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 sm:space-y-6 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">Ringkasan Pesanan</h3>
              <p className="text-xs text-slate-400">Periksa detail transaksi kamu sebelum membayar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game & Player Details Box */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={game.iconUrl || game.bannerUrl}
              alt={game.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
            />
            <div>
              <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
                {game.category}
              </span>
              <h4 className="font-bold text-white text-sm">{game.name}</h4>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">User ID:</span>
              <span className="font-mono font-bold text-cyan-300">{userId}</span>
            </div>
            {serverId && (
              <div>
                <span className="text-slate-400 block text-[11px]">Server / Zone:</span>
                <span className="font-mono font-bold text-white">{serverId}</span>
              </div>
            )}
            <div>
              <span className="text-slate-400 block text-[11px]">Item Pesanan:</span>
              <span className="font-bold text-white">{item.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">No. WhatsApp:</span>
              <span className="font-mono font-bold text-slate-200">{whatsapp}</span>
            </div>
          </div>
        </div>

        {/* Payment & Price Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span>Metode Bayar:</span>
            <span className="font-bold text-white flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-blue-400" />
              {payment.name}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span>Harga Item ({item.name}):</span>
            <span>Rp {itemPrice.toLocaleString('id-ID')}</span>
          </div>

          {discountAmount > 0 && promo && (
            <div className="flex items-center justify-between text-emerald-400">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Voucher ({promo.code}):
              </span>
              <span>-Rp {discountAmount.toLocaleString('id-ID')}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-slate-400">
            <span>Biaya Layanan / Admin:</span>
            <span>{adminFee > 0 ? `Rp ${adminFee.toLocaleString('id-ID')}` : 'Gratis'}</span>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-sm">
            <span className="font-bold text-white">Total Tagihan:</span>
            <span className="font-extrabold text-cyan-400 text-base">
              Rp {totalPrice.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Sandbox Test Mode Selector */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
              <span>🧪</span>
              <span>Mode Pengujian (Sandbox Mode):</span>
            </span>
            <span className="text-[10px] text-indigo-400 font-mono font-bold">DEV TESTING</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setTestMode('pending')}
              className={`py-2 px-1.5 rounded-xl text-[10px] font-bold border transition text-center cursor-pointer ${
                testMode === 'pending'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/70 shadow-sm'
                  : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              ⏳ Menunggu Bayar
            </button>
            <button
              type="button"
              onClick={() => setTestMode('berhasil')}
              className={`py-2 px-1.5 rounded-xl text-[10px] font-bold border transition text-center cursor-pointer ${
                testMode === 'berhasil'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/70 shadow-sm'
                  : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              🟢 Auto-Berhasil
            </button>
            <button
              type="button"
              onClick={() => setTestMode('gagal')}
              className={`py-2 px-1.5 rounded-xl text-[10px] font-bold border transition text-center cursor-pointer ${
                testMode === 'gagal'
                  ? 'bg-red-500/20 text-red-300 border-red-500/70 shadow-sm'
                  : 'bg-slate-900/70 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              🔴 Simulasi Gagal
            </button>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Garansi 100% Saldo Masuk &bull; Enkripsi SSL 256-bit</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            disabled={isProcessing}
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
          >
            Ubah Data
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => onConfirm(testMode)}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Memproses Pesanan...
              </span>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Bayar Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
