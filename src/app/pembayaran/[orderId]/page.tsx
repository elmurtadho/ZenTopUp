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
  Zap,
  Loader2,
} from 'lucide-react';
import PaymentBillingSummary from '@/components/PaymentBillingSummary';
import { MOCK_PAYMENT_METHODS } from '@/data/mockPayments';
import PaymentInstructions from '@/components/PaymentInstructions';
import SandboxPaymentBar, { OrderStatus } from '@/components/SandboxPaymentBar';
import { useToast } from '@/context/ToastContext';

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default function PaymentPage({ params }: PageProps) {
  const { orderId } = use(params);
  const router = useRouter();
  const { success, error, info, processing, warning } = useToast();

  // Timer: 15 minutes countdown
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('pending');
  const [isChecking, setIsChecking] = useState(false);
  const [checkAttempts, setCheckAttempts] = useState(0);
  const [checkMessage, setCheckMessage] = useState<string | null>(null);

  // Live order details
  const [orderData, setOrderData] = useState<{
    gameName: string;
    itemName: string;
    totalAmount: number;
    paymentMethod: string;
    externalRef: string;
    gameUserId?: string;
    serverId?: string;
  }>({
    gameName: 'Mobile Legends: Bang Bang',
    itemName: 'Weekly Diamond Pass',
    totalAmount: 79000,
    paymentMethod: 'BCA Virtual Account',
    externalRef: '8801' + orderId.replace(/\D/g, '').padEnd(10, '7'),
  });

  // Fetch real order status from DB
  useEffect(() => {
    async function loadOrderStatus() {
      try {
        const res = await fetch(`/api/orders/${orderId}/status`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const d = json.data;
            setOrderData((prev) => ({
              ...prev,
              gameName: d.game || prev.gameName,
              itemName: d.item || prev.itemName,
              totalAmount: d.totalAmount || prev.totalAmount,
              paymentMethod: d.paymentMethod || prev.paymentMethod,
              externalRef: d.externalRef || prev.externalRef,
              gameUserId: d.gameUserId,
              serverId: d.serverId,
            }));

            if (d.status === 'berhasil') {
              setCurrentStatus('berhasil');
            } else if (d.status === 'gagal') {
              setCurrentStatus('gagal');
            } else if (d.status === 'diproses') {
              setCurrentStatus('diproses');
            }
          }
        }
      } catch (err) {
        console.error('Error fetching order status:', err);
      }
    }
    loadOrderStatus();
  }, [orderId]);

  // Countdown timer effect
  useEffect(() => {
    if (currentStatus === 'berhasil' || currentStatus === 'gagal') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCurrentStatus('gagal');
          warning('Batas Waktu Pembayaran Habis', 'Pesanan telah otomatis dibatalkan.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStatus, warning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(label);
    info('Tersalin!', `${label === 'amount' ? 'Nominal pembayaran' : 'Kode/VA'} berhasil disalin ke clipboard.`);
    setTimeout(() => setIsCopied(null), 2000);
  };

  // Sandbox status handler
  const handleSandboxStatusChange = (newStatus: OrderStatus) => {
    setCurrentStatus(newStatus);
    if (newStatus === 'berhasil') {
      setTimeout(() => {
        router.push(`/konfirmasi/${orderId}?status=success`);
      }, 1200);
    } else if (newStatus === 'gagal') {
      setTimeout(() => {
        router.push(`/konfirmasi/${orderId}?status=failed`);
      }, 1200);
    } else if (newStatus === 'pending') {
      setTimeLeft(15 * 60);
    }
  };

  // Check Status button handler
  const handleCheckStatus = useCallback(async () => {
    if (isChecking) return;
    setIsChecking(true);
    setCheckMessage(null);
    const attempt = checkAttempts + 1;
    setCheckAttempts(attempt);

    try {
      const res = await fetch(`/api/orders/${orderId}/status`);
      const json = await res.json();
      const statusFromDb = json.data?.status;

      setIsChecking(false);

      if (statusFromDb === 'berhasil' || currentStatus === 'berhasil') {
        setCurrentStatus('berhasil');
        success(
          'Pembayaran Berhasil Terverifikasi!',
          `Transaksi ${orderId} terdeteksi sukses. Mengalihkan ke invoice...`
        );
        setTimeout(() => {
          router.push(`/konfirmasi/${orderId}?status=success`);
        }, 1000);
      } else if (statusFromDb === 'gagal' || currentStatus === 'gagal') {
        setCurrentStatus('gagal');
        error('Pembayaran Gagal', 'Pesanan telah dibatalkan atau ditolak.');
        setTimeout(() => {
          router.push(`/konfirmasi/${orderId}?status=failed`);
        }, 1000);
      } else if (statusFromDb === 'diproses' || currentStatus === 'diproses') {
        setCurrentStatus('diproses');
        processing(
          'Pesanan Sedang Diproses',
          'Pembayaran telah masuk dan item sedang dalam proses pengiriman.'
        );
      } else {
        // Still pending
        setCheckMessage(`Pembayaran belum terdeteksi (percobaan ke-${attempt}). Selesaikan transfer Anda sebelum batas waktu.`);
        info(
          'Menunggu Pembayaran',
          `Belum ada mutasi masuk untuk ${orderId}. Anda juga dapat menguji menggunakan tombol Sandbox di atas.`
        );
      }
    } catch {
      setIsChecking(false);
      setCheckMessage('Gagal menghubungi server. Periksa koneksi Anda.');
    }
  }, [isChecking, checkAttempts, orderId, currentStatus, router, success, error, processing, info]);

  // Payment method object matching
  const matchedMethod = MOCK_PAYMENT_METHODS.find(
    (m) => m.name.toLowerCase() === orderData.paymentMethod.toLowerCase() || m.id.toLowerCase() === orderData.paymentMethod.toLowerCase()
  ) ?? MOCK_PAYMENT_METHODS[0];

  const timeColor = timeLeft < 60 ? 'text-red-400' : timeLeft < 300 ? 'text-amber-400' : 'text-cyan-400';

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <span className="text-xs text-slate-400 font-mono">
            ID: <strong className="text-white">{orderId}</strong>
          </span>
        </div>

        {/* SANDBOX TESTING SIMULATOR BAR */}
        <SandboxPaymentBar
          orderId={orderId}
          currentStatus={currentStatus}
          onStatusChange={handleSandboxStatusChange}
          onExpireTimer={() => setTimeLeft(0)}
          totalAmount={orderData.totalAmount}
          gameName={orderData.gameName}
          itemName={orderData.itemName}
        />

        {currentStatus === 'berhasil' ? (
          /* Payment Success View */
          <div className="rounded-3xl bg-slate-900 border border-emerald-500/40 p-8 text-center space-y-6 shadow-2xl animate-in fade-in duration-300">
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
                Item <strong className="text-white">{orderData.itemName}</strong> telah otomatis ditambahkan ke akun game kamu. Terima kasih telah menggunakan TokoGem!
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs max-w-md mx-auto space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Nomor Pesanan:</span>
                <span className="font-mono font-bold text-white">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Game / Item:</span>
                <span className="font-semibold text-white">{orderData.gameName} — {orderData.itemName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status Pengiriman:</span>
                <span className="text-emerald-400 font-bold">100% SUKSES MASUK</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Dibayar:</span>
                <span className="text-cyan-400 font-bold">Rp {orderData.totalAmount.toLocaleString('id-ID')}</span>
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
                href={`/konfirmasi/${orderId}?status=success`}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-1.5"
              >
                <span>Buka Invoice Resmi</span>
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
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                    currentStatus === 'diproses'
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {currentStatus === 'diproses' ? (
                      <>
                        <Zap className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                        <span>Pesanan Sedang Diproses</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5" />
                        <span>Menunggu Pembayaran</span>
                      </>
                    )}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    {currentStatus === 'diproses' ? 'Pembayaran Sedang Diverifikasi' : 'Selesaikan Pembayaran Kamu'}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    No. Pesanan: <strong className="font-mono text-slate-200">{orderId}</strong> &bull; {orderData.gameName} ({orderData.itemName})
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
                    {timeLeft === 0 ? 'Waktu habis, pesanan dibatalkan' : 'menit tersisa'}
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
                    <span className="font-bold text-sm text-white">{orderData.paymentMethod}</span>
                  </div>
                </div>

                {/* Total amount */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-400 block">Total yang Harus Dibayar</span>
                    <span className="text-xl sm:text-2xl font-extrabold text-cyan-400">
                      Rp {orderData.totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(orderData.totalAmount.toString(), 'amount')}
                    className="w-full sm:w-auto justify-center px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition cursor-pointer"
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
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-400 block">Nomor Kode / Virtual Account</span>
                    <span className="text-base sm:text-lg font-mono font-bold text-white tracking-wider break-all">
                      {orderData.externalRef}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(orderData.externalRef, 'va')}
                    className="w-full sm:w-auto justify-center px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition cursor-pointer"
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
                <PaymentInstructions paymentMethod={matchedMethod} />

                {/* Billing Summary */}
                <PaymentBillingSummary
                  orderId={orderId}
                  gameName={orderData.gameName}
                  itemName={orderData.itemName}
                  itemPrice={Math.max(0, orderData.totalAmount - (matchedMethod.adminFee || 0))}
                  paymentMethod={matchedMethod}
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

                <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Transaksi dijamin 100% aman &amp; instan oleh TokoGem</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
