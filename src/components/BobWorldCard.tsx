import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, Wifi, Sparkles } from 'lucide-react';
import { useBank } from '../context/BankContext';

interface BobWorldCardProps {
  onViewAllAccounts: () => void;
  onViewTransactionHistory: () => void;
}

export const BobWorldCard: React.FC<BobWorldCardProps> = ({
  onViewAllAccounts,
  onViewTransactionHistory,
}) => {
  const { accounts, formatMoney, formatIndianWords } = useBank();
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const primaryAccount = accounts.find((a) => a.isPrimary) || accounts[0];
  const lastFourDigits = primaryAccount?.accountNumber.slice(-4) || '8839';
  const fullAccountNumber = primaryAccount?.accountNumber || '50100482918839';
  const ifscCode = primaryAccount?.ifscCode || 'NOVA0000842';
  const balance = primaryAccount?.balance || 485250.75;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 mt-1">
      {/* Luxury Red-Orange Gradient Account Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF4E18] via-[#E6390A] to-[#C82A02] p-6 text-white shadow-xl shadow-orange-700/25 transition-all">
        
        {/* Subtle Decorative Geometric Waves & Watermark */}
        <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-black/15 blur-2xl pointer-events-none" />
        
        {/* Background Rupee Watermark */}
        <div className="absolute right-4 bottom-2 text-white/5 font-serif font-black text-9xl pointer-events-none select-none">
          ₹
        </div>

        <div className="relative z-10 flex flex-col justify-between min-h-[175px]">
          
          {/* Top Line: Account Info, Contactless wave & Primary Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* EMV Microchip Graphic */}
              <div className="w-9 h-7 rounded-lg bg-gradient-to-br from-amber-200 via-amber-300 to-yellow-500 p-1 flex items-center justify-center shadow-xs border border-amber-400/80">
                <div className="w-full h-full border border-amber-600/40 rounded-xs grid grid-cols-2 gap-0.5 opacity-80" />
              </div>
              <Wifi className="w-4 h-4 text-white/80 rotate-90" />
              <span className="text-sm font-semibold text-white/95 tracking-wide">
                Savings account - {lastFourDigits}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/30 shadow-xs">
                Primary
              </span>
            </div>
          </div>

          {/* Center Balance Display with Eye Toggle */}
          <div className="my-2.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] uppercase font-semibold tracking-wider text-orange-100/90 block">
                Available balance
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2 font-sans">
                {isBalanceHidden ? (
                  <span className="tracking-widest font-mono text-orange-100">₹ X,XX,XXX</span>
                ) : (
                  <span>{formatMoney(balance)}</span>
                )}
              </div>
              {!isBalanceHidden && (
                <div className="text-[11px] font-medium text-orange-100 flex items-center gap-1">
                  <span>{formatIndianWords(balance)}</span>
                  <span className="text-[10px] opacity-80">• 4.50% p.a.</span>
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

          {/* Bottom Account & IFSC Quick Copy Bar */}
          <div className="flex items-center justify-between text-xs text-orange-50/90 pt-2.5 border-t border-white/15">
            <button
              onClick={() => handleCopy(fullAccountNumber, 'Account No')}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              title="Click to copy full Account Number"
            >
              <span className="font-mono text-[11px]">A/c: {fullAccountNumber}</span>
              {copiedField === 'Account No' ? (
                <Check className="w-3 h-3 text-emerald-300" />
              ) : (
                <Copy className="w-3 h-3 opacity-70" />
              )}
            </button>

            <button
              onClick={() => handleCopy(ifscCode, 'IFSC')}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
              title="Click to copy IFSC Code"
            >
              <span className="font-mono text-[11px]">IFSC: {ifscCode}</span>
              {copiedField === 'IFSC' ? (
                <Check className="w-3 h-3 text-emerald-300" />
              ) : (
                <Copy className="w-3 h-3 opacity-70" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Two Rounded Pill Action Buttons Below Card */}
      <div className="grid grid-cols-2 gap-3 mt-3.5">
        <button
          onClick={onViewAllAccounts}
          className="w-full py-3 px-3 rounded-2xl bg-white border border-orange-200/80 text-slate-800 font-bold text-xs sm:text-sm hover:bg-orange-50/70 hover:border-orange-300 transition-all shadow-xs text-center cursor-pointer active:scale-98 flex items-center justify-center gap-1.5 group"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E6390A] group-hover:rotate-12 transition-transform" />
          <span>View all accounts</span>
        </button>

        <button
          onClick={onViewTransactionHistory}
          className="w-full py-3 px-3 rounded-2xl bg-white border border-orange-200/80 text-slate-800 font-bold text-xs sm:text-sm hover:bg-orange-50/70 hover:border-orange-300 transition-all shadow-xs text-center cursor-pointer active:scale-98 flex items-center justify-center gap-1.5 group"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
          <span>Transaction history</span>
        </button>
      </div>
    </div>
  );
};
