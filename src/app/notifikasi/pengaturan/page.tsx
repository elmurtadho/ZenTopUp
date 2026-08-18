'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  ArrowLeft, 
  Smartphone, 
  Mail, 
  Tag, 
  ShieldCheck, 
  Save, 
  Check, 
  Volume2, 
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  channel: 'whatsapp' | 'email' | 'in_app';
}

export default function PengaturanNotifikasiPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'wa_tx_status',
      title: 'Pemberitahuan Status Transaksi via WhatsApp',
      description: 'Dapatkan invoice digital dan status pengiriman item langsung ke nomor WhatsApp kamu.',
      enabled: true,
      channel: 'whatsapp',
    },
    {
      id: 'wa_promo',
      title: 'Info Flash Sale & Promo Khusus WhatsApp',
      description: 'Dapatkan kupon voucher diskon eksklusif dan event top up bonus diamond mingguan.',
      enabled: false,
      channel: 'whatsapp',
    },
    {
      id: 'email_receipt',
      title: 'Bukti Pembayaran Resmi via Email',
      description: 'Kirimkan invoice format PDF resmi ke alamat email setiap transaksi berhasil.',
      enabled: true,
      channel: 'email',
    },
    {
      id: 'email_newsletter',
      title: 'Update Game & Rilis Item Baru',
      description: 'Kabar rilis skin baru, hero baru, dan event kolaborasi game terpopuler.',
      enabled: false,
      channel: 'email',
    },
    {
      id: 'inapp_order_update',
      title: 'Notifikasi Aplikasi: Pembaruan Transaksi',
      description: 'Tampilkan pop-up dan lonceng notifikasi saat pembayaran diverifikasi.',
      enabled: true,
      channel: 'in_app',
    },
    {
      id: 'inapp_maintenance',
      title: 'Pemberitahuan Pemeliharaan Server',
      description: 'Informasi dini jadwal maintenance server game atau jalur pembayaran bank.',
      enabled: true,
      channel: 'in_app',
    },
  ]);

  const [isSaved, setIsSaved] = useState(false);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2500);
  };

  const waSettings = settings.filter((s) => s.channel === 'whatsapp');
  const emailSettings = settings.filter((s) => s.channel === 'email');
  const inAppSettings = settings.filter((s) => s.channel === 'in_app');

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Navigation back */}
        <div className="mb-6">
          <Link
            href="/notifikasi"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Notifikasi</span>
          </Link>
        </div>

        {/* Header */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
            <Bell className="w-4 h-4" />
            <span>Preferensi Pemberitahuan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Pengaturan Notifikasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Atur saluran dan jenis informasi yang ingin kamu terima dari ZenTopUp.
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          
          {/* Section 1: WhatsApp */}
          <div className="rounded-3xl bg-[#111827] border border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Saluran WhatsApp</h2>
                <p className="text-xs text-slate-400">Pemberitahuan instan via bot resmi WhatsApp ZenTopUp</p>
              </div>
            </div>

            <div className="space-y-5">
              {waSettings.map((s) => (
                <div key={s.id} className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-sm font-semibold text-white block">{s.title}</span>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSetting(s.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      s.enabled ? 'bg-emerald-600' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                        s.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Email */}
          <div className="rounded-3xl bg-[#111827] border border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Saluran Email</h2>
                <p className="text-xs text-slate-400">Invoice dan berita update game ke email terdaftar</p>
              </div>
            </div>

            <div className="space-y-5">
              {emailSettings.map((s) => (
                <div key={s.id} className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-sm font-semibold text-white block">{s.title}</span>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSetting(s.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      s.enabled ? 'bg-blue-600' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                        s.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: In-App */}
          <div className="rounded-3xl bg-[#111827] border border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Notifikasi Dalam Aplikasi</h2>
                <p className="text-xs text-slate-400">Pemberitahuan lonceng dan pop-up saat berselancar di website</p>
              </div>
            </div>

            <div className="space-y-5">
              {inAppSettings.map((s) => (
                <div key={s.id} className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-sm font-semibold text-white block">{s.title}</span>
                    <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSetting(s.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      s.enabled ? 'bg-purple-600' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                        s.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Privasi data nomor kontak kamu dijamin aman 100%.</span>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Pengaturan Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
