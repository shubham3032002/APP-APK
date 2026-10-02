import React, { useState } from 'react';
import {
  Lock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Percent,
  Calendar,
  ShieldCheck,
  Building,
  RotateCw,
} from 'lucide-react';
import { useBank } from '../context/BankContext';

interface OpenFDModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FD_TENOR_RATES = [
  { months: 3, rate: 6.25, label: '3 Months (6.25% p.a.)' },
  { months: 6, rate: 6.90, label: '6 Months (6.90% p.a.)' },
  { months: 12, rate: 7.35, label: '1 Year (7.35% p.a.)' },
  { months: 24, rate: 7.60, label: '2 Years (7.60% p.a.)' },
  { months: 36, rate: 7.80, label: '3 Years (7.80% p.a.)' },
  { months: 60, rate: 8.10, label: '5 Years Super Saver (8.10% p.a.)' },
];

export const OpenFDModal: React.FC<OpenFDModalProps> = ({ isOpen, onClose }) => {
  const {
    accounts,
    openNewFixedDeposit,
    formatMoney,
    profile,
  } = useBank();

  const [principalInput, setPrincipalInput] = useState<string>('10000');
  const [selectedTenorIdx, setSelectedTenorIdx] = useState<number>(2); // 12 Months default
  const [interestPayout, setInterestPayout] = useState<'on_maturity' | 'monthly' | 'quarterly'>('on_maturity');
  const [sourceAccountId, setSourceAccountId] = useState<string>(accounts[0]?.id || '');
  const [autoRenew, setAutoRenew] = useState<boolean>(true);
  const [taxSaver, setTaxSaver] = useState<boolean>(false);
  const [nominee, setNominee] = useState<string>(`${profile.name} (Spouse / Legal Heir)`);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [createdFDNumber, setCreatedFDNumber] = useState<string>('');

  if (!isOpen) return null;

  const currentTenor = FD_TENOR_RATES[selectedTenorIdx];
  const principal = parseFloat(principalInput) || 0;
  const eligibleAccounts = accounts.filter((a) => a.type !== 'credit');
  const fromAcc = accounts.find((a) => a.id === sourceAccountId) || eligibleAccounts[0];

  // Dynamic Compound Interest Math
  const years = currentTenor.months / 12;
  const r = currentTenor.rate / 100;
  const n = 4; // quarterly compounding
  const estimatedMaturityValue = principal > 0 ? principal * Math.pow(1 + r / n, n * years) : 0;
  const estimatedTotalInterest = Math.max(0, estimatedMaturityValue - principal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (principal < 500) {
      setErrorMsg('Minimum Fixed Deposit booking amount is $500.00');
      return;
    }

    if (fromAcc && fromAcc.balance < principal) {
      setErrorMsg(`Insufficient balance in ${fromAcc.name}. Available: ${formatMoney(fromAcc.balance)}`);
      return;
    }

    const res = openNewFixedDeposit({
      title: `${currentTenor.months}-Month High-Yield FD`,
      principalAmount: principal,
      tenorMonths: currentTenor.months,
      interestRate: currentTenor.rate,
      interestPayout,
      linkedAccountId: sourceAccountId,
      autoRenew,
      taxSaver,
      nominee,
    });

    if (res.success && res.fd) {
      setCreatedFDNumber(res.fd.depositNumber);
      setIsSuccess(true);
    } else {
      setErrorMsg(res.error || 'Failed to book Fixed Deposit');
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-white my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Open Fixed Deposit (FD)</h3>
              <p className="text-xs text-slate-400">
                Guaranteed high yield returns • FDIC Insured up to $250,000
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

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10 animate-in zoom-in-95">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Fixed Deposit Booked!</h4>
              <p className="text-xs font-mono text-indigo-400 mt-0.5">Advice Ref: #{createdFDNumber}</p>
              <p className="text-sm font-mono font-bold text-emerald-400 mt-2">
                ${principal.toLocaleString('en-US', { minimumFractionDigits: 2 })} locked @ {currentTenor.rate}% p.a.
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Estimated maturity amount of <strong className="text-white">${estimatedMaturityValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> will be credited on maturity.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4">
            
            {/* Principal Amount Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Deposit Principal Amount ($)
                </label>
                <div className="flex gap-1.5">
                  {[5000, 10000, 25000, 50000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPrincipalInput(amt.toString())}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                    >
                      ${(amt / 1000)}k
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-base font-bold">
                  $
                </span>
                <input
                  type="number"
                  required
                  min="500"
                  step="any"
                  value={principalInput}
                  onChange={(e) => setPrincipalInput(e.target.value)}
                  placeholder="10,000"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-lg font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Tenor & Interest Rate Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Tenor & Guaranteed Interest Rate
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FD_TENOR_RATES.map((t, idx) => (
                  <div
                    key={t.months}
                    onClick={() => setSelectedTenorIdx(idx)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedTenorIdx === idx
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/50'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{t.months} Months</span>
                      <span className="text-[10px] font-mono font-extrabold text-emerald-400 bg-emerald-500/10 px-1 rounded">
                        {t.rate}%
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {t.months >= 12 ? `${t.months / 12} Year Term` : 'Short Term'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interest Payout Option */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
              <button
                type="button"
                onClick={() => setInterestPayout('on_maturity')}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                  interestPayout === 'on_maturity'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                On Maturity (Cumulative)
              </button>
              <button
                type="button"
                onClick={() => setInterestPayout('quarterly')}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                  interestPayout === 'quarterly'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Quarterly Payout
              </button>
              <button
                type="button"
                onClick={() => setInterestPayout('monthly')}
                className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                  interestPayout === 'monthly'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Income
              </button>
            </div>

            {/* Live Returns Calculator Summary Box */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-slate-900 border border-indigo-500/30 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Interest Earned</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  +{formatMoney(estimatedTotalInterest)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1.5 border-t border-slate-800">
                <span className="text-slate-200 font-bold">Estimated Maturity Value</span>
                <span className="font-mono font-black text-amber-400 text-base">
                  {formatMoney(estimatedMaturityValue)}
                </span>
              </div>
            </div>

            {/* Funding Source Account */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Fund From Account
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  Available: {formatMoney(fromAcc?.balance || 0)}
                </span>
              </div>
              <select
                value={sourceAccountId}
                onChange={(e) => setSourceAccountId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {eligibleAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.accountNumber}) — {formatMoney(acc.balance)}
                  </option>
                ))}
              </select>
            </div>

            {/* Nominee & Toggles */}
            <div className="space-y-2 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nominee / Beneficiary Details
                </label>
                <input
                  type="text"
                  value={nominee}
                  onChange={(e) => setNominee(e.target.value)}
                  placeholder="Nominee full legal name"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs">
                <div className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4 text-blue-400" />
                  <div>
                    <span className="font-semibold text-white block">Auto-Renew on Maturity</span>
                    <span className="text-[10px] text-slate-400">Reinvest principal & accrued interest seamlessly</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoRenew}
                  onChange={(e) => setAutoRenew(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                />
              </div>
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
                className="py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all"
              >
                Confirm & Book FD
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
