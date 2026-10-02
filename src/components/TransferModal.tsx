import React, { useState } from 'react';
import {
  Send,
  ArrowRightLeft,
  User,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Building,
  Lock,
} from 'lucide-react';
import { useBank } from '../context/BankContext';
import { TransactionCategory } from '../types/bank';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSourceAccountId?: string | null;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  defaultSourceAccountId,
}) => {
  const {
    accounts,
    transferMoney,
    formatMoney,
  } = useBank();

  const [transferType, setTransferType] = useState<'internal' | 'zelle' | 'wire'>('internal');
  const [fromAccountId, setFromAccountId] = useState<string>(
    defaultSourceAccountId || accounts[0]?.id || ''
  );
  const [toAccountId, setToAccountId] = useState<string>(
    accounts[1]?.id || ''
  );
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientContact, setRecipientContact] = useState<string>('');
  const [amountInput, setAmountInput] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [category, setCategory] = useState<TransactionCategory>('Transfer');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const fromAcc = accounts.find((a) => a.id === fromAccountId) || accounts[0];
  const eligibleDestinationAccounts = accounts.filter((a) => a.id !== fromAccountId);

  const quickContacts = [
    { name: 'Sophia Chen', contact: 'sophia.c@design.io', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100' },
    { name: 'Marcus Vance', contact: '+1 (555) 319-8801', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    { name: 'Elena Rostova', contact: 'elena@rostova.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100' },
    { name: 'Liam O\'Connor', contact: '+1 (555) 882-9912', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  ];

  const handleMaxAmount = () => {
    if (fromAcc) {
      setAmountInput(fromAcc.balance.toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg('Please enter a valid transfer amount');
      return;
    }

    if (transferType === 'internal') {
      if (!toAccountId) {
        setErrorMsg('Please select destination account');
        return;
      }
      const res = transferMoney({
        fromAccountId,
        toAccountId,
        amount,
        category,
        note,
        transferType: 'internal',
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Transfer failed');
        return;
      }
    } else {
      if (!recipientName.trim()) {
        setErrorMsg('Please enter recipient name');
        return;
      }
      const res = transferMoney({
        fromAccountId,
        recipientName,
        recipientDetails: recipientContact || 'Zelle Direct Instant',
        amount,
        category,
        note,
        transferType: transferType === 'zelle' ? 'zelle' : 'wire',
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Transfer failed');
        return;
      }
    }

    setIsSuccess(true);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setAmountInput('');
    setNote('');
    setRecipientName('');
    setRecipientContact('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Transfer Money & Instant Pay</h3>
              <p className="text-xs text-slate-400">
                Zero fees • Instant real-time settlement
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
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Transfer Completed!</h4>
              <p className="text-sm font-mono font-bold text-emerald-400 mt-1">
                ${parseFloat(amountInput).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Funds have been transferred and your account balance is updated in real-time.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4">
            
            {/* Transfer Type Selector */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <button
                type="button"
                onClick={() => setTransferType('internal')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  transferType === 'internal'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Between Accounts
              </button>
              <button
                type="button"
                onClick={() => setTransferType('zelle')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  transferType === 'zelle'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Zelle® Instant
              </button>
              <button
                type="button"
                onClick={() => setTransferType('wire')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  transferType === 'wire'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Bank Wire / ACH
              </button>
            </div>

            {/* From Account */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  From Account
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  Available: {formatMoney(fromAcc?.availableBalance || 0)}
                </span>
              </div>
              <select
                value={fromAccountId}
                onChange={(e) => setFromAccountId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.accountNumber}) — {formatMoney(acc.balance)}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination */}
            {transferType === 'internal' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  To Account
                </label>
                <select
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {eligibleDestinationAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.accountNumber}) — {formatMoney(acc.balance)}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Quick contact pills */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Quick Contacts
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {quickContacts.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => {
                          setRecipientName(c.name);
                          setRecipientContact(c.contact);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-all shrink-0"
                      >
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-medium">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Sophia Chen"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone / Email / Account #
                    </label>
                    <input
                      type="text"
                      value={recipientContact}
                      onChange={(e) => setRecipientContact(e.target.value)}
                      placeholder="sophia@example.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Amount */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Amount ($)
                </label>
                <div className="flex items-center gap-1.5">
                  {[100, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmountInput(amt.toString())}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                    >
                      +${amt}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleMaxAmount}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-base font-bold">
                  $
                </span>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="any"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-lg font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Note & Category */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Transfer">Transfer</option>
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Housing & Utilities">Housing & Rent</option>
                  <option value="Bills">Bills</option>
                  <option value="Travel">Travel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Memo / Note (Optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Dinner split, invoice, etc."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all"
              >
                Confirm & Send
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
