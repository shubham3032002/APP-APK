import React, { useState } from 'react';
import {
  FileText,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { useBank } from '../context/BankContext';

interface StatementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatementModal: React.FC<StatementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    profile,
    accounts,
    transactions,
    formatMoney,
    totalNetWorthUSD,
    monthlyIncomeUSD,
    monthlyExpensesUSD,
  } = useBank();

  const [statementPeriod] = useState('01-Aug-2026 to 31-Aug-2026');
  const [selectedAccFilter, setSelectedAccFilter] = useState('all');

  if (!isOpen) return null;

  const filteredTx = transactions.filter((tx) =>
    selectedAccFilter === 'all' ? true : tx.accountId === selectedAccFilter
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl text-white my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Official Bank e-Statement</h3>
              <p className="text-xs text-slate-400">
                Verified financial document • Suitable for ITR filing, visa & official loan audit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 border border-slate-700 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Printable Statement Body */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6 print:p-0 print:bg-white print:text-black">
          
          {/* Statement Letterhead */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
                  NB
                </div>
                <span className="font-bold text-base tracking-tight text-white">
                  NOVA BANK INDIA LTD.
                </span>
              </div>
              <p className="text-xs text-slate-400">BKC Branch, Bandra Kurla Complex, Mumbai - 400051</p>
              <p className="text-xs text-slate-400">IFSC: NOVA0000842 • MICR: 400240019 • Scheduled Commercial Bank</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Official Statement of Account
              </span>
              <p className="text-sm font-bold text-white mt-0.5">{statementPeriod}</p>
              <p className="text-xs text-slate-400 font-mono">Ref: NB-IN-{Date.now().toString().slice(-8)}</p>
            </div>
          </div>

          {/* Account Details & Balances */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Account Holder Information</span>
              <p className="text-sm font-bold text-white">{profile.name}</p>
              <p className="text-slate-300">{profile.email}</p>
              <p className="text-slate-300">{profile.phone}</p>
              <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                <span>PAN: <strong className="font-mono text-slate-200">{profile.panNumber || 'ABCDE1234F'}</strong></span>
                <span>•</span>
                <span>CIF: <strong className="font-mono text-slate-200">{profile.cifNumber || '594830219'}</strong></span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Statement Financial Summary (INR)</span>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Total Credits (Salary + Int.)</span>
                <span className="font-mono font-bold text-emerald-400">+{formatMoney(monthlyIncomeUSD)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Total Debits (EMIs + Exp.)</span>
                <span className="font-mono font-bold text-slate-200">-{formatMoney(monthlyExpensesUSD)}</span>
              </div>
              <div className="flex justify-between py-1 pt-1.5">
                <span className="text-slate-300 font-bold">Total Net Portfolio Worth</span>
                <span className="font-mono font-bold text-white text-sm">{formatMoney(totalNetWorthUSD)}</span>
              </div>
            </div>
          </div>

          {/* Account Selector Filter */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Account View:</span>
            <select
              value={selectedAccFilter}
              onChange={(e) => setSelectedAccFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
            >
              <option value="all">Consolidated Portfolio (All Accounts)</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.accountNumber}) — {formatMoney(a.balance)}
                </option>
              ))}
            </select>
          </div>

          {/* Transactions Ledger Table */}
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono text-[11px]">
                <tr>
                  <th className="p-3">Value Date</th>
                  <th className="p-3">Narration</th>
                  <th className="p-3">Mode & UTR / Ref</th>
                  <th className="p-3 text-right">Amount (₹)</th>
                  <th className="p-3 text-right">Running Balance (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                {filteredTx.map((tx) => (
                  <tr key={tx.id}>
                    <td className="p-3 font-mono text-slate-400 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-3 font-medium text-white">
                      <div>{tx.merchant}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{tx.description}</div>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-300">
                      <span className="px-1 py-0.2 rounded bg-slate-800 text-[10px] font-bold text-slate-300 mr-1">
                        {tx.mode || 'UPI'}
                      </span>
                      {tx.referenceNumber}
                    </td>
                    <td
                      className={`p-3 font-mono font-bold text-right ${
                        tx.type === 'credit' ? 'text-emerald-400' : 'text-slate-200'
                      }`}
                    >
                      {tx.type === 'credit' ? '+' : '-'}
                      {formatMoney(tx.amount)}
                    </td>
                    <td className="p-3 font-mono text-slate-300 text-right">
                      {formatMoney(tx.balanceAfter)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legal Sign-off Seal */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Certified Electronic Record • Regulated by RBI • DICGC Insured</span>
            </div>
            <div className="font-mono text-[10px] text-slate-500">
              Page 1 of 1 • System Generated CBS
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-all cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-xs font-bold text-white border border-slate-700 transition-all cursor-pointer flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print e-Statement</span>
          </button>
        </div>
      </div>
    </div>
  );
};
