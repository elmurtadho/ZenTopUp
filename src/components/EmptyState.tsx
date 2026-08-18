'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, Search, Receipt, ArrowRight, RefreshCw, Zap } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
  secondaryActionText?: string;
  onSecondaryActionClick?: () => void;
}

export default function EmptyState({
  icon: Icon = Receipt,
  title,
  description,
  actionText = 'Mulai Top Up Game',
  actionHref = '/#katalog',
  onActionClick,
  secondaryActionText,
  onSecondaryActionClick,
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl bg-[#111827] border border-slate-800 p-10 sm:p-14 text-center space-y-5 shadow-xl animate-in fade-in duration-300">
      {/* Icon with glow background */}
      <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl animate-pulse" />
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shadow-inner">
          <Icon className="w-8 h-8 text-blue-400" />
        </div>
      </div>

      {/* Text content */}
      <div className="max-w-md mx-auto space-y-2">
        <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action buttons */}
      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        {onSecondaryActionClick && secondaryActionText && (
          <button
            onClick={onSecondaryActionClick}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{secondaryActionText}</span>
          </button>
        )}

        {actionHref ? (
          <Link
            href={actionHref}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          onActionClick && (
            <button
              onClick={onActionClick}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>{actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )
        )}
      </div>
    </div>
  );
}
