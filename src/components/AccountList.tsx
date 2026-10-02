import React, { useState } from 'react';
import {
  PiggyBank,
  Copy,
  Check,
  Shield,
  FileText,
  Info,
  QrCode,
} from 'lucide-react';
import { useBank } from '../context/BankContext';
import { BankAccount } from '../types/bank';

interface AccountListProps {
  onOpenStatementForAccount?: (accountId: string) => void;
}

export const AccountList: React.FC<AccountListProps> = ({
  onOpenStatementForAccount,
}) => {
  const {
    accounts,
    selectedAccountId,
    setSelectedAccountId,
    formatMoney,
    formatIndianWords,
  } = useBank();

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [detailedAccount, setDetailedAccount] = useState<BankAccount | null>(null);

  const handleCopy = (text: string, fieldKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span>Primary Savings Account</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Active Resident Savings (SB)
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Linked to UPI, IMPS, NEFT & RTGS • 4.50% p.a. quarterly interest credit
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            IFSC: {accounts[0]?.ifscCode || 'NOVA0000842'}
          </span>
        </div>
      </div>

      {/* Grid of Bank Accounts - Clean & Simple */}
      <div className="grid grid-cols-1 gap-3">
        {accounts.map((acc) => {
          const isSelected = selectedAccountId === acc.id;

          return (
            <div
              key={acc.id}
              onClick={() => setSelectedAccountId(isSelected ? null : acc.id)}
              className={`rounded-2xl p-5 sm:p-6 border cursor-pointer transition-all duration-150 ${
                isSelected
                  ? 'bg-slate-900 border-slate-600 shadow-md'
                  : 'bg-slate-900 hover:bg-slate-850 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-xl bg-slate-800 text-slate-200 border border-slate-700">
                    <PiggyBank className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {acc.name}
                      </h3>
                      {acc.isPrimary && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 flex-wrap">
                      <span className="font-mono font-bold text-slate-300">A/c: {acc.accountNumber}</span>
                      <span>•</span>
                      <span>IFSC: <strong className="font-mono text-slate-300">{acc.ifscCode}</strong></span>
                      <span>•</span>
                      <span>{acc.branch || 'BKC Mumbai'}</span>
                      {acc.apy && (
                        <>
                          <span>•</span>
                          <span className="text-slate-300 font-medium font-mono">
                            {acc.apy}% p.a. Interest
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailedAccount(acc);
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800 border border-slate-700 transition-all cursor-pointer"
                    title="View Account & Branch Details"
                  >
                    <Info className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenStatementForAccount) {
                        onOpenStatementForAccount(acc.id);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>e-Statement</span>
                  </button>
                </div>
              </div>

              {/* Balance Row */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-end justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium">
                    Available Savings Balance
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white flex items-baseline gap-2">
                    <span>{formatMoney(acc.balance)}</span>
                    <span className="text-xs font-normal text-slate-400 font-sans">
                      ({formatIndianWords(acc.balance)})
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400">UPI VPA</div>
                  <div className="font-mono text-xs font-semibold text-slate-200">
                    {acc.upiId || '-'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Account Details Modal (Indian Banking Specs) */}
      {detailedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200">
                  <PiggyBank className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">{detailedAccount.name}</h3>
                  <p className="text-xs text-slate-400">
                    {detailedAccount.institution || 'Nova Bank India Ltd.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailedAccount(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                {/* Account Number */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-slate-400">Account Number</p>
                    <p className="text-sm font-mono font-bold text-white">
                      {detailedAccount.accountNumber}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleCopy(detailedAccount.accountNumber, 'accNum', e)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                  >
                    {copiedField === 'accNum' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedField === 'accNum' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* IFSC Code */}
                <div className="flex items-center justify-between border-t border-slate-800 pt-2.5">
                  <div>
                    <p className="text-[11px] text-slate-400">IFSC Code (RTGS / NEFT / IMPS)</p>
                    <p className="text-sm font-mono font-bold text-white">
                      {detailedAccount.ifscCode}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleCopy(detailedAccount.ifscCode, 'ifsc', e)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                  >
                    {copiedField === 'ifsc' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedField === 'ifsc' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* MICR & Branch */}
                <div className="flex items-center justify-between border-t border-slate-800 pt-2.5 text-xs">
                  <div>
                    <p className="text-[11px] text-slate-400">MICR Code</p>
                    <p className="font-mono font-bold text-slate-200">{detailedAccount.micrCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-slate-400">Branch Location</p>
                    <p className="font-medium text-slate-200">{detailedAccount.branch}</p>
                  </div>
                </div>

                {/* UPI VPA */}
                <div className="flex items-center justify-between border-t border-slate-800 pt-2.5">
                  <div>
                    <p className="text-[11px] text-slate-400">Primary UPI VPA</p>
                    <p className="text-xs font-mono font-bold text-slate-200">
                      {detailedAccount.upiId || 'shubham@oknova'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleCopy(detailedAccount.upiId || '-', 'upi', e)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                  >
                    {copiedField === 'upi' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedField === 'upi' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Available Balance */}
                <div className="flex items-center justify-between border-t border-slate-800 pt-2.5">
                  <div>
                    <p className="text-[11px] text-slate-400">Available Savings Balance</p>
                    <p className="text-base font-mono font-black text-white">
                      {formatMoney(detailedAccount.balance)}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {formatIndianWords(detailedAccount.balance)}
                  </span>
                </div>
              </div>

              {/* DICGC Notice */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p>
                  Deposits in this account are guaranteed and insured up to ₹5,00,000 by the Deposit Insurance and Credit Guarantee Corporation (DICGC, Reserve Bank of India).
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setDetailedAccount(null)}
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 font-semibold text-xs text-slate-200 border border-slate-700 transition-all cursor-pointer"
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
