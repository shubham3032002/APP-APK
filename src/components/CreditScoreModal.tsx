import React from 'react';
import { Gauge, CheckCircle2, ShieldAlert } from 'lucide-react';

interface CreditScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreditScoreModal: React.FC<CreditScoreModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">CIBIL TransUnion Report</h3>
              <p className="text-xs text-slate-500">Updated August 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Score Ring */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white text-center space-y-1 shadow-md">
          <span className="text-xs uppercase font-semibold text-emerald-100 tracking-wider">
            Your Credit Health
          </span>
          <div className="text-4xl font-extrabold tracking-tight font-mono">
            785 <span className="text-lg font-normal text-emerald-200">/ 900</span>
          </div>
          <span className="inline-block text-xs font-bold bg-white/20 px-3 py-0.5 rounded-full backdrop-blur-md">
            Excellent • Prime Borrower
          </span>
        </div>

        {/* Factors breakdown */}
        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-700">EMI On-Time Repayment</span>
            </div>
            <span className="font-bold text-emerald-700">100% (No Delays)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-700">Active Credit Mix</span>
            </div>
            <span className="font-bold text-slate-800">3 Loans (Home, EV, Edu)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-slate-400" />
              <span className="text-slate-700">Credit Utilization</span>
            </div>
            <span className="font-bold text-slate-800">17.2% (Healthy)</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
