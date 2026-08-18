'use client';

import React, { useState, useEffect, use, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, 
  Clock, 
  Copy, 
  Check, 
  CreditCard, 
  ShieldCheck, 
  ArrowLeft, 
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import PaymentBillingSummary from '@/components/PaymentBillingSummary';
import { MOCK_PAYMENT_METHODS } from '@/data/mockPayments';
import PaymentInstructions from '@/components/PaymentInstructions';

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default function PaymentPage({ params }: PageProps) {
  const { orderId } = use(params);
  const router = useRouter();

  // Timer: 15 minutes countdown
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'menunggu' | 'berhasil'>('menunggu');
  const [isChecking, setIsChecking] = useState(false);
  const [checkAttempts, setCheckAttempts] = useState(0);
  const [checkMessage, setCheckMessage] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(label);
    setTimeout(() => setIsCopied(null), 2000);
  };

  const handleCheckStatus = useCallback(() => {
    if (isChecking) return;
    setIsChecking(true);
    setCheckMessage(null);
    const attempt = checkAttempts + 1;
    setCheckAttempts(attempt);

    setTimeout(() => {
      setIsChecking(false);
      // Simulate: succeed on 1st attempt for demo purposes
      if (attempt >= 1) {
        setIsConfirmed(true);
        setPaymentStatus('berhasil');
        setCheckMessage(null);
        // Redirect to confirmation page after short delay
        setTimeout(() => {
          router.push(`/konfirmasi/${orderId}?status=success`);
        }, 1000);
      } else {
        setCheckMessage(`Belum terdeteksi (percobaan ke-${attempt}). Coba lagi setelah menyelesaikan pembayaran.`);
      }
    }, 1800);
  }, [isChecking, checkAttempts, orderId, router]);

  // Mock payment details — default to BCA VA
  const defaultMethod = MOCK_PAYMENT_METHODS.find((m) => m.id === 'bca-va') ?? MOCK_PAYMENT_METHODS[0];
  const vaNumber = '8801' + orderId.replace(/\D/g, '').padEnd(10, '7');
  const totalAmount = 79000;

  const timeColor = timeLeft < 60 ? 'text-red-400' : timeLeft < 300 ? 'text-amber-400' : 'text-amber-400';

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {paymentStatus === 'berhasil' ? (
          /* Payment Success View */
          <div className="rounded-3xl bg-slate-900 border border-emerald-500/40 p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase">
                Transaksi Berhasil
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                Pembayaran Sukses &amp; Item Terkirim!
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto">
                Item top up telah otomatis ditambahkan ke akun game kamu. Terima kasih telah menggunakan ZenTopUp!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs max-w-md mx-auto space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Nomor Pesanan:</span>
                <span className="font-mono font-bold text-white">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Pengiriman:</span>
                <span className="text-emerald-400 font-bold">100% SUKSES MASUK</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Waktu Transaksi:</span>
                <span className="text-white">{new Date().toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Link
                href="/"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
              >
                Kembali ke Beranda
              </Link>
              <Link
                href="/"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition"
              >
                Top Up Game Lainnya
              </Link>
            </div>
          </div>
        ) : (
          /* Awaiting Payment View */
          <div className="space-y-5">
            
            {/* Header Status Card */}
            <div className="rounded-3xl bg-[#111827] border border-slate-800 p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Menunggu Pembayaran</span>
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    Selesaikan Pembayaran Kamu
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    No. Pesanan: <strong className="font-mono text-slate-200">{orderId}</strong>
                  </p>
                </div>

                {/* Countdown Timer */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center min-w-[150px]">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                    Batas Waktu Bayar
                  </span>
                  <span className={`text-3xl font-extrabold font-mono ${timeColor}`}>
                    {formatTime(timeLeft)}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {timeLeft === 0 ? 'Waktu habis, buat pesanan baru' : 'menit tersisa'}
                  </p>
                </div>
              </div>

              {/* Payment details box */}
              <div className="pt-6 space-y-4">
                {/* Payment method info */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Metode Pembayaran</span>
                    <span className="font-bold text-sm text-white">{defaultMethod.name}</span>
                  </div>
                </div>

                {/* Total amount */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Total yang Harus Dibayar</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-cyan-400">
                      Rp {totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(totalAmount.toString(), 'amount')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {isCopied === 'amount' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Nominal</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Virtual Account / Payment Code */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Nomor Kode / Virtual Account</span>
                    <span className="text-base sm:text-lg font-mono font-bold text-white tracking-wider">
                      {vaNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(vaNumber, 'va')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {isCopied === 'va' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Kode</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Step-by-step instructions per payment method */}
                <PaymentInstructions paymentMethod={defaultMethod} />

                {/* Billing Summary */}
                <PaymentBillingSummary
                  orderId={orderId}
                  gameName="Mobile Legends: Bang Bang"
                  itemName="Weekly Diamond Pass"
                  itemPrice={totalAmount - defaultMethod.adminFee}
                  paymentMethod={defaultMethod}
                  promo={null}
                  discountAmount={0}
                />

                {/* Check Status Button */}
                <button
                  type="button"
                  disabled={isChecking || timeLeft === 0}
                  onClick={handleCheckStatus}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                  <span>
                    {isChecking
                      ? 'Sedang Memeriksa Pembayaran...'
                      : isConfirmed
                      ? 'Pembayaran Terverifikasi! Mengalihkan...'
                      : 'Cek Status Pembayaran Sekarang'}
                  </span>
                </button>

                {/* Check feedback */}
                {checkMessage && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-xs text-amber-300">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{checkMessage}</span>
                  </div>
                )}

                {isConfirmed && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Pembayaran berhasil dikonfirmasi! Mengalihkan ke halaman konfirmasi...</span>
                  </div>
                )}

                <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Transaksi dijamin 100% aman &amp; instan oleh ZenTopUp</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
