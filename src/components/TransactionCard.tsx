'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MockTransaction } from '@/data/mockOrders';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  CreditCard, 
  ArrowRight, 
  Copy, 
  Check, 
  FileText,
  Zap
} from 'lucide-react';
import TransactionStatusBadge from './TransactionStatusBadge';

interface TransactionCardProps {
  transaction: MockTransaction;
  onViewInvoice: (tx: MockTransaction) => void;
}

export default function TransactionCard({
  transaction,
  onViewInvoice,
}: TransactionCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(transaction.id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const isSuccess = transaction.status === 'berhasil';
  const isPending = transaction.status === 'pending';
  const isFailed = transaction.status === 'gagal';

  return (
    <div className="rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700 p-5 sm:p-6 transition-all duration-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5 group">
      {/* Left section */}
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={transaction.gameIcon}
            alt={transaction.gameName}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-slate-800 shrink-0 group-hover:scale-105 transition-transform"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
            {isSuccess && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            {isPending && <Clock className="w-3.5 h-3.5 text-amber-400" />}
            {isFailed && <XCircle className="w-3.5 h-3.5 text-red-400" />}
          </div>
        </div>

        <div>
          {/* Order ID & date */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <button
              onClick={handleCopyId}
              className="inline-flex items-center gap-1.5 font-mono font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-800 transition cursor-pointer"
              title="Salin Nomor Pesanan"
            >
              <span>{transaction.id}</span>
              {isCopied ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
            </button>
            <span className="text-[11px] text-slate-500">&bull;</span>
            <span className="text-[11px] text-slate-400">{transaction.createdAt}</span>
          </div>

          <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
            {transaction.itemName}
          </h3>

          <p className="text-xs text-slate-400 mt-0.5">
            {transaction.gameName} &bull; ID:{' '}
            <span className="text-slate-200 font-mono font-semibold">
              {transaction.gameUserId}
            </span>
            {transaction.serverId && <span> ({transaction.serverId})</span>}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-blue-400" />
              <span>{transaction.paymentMethod}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right section: Price & Actions */}
      <div className="flex sm:flex-col md:items-end justify-between md:justify-center pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80 gap-3">
        <div className="text-left md:text-right">
          <span className="text-[11px] text-slate-400 block">Total Tagihan</span>
          <span className="text-base sm:text-lg font-extrabold text-cyan-400">
            Rp {transaction.totalAmount.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Status badge */}
          <TransactionStatusBadge status={transaction.status} size="md" />

          {/* Action buttons */}
          {isPending ? (
            <Link
              href={`/pembayaran/${transaction.id}`}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition flex items-center gap-1"
            >
              <span>Bayar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              onClick={() => onViewInvoice(transaction)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Invoice</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
