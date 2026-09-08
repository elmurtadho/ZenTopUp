import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Tag, FileText, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { MOCK_PROMOS } from '@/data/mockGames';

export default function PromoTermsPage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/promo"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Promo</span>
          </Link>
        </div>

        {/* Header */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <FileText className="w-4 h-4" />
            <span>Dokumen Resmi Ketentuan Promo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Syarat &amp; Ketentuan Promo TokoGem
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Harap membaca syarat dan ketentuan umum serta ketentuan khusus promo sebelum menggunakan kode voucher pada layanan TokoGem.
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
          
          {/* Section 1 */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs">1</span>
              <span>Ketentuan Umum Penggunaan Promo</span>
            </h2>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-400 pl-2">
              <li>Kode promo hanya berlaku untuk transaksi top up di website resmi TokoGem.</li>
              <li>Satu kode promo hanya dapat digunakan satu kali per transaksi per akun/nomor WhatsApp.</li>
              <li>Promo tidak dapat diuangkan, ditukar, atau digabungkan dengan program promosi lain kecuali dinyatakan berbeda.</li>
              <li>TokoGem berhak membatalkan transaksi atau membekukan voucher jika ditemukan indikasi kecurangan atau pelanggaran hukum.</li>
            </ul>
          </div>

          {/* Section 2: Per-promo specific rules */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xs">2</span>
              <span>Rincian Syarat Khusus Tiap Voucher Aktif</span>
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {MOCK_PROMOS.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-cyan-400 bg-slate-800 px-2.5 py-1 rounded">
                      {p.code}
                    </span>
                    <span className="text-[11px] text-slate-400">s/d {p.endsAt}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{p.title}</h4>
                  <p className="text-xs text-slate-400">{p.description}</p>
                  <div className="pt-2 border-t border-slate-800/60 flex flex-wrap gap-2 text-[11px] text-slate-300">
                    <span className="bg-slate-800/80 px-2 py-0.5 rounded">
                      Min. Beli: Rp {p.minPurchase.toLocaleString('id-ID')}
                    </span>
                    {p.maxDiscount && (
                      <span className="bg-slate-800/80 px-2 py-0.5 rounded">
                        Maks. Potongan: Rp {p.maxDiscount.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Pengembalian dana */}
          <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center text-xs">3</span>
              <span>Kebijakan Pembatalan &amp; Pengembalian Dana</span>
            </h2>
            <p className="text-xs text-slate-400">
              Jika transaksi gagal karena kendala sistem mitra penerbit game, saldo pembayaran yang telah ditransfer akan dikembalikan secara penuh atau item dikirim ulang secara otomatis dalam 1x24 jam. Nilai potongan kupon promo tidak dapat dikembalikan dalam bentuk uang tunai.
            </p>
          </div>

          {/* Contact Support */}
          <div className="p-6 rounded-2xl bg-blue-950/30 border border-blue-800/40 text-center space-y-3">
            <h3 className="font-bold text-white text-base">Punya Pertanyaan Mengenai Promo?</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Tim Customer Support kami siap membantu kendala penukaran voucher promo 24 jam sehari.
            </p>
            <Link
              href="https://wa.me/6281234567890"
              target="_blank"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
            >
              Hubungi CS WhatsApp 24/7
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
