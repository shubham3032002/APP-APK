import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Search,
  ShieldCheck,
  Award,
  PiggyBank,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Sparkles,
  Building,
} from 'lucide-react';
import { useBank } from '../context/BankContext';

export const StatementHub: React.FC = () => {
  const {
    profile,
    memberShares,
    accounts,
    fixedDeposits,
    loans,
    transactions,
    formatMoney,
    formatIndianWords,
  } = useBank();

  const [selectedAccId, setSelectedAccId] = useState<string>('all');
  const [statementPeriod, setStatementPeriod] = useState<string>('aug_2026');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchAccount = selectedAccId === 'all' || tx.accountId === selectedAccId;
    const matchType = filterType === 'all' || tx.type === filterType;
    const matchCategory = categoryFilter === 'all' || tx.category === categoryFilter;
    const matchSearch =
      searchTerm === '' ||
      tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.description && tx.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tx.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchAccount && matchType && matchCategory && matchSearch;
  });

  const periodLabels: Record<string, string> = {
    aug_2026: '01-Aug-2026 to 31-Aug-2026 (Current Month)',
    jul_2026: '01-Jul-2026 to 31-Jul-2026',
    q1_fy27: '01-Apr-2026 to 30-Jun-2026 (Q1 FY 2026-27)',
    fy_2025_26: '01-Apr-2025 to 31-Mar-2026 (Annual Audit FY 2025-26)',
  };

  const selectedAcc = accounts.find((a) => a.id === selectedAccId);

  const totalCreditsInView = filteredTransactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebitsInView = filteredTransactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      
      {/* Top Banner - Society Warm Gradient */}
      <div className="rounded-3xl bg-gradient-to-br from-[#E6390A] via-[#F1592A] to-[#D72B00] p-5 sm:p-6 text-white shadow-lg shadow-orange-700/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3 h-3" /> Member Passbook & Ledger
              </span>
              <span className="text-[10px] text-orange-100 font-medium bg-black/15 px-2 py-0.5 rounded-full">
                सभासद पासबुक
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Society Member Consolidated Passbook
            </h2>
            <p className="text-xs text-orange-100/90 max-w-xl">
              Complete entries for Pigmy Daily deposits, Annual Dividends, Monthly RD, and Loan EMI debits.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-orange-50 text-slate-900 font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
          >
            <Printer className="w-4 h-4 text-[#E6390A]" />
            <span>Print Passbook PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-3xl bg-white border border-orange-100 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Select Account / Scheme */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Select Scheme / Ledger
            </label>
            <select
              value={selectedAccId}
              onChange={(e) => setSelectedAccId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-orange-50/40 border border-orange-200/80 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#E6390A]"
            >
              <option value="all">Consolidated Member Passbook (All Schemes)</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.accountNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Select Period */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Statement Period
            </label>
            <select
              value={statementPeriod}
              onChange={(e) => setStatementPeriod(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-orange-50/40 border border-orange-200/80 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#E6390A]"
            >
              <option value="aug_2026">August 2026 (Current Month)</option>
              <option value="jul_2026">July 2026 (Dividend Month)</option>
              <option value="q1_fy27">Q1 FY 2026-27 (Apr - Jun 2026)</option>
              <option value="fy_2025_26">Financial Year 2025-26 (Annual Audit)</option>
            </select>
          </div>
        </div>

        {/* Search & Transaction Type Filter */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-orange-100/80">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search receipt #, agent, narration..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-orange-50/40 border border-orange-200/80 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#E6390A]"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer text-center ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-orange-50'
              }`}
            >
              All ({filteredTransactions.length})
            </button>
            <button
              onClick={() => setFilterType('credit')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer text-center ${
                filterType === 'credit'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50'
              }`}
            >
              Credits
            </button>
            <button
              onClick={() => setFilterType('debit')}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer text-center ${
                filterType === 'debit'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-rose-50'
              }`}
            >
              Debits
            </button>
          </div>
        </div>
      </div>

      {/* Society Passbook Preview */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-orange-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-orange-100 gap-2">
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {memberShares.societyName}
            </h3>
            <p className="text-[11px] font-mono text-slate-500 truncate">
              {profile.name} • #{memberShares.memberNumber} • Folio: {memberShares.shareFolioNumber}
            </p>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#E6390A] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 block truncate">
              {periodLabels[statementPeriod] || statementPeriod}
            </span>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          <div className="p-2.5 sm:p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-0.5">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block truncate">
              Total Credits
            </span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-700 font-sans truncate block">
              +{formatMoney(totalCreditsInView)}
            </span>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-0.5">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block truncate">
              Total Debits
            </span>
            <span className="text-sm sm:text-base font-extrabold text-rose-600 font-sans truncate block">
              -{formatMoney(totalDebitsInView)}
            </span>
          </div>

          <div className="p-2.5 sm:p-3.5 rounded-2xl bg-orange-50/50 border border-orange-100 space-y-0.5 col-span-2 sm:col-span-1">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block truncate">
              Share Capital
            </span>
            <span className="text-sm sm:text-base font-extrabold text-slate-900 font-sans truncate block">
              {formatMoney(memberShares.totalShareCapital)}
            </span>
          </div>
        </div>

        {/* Mobile Passbook Cards List (Visible on mobile) */}
        <div className="block sm:hidden space-y-2.5">
          {filteredTransactions.map((tx) => {
            const isCredit = tx.type === 'credit';
            return (
              <div
                key={tx.id}
                className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        isCredit
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-xs truncate leading-tight">
                        {tx.merchant}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {tx.description || tx.category} • {tx.mode || 'SOCIETY'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`font-sans font-bold text-xs ${
                        isCredit ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isCredit ? '+' : '-'} {formatMoney(tx.amount)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-200/60 font-mono">
                  <span>
                    {new Date(tx.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="truncate max-w-[120px]">Ref: {tx.referenceNumber}</span>
                  <span className="font-bold text-slate-700">
                    Bal: {formatMoney(tx.balanceAfter || 85250.75)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Passbook Table (Visible on tablet & desktop) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-orange-100 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Narration & Voucher / Agent</th>
                <th className="py-2.5 px-3">Receipt / Ref #</th>
                <th className="py-2.5 px-3 text-right">Amount (INR)</th>
                <th className="py-2.5 px-3 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100/60">
              {filteredTransactions.map((tx) => {
                const isCredit = tx.type === 'credit';
                return (
                  <tr key={tx.id} className="hover:bg-orange-50/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                            isCredit
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {isCredit ? (
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs leading-tight">
                            {tx.merchant}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {tx.description || tx.category} • {tx.mode || 'SOCIETY'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">
                      {tx.referenceNumber}
                    </td>
                    <td className="py-3 px-3 text-right font-sans font-bold whitespace-nowrap">
                      <span className={isCredit ? 'text-emerald-600' : 'text-rose-600'}>
                        {isCredit ? '+' : '-'} {formatMoney(tx.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-sans font-bold text-slate-800 whitespace-nowrap">
                      {formatMoney(tx.balanceAfter || 85250.75)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
