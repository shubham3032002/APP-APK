import React from 'react';
import { useBank } from '../context/BankContext';
import {
  Wallet,
  Lock,
  Landmark,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface ViewAllAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccountStatement: (accId: string) => void;
}

export const ViewAllAccountsModal: React.FC<ViewAllAccountsModalProps> = ({
  isOpen,
  onClose,
  onSelectAccountStatement,
}) => {
  const {
    accounts,
    fixedDeposits,
    loans,
    formatMoney,
    formatIndianWords,
  } = useBank();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-lg bg-white sm:rounded-3xl rounded-t-3xl p-6 max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200"
      >
        {/* Modal Handle & Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">All Linked Accounts</h3>
            <p className="text-xs text-slate-500">
              1 Savings • 2 Fixed Deposits • 3 Active Loans
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5">
          
          {/* 1. SAVINGS ACCOUNT SECTION */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-[#E6390A]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Savings Account (1)
              </span>
            </div>

            {accounts.map((acc) => (
              <div
                key={acc.id}
                onClick={() => {
                  onSelectAccountStatement(acc.id);
                  onClose();
                }}
                className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/80 hover:border-orange-300 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{acc.name}</h4>
                    <p className="text-xs font-mono text-slate-500">
                      A/c: {acc.accountNumber} • IFSC: {acc.ifscCode}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#E6390A] transition-colors" />
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-orange-200/60">
                  <span className="text-xs text-slate-600 font-medium">Available Balance</span>
                  <div className="text-right">
                    <span className="text-base font-bold text-slate-900 font-sans">
                      {formatMoney(acc.balance)}
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      {formatIndianWords(acc.balance)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 2. FIXED DEPOSITS (FD) SECTION */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Fixed Deposit Accounts (2)
              </span>
            </div>

            <div className="space-y-2.5">
              {fixedDeposits.map((fd) => (
                <div
                  key={fd.id}
                  className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 hover:border-blue-200 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                          {fd.title}
                        </h4>
                        {fd.taxSaver && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-blue-600 text-white font-bold rounded">
                            Sec 80C
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {fd.depositNumber} • ROI: {fd.interestRate}% p.a.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1.5 border-t border-blue-100/80">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Principal Deposited</span>
                      <span className="font-bold text-slate-900 font-sans">
                        {formatMoney(fd.principalAmount)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 text-[11px] block">Maturity Amount</span>
                      <span className="font-bold text-blue-700 font-sans">
                        {formatMoney(fd.maturityAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. LOANS & BORROWING SECTION */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Landmark className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Loan & Borrowing Accounts (3)
              </span>
            </div>

            <div className="space-y-2.5">
              {loans.map((loan) => (
                <div
                  key={loan.id}
                  className="p-4 rounded-2xl bg-purple-50/40 border border-purple-100 hover:border-purple-200 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                        {loan.title}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {loan.loanNumber} • Rate: {loan.interestRate}% p.a.
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                      EMI: {formatMoney(loan.emiAmount)}/mo
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1.5 border-t border-purple-100/80">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Sanctioned Limit</span>
                      <span className="font-bold text-slate-700 font-sans">
                        {formatMoney(loan.originalAmount)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 text-[11px] block">Outstanding Principal</span>
                      <span className="font-bold text-rose-600 font-sans">
                        {formatMoney(loan.outstandingBalance)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DICGC Protection Guarantee */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              All deposits in Nova Bank are protected up to ₹5,00,000 under DICGC (Subsidiary of RBI).
            </span>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
