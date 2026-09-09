'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ChevronRight, ChevronLeft, ShieldCheck, Zap, Headphones, Tag } from 'lucide-react';
import { MOCK_PROMOS } from '@/data/mockGames';

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await fetch('/api/banners');
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setBanners(json.data);
        } else {
          // Fallback to mock promos formatted as banners
          setBanners(
            MOCK_PROMOS.map((p) => ({
              id: p.id,
              title: p.title,
              subtitle: p.description,
              imageUrl: p.imageUrl,
              targetUrl: p.gameSlug ? `/game/${p.gameSlug}` : '/promo',
              badgeText: 'PROMO SPESIAL',
              code: p.code,
            }))
          );
        }
      } catch {
        setBanners(
          MOCK_PROMOS.map((p) => ({
            id: p.id,
            title: p.title,
            subtitle: p.description,
            imageUrl: p.imageUrl,
            targetUrl: p.gameSlug ? `/game/${p.gameSlug}` : '/promo',
            badgeText: 'PROMO SPESIAL',
            code: p.code,
          }))
        );
      } finally {
        setIsLoaded(true);
      }
    };

    loadBanners();
  }, []);

  const totalSlides = banners.length > 0 ? banners.length : 1;

  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5500);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const banner = banners[currentSlide] || {
    title: 'Top Up Game Termurah & Tercepat',
    subtitle: 'Proses otomatis kilat 1 detik 24 jam nonstop',
    imageUrl: '/images/games/mlbb-banner.webp',
    targetUrl: '/#katalog',
    badgeText: 'EVENT SPESIAL',
  };

  return (
    <section className="relative overflow-hidden pt-6 pb-8">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Carousel Card */}
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-800/80 bg-gradient-to-r from-slate-900 via-[#0d1627] to-[#0f1d38] shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[340px] md:min-h-[380px]">
            {/* Left Content */}
            <div className="md:col-span-7 p-5 sm:p-8 md:p-10 flex flex-col justify-between z-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3 sm:mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{banner.badgeText || 'Promo Spesial Hari Ini'}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2 sm:mb-3">
                  {banner.title}
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mb-5 sm:mb-6">
                  {banner.subtitle || banner.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                <Link
                  href={banner.targetUrl || '/#katalog'}
                  className="w-full sm:w-auto justify-center px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all duration-200 flex items-center gap-2 group cursor-pointer"
                >
                  <span>Klaim &amp; Top Up Sekarang</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {banner.code && (
                  <div className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-mono text-cyan-300 flex items-center gap-2">
                    <span className="text-slate-400">Kode:</span>
                    <span className="font-bold tracking-wider">{banner.code}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="md:col-span-5 relative min-h-[200px] md:min-h-full overflow-hidden">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover object-center opacity-80 md:opacity-90 transform transition-transform duration-700 hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.opacity = '0.4';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0d1627] via-transparent to-transparent" />
            </div>
          </div>

          {/* Carousel dots & arrows */}
          {totalSlides > 1 && (
            <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 flex items-center gap-1.5 sm:gap-2 z-20">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)}
                className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white border border-slate-700/60 transition cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1.5 px-1.5 sm:px-2">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentSlide ? 'w-5 sm:w-6 bg-cyan-400' : 'w-2 bg-slate-600'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % totalSlides)}
                className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white border border-slate-700/60 transition cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Feature quick badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Proses Instan 1 Detik</h4>
              <p className="text-xs text-slate-400">Otomatis langsung masuk ke ID akun game</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Resmi &amp; Legal</h4>
              <p className="text-xs text-slate-400">Jaminan anti-minus &amp; akun selalu aman</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Layanan CS 24/7</h4>
              <p className="text-xs text-slate-400">Bantuan cepat via live chat &amp; WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
