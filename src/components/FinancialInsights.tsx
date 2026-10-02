import React from 'react';
import { useBank } from '../context/BankContext';
import { TrendingUp } from 'lucide-react';

export const FinancialInsights: React.FC = () => {
  const { monthlyIncomeUSD, monthlyExpensesUSD, totalAssetsUSD, totalLiabilitiesUSD, formatMoney } = useBank();

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-slate-300" />
        <h3 className="text-sm font-bold">Portfolio Overview & Liquidity</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400">Total Liquid Assets</span>
          <p className="text-base font-mono font-bold text-white mt-1">{formatMoney(totalAssetsUSD)}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400">Total Loan Liabilities</span>
          <p className="text-base font-mono font-bold text-rose-400 mt-1">{formatMoney(totalLiabilitiesUSD)}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400">Monthly Inflow</span>
          <p className="text-base font-mono font-bold text-emerald-400 mt-1">+{formatMoney(monthlyIncomeUSD)}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400">Monthly Outflow</span>
          <p className="text-base font-mono font-bold text-slate-200 mt-1">-{formatMoney(monthlyExpensesUSD)}</p>
        </div>
      </div>
    </div>
  );
};
