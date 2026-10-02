import React from 'react';
import { useBank } from '../context/BankContext';
import { PiggyBank } from 'lucide-react';

export const SavingsVaults: React.FC = () => {
  const { savingsGoals, formatMoney } = useBank();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Savings Goals & Vaults</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savingsGoals.map((g) => {
          const pct = Math.round((g.currentAmount / g.targetAmount) * 100);
          return (
            <div key={g.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PiggyBank className="w-5 h-5 text-slate-300" />
                  <span className="font-bold text-sm">{g.title}</span>
                </div>
                <span className="text-xs font-mono text-slate-400">{pct}%</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Saved: {formatMoney(g.currentAmount)}</span>
                <span>Target: {formatMoney(g.targetAmount)}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
