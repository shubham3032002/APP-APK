import React, { useState } from 'react';
import {
  FileText,
  Printer,
  PieChart,
  Lock,
  Landmark,
  PiggyBank,
} from 'lucide-react';
import { useBank } from '../context/BankContext';

interface BalanceCardProps {
  onOpenStatement: () => void;
  onOpenFDHub?: () => void;
  onOpenLoanHub?: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  onOpenStatement,
  onOpenFDHub,
  onOpenLoanHub,
}) => {
  const {
    totalNetWorthUSD,
    totalLiquidCashUSD,
    totalFixedDepositsUSD,
    totalLoansUSD,
    totalAssetsUSD,
    totalLiabilitiesUSD,
    monthlyIncomeUSD,
    monthlyExpensesUSD,
    formatMoney,
    formatIndianWords,
    isPrivacyMode,
    currency,
    fixedDeposits,
    loans,
  } = useBank();

  const [activeTab, setActiveTab] = useState<'net_worth' | 'savings' | 'fds' | 'loans'>('net_worth');

  const getDisplayedBalance = () => {
    switch (activeTab) {
      case 'net_worth':
        return totalNetWorthUSD;
      case 'savings':
        return totalLiquidCashUSD;
      case 'fds':
        return totalFixedDepositsUSD;
      case 'loans':
        return -totalLoansUSD;
      default:
        return totalNetWorthUSD;
    }
  };

  const getSubtext = () => {
    switch (activeTab) {
      case 'net_worth':
        return `Net Portfolio Worth: Total Assets (${formatMoney(totalAssetsUSD)}) minus Total Loan Liabilities (${formatMoney(totalLiabilitiesUSD)})`;
      case 'savings':
        return '1 Primary High-Yield Savings Account • 4.50% p.a. quarterly compounded interest with DICGC insurance';
      case 'fds':
        return `${fixedDeposits.length} Guaranteed High-Yield Fixed Deposits (Sec 80C Tax-Saver & Cumulative) earning up to 7.90% p.a.`;
      case 'loans':
        return `${loans.length} Active Loan Accounts (Housing Finance Home Loan, Electric Vehicle Auto Loan & Education Loan)`;
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-md text-white">
      
      {/* Top row: Balance category selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('net_worth')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'net_worth'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            Total Net Worth
          </button>
          <button
            onClick={() => setActiveTab('savings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'savings'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PiggyBank className="w-3.5 h-3.5" />
            
          </button>
          <button
            onClick={() => setActiveTab('fds')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'fds'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            2 Fixed Deposits (FD)
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'loans'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            3 Loan Accounts
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            DICGC Insured (Govt. of India)
          </span>
        </div>
      </div>

      {/* Main Balance Display */}
      <div className="my-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm font-medium mb-1">
              <span>
                {activeTab === 'net_worth' && 'Total Available Net Worth (Assets - Liabilities)'}
                {activeTab === 'savings' && 'Primary High-Yield Savings Account Balance'}
                {activeTab === 'fds' && '2 Fixed Deposits (FD) Principal Value'}
                {activeTab === 'loans' && '3 Loans Total Outstanding Liability'}
              </span>
              <span className="text-slate-500 font-mono text-[11px]">({currency.code})</span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h1
                className={`text-3xl sm:text-5xl font-black tracking-tight font-mono ${
                  activeTab === 'loans' ? 'text-rose-400' : 'text-white'
                }`}
              >
                {formatMoney(getDisplayedBalance())}
              </h1>
              {!isPrivacyMode && currency.code === 'INR' && (
                <span className="text-xs font-medium text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 font-mono">
                  {formatIndianWords(getDisplayedBalance())}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-2 max-w-xl">
              {getSubtext()}
            </p>
          </div>

          {/* Quick Stats: Credits & Debits (Salary, Interest & Outflows) */}
          <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="pr-3 border-r border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Monthly Inflows (Salary + Int.)
              </p>
              <p className="text-xs sm:text-sm font-bold font-mono text-emerald-400 mt-0.5">
                +{formatMoney(monthlyIncomeUSD)}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Monthly Outflows (EMIs + Exp.)
              </p>
              <p className="text-xs sm:text-sm font-bold font-mono text-slate-200 mt-0.5">
                -{formatMoney(monthlyExpensesUSD)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Statement & Balance Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {/* View Official Statement */}
        <button
          onClick={onOpenStatement}
          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-medium transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300">
              <FileText className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold block">Official e-Statement</span>
              <span className="text-[10px] text-slate-400 font-normal">Monthly & Annual PDF statement</span>
            </div>
          </div>
        </button>

        {/* Print / Save PDF */}
        <button
          onClick={() => window.print()}
          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-medium transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300">
              <Printer className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold block">Print Balance Sheet</span>
              <span className="text-[10px] text-slate-400 font-normal">Tax & Visa audit verified</span>
            </div>
          </div>
        </button>

        {/* FD & Loan Ledger View */}
        <button
          onClick={onOpenFDHub}
          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-medium transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300">
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold block">2 FDs & 3 Loans</span>
              <span className="text-[10px] text-slate-400 font-normal">80C & 24(b) certificates</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
