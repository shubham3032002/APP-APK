import React, { useState } from 'react';
import { Eye, EyeOff, FileText, Layers, ChevronRight } from 'lucide-react';
import { useBank } from '../context/BankContext';

interface PrimaryBalanceCardProps {
  onViewAllAccounts: () => void;
  onViewStatement: () => void;
}

export const PrimaryBalanceCard: React.FC<PrimaryBalanceCardProps> = ({
  onViewAllAccounts,
  onViewStatement,
}) => {
  const { accounts, formatMoney, formatIndianWords, fixedDeposits, loans } =
    useBank();
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const primaryAccount = accounts.find((a) => a.isPrimary) || accounts[0];
  const lastFourDigits = primaryAccount?.accountNumber.slice(-4) || '8839';
  const balance = primaryAccount?.balance || 485250.75;

  const totalFDVal = fixedDeposits.reduce((acc, f) => acc + f.principalAmount, 0);
  const totalLoanVal = loans.reduce((acc, l) => acc + l.outstandingBalance, 0);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Primary Hero Account Card in Signature Orange-Red Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF5E0E] via-[#EE430A] to-[#D72B00] p-6 sm:p-7 text-white shadow-xl shadow-orange-950/10">
        
        {/* Subtle Decorative Background Rings */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-orange-900/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between gap-6">
          
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-semibold text-white/95 tracking-tight">
                Savings account - {lastFourDigits}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider border border-white/30">
                Primary
              </span>
            </div>

            <span className="text-xs font-mono text-white/80 hidden sm:inline-block bg-white/10 px-2 py-0.5 rounded-md">
              IFSC: {primaryAccount?.ifscCode || 'NOVA0000842'}
            </span>
          </div>

          {/* Balance Row with Eye Toggle */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-white/80 font-medium block uppercase tracking-wider">
                Available balance
              </span>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white flex items-center gap-2 font-sans">
                {isBalanceHidden ? (
                  <span className="tracking-widest font-mono text-white/80">₹ X,XX,XXX</span>
                ) : (
                  <span>{formatMoney(balance)}</span>
                )}
              </div>
              {!isBalanceHidden && (
                <div className="text-xs text-white/90 font-medium pt-0.5">
                  {formatIndianWords(balance)}
                </div>
              )}
            </div>

            {/* Eye toggle button */}
            <button
              onClick={() => setIsBalanceHidden(!isBalanceHidden)}
              className="p-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/25 text-white transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
              title={isBalanceHidden ? 'Show balance' : 'Hide balance'}
              aria-label="Toggle balance visibility"
            >
              {isBalanceHidden ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Subtitle & Branch details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-white/20 text-xs text-white/85">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>4.50% p.a. Savings Interest • Compounded Quarterly</span>
            </div>
            <span className="font-mono text-white/80">
              Branch: BKC Mumbai (MICR: 400240019)
            </span>
          </div>
        </div>
      </div>

      {/* Two Prominent Action Pills (Matching Mobile Banking App Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onViewAllAccounts}
          className="py-3.5 px-5 rounded-2xl bg-white hover:bg-orange-50/70 border border-orange-200/90 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-between gap-2 transition-all shadow-xs cursor-pointer active:scale-98 group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100/80 text-[#E6390A] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <span className="group-hover:text-[#E6390A] transition-colors">
              View all accounts (1 Sav, 2 FDs, 3 Loans)
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#E6390A] transition-colors" />
        </button>

        <button
          onClick={onViewStatement}
          className="py-3.5 px-5 rounded-2xl bg-white hover:bg-orange-50/70 border border-orange-200/90 text-slate-800 font-bold text-xs sm:text-sm flex items-center justify-between gap-2 transition-all shadow-xs cursor-pointer active:scale-98 group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100/80 text-[#E6390A] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <span className="group-hover:text-[#E6390A] transition-colors">
              Transaction history & e-Statements
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#E6390A] transition-colors" />
        </button>
      </div>

      {/* Portfolio Breakdown Tiles with Orange & Clean Warm Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Savings Card */}
        <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-2xs space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className="font-semibold">1 Savings Balance</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-1.5 py-0.2 rounded border border-emerald-200">
              Liquid
            </span>
          </div>
          <p className="text-xl font-black text-slate-900 font-sans">
            {isBalanceHidden ? '₹ ••••••' : formatMoney(balance)}
          </p>
        </div>

        {/* 2 FDs Card */}
        <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-2xs space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className="font-semibold">2 Fixed Deposits</span>
            <span className="text-[10px] text-blue-700 bg-blue-50 font-bold px-1.5 py-0.2 rounded border border-blue-200">
              7.75% - 7.90%
            </span>
          </div>
          <p className="text-xl font-black text-slate-900 font-sans">
            {isBalanceHidden ? '₹ ••••••' : formatMoney(totalFDVal)}
          </p>
        </div>

        {/* 3 Loans Card */}
        <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-2xs space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className="font-semibold">3 Active Loans</span>
            <span className="text-[10px] text-purple-700 bg-purple-50 font-bold px-1.5 py-0.2 rounded border border-purple-200">
              Outstanding
            </span>
          </div>
          <p className="text-xl font-black text-slate-900 font-sans">
            {isBalanceHidden ? '₹ ••••••' : formatMoney(totalLoanVal)}
          </p>
        </div>
      </div>
    </div>
  );
};
