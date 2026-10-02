import React from 'react';
import { useBank } from '../context/BankContext';
import { CreditCard, Lock, Unlock } from 'lucide-react';

export const CardManagement: React.FC = () => {
  const { cards, toggleFreezeCard, formatMoney } = useBank();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Debit & ATM Cards</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((c) => (
          <div key={c.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-slate-300" />
                <span className="font-bold text-sm">{c.cardHolder}</span>
              </div>
              <span className="text-[10px] uppercase font-bold bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700 font-mono">
                {c.network}
              </span>
            </div>
            <div className="font-mono text-base tracking-widest text-slate-200">{c.cardNumber}</div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Expires: {c.expiry}</span>
              <span>Daily Limit: {formatMoney(c.spendingLimit)}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs text-slate-400">Status: {c.isFrozen ? 'Frozen' : 'Active'}</span>
              <button
                onClick={() => toggleFreezeCard(c.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700"
              >
                {c.isFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{c.isFrozen ? 'Unfreeze' : 'Freeze Card'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
