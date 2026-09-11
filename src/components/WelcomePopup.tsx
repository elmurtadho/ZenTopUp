'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function WelcomePopup() {
  const [popups, setPopups] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem('tokogem_welcome_popup_seen');
      if (dismissed === 'true') {
        return;
      }

      const fetchPopups = async () => {
        try {
          const res = await fetch('/api/popup');
          const json = await res.json();
          if (json.success && json.data) {
            const list = Array.isArray(json.data) ? json.data : [json.data];
            const activeList = list.filter((item: any) => Boolean(item.isActive));
            if (activeList.length > 0) {
              setPopups(activeList);
              setCurrentIndex(0);
              // Smooth entrance delay
              setTimeout(() => {
                setIsOpen(true);
              }, 1200);
            }
          }
        } catch {
          // ignore error
        }
      };

      fetchPopups();
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

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? popups.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === popups.length - 1 ? 0 : prev + 1));
  };

  if (!isOpen || popups.length === 0) return null;

  const currentPopup = popups[currentIndex];
  if (!currentPopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-700/90 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-xs">
        {/* Poster Image */}
        {currentPopup.imageUrl && (
          <div className="relative h-44 sm:h-48 bg-slate-950 overflow-hidden select-none">
            <img
              src={currentPopup.imageUrl}
              alt={currentPopup.title}
              className="w-full h-full object-cover transition-all duration-300"
              onError={(e) => {
                (e.target as HTMLElement).style.opacity = '0.3';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-95" />

            {/* Tag / Badge */}
            {currentPopup.tag && (
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black text-[10px] uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{currentPopup.tag}</span>
                </span>
              </div>
            )}

            {/* Close Button Top Right */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition cursor-pointer z-10"
              title="Tutup Promo"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Carousel Arrows if > 1 popup */}
            {popups.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 backdrop-blur-sm transition cursor-pointer shadow-lg active:scale-95"
                  title="Promo Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 backdrop-blur-sm transition cursor-pointer shadow-lg active:scale-95"
                  title="Promo Selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-3.5">
          {!currentPopup.imageUrl && (
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-[10px] uppercase tracking-wider">
                {currentPopup.tag || 'PENGUMUMAN'}
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
              {currentPopup.title}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed whitespace-pre-line">
              {currentPopup.description}
            </p>
          </div>

          {/* Slider Pagination Dots & Counter (if > 1 popup) */}
          {popups.length > 1 && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5">
                {popups.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex ? 'w-6 bg-gradient-to-r from-rose-500 to-amber-500' : 'w-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                    title={`Promo ${idx + 1}`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-semibold text-slate-400">
                Promo {currentIndex + 1} dari {popups.length}
              </span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2 flex items-center gap-2">
            <Link
              href={currentPopup.buttonUrl || '/promo'}
              onClick={handleDismiss}
              className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>{currentPopup.buttonText || 'Lihat Penawaran Sekarang'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <p className="text-[10px] text-center text-slate-500">
            {popups.length > 1
              ? 'Geser untuk melihat promo lainnya atau klik untuk klaim'
              : 'Klik tombol untuk melihat promo atau silang untuk menutup'}
          </p>
        </div>
      </div>
    </div>
  );
}
