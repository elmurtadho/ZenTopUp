import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Headphones, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#080c14] border-t border-slate-800/80 pt-12 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/images/tokogem-logo.png"
                  alt="TokoGem Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]"
                />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Toko<span className="text-blue-400">Gem</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform top up game terpercaya, cepat, dan legal 100% di Indonesia. Layanan otomatis aktif 24 jam non-stop dengan ribuan transaksi sukses setiap hari.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              Jelajah Cepat
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/game/mobile-legends" className="hover:text-blue-400 transition">
                  Top Up Mobile Legends
                </Link>
              </li>
              <li>
                <Link href="/game/free-fire" className="hover:text-blue-400 transition">
                  Top Up Free Fire
                </Link>
              </li>
              <li>
                <Link href="/game/valorant" className="hover:text-blue-400 transition">
                  Top Up Valorant VP
                </Link>
              </li>
              <li>
                <Link href="/game/pubg-mobile" className="hover:text-blue-400 transition">
                  Top Up PUBG Mobile UC
                </Link>
              </li>
              <li>
                <Link href="/game/genshin-impact" className="hover:text-blue-400 transition">
                  Genshin Impact Genesis Crystal
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Safety */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              Dukungan & Bantuan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/riwayat" className="hover:text-blue-400 transition">
                  Cek Status Pesanan
                </Link>
              </li>
              <li>
                <a href="#promo-section" className="hover:text-blue-400 transition">
                  Klaim Kode Promo
                </a>
              </li>
              <li>
                <span className="text-slate-400">WhatsApp: 0812-3456-7890</span>
              </li>
              <li>
                <span className="text-slate-400">Email: support@tokogem.id</span>
              </li>
              <li>
                <span className="text-slate-400">Operasional: 24 Jam Non-Stop</span>
              </li>
            </ul>
          </div>

          {/* Payment Methods Info */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-4">
              Metode Pembayaran
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Mendukung QRIS, GoPay, OVO, DANA, ShopeePay, Virtual Account BCA, BRI, Mandiri, BNI, dan Alfamart/Indomaret.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-semibold">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">QRIS</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">GoPay</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">OVO</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">DANA</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">BCA VA</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">BRI VA</span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">Mandiri VA</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} TokoGem. Seluruh hak cipta dilindungi.
          </div>
          <div className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>untuk gamers Indonesia</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
