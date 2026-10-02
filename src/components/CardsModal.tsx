import React from 'react';
import { useBank } from '../context/BankContext';
import { CreditCard, Lock, Unlock, ShieldCheck, Check } from 'lucide-react';

interface CardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CardsModal: React.FC<CardsModalProps> = ({ isOpen, onClose }) => {
  const { cards, toggleFreezeCard, formatMoney } = useBank();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-orange-100 text-[#E6390A] flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">bob World RuPay Debit Cards</h3>
              <p className="text-xs text-slate-500">Contactless EMV Chip & PIN</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Card Graphics */}
        {cards.map((c) => (
          <div key={c.id} className="space-y-3">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 p-5 text-white shadow-md space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold tracking-wider text-orange-400">bob World</span>
                  <span className="text-[10px] text-slate-400 font-mono">| RuPay Platinum</span>
                </div>
                <span className="text-[11px] font-mono uppercase bg-white/10 px-2 py-0.5 rounded text-white">
                  {c.isFrozen ? 'FROZEN' : 'ACTIVE'}
                </span>
              </div>

              <div className="font-mono text-base tracking-widest text-slate-200 py-1">
                {c.cardNumber}
              </div>

              <div className="flex justify-between items-end text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Card Holder</span>
                  <span className="font-semibold tracking-wide">{c.cardHolder}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Expires</span>
                  <span className="font-mono">{c.expiry}</span>
                </div>
              </div>
            </div>

            {/* Quick Controls */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Daily ATM & POS Limit</span>
                <span className="font-bold text-slate-900 font-sans">{formatMoney(c.spendingLimit)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Contactless Tap & Pay</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Enabled (Up to ₹5,000)
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-700 font-medium">Temporary Lock Card</span>
                <button
                  onClick={() => toggleFreezeCard(c.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition-all cursor-pointer shadow-2xs"
                >
                  {c.isFrozen ? <Unlock className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-[#E6390A]" />}
                  <span>{c.isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Protected with RuPay 2-Factor Authentication</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
