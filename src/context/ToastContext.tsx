'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Loader2, 
  X, 
  ExternalLink 
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'processing';

export interface ToastAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  action?: ToastAction;
  duration?: number; // ms, default 5000
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  dismissToast: (id: string) => void;
  success: (title: string, message?: string, action?: ToastAction) => string;
  error: (title: string, message?: string, action?: ToastAction) => string;
  info: (title: string, message?: string, action?: ToastAction) => string;
  warning: (title: string, message?: string, action?: ToastAction) => string;
  processing: (title: string, message?: string, action?: ToastAction) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    const duration = toast.duration ?? 5000;

    const newToast: ToastItem = { ...toast, id, duration };

    setToasts((prev) => [newToast, ...prev.slice(0, 4)]); // max 5 toasts

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }

    return id;
  }, [dismissToast]);

  const success = useCallback((title: string, message?: string, action?: ToastAction) => {
    return showToast({ type: 'success', title, message, action, duration: 5500 });
  }, [showToast]);

  const error = useCallback((title: string, message?: string, action?: ToastAction) => {
    return showToast({ type: 'error', title, message, action, duration: 6000 });
  }, [showToast]);

  const info = useCallback((title: string, message?: string, action?: ToastAction) => {
    return showToast({ type: 'info', title, message, action, duration: 5000 });
  }, [showToast]);

  const warning = useCallback((title: string, message?: string, action?: ToastAction) => {
    return showToast({ type: 'warning', title, message, action, duration: 5000 });
  }, [showToast]);

  const processing = useCallback((title: string, message?: string, action?: ToastAction) => {
    return showToast({ type: 'processing', title, message, action, duration: 4000 });
  }, [showToast]);

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          borderColor: 'border-emerald-500/40',
          bgColor: 'bg-gradient-to-r from-emerald-950/90 via-slate-900/95 to-slate-900/95',
          glowColor: 'shadow-[0_0_25px_-5px_rgba(16,185,129,0.35)]',
          badge: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
          badgeText: 'SUKSES',
        };
      case 'error':
        return {
          icon: <XCircle className="w-5 h-5 text-red-400 shrink-0" />,
          borderColor: 'border-red-500/40',
          bgColor: 'bg-gradient-to-r from-red-950/90 via-slate-900/95 to-slate-900/95',
          glowColor: 'shadow-[0_0_25px_-5px_rgba(239,68,68,0.35)]',
          badge: 'bg-red-500/20 text-red-400 border border-red-500/30',
          badgeText: 'GAGAL',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          borderColor: 'border-amber-500/40',
          bgColor: 'bg-gradient-to-r from-amber-950/90 via-slate-900/95 to-slate-900/95',
          glowColor: 'shadow-[0_0_25px_-5px_rgba(245,158,11,0.35)]',
          badge: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
          badgeText: 'PERINGATAN',
        };
      case 'processing':
        return {
          icon: <Loader2 className="w-5 h-5 text-cyan-400 shrink-0 animate-spin" />,
          borderColor: 'border-cyan-500/40',
          bgColor: 'bg-gradient-to-r from-cyan-950/90 via-slate-900/95 to-slate-900/95',
          glowColor: 'shadow-[0_0_25px_-5px_rgba(6,182,212,0.35)]',
          badge: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
          badgeText: 'DIPROSES',
        };
      case 'info':
      default:
        return {
          icon: <Clock className="w-5 h-5 text-blue-400 shrink-0" />,
          borderColor: 'border-blue-500/40',
          bgColor: 'bg-gradient-to-r from-blue-950/90 via-slate-900/95 to-slate-900/95',
          glowColor: 'shadow-[0_0_25px_-5px_rgba(59,130,246,0.35)]',
          badge: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
          badgeText: 'INFO / MENUNGGU',
        };
    }
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        dismissToast,
        success,
        error,
        info,
        warning,
        processing,
      }}
    >
      {children}

      {/* Floating Toasts Container */}
      <div 
        aria-live="polite" 
        className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none"
      >
        {toasts.map((toast) => {
          const style = getToastStyles(toast.type);
          return (
            <div
              key={toast.id}
              role="alert"
              className={`pointer-events-auto rounded-2xl border ${style.borderColor} ${style.bgColor} ${style.glowColor} backdrop-blur-xl p-4 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-4`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{style.icon}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${style.badge}`}>
                      {style.badgeText}
                    </span>
                    <h5 className="text-xs sm:text-sm font-bold text-white truncate">
                      {toast.title}
                    </h5>
                  </div>

                  {toast.message && (
                    <p className="text-xs text-slate-300 leading-relaxed break-words">
                      {toast.message}
                    </p>
                  )}

                  {toast.action && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                      {toast.action.href ? (
                        <Link
                          href={toast.action.href}
                          onClick={() => dismissToast(toast.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
                        >
                          <span>{toast.action.label}</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            toast.action?.onClick?.();
                            dismissToast(toast.id);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
                        >
                          <span>{toast.action.label}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/70 transition shrink-0 cursor-pointer"
                  aria-label="Tutup notifikasi"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
