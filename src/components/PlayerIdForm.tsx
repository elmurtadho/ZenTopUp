'use client';

import React, { useState, useEffect } from 'react';
import { Game } from '@/types';
import { UserCheck, HelpCircle, CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';

interface PlayerIdFormProps {
  game: Game;
  userId: string;
  serverId: string;
  onUserIdChange: (val: string) => void;
  onServerIdChange: (val: string) => void;
  error?: string | null;
  serverError?: string | null;
}

export function validatePlayerId(game: Game, userId: string, serverId: string): { userIdError: string | null; serverError: string | null } {
  let userIdError: string | null = null;
  let serverError: string | null = null;

  const trimmedId = userId.trim();

  if (!trimmedId) {
    userIdError = 'User ID tidak boleh kosong';
  } else if (game.slug === 'valorant') {
    if (!trimmedId.includes('#') || trimmedId.split('#')[1].length === 0) {
      userIdError = 'Format Riot ID harus menyertakan tanda pagar (contoh: TenZ#NA1)';
    }
  } else if (game.slug === 'mobile-legends' || game.slug === 'free-fire' || game.slug === 'pubg-mobile' || game.slug === 'genshin-impact') {
    if (!/^\d+$/.test(trimmedId)) {
      userIdError = 'User ID harus berupa angka';
    } else if (trimmedId.length < 5 || trimmedId.length > 15) {
      userIdError = 'Panjang User ID harus antara 5 hingga 15 digit';
    }
  } else if (trimmedId.length < 3) {
    userIdError = 'User ID terlalu pendek (minimal 3 karakter)';
  }

  if (game.serverRequired) {
    if (!serverId || !serverId.trim()) {
      serverError = game.serverList ? 'Silakan pilih server' : 'Zone ID / Server ID wajib diisi';
    } else if (!game.serverList && !/^\d+$/.test(serverId.trim())) {
      serverError = 'Zone ID harus berupa angka (contoh: 2024)';
    }
  }

  return { userIdError, serverError };
}

export default function PlayerIdForm({
  game,
  userId,
  serverId,
  onUserIdChange,
  onServerIdChange,
  error,
  serverError,
}: PlayerIdFormProps) {
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [touched, setTouched] = useState(false);

  const validation = validatePlayerId(game, userId, serverId);
  const currentUserIdError = touched && (error || validation.userIdError);
  const currentServerError = touched && (serverError || validation.serverError);

  // Validate ID and simulate verified nickname
  useEffect(() => {
    if (userId.trim().length >= 5 && !validation.userIdError) {
      setIsValidating(true);
      const timer = setTimeout(() => {
        setIsValidating(false);
        setNickname(`GemGamer_${userId.slice(-4)}`);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setNickname(null);
      setIsValidating(false);
    }
  }, [userId, serverId, validation.userIdError]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* User ID Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              User ID {game.slug === 'valorant' ? '/ Riot ID' : ''} <span className="text-red-400">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowGuideModal(true)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Petunjuk ID</span>
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={userId}
              onBlur={() => setTouched(true)}
              onChange={(e) => onUserIdChange(e.target.value)}
              placeholder={
                game.slug === 'valorant'
                  ? 'Contoh: TenZ#NA1'
                  : 'Contoh: 12345678'
              }
              className={`w-full px-4 py-3 rounded-xl bg-slate-900 border text-white text-sm outline-none transition ${
                currentUserIdError
                  ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
          </div>

          {currentUserIdError && (
            <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{currentUserIdError}</span>
            </p>
          )}
        </div>

        {/* Server ID Field (if required) */}
        {game.serverRequired && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {game.serverList ? 'Pilih Server' : 'Zone ID / Server ID'} <span className="text-red-400">*</span>
              </label>
            </div>

            {game.serverList ? (
              <select
                value={serverId}
                onBlur={() => setTouched(true)}
                onChange={(e) => onServerIdChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-slate-900 border text-white text-sm outline-none transition cursor-pointer ${
                  currentServerError ? 'border-red-500' : 'border-slate-800 focus:border-blue-500'
                }`}
              >
                {game.serverList.map((srv) => (
                  <option key={srv} value={srv}>
                    Server: {srv}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={serverId}
                onBlur={() => setTouched(true)}
                onChange={(e) => onServerIdChange(e.target.value)}
                placeholder="Contoh: (2024)"
                className={`w-full px-4 py-3 rounded-xl bg-slate-900 border text-white text-sm outline-none transition ${
                  currentServerError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                }`}
              />
            )}

            {currentServerError && (
              <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{currentServerError}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Account Verification Feedback badge */}
      {isValidating && (
        <div className="text-xs text-blue-400 flex items-center gap-1.5 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Memverifikasi akun pemain...</span>
        </div>
      )}

      {nickname && !isValidating && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Akun Terverifikasi: <strong>{nickname}</strong>
            </span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-bold">
            VALID
          </span>
        </div>
      )}

      {/* Guide Dialog */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <span>Cara Menemukan User ID {game.name}</span>
              </h3>
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                1. Buka game <strong>{game.name}</strong> di perangkat HP atau PC kamu.
              </p>
              <p>
                2. Buka menu <strong>Profil / Pengaturan</strong> di pojok kiri atas layar utama game.
              </p>
              <p>
                3. User ID &amp; Server ID terletak di bawah avatar atau nickname akun kamu (contoh: <code>12345678 (2024)</code>).
              </p>
              <p>
                4. Salin nomor tersebut dan tempelkan ke form isian di TokoGem.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
