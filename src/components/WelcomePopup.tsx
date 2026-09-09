'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles, ArrowRight } from 'lucide-react';

export default function WelcomePopup() {
  const [popupData, setPopupData] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only check in browser
    try {
      const dismissed = sessionStorage.getItem('tokogem_welcome_popup_seen');
      if (dismissed === 'true') {
        return;
      }

      const fetchPopup = async () => {
        try {
          const res = await fetch('/api/popup');
          const json = await res.json();
          if (json.success && json.data && json.data.isActive) {
            setPopupData(json.data);
            // Slight delay for smooth initial entrance
            setTimeout(() => {
              setIsOpen(true);
            }, 1200);
          }
        } catch {
          // ignore error
        }
      };

      fetchPopup();
    } catch {
      // ignore
    }
  }, []);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem('tokogem_welcome_popup_seen', 'true');
    } catch {}
    setIsOpen(false);
  };

  if (!isOpen || !popupData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-700/90 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-xs">
        {/* Poster Image */}
        {popupData.imageUrl && (
          <div className="relative h-44 sm:h-48 bg-slate-950 overflow-hidden">
            <img
              src={popupData.imageUrl}
              alt={popupData.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.opacity = '0.3';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-95" />

            {/* Tag / Badge */}
            {popupData.tag && (
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-[10px] uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{popupData.tag}</span>
                </span>
              </div>
            )}

            {/* Close Button Top Right */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition cursor-pointer"
              title="Tutup Pengumuman"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-3.5">
          {!popupData.imageUrl && (
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-[10px] uppercase tracking-wider">
                {popupData.tag || 'PENGUMUMAN'}
              </span>
              <button
                onClick={handleDismiss}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div>
            <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
              {popupData.title}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed whitespace-pre-line">
              {popupData.description}
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex items-center gap-2">
            <Link
              href={popupData.buttonUrl || '/promo'}
              onClick={handleDismiss}
              className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>{popupData.buttonText || 'Lihat Penawaran Sekarang'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <p className="text-[10px] text-center text-slate-500">
            Klik tombol untuk melihat promo atau klik silang untuk menutup
          </p>
        </div>
      </div>
    </div>
  );
}
