import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Repeat,
  Layers,
  UserCheck,
  Globe,
  TrendingUp,
  Smartphone,
  PieChart,
  ShieldCheck,
  ShoppingBag,
  HeartPulse,
  Gift,
  Gauge,
} from 'lucide-react';

interface TrendingGridProps {
  onSelectAction: (actionKey: string) => void;
}

export const TrendingGrid: React.FC<TrendingGridProps> = ({ onSelectAction }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const trendingItems = [
    {
      id: 'fund_transfer',
      title: 'Transfer',
      icon: Repeat,
      badge: '₹',
      color: 'text-slate-700',
    },
    {
      id: 'fd_plan',
      title: 'FD & RD',
      icon: Layers,
      badge: '9.5%',
      color: 'text-slate-700',
      highlight: true,
    },
    {
      id: 'kyc_update',
      title: 'Re-KYC',
      icon: UserCheck,
      badge: '✓',
      badgeColor: 'bg-emerald-600 text-white',
      color: 'text-slate-700',
    },
    {
      id: 'digital_loan',
      title: 'Apply Loan',
      icon: Smartphone,
      badge: '₹',
      color: 'text-slate-700',
      highlight: true,
    },
    {
      id: 'mutual_funds',
      title: 'Mutual Funds',
      icon: PieChart,
      badge: 'SIP',
      color: 'text-slate-700',
    },
    {
      id: 'insurance',
      title: 'Insurance',
      icon: ShieldCheck,
      badge: 'DICGC',
      color: 'text-slate-700',
    },
    {
      id: 'credit_score',
      title: 'Credit Score',
      icon: Gauge,
      badge: 'Free',
      badgeColor: 'bg-emerald-600 text-white',
      color: 'text-slate-700',
    },
    {
      id: 'apply_ipo',
      title: 'Apply IPO',
      icon: TrendingUp,
      badge: 'IPO',
      color: 'text-slate-700',
    },
  ];

  return (
    <div className="w-full max-w-lg mx-auto px-4 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <h3 className="text-base font-bold text-slate-800 tracking-tight">
          What&apos;s trending
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* 4-Column Grid */}
      {isExpanded && (
        <div className="grid grid-cols-4 gap-y-6 gap-x-2 pt-3 pb-6 animate-in fade-in">
          {trendingItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onSelectAction(item.id)}
                className="flex flex-col items-center text-center group cursor-pointer active:scale-95 transition-transform"
              >
                {/* Icon Circle Container with Accent Badges */}
                <div className="relative w-12 h-12 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center group-hover:border-orange-300 group-hover:bg-orange-50/40 transition-all">
                  <Icon className="w-6 h-6 text-slate-600 group-hover:text-[#E6390A] transition-colors" />

                  {/* Top-right small badge */}
                  {item.badge && (
                    <span
                      className={`absolute -top-1.5 -right-1.5 px-1 py-0.2 min-w-4 text-[9px] font-bold rounded-full border border-white shadow-xs flex items-center justify-center ${
                        item.badgeColor || 'bg-[#E6390A] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <span className="text-[11px] leading-snug font-medium text-slate-700 mt-2 px-0.5 line-clamp-2 max-w-[80px]">
                  {item.title}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
