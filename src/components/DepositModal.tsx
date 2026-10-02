import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  DollarSign,
  PlusCircle,
  Sparkles,
  Shield,
  CreditCard,
  Building,
  Upload,
} from 'lucide-react';
import { useBank } from '../context/BankContext';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDestinationAccountId?: string | null;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  defaultDestinationAccountId,
}) => {
  const { accounts, depositMoney, formatMoney } = useBank();

  const [depositMethod, setDepositMethod] = useState<'check' | 'instant_card' | 'ach'>('check');
  const [toAccountId, setToAccountId] = useState<string>(
    defaultDestinationAccountId || accounts[0]?.id || ''
  );
  const [amountInput, setAmountInput] = useState<string>('');
  const [checkPayer, setCheckPayer] = useState<string>('');
  const [hasCapturedFront, setHasCapturedFront] = useState(false);
  const [hasCapturedBack, setHasCapturedBack] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const eligibleAccounts = accounts.filter((a) => a.type !== 'credit');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg('Please enter a valid deposit amount');
      return;
    }

    if (depositMethod === 'check' && (!hasCapturedFront || !hasCapturedBack)) {
      setErrorMsg('Please capture photos of both the front and back of the check');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const res = depositMoney({
        toAccountId,
        amount,
        source: depositMethod === 'check' ? 'check' : depositMethod === 'instant_card' ? 'instant_card' : 'ach',
        memo: checkPayer ? `Check from ${checkPayer}` : undefined,
      });

      setIsProcessing(false);
      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorMsg(res.error || 'Deposit failed');
      }
    }, 1000);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setAmountInput('');
    setCheckPayer('');
    setHasCapturedFront(false);
    setHasCapturedBack(false);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Deposit Funds & Clear Checks</h3>
              <p className="text-xs text-slate-400">
                Instant clearing • Zero hold policy for priority members
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
              <h4 className="text-xl font-bold text-white">Deposit Processed!</h4>
              <p className="text-sm font-mono font-bold text-emerald-400 mt-1">
                +${parseFloat(amountInput).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Funds are immediately credited to your balance and available for spend.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4">
            
            {/* Deposit Method Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <button
                type="button"
                onClick={() => setDepositMethod('check')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  depositMethod === 'check'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mobile Check
              </button>
              <button
                type="button"
                onClick={() => setDepositMethod('instant_card')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  depositMethod === 'instant_card'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Instant Card Load
              </button>
              <button
                type="button"
                onClick={() => setDepositMethod('ach')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  depositMethod === 'ach'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                External ACH Wire
              </button>
            </div>

            {/* Destination Account */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Deposit Into Account
              </label>
              <select
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {eligibleAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.accountNumber}) — Current: {formatMoney(acc.balance)}
                  </option>
                ))}
              </select>
            </div>

            {/* Check Amount */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Deposit Amount ($)
                </label>
                <div className="flex gap-1.5">
                  {[250, 500, 1500, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmountInput(amt.toString())}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                    >
                      ${amt}
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
                  min="1"
                  step="any"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-lg font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Check capture simulation UI */}
            {depositMethod === 'check' ? (
              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Check Issuer / Payer
                  </label>
                  <input
                    type="text"
                    value={checkPayer}
                    onChange={(e) => setCheckPayer(e.target.value)}
                    placeholder="e.g. Apex Corp, John Doe, IRS Tax Refund"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Front of Check */}
                  <div
                    onClick={() => setHasCapturedFront(!hasCapturedFront)}
                    className={`p-3.5 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                      hasCapturedFront
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-slate-800/40 border-slate-700 hover:border-slate-500 text-slate-400'
                    }`}
                  >
                    {hasCapturedFront ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 mb-1 text-emerald-400" />
                        <span className="text-xs font-bold">Front Captured</span>
                        <span className="text-[10px] opacity-80">Tap to retake</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-6 h-6 mb-1" />
                        <span className="text-xs font-semibold">Front of Check</span>
                        <span className="text-[10px] text-slate-500">Tap to scan</span>
                      </>
                    )}
                  </div>

                  {/* Back of Check */}
                  <div
                    onClick={() => setHasCapturedBack(!hasCapturedBack)}
                    className={`p-3.5 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                      hasCapturedBack
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-slate-800/40 border-slate-700 hover:border-slate-500 text-slate-400'
                    }`}
                  >
                    {hasCapturedBack ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 mb-1 text-emerald-400" />
                        <span className="text-xs font-bold">Back Endorsed</span>
                        <span className="text-[10px] opacity-80">Tap to retake</span>
                      </>
                    ) : (
                      <>
                        <Camera className="w-6 h-6 mb-1" />
                        <span className="text-xs font-semibold">Back (Endorsement)</span>
                        <span className="text-[10px] text-slate-500">Tap to scan</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 text-[11px] text-slate-400">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Please sign your name on the back and write "For Nova Mobile Deposit Only".</span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white">
                  <CreditCard className="w-4 h-4 text-blue-400" />
                  <span>Instant Debit Load Protocol</span>
                </div>
                <p className="text-slate-400">
                  Funds will be pulled from your linked external Visa Debit (•••• 1029) and credited in 0.4 seconds.
                </p>
              </div>
            )}

            {errorMsg && (
              <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>
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
                disabled={isProcessing}
                className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Verifying with AI...</span>
                ) : (
                  <span>Confirm & Deposit</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
