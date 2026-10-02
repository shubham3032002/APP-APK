import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  DollarSign,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useBank } from '../context/BankContext';

interface PayLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultLoanId?: string | null;
}

export const PayLoanModal: React.FC<PayLoanModalProps> = ({
  isOpen,
  onClose,
  defaultLoanId,
}) => {
  const { loans, accounts, payLoanEMI, formatMoney } = useBank();

  const activeLoans = loans.filter((l) => l.status === 'active');
  const [selectedLoanId, setSelectedLoanId] = useState<string>(
    defaultLoanId || activeLoans[0]?.id || ''
  );
  const [payType, setPayType] = useState<'emi' | 'prepay'>('emi');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [fromAccountId, setFromAccountId] = useState<string>(accounts[0]?.id || '');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentLoan = loans.find((l) => l.id === selectedLoanId) || activeLoans[0];
  const eligibleAccounts = accounts.filter((a) => a.type !== 'credit');
  const fromAcc = accounts.find((a) => a.id === fromAccountId) || eligibleAccounts[0];

  const amountToPay =
    payType === 'emi'
      ? currentLoan?.emiAmount || 0
      : parseFloat(customAmount) || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!currentLoan) {
      setErrorMsg('Please select a loan');
      return;
    }

    if (amountToPay <= 0) {
      setErrorMsg('Please enter a valid payment amount');
      return;
    }

    if (amountToPay > currentLoan.outstandingBalance) {
      setErrorMsg(`Amount exceeds total outstanding balance of ${formatMoney(currentLoan.outstandingBalance)}`);
      return;
    }

    if (fromAcc && fromAcc.balance < amountToPay) {
      setErrorMsg(`Insufficient funds in ${fromAcc.name}. Available: ${formatMoney(fromAcc.balance)}`);
      return;
    }

    const res = payLoanEMI({
      loanId: currentLoan.id,
      fromAccountId,
      amount: amountToPay,
      isPrepayment: payType === 'prepay',
    });

    if (res.success) {
      setIsSuccess(true);
    } else {
      setErrorMsg(res.error || 'Payment failed');
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setErrorMsg(null);
    setCustomAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Pay Loan EMI / Prepayment</h3>
              <p className="text-xs text-slate-400">
                Direct principal reduction • Zero prepayment penalty
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
              <h4 className="text-xl font-bold text-white">Loan Payment Processed!</h4>
              <p className="text-sm font-mono font-bold text-emerald-400 mt-1">
                ${amountToPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Principal has been adjusted and remaining balance updated in real-time.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4">
            
            {/* Select Loan */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Select Loan Account
              </label>
              <select
                value={selectedLoanId}
                onChange={(e) => setSelectedLoanId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {activeLoans.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title} ({l.loanNumber}) — Outstanding: {formatMoney(l.outstandingBalance)}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Mode Selector */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-center">
              <button
                type="button"
                onClick={() => setPayType('emi')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  payType === 'emi'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Scheduled Monthly EMI ({formatMoney(currentLoan?.emiAmount || 0)})
              </button>
              <button
                type="button"
                onClick={() => setPayType('prepay')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  payType === 'prepay'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Custom Principal Prepay
              </button>
            </div>

            {/* Custom Amount if Prepaying */}
            {payType === 'prepay' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Prepayment Amount ($)
                  </label>
                  <button
                    type="button"
                    onClick={() => setCustomAmount((currentLoan?.outstandingBalance || 0).toString())}
                    className="text-[10px] font-bold text-rose-400 hover:underline"
                  >
                    Pay Off Entire Loan
                  </button>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-base font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    min="100"
                    step="any"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="e.g. 5,000"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-lg font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            )}

            {/* Debit From Account */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Pay From Account
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  Available: {formatMoney(fromAcc?.balance || 0)}
                </span>
              </div>
              <select
                value={fromAccountId}
                onChange={(e) => setFromAccountId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {eligibleAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.accountNumber}) — {formatMoney(acc.balance)}
                  </option>
                ))}
              </select>
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
                className="py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition-all"
              >
                Confirm Payment ({formatMoney(amountToPay)})
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
