'use client';

import React, { useState } from 'react';
import { PaymentMethod } from '@/types';
import { CreditCard, Check, ChevronDown, ChevronUp, Zap, ShieldCheck } from 'lucide-react';

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedMethod: PaymentMethod | null;
  itemPrice: number;
  onSelectMethod: (method: PaymentMethod) => void;
}

const CATEGORY_ORDER = ['QRIS', 'E-Wallet', 'Virtual Account', 'Convenience Store'] as const;

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'QRIS': <span className="text-xs font-bold text-orange-400">QR</span>,
  'E-Wallet': <span className="text-xs font-bold text-purple-400">eW</span>,
  'Virtual Account': <span className="text-xs font-bold text-blue-400">VA</span>,
  'Convenience Store': <span className="text-xs font-bold text-yellow-400">CS</span>,
};

export default function PaymentMethodSelector({
  methods,
  selectedMethod,
  itemPrice,
  onSelectMethod,
}: PaymentMethodSelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    // Expand all by default
    Object.fromEntries(CATEGORY_ORDER.map((c) => [c, true]))
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <div className="space-y-4">
      {CATEGORY_ORDER.map((categoryName) => {
        const categoryMethods = methods.filter((m) => m.category === categoryName);
        if (!categoryMethods.length) return null;

        const isExpanded = expandedCategories[categoryName] ?? true;
        const hasSelectedInCategory = categoryMethods.some((m) => m.id === selectedMethod?.id);

        return (
          <div key={categoryName} className="rounded-xl overflow-hidden border border-slate-800">
            {/* Category Header (collapsible) */}
            <button
              type="button"
              onClick={() => toggleCategory(categoryName)}
              className="w-full px-4 py-3 bg-slate-900/80 flex items-center justify-between hover:bg-slate-900 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                  {CATEGORY_ICONS[categoryName] || <CreditCard className="w-3.5 h-3.5 text-slate-400" />}
                </div>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {categoryName}
                </span>
                {hasSelectedInCategory && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-bold">
                    Dipilih
                  </span>
                )}
              </div>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Methods List */}
            {isExpanded && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-950/50">
                {categoryMethods.map((method) => {
                  const isSelected = selectedMethod?.id === method.id;
                  const total = itemPrice + method.adminFee;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => onSelectMethod(method)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600/15 border-blue-500 ring-2 ring-blue-500/30 shadow-md shadow-blue-600/10'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-600 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                            isSelected
                              ? 'bg-blue-600/20 border-blue-500/50'
                              : 'bg-slate-800 border-slate-700'
                          }`}
                        >
                          <CreditCard
                            className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`}
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-sm text-white block truncate">
                            {method.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {method.adminFee > 0
                              ? `+Rp ${method.adminFee.toLocaleString('id-ID')}`
                              : 'Gratis admin'}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-2">
                        {isSelected ? (
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="text-xs font-bold text-white">
                              Rp {total.toLocaleString('id-ID')}
                            </span>
                            <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-0.5">
                              <Check className="w-3 h-3" />
                              Dipilih
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-400">
                            Rp {total.toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Selected Method Summary */}
      {selectedMethod && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-emerald-300 text-sm block">
              {selectedMethod.name}
            </span>
            <span className="text-[11px] text-emerald-400/80">
              Proses verifikasi otomatis instan setelah pembayaran dikonfirmasi
            </span>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        </div>
      )}
    </div>
  );
}
