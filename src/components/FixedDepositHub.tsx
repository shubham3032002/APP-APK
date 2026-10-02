import React, { useState } from 'react';
import {
  Lock,
  Calendar,
  Clock,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { useBank } from '../context/BankContext';
import { FixedDeposit } from '../types/bank';

interface FixedDepositHubProps {
  onOpenNewFD: () => void;
}

export const FixedDepositHub: React.FC<FixedDepositHubProps> = () => {
  const {
    fixedDeposits,
    formatMoney,
    formatIndianWords,
    totalFixedDepositsUSD,
  } = useBank();

  const [showCertFD, setShowCertFD] = useState<FixedDeposit | null>(null);

  const activeFDs = fixedDeposits.filter((fd) => fd.status === 'active');
  const totalAccruedInterest = activeFDs.reduce((sum, fd) => sum + fd.accruedInterest, 0);
  const totalProjectedMaturity = activeFDs.reduce((sum, fd) => sum + fd.maturityAmount, 0);

  const calculateProgress = (startDate: string, maturityDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(maturityDate).getTime();
    const now = new Date().getTime();
    if (now <= start) return 5;
    if (now >= end) return 100;
    const progress = ((now - start) / (end - start)) * 100;
    return Math.min(100, Math.max(5, Math.round(progress)));
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner - Clean & Simple */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Fixed Deposits Ledger
              </span>
              <span className="text-xs text-slate-300 font-medium bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                2 Active Term Deposits
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Fixed & Term Deposits (FD)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Lock in guaranteed high fixed interest rates with zero market risk. Cumulative quarterly compounding with Section 80C Tax-Saving benefits and DICGC deposit insurance.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 min-w-[150px]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Total Locked Principal
              </span>
              <p className="text-lg font-mono font-bold text-white mt-0.5">
                {formatMoney(totalFixedDepositsUSD)}
              </p>
              <span className="text-[10px] text-slate-400 font-mono">
                {formatIndianWords(totalFixedDepositsUSD)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 min-w-[150px]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Accrued Interest
              </span>
              <p className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
                +{formatMoney(totalAccruedInterest)}
              </p>
              <span className="text-[10px] text-slate-400">
                TDS Compliant
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FD Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Active Term Deposit Accounts ({activeFDs.length})
          </h3>
          <span className="text-xs text-slate-400">
            Total Maturity Value: <span className="font-bold text-white font-mono">{formatMoney(totalProjectedMaturity)}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeFDs.map((fd) => {
            const progress = calculateProgress(fd.startDate, fd.maturityDate);

            return (
              <div
                key={fd.id}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {fd.depositNumber}
                        </span>
                        {fd.taxSaver && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                            Section 80C Tax-Saver (5Y Lock-in)
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-white mt-1.5">
                        {fd.title}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-slate-400">Fixed Rate</span>
                      <div className="text-lg font-bold font-mono text-white">
                        {fd.interestRate}% <span className="text-xs text-slate-400 font-normal">p.a.</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Metrics Box */}
                  <div className="my-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Principal Deposit
                      </span>
                      <p className="text-base font-mono font-bold text-white mt-0.5">
                        {formatMoney(fd.principalAmount)}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Maturity Value
                      </span>
                      <p className="text-base font-mono font-bold text-white mt-0.5">
                        {formatMoney(fd.maturityAmount)}
                      </p>
                    </div>

                    <div className="border-t border-slate-800 pt-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Accrued Interest
                      </span>
                      <p className="font-mono font-semibold text-emerald-400 mt-0.5">
                        +{formatMoney(fd.accruedInterest)}
                      </p>
                    </div>

                    <div className="border-t border-slate-800 pt-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Form 15G / TDS Status
                      </span>
                      <p className="font-semibold text-slate-300 mt-0.5">
                        {fd.form15GStatus || 'Submitted'}
                      </p>
                    </div>
                  </div>

                  {/* Maturity Timeline Progress */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Start: {fd.startDate}
                      </span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <Clock className="w-3 h-3" /> Matures: {fd.maturityDate}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-slate-400 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400">
                    Tenor: <span className="font-semibold text-slate-300">{fd.tenorMonths} Months ({fd.tenorMonths / 12} Yrs)</span>
                  </div>

                  <button
                    onClick={() => setShowCertFD(fd)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
                  >
                    View Deposit Certificate & 80C Proof
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Certificate Modal */}
      {showCertFD && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Fixed Deposit Receipt (FDR)</h3>
                <p className="text-xs text-slate-400 font-mono">FDR #{showCertFD.depositNumber} • Nova Bank India Ltd.</p>
              </div>
              <button
                onClick={() => setShowCertFD(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Scheme Name</span>
                  <span className="font-semibold text-white">{showCertFD.title}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Principal Deposit Amount</span>
                  <span className="font-mono font-bold text-white">{formatMoney(showCertFD.principalAmount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Fixed Rate of Interest</span>
                  <span className="font-mono font-bold text-white">{showCertFD.interestRate}% p.a.</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Maturity Date</span>
                  <span className="font-mono text-slate-200">{showCertFD.maturityDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Total Maturity Value</span>
                  <span className="font-mono font-black text-white">{formatMoney(showCertFD.maturityAmount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Tax Exemption Eligibility</span>
                  <span className="text-slate-200 font-semibold">
                    {showCertFD.taxSaver ? 'Eligible under Section 80C (Income Tax Act, 1961)' : 'Standard Term Deposit'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Registered Nominee</span>
                  <span className="text-slate-300 font-medium">{showCertFD.nominee || 'Sunita Mokal (Mother)'}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 font-semibold text-xs text-white border border-slate-700 transition-all cursor-pointer"
              >
                Print Deposit Certificate
              </button>
              <button
                onClick={() => setShowCertFD(null)}
                className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 font-semibold text-xs text-slate-300 border border-slate-700 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
