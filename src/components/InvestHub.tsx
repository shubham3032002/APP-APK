import React from 'react';
import { useBank } from '../context/BankContext';
import { TrendingUp, PieChart, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface InvestHubProps {
  onOpenStatement: () => void;
}

export const InvestHub: React.FC<InvestHubProps> = ({ onOpenStatement }) => {
  const { formatMoney } = useBank();

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-4 space-y-4 animate-in fade-in">
      {/* Overview Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-slate-300">Total Portfolio Investments</span>
          <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
            +14.8% Returns
          </span>
        </div>
        <div className="text-2xl font-bold font-sans">
          {formatMoney(375000)}
        </div>
        <p className="text-xs text-slate-400">
          Linked with BSE Star MF, Demat & ASBA e-IPO Services
        </p>
      </div>

      {/* Mutual Funds & SIPs */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#E6390A]" />
            <h4 className="text-sm font-bold text-slate-900">Active Monthly SIPs</h4>
          </div>
          <span className="text-xs font-bold text-slate-700">₹15,000/mo</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-800">HDFC Flexi Cap Fund - Direct (G)</p>
              <p className="text-[10px] text-slate-500 font-mono">SIP on 10th of every month (NACH)</p>
            </div>
            <span className="font-bold text-slate-900">₹10,000</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
            <div>
              <p className="font-bold text-slate-800">Nippon India Small Cap Fund - Growth</p>
              <p className="text-[10px] text-slate-500 font-mono">SIP on 10th of every month (NACH)</p>
            </div>
            <span className="font-bold text-slate-900">₹5,000</span>
          </div>
        </div>
      </div>

      {/* ASBA e-IPO Status */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">ASBA e-IPO Services</h4>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            No Active Lien
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Your savings account balance remains earning interest until allotment is finalized.
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={onOpenStatement}
        className="w-full py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <span>View Investment Ledger Transactions</span>
        <ArrowUpRight className="w-4 h-4" />
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>SEBI Regulated Mutual Fund Distributor</span>
      </div>
    </div>
  );
};
