import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Receipt,
  Copy,
  Check,
} from 'lucide-react';
import { useBank } from '../context/BankContext';
import { Transaction } from '../types/bank';

interface TransactionHistoryProps {
  searchQuery: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  searchQuery,
}) => {
  const {
    transactions,
    selectedAccountId,
    formatMoney,
  } = useBank();

  const [selectedType, setSelectedType] = useState<'all' | 'credit' | 'debit'>('all');
  const [activeReceiptTx, setActiveReceiptTx] = useState<Transaction | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    if (selectedAccountId && tx.accountId !== selectedAccountId) return false;
    if (selectedType !== 'all' && tx.type !== selectedType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMerchant = tx.merchant.toLowerCase().includes(q);
      const matchDesc = tx.description?.toLowerCase().includes(q);
      const matchCategory = tx.category.toLowerCase().includes(q);
      const matchRef = tx.referenceNumber.toLowerCase().includes(q);
      if (!matchMerchant && !matchDesc && !matchCategory && !matchRef) return false;
    }
    return true;
  });

  const exportToCSV = () => {
    const headers = ['Value Date', 'Particulars', 'Narration', 'Mode', 'Type', 'Category', 'Amount (INR)', 'Running Balance (INR)', 'Status', 'UTR/Ref No'];
    const rows = filtered.map((tx) => [
      new Date(tx.date).toLocaleDateString('en-IN'),
      `"${tx.merchant.replace(/"/g, '""')}"`,
      `"${(tx.description || '').replace(/"/g, '""')}"`,
      tx.mode || 'UPI',
      tx.type,
      tx.category,
      tx.type === 'debit' ? `-${tx.amount}` : `${tx.amount}`,
      tx.balanceAfter,
      tx.status,
      tx.referenceNumber,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NovaBank_Statement_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyReference = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span>Transaction & Statement Ledger</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {filtered.length} Entries
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Real-time verified ledger with UPI, IMPS, NEFT, RTGS & NACH auto-debits
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Type filters */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('credit')}
              className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer ${
                selectedType === 'credit'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Credits
            </button>
            <button
              onClick={() => setSelectedType('debit')}
              className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer ${
                selectedType === 'debit'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Debits
            </button>
          </div>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 divide-y divide-slate-800/80 overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No transaction records found matching your filters.
          </div>
        ) : (
          filtered.map((tx) => (
            <div
              key={tx.id}
              onClick={() => setActiveReceiptTx(tx)}
              className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-850 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                  {tx.type === 'credit' ? (
                    <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-white truncate">
                      {tx.merchant}
                    </p>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                      {tx.mode || 'UPI'}
                    </span>
                    <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {tx.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5 font-mono">
                    {tx.description}
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {new Date(tx.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })} • UTR: {tx.referenceNumber}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div
                  className={`text-sm sm:text-base font-bold font-mono ${
                    tx.type === 'credit' ? 'text-emerald-400' : 'text-white'
                  }`}
                >
                  {tx.type === 'credit' ? '+' : '-'}
                  {formatMoney(tx.amount)}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Bal: {formatMoney(tx.balanceAfter)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Transaction Receipt Modal */}
      {activeReceiptTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-slate-400" />
                <h3 className="text-sm font-bold">Transaction Receipt</h3>
              </div>
              <button
                onClick={() => setActiveReceiptTx(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="text-center py-2">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                  Amount Transacted
                </span>
                <div
                  className={`text-3xl font-black font-mono mt-1 ${
                    activeReceiptTx.type === 'credit' ? 'text-emerald-400' : 'text-white'
                  }`}
                >
                  {activeReceiptTx.type === 'credit' ? '+' : '-'}
                  {formatMoney(activeReceiptTx.amount)}
                </div>
                <span className="inline-block text-[10px] uppercase font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 mt-2">
                  Status: Completed ({activeReceiptTx.mode || 'UPI'})
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Beneficiary / Particulars</span>
                  <span className="font-semibold text-white">{activeReceiptTx.merchant}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Narration</span>
                  <span className="text-slate-300 font-mono text-[11px]">{activeReceiptTx.description}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Category</span>
                  <span className="text-slate-200">{activeReceiptTx.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Date & Time</span>
                  <span className="font-mono text-slate-300">
                    {new Date(activeReceiptTx.date).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800 items-center">
                  <span className="text-slate-400">UTR / Reference No.</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-slate-300">{activeReceiptTx.referenceNumber}</span>
                    <button
                      onClick={() => copyReference(activeReceiptTx.referenceNumber)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                    >
                      {copiedRef ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Closing Balance</span>
                  <span className="font-mono font-bold text-white">
                    {formatMoney(activeReceiptTx.balanceAfter)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 font-semibold text-xs text-white border border-slate-700 transition-all cursor-pointer"
              >
                Print Receipt
              </button>
              <button
                onClick={() => setActiveReceiptTx(null)}
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
