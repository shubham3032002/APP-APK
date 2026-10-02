import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Landmark,
  Wifi,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import { useBank } from '../context/BankContext';

interface DepositLoanCardsProps {
  onOpenFDHub: () => void;
  onOpenLoanHub: () => void;
  onOpenStatement: () => void;
}

export const DepositLoanCards: React.FC<DepositLoanCardsProps> = ({
  onOpenFDHub,
  onOpenLoanHub,
  onOpenStatement,
}) => {
  const { fixedDeposits, loans, formatMoney, formatIndianWords } = useBank();

  const [isDepositHidden, setIsDepositHidden] = useState(false);
  const [isLoanHidden, setIsLoanHidden] = useState(false);

  // Total sums
  const totalDepositPrincipal = fixedDeposits.reduce(
    (sum, fd) => sum + fd.principalAmount,
    0
  );
  const totalMaturityValue = fixedDeposits.reduce(
    (sum, fd) => sum + fd.maturityAmount,
    0
  );

  const totalLoanOutstanding = loans.reduce(
    (sum, l) => sum + l.outstandingBalance,
    0
  );
  const totalMonthlyEMI = loans.reduce((sum, l) => sum + l.emiAmount, 0);

  return (
    <div className="w-full max-w-lg mx-auto px-4 space-y-5">
      
      {/* 1. DEPOSIT / FIXED DEPOSIT CARD (ROYAL SAPPHIRE BLUE GRADIENT) */}
      <div className="space-y-2.5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B2A68] via-[#1546AF] to-[#1E60EC] p-6 text-white shadow-xl shadow-blue-900/20 transition-all">
          
          {/* Decorative Mesh Glows & Background Rupee Sign */}
          <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-black/20 blur-2xl pointer-events-none" />
          <div className="absolute right-4 bottom-2 text-white/5 font-serif font-black text-9xl pointer-events-none select-none">
            ₹
          </div>

          <div className="relative z-10 flex flex-col justify-between min-h-[175px]">
            {/* Top Line */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Silver EMV Chip for Deposits */}
                <div className="w-9 h-7 rounded-lg bg-gradient-to-br from-slate-200 via-slate-100 to-slate-400 p-1 flex items-center justify-center shadow-xs border border-slate-300">
                  <div className="w-full h-full border border-slate-500/40 rounded-xs grid grid-cols-2 gap-0.5 opacity-80" />
                </div>
                <Wifi className="w-4 h-4 text-blue-200 rotate-90" />
                <span className="text-sm font-semibold text-white/95 tracking-wide">
                  Deposit accounts - 2 FDs
                </span>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white tracking-wider border border-white/30 shadow-xs">
                7.75% - 7.90% p.a.
              </span>
            </div>

            {/* Deposit Balance with Eye Toggle */}
            <div className="my-2.5 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase font-semibold tracking-wider text-blue-200 block">
                  Total Term Deposits
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2 font-sans">
                  {isDepositHidden ? (
                    <span className="tracking-widest font-mono text-blue-200">₹ X,XX,XXX</span>
                  ) : (
                    <span>{formatMoney(totalDepositPrincipal)}</span>
                  )}
                </div>
                {!isDepositHidden && (
                  <div className="text-[11px] font-medium text-blue-200 flex items-center gap-1.5">
                    <span>{formatIndianWords(totalDepositPrincipal)} (Principal)</span>
                  </div>
                )}
              </div>

              {/* Eye toggle button */}
              <button
                onClick={() => setIsDepositHidden(!isDepositHidden)}
                className="p-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                title={isDepositHidden ? 'Show deposit balance' : 'Hide deposit balance'}
                aria-label="Toggle deposit balance visibility"
              >
                {isDepositHidden ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Bottom Subtitle */}
            <div className="flex items-center justify-between text-xs text-blue-100/90 pt-2.5 border-t border-white/15">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-blue-300" />
                <span>Matures at: {formatMoney(totalMaturityValue)}</span>
              </span>
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full text-white border border-white/25">
                Sec 80C Tax-Saver
              </span>
            </div>
          </div>
        </div>

        {/* 2 Deposit Quick Action Pills */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onOpenFDHub}
            className="w-full py-3 px-3 rounded-2xl bg-white border border-blue-200/80 text-slate-800 font-bold text-xs sm:text-sm hover:bg-blue-50/70 hover:border-blue-300 transition-all shadow-xs text-center cursor-pointer active:scale-98 flex items-center justify-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>View 2 FDs Breakdown</span>
          </button>

          <button
            onClick={onOpenStatement}
            className="w-full py-3 px-3 rounded-2xl bg-white border border-blue-200/80 text-slate-800 font-bold text-xs sm:text-sm hover:bg-blue-50/70 hover:border-blue-300 transition-all shadow-xs text-center cursor-pointer active:scale-98 flex items-center justify-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>Deposit Statements</span>
          </button>
        </div>
      </div>


      {/* 2. LOAN ACCOUNT CARD (DEEP ROYAL PURPLE GRADIENT) */}
      <div className="space-y-2.5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D0652] via-[#4C1282] to-[#711DBE] p-6 text-white shadow-xl shadow-purple-950/20 transition-all">
          
          {/* Decorative Mesh Glows & Background Rupee Sign */}
          <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-black/20 blur-2xl pointer-events-none" />
          <div className="absolute right-4 bottom-2 text-white/5 font-serif font-black text-9xl pointer-events-none select-none">
            ₹
          </div>

          <div className="relative z-10 flex flex-col justify-between min-h-[175px]">
            {/* Top Line */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Gold EMV Chip for Loans */}
                <div className="w-9 h-7 rounded-lg bg-gradient-to-br from-amber-200 via-amber-300 to-yellow-500 p-1 flex items-center justify-center shadow-xs border border-amber-400/80">
                  <div className="w-full h-full border border-amber-600/40 rounded-xs grid grid-cols-2 gap-0.5 opacity-80" />
                </div>
                <Wifi className="w-4 h-4 text-purple-200 rotate-90" />
                <span className="text-sm font-semibold text-white/95 tracking-wide">
                  Loan accounts - 3 Active
                </span>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white tracking-wider border border-white/30 shadow-xs">
                Home, EV & Edu
              </span>
            </div>

            {/* Loan Balance with Eye Toggle */}
            <div className="my-2.5 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase font-semibold tracking-wider text-purple-200 block">
                  Total Outstanding Principal
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2 font-sans">
                  {isLoanHidden ? (
                    <span className="tracking-widest font-mono text-purple-200">₹ X,XX,XXX</span>
                  ) : (
                    <span>{formatMoney(totalLoanOutstanding)}</span>
                  )}
                </div>
                {!isLoanHidden && (
                  <div className="text-[11px] font-medium text-purple-200 flex items-center gap-1.5">
                    <span>{formatIndianWords(totalLoanOutstanding)} (Principal)</span>
                  </div>
                )}
              </div>

              {/* Eye toggle button */}
              <button
                onClick={() => setIsLoanHidden(!isLoanHidden)}
                className="p-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                title={isLoanHidden ? 'Show loan balance' : 'Hide loan balance'}
                aria-label="Toggle loan balance visibility"
              >
                {isLoanHidden ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Bottom Subtitle */}
            <div className="flex items-center justify-between text-xs text-purple-100/90 pt-2.5 border-t border-white/15">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-300" />
                <span>Monthly EMI: {formatMoney(totalMonthlyEMI)}/mo</span>
              </span>
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full text-white border border-white/25">
                Sec 24(b) & 80E
              </span>
            </div>
          </div>
        </div>

        {/* 2 Loan Quick Action Pills */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onOpenLoanHub}
            className="w-full py-3 px-3 rounded-2xl bg-white border border-purple-200/80 text-slate-800 font-bold text-xs sm:text-sm hover:bg-purple-50/70 hover:border-purple-300 transition-all shadow-xs text-center cursor-pointer active:scale-98 flex items-center justify-center gap-1.5"
          >
            <Landmark className="w-3.5 h-3.5 text-purple-600" />
            <span>View 3 Loans Details</span>
          </button>

          <button
            onClick={onOpenStatement}
            className="w-full py-3 px-3 rounded-2xl bg-white border border-purple-200/80 text-slate-800 font-bold text-xs sm:text-sm hover:bg-purple-50/70 hover:border-purple-300 transition-all shadow-xs text-center cursor-pointer active:scale-98 flex items-center justify-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-purple-600" />
            <span>Loan Repayment Log</span>
          </button>
        </div>
      </div>

    </div>
  );
};
