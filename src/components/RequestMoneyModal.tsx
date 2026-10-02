import React, { useState } from 'react';
import { QrCode, Copy, Check, Share2, Sparkles, User, DollarSign } from 'lucide-react';
import { useBank } from '../context/BankContext';

interface RequestMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestMoneyModal: React.FC<RequestMoneyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { profile, accounts, formatMoney } = useBank();

  const [amountInput, setAmountInput] = useState<string>('50');
  const [note, setNote] = useState<string>('Dinner split & drinks');
  const [selectedAccId, setSelectedAccId] = useState<string>(
    accounts[0]?.id || ''
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const targetAccount = accounts.find((a) => a.id === selectedAccId) || accounts[0];
  const paymentLink = `https://pay.novabank.com/@${profile.name.toLowerCase().replace(/\s+/g, '')}?amt=${amountInput || '0'}&ref=NOVA-${Date.now().toString().slice(-6)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Request Money & QR Code</h3>
              <p className="text-xs text-slate-400">
                Receive instant deposits via QR scan or payment link
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="py-4 space-y-4">
          
          {/* QR Code Frame */}
          <div className="p-5 rounded-3xl bg-white flex flex-col items-center justify-center shadow-lg text-slate-900">
            {/* SVG Dynamic QR Code representation */}
            <div className="relative p-2 bg-white rounded-2xl border-4 border-slate-900">
              <svg
                viewBox="0 0 100 100"
                className="w-36 h-36 sm:w-40 sm:h-40 fill-slate-900"
              >
                {/* Standard QR Pattern corner squares */}
                <rect x="0" y="0" width="28" height="28" fill="#0f172a" rx="4" />
                <rect x="4" y="4" width="20" height="20" fill="white" rx="2" />
                <rect x="8" y="8" width="12" height="12" fill="#0f172a" rx="1" />

                <rect x="72" y="0" width="28" height="28" fill="#0f172a" rx="4" />
                <rect x="76" y="4" width="20" height="20" fill="white" rx="2" />
                <rect x="80" y="8" width="12" height="12" fill="#0f172a" rx="1" />

                <rect x="0" y="72" width="28" height="28" fill="#0f172a" rx="4" />
                <rect x="4" y="76" width="20" height="20" fill="white" rx="2" />
                <rect x="8" y="80" width="12" height="12" fill="#0f172a" rx="1" />

                {/* Simulated QR data modules */}
                <rect x="36" y="8" width="8" height="8" />
                <rect x="52" y="8" width="12" height="8" />
                <rect x="36" y="24" width="24" height="8" />
                <rect x="8" y="36" width="16" height="8" />
                <rect x="32" y="36" width="8" height="8" />
                <rect x="48" y="36" width="16" height="8" />
                <rect x="72" y="36" width="20" height="8" />
                <rect x="8" y="48" width="8" height="16" />
                <rect x="24" y="48" width="16" height="8" />
                <rect x="48" y="48" width="8" height="20" />
                <rect x="64" y="48" width="28" height="8" />
                <rect x="24" y="64" width="16" height="16" />
                <rect x="64" y="64" width="12" height="16" />
                <rect x="84" y="64" width="8" height="28" />
                <rect x="36" y="76" width="20" height="8" />
                <rect x="64" y="84" width="12" height="8" />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md font-bold text-xs">
                  N
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs font-bold text-slate-800 font-mono">
              Scan with camera or Nova Bank App
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Requested: ${amountInput || '0.00'} • {profile.name}
            </p>
          </div>

          {/* Amount and note inputs */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Requested Amount ($)
              </label>
              <input
                type="number"
                min="1"
                step="any"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Receive Into
              </label>
              <select
                value={selectedAccId}
                onChange={(e) => setSelectedAccId(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name.split(' ')[0]} ({acc.accountNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Shareable Link Box */}
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
            <span className="text-[11px] text-slate-400 font-medium">
              Shareable Direct Payment Link
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={paymentLink}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 truncate"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shrink-0 shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
