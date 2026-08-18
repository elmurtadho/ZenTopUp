'use client';

import React, { useState, use, useMemo } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_GAMES, MOCK_PROMOS } from '@/data/mockGames';
import { MOCK_PAYMENT_METHODS } from '@/data/mockPayments';
import { GameItem, PaymentMethod, Promo } from '@/types';
import { 
  Zap, 
  ShieldCheck, 
  HelpCircle, 
  ChevronRight, 
  Check, 
  Flame, 
  Tag, 
  AlertCircle, 
  CreditCard, 
  UserCheck, 
  Smartphone, 
  Info,
  ArrowLeft,
  Lock,
  Sparkles
} from 'lucide-react';
import ItemSelector from '@/components/ItemSelector';
import PlayerIdForm from '@/components/PlayerIdForm';
import PaymentMethodSelector from '@/components/PaymentMethodSelector';
import OrderSummaryModal from '@/components/OrderSummaryModal';
import PromoForm from '@/components/PromoForm';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function GameDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const router = useRouter();

  // Find game
  const game = MOCK_GAMES.find((g) => g.slug === slug);
  if (!game) {
    notFound();
  }

  // Form State
  const [userId, setUserId] = useState('');
  const [serverId, setServerId] = useState(game.serverList ? game.serverList[0] : '');
  const [selectedItem, setSelectedItem] = useState<GameItem | null>(game.items?.[2] || game.items?.[0] || null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(MOCK_PAYMENT_METHODS[0]);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<Promo | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState('');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Price calculations
  const itemPrice = selectedItem?.price || 0;
  
  const discountAmount = useMemo(() => {
    if (!appliedPromo || !selectedItem) return 0;
    if (itemPrice < appliedPromo.minPurchase) return 0;

    if (appliedPromo.discountType === 'percent') {
      const calc = (itemPrice * appliedPromo.amount) / 100;
      return appliedPromo.maxDiscount ? Math.min(calc, appliedPromo.maxDiscount) : calc;
    }
    return Math.min(appliedPromo.amount, itemPrice);
  }, [appliedPromo, selectedItem, itemPrice]);

  const adminFee = selectedPayment?.adminFee || 0;
  const totalPrice = Math.max(0, itemPrice - discountAmount) + adminFee;

  const handleApplyPromo = (codeToApply?: string) => {
    const code = (codeToApply || promoCodeInput).trim().toUpperCase();
    setPromoError(null);

    if (!code) {
      setPromoError('Masukkan kode promo terlebih dahulu');
      return;
    }

    const found = MOCK_PROMOS.find(
      (p) => p.code.toUpperCase() === code && p.isActive
    );

    if (!found) {
      setPromoError('Kode promo tidak valid atau telah berakhir');
      setAppliedPromo(null);
      return;
    }

    if (found.gameSlug && found.gameSlug !== game.slug) {
      setPromoError(`Kode promo ini khusus untuk game ${found.gameSlug}`);
      return;
    }

    if (itemPrice < found.minPurchase) {
      setPromoError(`Minimal pembelian untuk promo ini adalah Rp ${found.minPurchase.toLocaleString('id-ID')}`);
      return;
    }

    setAppliedPromo(found);
    setPromoCodeInput(found.code);
  };

  // Form error states
  const [formErrors, setFormErrors] = useState<{
    userId?: string;
    server?: string;
    item?: string;
    payment?: string;
    whatsapp?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: typeof formErrors = {};
    const trimmedId = userId.trim();
    
    if (!trimmedId) {
      errors.userId = 'User ID game wajib diisi';
    } else if (game.slug === 'valorant' && !trimmedId.includes('#')) {
      errors.userId = 'Riot ID harus memiliki tanda pagar (contoh: TenZ#NA1)';
    } else if (trimmedId.length < 3) {
      errors.userId = 'User ID terlalu pendek';
    }

    if (game.serverRequired) {
      if (!serverId || !serverId.trim()) {
        errors.server = 'Server ID / Zone ID wajib dipilih atau diisi';
      }
    }

    if (!selectedItem) {
      errors.item = 'Silakan pilih nominal item yang ingin dibeli';
    }

    if (!selectedPayment) {
      errors.payment = 'Silakan pilih metode pembayaran';
    }

    const trimmedWa = whatsapp.trim().replace(/[-\s]/g, '');
    if (!trimmedWa) {
      errors.whatsapp = 'Nomor WhatsApp wajib diisi untuk bukti transaksi';
    } else if (!/^(08|628|\+628)[0-9]{8,13}$/.test(trimmedWa)) {
      errors.whatsapp = 'Format nomor WhatsApp tidak valid (contoh: 081234567890)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Smooth scroll to first error
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }
    setShowSummaryModal(true);
  };

  const handleConfirmOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSummaryModal(false);
      const mockOrderId = 'ZEN-' + Math.floor(100000 + Math.random() * 900000);
      router.push(`/pembayaran/${mockOrderId}`);
    }, 1000);
  };

  return (
    <div className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/" className="hover:text-blue-400 transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Katalog Game</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-200 font-semibold">{game.name}</span>
        </div>

        {/* Top Game Hero Card */}
        <div className="relative rounded-2xl md:rounded-3xl bg-[#111827] border border-slate-800 p-6 sm:p-8 mb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
            <img
              src={game.iconUrl || game.bannerUrl}
              alt={game.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-xl border-2 border-slate-700/80 shrink-0"
            />

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                  {game.category}
                </span>
                <span className="text-xs text-slate-400">&bull; {game.publisher}</span>
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Resmi &amp; Terverifikasi
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Top Up {game.name}
              </h1>

              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                {game.tagline || 'Proses kilat otomatis 1-5 detik masuk ke akun game kamu. Aman, bergaransi & harga termurah.'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid: Form + Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form Steps */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* STEP 1: Akun Game */}
            <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6 shadow-md">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Masukkan Data Akun</h3>
                  <p className="text-xs text-slate-400">Pastikan User ID sudah sesuai agar item langsung masuk</p>
                </div>
              </div>

              <PlayerIdForm
                game={game}
                userId={userId}
                serverId={serverId}
                error={formErrors.userId}
                serverError={formErrors.server}
                onUserIdChange={(val) => {
                  setUserId(val);
                  setFormErrors((prev) => ({ ...prev, userId: undefined }));
                }}
                onServerIdChange={(val) => {
                  setServerId(val);
                  setFormErrors((prev) => ({ ...prev, server: undefined }));
                }}
              />
            </div>

            {/* STEP 2: Pilih Nominal */}
            <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6 shadow-md">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Pilih Nominal Top Up</h3>
                    <p className="text-xs text-slate-400">Pilih item atau nominal yang ingin kamu beli</p>
                  </div>
                </div>
              </div>

              {formErrors.item && (
                <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formErrors.item}</span>
                </div>
              )}

              {game.items && (
                <ItemSelector
                  items={game.items}
                  selectedItem={selectedItem}
                  onSelectItem={(item) => {
                    setSelectedItem(item);
                    setFormErrors((prev) => ({ ...prev, item: undefined }));
                  }}
                />
              )}
            </div>

            {/* STEP 3: Metode Pembayaran */}
            <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6 shadow-md">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Pilih Metode Pembayaran</h3>
                  <p className="text-xs text-slate-400">Mendukung berbagai e-wallet, VA, dan transfer bank</p>
                </div>
              </div>

              {formErrors.payment && (
                <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formErrors.payment}</span>
                </div>
              )}

              <PaymentMethodSelector
                methods={MOCK_PAYMENT_METHODS}
                selectedMethod={selectedPayment}
                itemPrice={selectedItem ? selectedItem.price : 0}
                onSelectMethod={(method) => {
                  setSelectedPayment(method);
                  setFormErrors((prev) => ({ ...prev, payment: undefined }));
                }}
              />
            </div>

            {/* STEP 4: Promo Code & Kontak */}
            <div className="rounded-2xl bg-[#111827] border border-slate-800 p-6 shadow-md">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Kode Promo &amp; Kontak</h3>
                  <p className="text-xs text-slate-400">Dapatkan diskon dan bukti transaksi instan</p>
                </div>
              </div>

              {/* Promo input */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Kode Promo &amp; Voucher
                </label>
                <PromoForm
                  gameSlug={game.slug}
                  itemPrice={itemPrice}
                  appliedPromo={appliedPromo}
                  discountAmount={discountAmount}
                  onApplyPromo={(p) => {
                    setAppliedPromo(p);
                    if (p) setPromoCodeInput(p.code);
                    else setPromoCodeInput('');
                  }}
                />
              </div>

              {/* WhatsApp Contact */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Nomor WhatsApp <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(e.target.value);
                    setFormErrors((prev) => ({ ...prev, whatsapp: undefined }));
                  }}
                  placeholder="081234567890"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900 border text-white text-sm outline-none ${
                    formErrors.whatsapp
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-800 focus:border-blue-500'
                  }`}
                />
                {formErrors.whatsapp ? (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{formErrors.whatsapp}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    Bukti pembayaran dan invoice resmi akan dikirim otomatis ke nomor ini.
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Right Sticky Order Summary Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl bg-[#111827] border border-slate-800 p-6 shadow-xl space-y-5">
              <h3 className="font-bold text-white text-lg pb-3 border-b border-slate-800 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span>Ringkasan Pesanan</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Game:</span>
                  <strong className="text-white">{game.name}</strong>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span>User ID:</span>
                  <strong className="text-white font-mono">{userId || '—'}</strong>
                </div>

                {game.serverRequired && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Server / Zone:</span>
                    <strong className="text-white font-mono">{serverId || '—'}</strong>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-300">
                  <span>Item:</span>
                  <strong className="text-white">{selectedItem?.name || '—'}</strong>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span>Metode Bayar:</span>
                  <strong className="text-white">{selectedPayment?.name || '—'}</strong>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Harga Item:</span>
                    <span>Rp {itemPrice.toLocaleString('id-ID')}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-emerald-400">
                      <span>Diskon Promo:</span>
                      <span>-Rp {discountAmount.toLocaleString('id-ID')}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Biaya Admin:</span>
                    <span>Rp {adminFee.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Total Pembayaran:</span>
                  <span className="text-lg font-extrabold text-cyan-400">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Beli Sekarang</span>
              </button>

              <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Transaksi dijamin 100% aman &amp; instan</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Order Summary & Confirmation Modal */}
      <OrderSummaryModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        onConfirm={handleConfirmOrder}
        isProcessing={isProcessing}
        game={game}
        item={selectedItem}
        payment={selectedPayment}
        userId={userId}
        serverId={serverId}
        whatsapp={whatsapp}
        promo={appliedPromo}
        itemPrice={itemPrice}
        discountAmount={discountAmount}
        adminFee={adminFee}
        totalPrice={totalPrice}
      />
    </div>
  );
}
