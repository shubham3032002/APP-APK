import React, { useState } from 'react';
import {
  Award,
  Eye,
  EyeOff,
  Coins,
  Sparkles,
} from 'lucide-react';
import { useBank } from '../context/BankContext';

interface MemberSharesCardProps {
  onOpenShareDetails?: () => void;
  onOpenDividendHistory?: () => void;
}

export const MemberSharesCard: React.FC<MemberSharesCardProps> = ({
  onOpenShareDetails,
}) => {
  const { memberShares, formatMoney, formatIndianWords } = useBank();
  const [isShareHidden, setIsShareHidden] = useState(false);

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4">
      {/* 1. Member Share Capital Card - Deep Forest Emerald */}
      <div 
        onClick={onOpenShareDetails}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#047857] p-5 sm:p-6 text-white shadow-lg shadow-emerald-950/20 transition-all border border-emerald-500/30 hover:border-emerald-400/50 cursor-pointer active:scale-[0.99]"
      >
        {/* Subtle Decorative Background Spheres */}
        <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-emerald-300/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-44 h-44 rounded-full bg-black/25 blur-2xl pointer-events-none" />
        
        {/* Subtle Background Watermark */}
        <div className="absolute right-4 bottom-1 text-white/[0.04] font-serif font-black text-8xl sm:text-9xl pointer-events-none select-none">
          भाग
        </div>

        <div className="relative z-10 flex flex-col justify-between min-h-[190px] gap-3">
          
          {/* Top Line: Header & Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shadow-xs shrink-0">
                <Coins className="w-4 h-4 text-emerald-200" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                    Member Share Capital
                  </span>
                  <span className="text-[10px] text-emerald-200 font-medium">
                    (भागभांडवल)
                  </span>
                </div>
                {/* Only show the "• folio number" segment when a folio
                    number actually exists — the backend's shareFolioNumber
                    can come back as an empty string when the member's
                    `resno` column is null, and unconditionally rendering
                    "• {shareFolioNumber}" left a dangling bullet with
                    nothing after it. */}
                <span className="text-[11px] font-mono text-emerald-200/80 truncate block">
                  Memno: {memberShares.memberNumber}
                  {memberShares.shareFolioNumber ? ` • ${memberShares.shareFolioNumber}` : ''}
                </span>
              </div>
            </div>

            {/* <div className="shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-emerald-400/20 backdrop-blur-md text-[10px] font-bold text-emerald-200 tracking-wider border border-emerald-400/30 shadow-xs flex items-center gap-1">
                <Award className="w-3 h-3 text-emerald-300" />
                <span>Class-A Equity</span>
              </span>
            </div> */}
          </div>

          {/* Center: Share Balance Display with Eye Toggle */}
          <div className="my-1 flex items-center justify-between gap-2">
            <div className="space-y-0.5 min-w-0">
              <span className="text-[11px] uppercase font-semibold tracking-wider text-emerald-200/90 block truncate">
                Total Paid-up Equity Capital
              </span>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2 font-sans">
                {isShareHidden ? (
                  <span className="tracking-widest font-mono text-emerald-200">₹ X,XXX</span>
                ) : (
                  <span>{formatMoney(memberShares.totalShareCapital)}</span>
                )}
              </div>
              {!isShareHidden && (
                <div className="text-xs font-medium text-emerald-100 flex items-center gap-1.5 flex-wrap">
                  <span>{formatIndianWords(memberShares.totalShareCapital)} Paid-up</span>
                  {/* <span className="text-[10px] bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-600/40 text-emerald-200 font-semibold">
                    {memberShares.dividendRate}% Annual Dividend
                  </span> */}
                </div>
              )}
            </div>

            {/* Eye toggle button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsShareHidden(!isShareHidden);
              }}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
              title={isShareHidden ? 'Show share value' : 'Hide share value'}
              aria-label="Toggle share value visibility"
            >
              {isShareHidden ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Bottom Breakdown Strip: adapts to how many columns are
              actually active. Face Value and Declared Dividend are
              currently commented out below, leaving only "Shares Held" —
              a hardcoded grid-cols-3 would reserve two empty slots next
              to it (the visible bug: the card only fills the left third,
              leaving dead space on the right). grid-cols-1 here makes
              the single active item span the full width instead. If you
              re-enable the other two columns, change this back to
              grid-cols-3. */}
          <div className="grid grid-cols-1 gap-1.5 py-2 px-3 rounded-2xl bg-black/25 border border-white/10 text-center">
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-emerald-200/80 uppercase font-medium tracking-wide block truncate">
                Shares Held
              </span>
              <span className="font-bold text-white font-mono text-xs sm:text-[13px] truncate block mt-0.5">
                {isShareHidden ? '••' : `${memberShares.numberOfShares} Units`}
              </span>
            </div>
            {/* <div className="min-w-0 border-x border-white/10">
              <span className="text-[9px] sm:text-[10px] text-emerald-200/80 uppercase font-medium tracking-wide block truncate">
                Face Value
              </span>
              <span className="font-bold text-white font-mono text-xs sm:text-[13px] truncate block mt-0.5">
                ₹{memberShares.faceValuePerShare} / Share
              </span>
            </div> */}
            {/* <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-emerald-200/80 uppercase font-medium tracking-wide block truncate">
                Declared Dividend
              </span>
              <span className="font-bold text-emerald-300 font-mono text-xs sm:text-[13px] truncate block mt-0.5">
                {isShareHidden
                  ? '₹•••'
                  : (memberShares.totalShareCapital == null || memberShares.dividendRate == null)
                    ? 'NA'
                    : `₹${(memberShares.totalShareCapital * (memberShares.dividendRate / 100)).toLocaleString('en-IN')}`}
              </span>
            </div> */}
          </div>

        </div>
      </div>
    </div>
  );
};