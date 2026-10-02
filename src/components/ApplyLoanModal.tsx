import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Home,
  Car,
  GraduationCap,
  Percent,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { useBank } from '../context/BankContext';
import { BankLoan } from '../types/bank';

interface ApplyLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_LOANS: {
  type: BankLoan['loanType'];
  title: string;
  defaultRate: number;
  maxAmount: number;
  tenorOptions: number[]; // in months
}[] = [
  {
    type: 'personal',
    title: 'Pre-Approved Instant Personal Loan',
    defaultRate: 7.99,
    maxAmount: 50000,
    tenorOptions: [12, 24, 36, 48, 60],
  },
  {
    type: 'car',
    title: 'Zero-Emission Green Auto / EV Loan',
    defaultRate: 4.89,
    maxAmount: 100000,
    tenorOptions: [24, 36, 48, 60, 72, 84],
  },
  {
    type: 'home',
    title: 'Prime Residential Home Mortgage',
    defaultRate: 6.25,
    maxAmount: 1000000,
    tenorOptions: [120, 180, 240, 360],
  },
  {
    type: 'education',
    title: 'Global University & Executive MBA Loan',
    defaultRate: 5.15,
    maxAmount: 80000,
    tenorOptions: [24, 36, 48, 60, 84],
  },
  {
    type: 'gold',
    title: 'Instant Sovereign Gold Backed Credit',
    defaultRate: 6.75,
    maxAmount: 60000,
    tenorOptions: [6, 12, 24, 36],
  },
];

export const ApplyLoanModal: React.FC<ApplyLoanModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { accounts, applyInstantLoan, formatMoney, profile } = useBank();

  const [selectedLoanIdx, setSelectedLoanIdx] = useState<number>(0);
  const [amountInput, setAmountInput] = useState<string>('25000');
  const [selectedTenure, setSelectedTenure] = useState<number>(36);
  const [depositAccId, setDepositAccId] = useState<string>(accounts[0]?.id || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [disbursedLoan, setDisbursedLoan] = useState<BankLoan | null>(null);

  if (!isOpen) return null;

  const currentLoanConfig = PRESET_LOANS[selectedLoanIdx];
  const amount = parseFloat(amountInput) || 0;
  const eligibleAccounts = accounts.filter((a) => a.type !== 'credit');

  // Dynamic EMI Calculation
  const monthlyR = currentLoanConfig.defaultRate / 12 / 100;
  const nMonths = selectedTenure;
  const estimatedEMI =
    amount > 0
      ? Math.round(
          (amount * monthlyR * Math.pow(1 + monthlyR, nMonths)) /
            (Math.pow(1 + monthlyR, nMonths) - 1)
        )
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (amount < 1000) {
      setErrorMsg('Minimum loan application amount is $1,000');
      return;
    }

    if (amount > currentLoanConfig.maxAmount) {
      setErrorMsg(`Maximum allowed for this facility is ${formatMoney(currentLoanConfig.maxAmount)}`);
      return;
    }

    const res = applyInstantLoan({
      loanType: currentLoanConfig.type,
      title: currentLoanConfig.title,
      amount,
      tenureMonths: selectedTenure,
      interestRate: currentLoanConfig.defaultRate,
      depositToAccountId: depositAccId,
    });

    if (res.success && res.loan) {
      setDisbursedLoan(res.loan);
      setIsSuccess(true);
    } else {
      setErrorMsg(res.error || 'Loan application failed');
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMsg(null);
    setDisbursedLoan(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-white my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500/20 to-indigo-500/20 text-rose-400 border border-rose-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Instant Pre-Approved Loan Disbursal</h3>
              <p className="text-xs text-slate-400">
                0 paperwork • Instant credit to your checking balance in seconds
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {isSuccess && disbursedLoan ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10 animate-in zoom-in-95">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                Approved & Disbursed Instantly
              </span>
              <h4 className="text-xl font-bold text-white mt-1">
                +${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Funds have been deposited into your account balance and are ready to spend immediately.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 text-left max-w-sm mx-auto font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Loan Account Ref:</span>
                <span className="text-white font-bold">{disbursedLoan.loanNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Monthly EMI:</span>
                <span className="text-emerald-400 font-bold">${disbursedLoan.emiAmount}/mo</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>First Installment Due:</span>
                <span className="text-white">{disbursedLoan.nextDueDate}</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg transition-all"
              >
                View Updated Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4">
            
            {/* Select Loan Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Pre-Approved Loan Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_LOANS.map((l, idx) => (
                  <div
                    key={l.type}
                    onClick={() => {
                      setSelectedLoanIdx(idx);
                      setSelectedTenure(l.tenorOptions[Math.floor(l.tenorOptions.length / 2)]);
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedLoanIdx === idx
                        ? 'bg-rose-600/20 border-rose-500 text-white shadow-sm ring-1 ring-rose-500/50'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold capitalize">{l.type} Loan</span>
                      <span className="text-[10px] font-mono font-extrabold text-rose-400 bg-rose-500/10 px-1 rounded">
                        {l.defaultRate}%
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Up to ${ (l.maxAmount / 1000) }k
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Loan Amount Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Required Loan Amount ($)
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  Max: {formatMoney(currentLoanConfig.maxAmount)}
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-base font-bold">
                  $
                </span>
                <input
                  type="number"
                  required
                  min="1000"
                  max={currentLoanConfig.maxAmount}
                  step="500"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="25,000"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-lg font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Tenure selector pills */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Repayment Tenure
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {currentLoanConfig.tenorOptions.map((months) => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => setSelectedTenure(months)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                      selectedTenure === months
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    {months >= 12 ? `${months / 12} Years (${months}m)` : `${months} Months`}
                  </button>
                ))}
              </div>
            </div>

            {/* Realtime Calculated EMI Breakdown */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/70 to-slate-900 border border-rose-500/30 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Fixed Rate of Interest</span>
                <span className="font-mono font-bold text-white">
                  {currentLoanConfig.defaultRate}% APR
                </span>
              </div>
              <div className="flex justify-between items-center pt-1.5 border-t border-slate-800">
                <span className="text-slate-200 font-bold">Estimated Monthly EMI</span>
                <span className="font-mono font-black text-rose-400 text-base">
                  ${estimatedEMI.toLocaleString('en-US', { minimumFractionDigits: 2 })}/mo
                </span>
              </div>
            </div>

            {/* Disbursal Account */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Disburse Funds Directly Into
              </label>
              <select
                value={depositAccId}
                onChange={(e) => setDepositAccId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {eligibleAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.accountNumber}) — Current: {formatMoney(acc.balance)}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-800/60 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Priority Customer Privilege: Pre-verified KYC • Instant disbursal approval</span>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition-all"
              >
                Approve & Disburse Funds
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
