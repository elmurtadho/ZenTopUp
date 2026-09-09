import HeroBanner from '@/components/HeroBanner';
import GameCatalog from '@/components/GameCatalog';
import PromoSection from '@/components/PromoSection';
import WelcomePopup from '@/components/WelcomePopup';
import { MOCK_GAMES } from '@/data/mockGames';
import { ShieldCheck, Zap, CreditCard, Sparkles, RefreshCw, CheckCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-2">
      {/* Welcome Announcement Promo Popup */}
      <WelcomePopup />

      {/* Hero Banner with Slides & Quick Info */}
      <HeroBanner />

      {/* Main Game Catalog (Daftar Game, Search & Filter) */}
      <GameCatalog games={MOCK_GAMES} />

      {/* Active Promos and Coupons */}
      <PromoSection />

      {/* Keunggulan Layanan TokoGem */}
      <section id="keunggulan" className="py-16 bg-[#090d16]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
              Kenapa Memilih TokoGem?
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Pengalaman Top Up Game Terbaik & Terpercaya
            </h3>
            <p className="text-sm text-slate-400 mt-2">
              Kami hadir untuk memberikan kemudahan bagi jutaan gamer di Indonesia dengan standar keamanan nomor satu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Pengiriman Instan 1 Detik</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sistem otomatis kami terintegrasi langsung dengan server game sehingga pesanan kamu diproses detik itu juga tanpa perlu menunggu lama.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">100% Legal & Bergaransi</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Semua diamond dan mata uang game bersumber langsung dari distributor resmi. Dijamin anti-minus dan aman dari banned.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <CreditCard className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Metode Pembayaran Lengkap</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pilihan bayar mudah dari QRIS (Semua e-wallet & m-banking), GoPay, OVO, ShopeePay, DANA, Transfer Bank, hingga minimarket.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
