import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Landmark,
  ShieldCheck,
} from 'lucide-react';
import { useBank } from '../context/BankContext';

interface MultipleLoansCardProps {
  onOpenLoansHub?: () => void;
  onOpenLoanSchedule?: () => void;
}

export const MultipleLoansCard: React.FC<MultipleLoansCardProps> = ({
  onOpenLoansHub,
}) => {
  // Only `loans` is pulled from context now — `totalLoansOutstanding`
  // and `totalMonthlyEMI` used to be read separately, but (same reason
  // as the deposit card) both totals are now derived directly from
  // `loans` so there's one source of truth instead of two numbers that
  // could drift apart.
  const { loans, formatMoney, formatIndianWords } = useBank();

  const [isLoanHidden, setIsLoanHidden] = useState(false);

  // buildLoanPayload() sets `status: 'closed'` once `clsdate` is set,
  // but a closed loan still comes back in the `loans` array. "Active
  // Accounts" and every total below should only reflect loans that are
  // actually still open — otherwise a paid-off loan inflates the count
  // and (harmlessly, since its balance is ~0, but misleadingly) sits
  // inside "Active".
  const activeLoans = loans.filter((l) => l.status === 'active');

  const totalOutstanding = activeLoans.reduce((sum, l) => sum + (l.outstandingBalance || 0), 0);
  const totalMonthlyEMI = activeLoans.reduce((sum, l) => sum + (l.emiAmount || 0), 0);

  // resolveLoanType()'s real output is 'gold' | 'home' | 'car' |
  // 'education' | 'festival' | 'personal' — no "Property" type exists
  // on the backend, so that word in the old hardcoded subtitle was
  // never going to match anything. Build the subtitle from whichever
  // types this customer's loans actually fall into.
  const loanTypeLabels: Record<string, string> = {
    gold: 'Gold',
    home: 'Home',
    car: 'Car',
    education: 'Education',
    festival: 'Festival',
    personal: 'Personal',
  };
  const activeSchemeTypes = Array.from(
    new Set(activeLoans.map((l) => loanTypeLabels[l.loanType] || 'Personal'))
  );
  const schemeSummaryText = activeSchemeTypes.length > 0
    ? activeSchemeTypes.join(', ')
    : 'No active loans';

  // One breakdown item PER LOAN ACCOUNT — same approach as the deposit
  // card's breakdown strip, and for the same reason: two loans of the
  // same type (e.g. two personal loans) are two separate accounts the
  // customer took out separately, so they each get their own column
  // with their own scheme name and their own outstanding balance,
  // rather than being merged into one "Personal" total that hides how
  // many loans that figure actually represents.
  const breakdownItems = activeLoans.map((l) => ({
    key: l.id,
    label: (l.schemeName || l.glname || l.title || loanTypeLabels[l.loanType] || 'Loan').trim(),
    total: l.outstandingBalance || 0,
    amountClassName: l.loanType === 'festival' ? 'text-purple-200' : 'text-white',
  }));

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4">
      {/* 3. Multiple Loans Card - Regal Deep Plum / Violet */}
      <div 
        onClick={onOpenLoansHub}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a0845] via-[#43126e] to-[#641a99] p-5 sm:p-6 text-white shadow-lg shadow-purple-950/20 transition-all border border-purple-400/30 hover:border-purple-300/50 cursor-pointer active:scale-[0.99]"
      >
        {/* Subtle Decorative Background Spheres */}
        <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-purple-300/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-44 h-44 rounded-full bg-black/25 blur-2xl pointer-events-none" />
        
        {/* Subtle Background Watermark */}
        <div className="absolute right-4 bottom-1 text-white/[0.04] font-serif font-black text-8xl sm:text-9xl pointer-events-none select-none">
          कर्ज
        </div>

        <div className="relative z-10 flex flex-col justify-between min-h-[190px] gap-3">
          
          {/* Top Line: Header & Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shadow-xs shrink-0">
                <Landmark className="w-4 h-4 text-purple-200" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                    Loan Accounts
                  </span>
                  <span className="text-[10px] text-purple-200 font-medium">
                    (कर्ज खाती)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-purple-200/80 truncate block">
                  {activeLoans.length} Active Account{activeLoans.length === 1 ? '' : 's'} • {schemeSummaryText}
                </span>
              </div>
            </div>

            {/* <div className="shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-purple-400/20 backdrop-blur-md text-[10px] font-bold text-purple-200 tracking-wider border border-purple-400/30 shadow-xs flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-purple-300" />
                <span>Secured Limits</span>
              </span>
            </div> */}
          </div>

          {/* Center: Total Outstanding Principal with Eye Toggle */}
          <div className="my-1 flex items-center justify-between gap-2">
            <div className="space-y-0.5 min-w-0">
              <span className="text-[11px] uppercase font-semibold tracking-wider text-purple-200/90 block truncate">
                Total Outstanding Principal ({activeLoans.length} Loan{activeLoans.length === 1 ? '' : 's'})
              </span>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2 font-sans">
                {isLoanHidden ? (
                  <span className="tracking-widest font-mono text-purple-200">₹ XX,XX,XXX</span>
                ) : (
                  <span>{formatMoney(totalOutstanding)}</span>
                )}
              </div>
              {!isLoanHidden && (
                <div className="text-xs font-medium text-purple-100 flex items-center gap-1.5 truncate">
                  <span className="truncate">{formatIndianWords(totalOutstanding)} Due</span>
                  <span className="text-[10px] bg-purple-900/60 px-2 py-0.5 rounded-full border border-purple-600/40 text-purple-200 font-semibold shrink-0">
                    Total EMI: {formatMoney(totalMonthlyEMI)}/mo
                  </span>
                </div>
              )}
            </div>

            {/* Eye toggle button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLoanHidden(!isLoanHidden);
              }}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
              title={isLoanHidden ? 'Show loan balance' : 'Hide loan balance'}
              aria-label="Toggle loan balance visibility"
            >
              {isLoanHidden ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Bottom Breakdown Strip: one column PER LOAN ACCOUNT — up to 3
              share the row evenly via grid; 4+ switch to a horizontally
              scrollable row so columns don't get squeezed unreadably thin. */}
          {breakdownItems.length > 0 ? (
            breakdownItems.length <= 3 ? (
              <div
                className={`grid gap-1.5 py-2 px-3 rounded-2xl bg-black/25 border border-white/10 text-center divide-x divide-white/10 ${
                  breakdownItems.length === 1
                    ? 'grid-cols-1'
                    : breakdownItems.length === 2
                    ? 'grid-cols-2'
                    : 'grid-cols-3'
                }`}
              >
                {breakdownItems.map((item) => (
                  <div key={item.key} className="min-w-0 px-1.5 first:pl-0 last:pr-0">
                    <span
                      className="text-[9px] sm:text-[10px] text-purple-200/80 uppercase font-medium tracking-wide block truncate"
                      title={item.label}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`font-bold font-mono text-xs sm:text-[13px] truncate block mt-0.5 ${item.amountClassName}`}
                    >
                      {isLoanHidden ? '₹•••' : formatMoney(item.total)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-black/25 border border-white/10 overflow-hidden">
                <div className="flex divide-x divide-white/10 overflow-x-auto py-2 px-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {breakdownItems.map((item) => (
                    <div key={item.key} className="shrink-0 w-[104px] px-2.5 text-center first:pl-1 last:pr-1">
                      <span
                        className="text-[9px] sm:text-[10px] text-purple-200/80 uppercase font-medium tracking-wide block truncate"
                        title={item.label}
                      >
                        {item.label}
                      </span>
                      <span
                        className={`font-bold font-mono text-xs sm:text-[13px] truncate block mt-0.5 ${item.amountClassName}`}
                      >
                        {isLoanHidden ? '₹•••' : formatMoney(item.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="py-2.5 px-3 rounded-2xl bg-black/25 border border-white/10 text-center text-[11px] text-purple-200/70 font-medium">
              No active loans
            </div>
          )}

        </div>
      </div>
    </div>
  );
};