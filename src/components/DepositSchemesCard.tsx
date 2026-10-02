import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  PiggyBank,
  Sparkles,
} from 'lucide-react';
import { useBank } from '../context/BankContext';

interface DepositSchemesCardProps {
  onOpenDepositHub?: () => void;
  onOpenPassbook?: () => void;
}

export const DepositSchemesCard: React.FC<DepositSchemesCardProps> = ({
  onOpenDepositHub,
}) => {
  // Only `accounts` is pulled from context now. `fixedDeposits` and
  // `totalDepositSchemesPrincipal` used to be read here too, but every
  // number this card shows is now derived directly from `accounts`
  // (the same array the backend's buildAccountPayload() populates with
  // per-account `type`/`balance`/`interestRate`). Keeping a second,
  // separately-computed context total around risked exactly the kind of
  // drift described below for computedTotal — better to have one source
  // of truth.
  const {
    accounts,
    formatMoney,
    formatIndianWords,
  } = useBank();

  const [isDepositHidden, setIsDepositHidden] = useState(false);

  // Aggregate ALL accounts of each type — not just the first one found.
  // The backend (buildAccountPayload) returns one row PER account, so a
  // customer with two savings accounts or two pigmy accounts previously
  // had one silently dropped by `accounts.find(...)`, understating their
  // real balance.
  const savingsAccounts = accounts.filter((a) => a.type === 'savings');
  const pigmyAccounts = accounts.filter((a) => a.type === 'pigmy');
  const rdAccounts = accounts.filter((a) => a.type === 'rd');
  const fdAccounts = accounts.filter((a) => a.type === 'fd');

  const savingsTotal = savingsAccounts.reduce((sum, a) => sum + (a.balance || 0), 0);
  const pigmyTotal = pigmyAccounts.reduce((sum, a) => sum + (a.balance || 0), 0);

  // RD & FD balances both come straight from `accounts` (already
  // per-account balances from the backend) rather than mixing in a
  // separately-fetched deposits value, which may already overlap with
  // `rd`-typed accounts (an RD account also carries a maturityDate, so
  // it can land in both places) and cause double-counting.
  const rdTotal = rdAccounts.reduce((sum, a) => sum + (a.balance || 0), 0);
  const fdTotal = fdAccounts.reduce((sum, a) => sum + (a.balance || 0), 0);
  const rdFdTotal = rdTotal + fdTotal;

  // One breakdown item PER ACCOUNT, not merged by type. Two accounts of
  // the same type (e.g. "KAYAM NIDHI" and "PRASHALA ANAMAT", both
  // `type: 'savings'`) are two distinct accounts the customer opened
  // separately — collapsing them into a single "Savings" column and
  // summing their balances hid the fact that there were two accounts
  // at all. Each account keeps its own name (from `ssname`/`name`) and
  // its own balance; the strip below renders one divided column per
  // item and adapts (grid for a few, horizontal scroll for many).
  const typeFallbackLabel: Record<string, string> = {
    savings: 'Savings',
    pigmy: 'Daily Pigmy',
    rd: 'RD',
    fd: 'FD',
  };
  const rdFdAmountTypes = new Set(['rd', 'fd']);

  const breakdownItems = accounts
    .filter((a) => a.type in typeFallbackLabel)
    .map((a) => ({
      key: a.id,
      label: (a.ssname || a.name || '').trim() || typeFallbackLabel[a.type],
      total: a.balance || 0,
      amountClassName: rdFdAmountTypes.has(a.type) ? 'text-blue-200' : 'text-white',
    }));

  // Real active account count and scheme list, instead of a hardcoded
  // "5 Active Accounts • Pigmy + RD + FDs" string that never reflected
  // what this customer actually holds.
  const activeAccountsCount = accounts.length;
  const activeSchemeTypes: string[] = [];
  if (savingsAccounts.length > 0) activeSchemeTypes.push('Savings');
  if (pigmyAccounts.length > 0) activeSchemeTypes.push('Pigmy');
  if (rdAccounts.length > 0) activeSchemeTypes.push('RD');
  if (fdAccounts.length > 0) activeSchemeTypes.push('FD');
  const schemeSummaryText = activeSchemeTypes.length > 0
    ? activeSchemeTypes.join(' + ')
    : 'No active schemes';

  // Real max interest rate across this customer's deposit accounts,
  // instead of a hardcoded "9.5% p.a." badge that doesn't reflect their
  // actual scheme rates. `interestRate` here is buildAccountPayload's
  // pass-through of the subledger row's `intrate` column, so this stays
  // correct even if a specific account's rate is 0.
  const maxInterestRate = accounts.reduce(
    (max, a) => Math.max(max, a.interestRate || 0),
    0
  );

  // Grand total: sum of the three breakdown buckets, so the big headline
  // figure always matches what the breakdown strip below adds up to —
  // rather than trusting a separately-computed context value that could
  // drift out of sync with these per-type sums.
  const computedTotal = savingsTotal + pigmyTotal + rdFdTotal;

  return (
    <div className="w-full max-w-lg mx-auto px-3 sm:px-4">
      {/* 2. Deposit Schemes Card - Royal Sapphire Navy */}
      <div 
        onClick={onOpenDepositHub}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c2340] via-[#0f3460] to-[#1e4e8c] p-5 sm:p-6 text-white shadow-lg shadow-blue-950/20 transition-all border border-blue-400/30 hover:border-blue-300/50 cursor-pointer active:scale-[0.99]"
      >
        {/* Subtle Decorative Background Spheres */}
        <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-blue-300/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-44 h-44 rounded-full bg-black/25 blur-2xl pointer-events-none" />
        
        {/* Subtle Background Watermark */}
        <div className="absolute right-4 bottom-1 text-white/[0.04] font-serif font-black text-8xl sm:text-9xl pointer-events-none select-none">
          ठेव
        </div>

        <div className="relative z-10 flex flex-col justify-between min-h-[190px] gap-3">
          
          {/* Top Line: Header & Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shadow-xs shrink-0">
                <PiggyBank className="w-4 h-4 text-blue-200" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                    Deposit Schemes
                  </span>
                  <span className="text-[10px] text-blue-200 font-medium">
                    (ठेव योजना)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-blue-200/80 truncate block">
                  {activeAccountsCount} Active Account{activeAccountsCount === 1 ? '' : 's'} • {schemeSummaryText}
                </span>
              </div>
            </div>

            {/* <div className="shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-blue-400/20 backdrop-blur-md text-[10px] font-bold text-blue-200 tracking-wider border border-blue-400/30 shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-300" />
                <span>{maxInterestRate > 0 ? `Up to ${maxInterestRate}% p.a.` : 'Deposit Schemes'}</span>
              </span>
            </div> */}
          </div>

          {/* Center: Total Deposit Balance with Eye Toggle */}
          <div className="my-1 flex items-center justify-between gap-2">
            <div className="space-y-0.5 min-w-0">
              <span className="text-[11px] uppercase font-semibold tracking-wider text-blue-200/90 block truncate">
                Total Deposit Balance Across Schemes
              </span>
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2 font-sans">
                {isDepositHidden ? (
                  <span className="tracking-widest font-mono text-blue-200">₹ X,XX,XXX</span>
                ) : (
                  <span>{formatMoney(computedTotal)}</span>
                )}
              </div>
              {!isDepositHidden && (
                <div className="text-xs font-medium text-blue-100 flex items-center gap-1.5 truncate">
                  <span className="truncate">{formatIndianWords(computedTotal)} Total Savings</span>
                </div>
              )}
            </div>

            {/* Eye toggle button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsDepositHidden(!isDepositHidden);
              }}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
              title={isDepositHidden ? 'Show deposit balance' : 'Hide deposit balance'}
              aria-label="Toggle deposit balance visibility"
            >
              {isDepositHidden ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Bottom Breakdown Strip: one column PER ACCOUNT (not merged by
              type) — a customer with two savings accounts sees two
              columns, each with its own scheme name and balance. Up to 3
              accounts share the row evenly via grid; 4+ switch to a
              horizontally scrollable row so columns don't get squeezed
              unreadably thin. */}
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
                      className="text-[9px] sm:text-[10px] text-blue-200/80 uppercase font-medium tracking-wide block truncate"
                      title={item.label}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`font-bold font-mono text-xs sm:text-[13px] truncate block mt-0.5 ${item.amountClassName}`}
                    >
                      {isDepositHidden ? '₹•••' : formatMoney(item.total)}
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
                        className="text-[9px] sm:text-[10px] text-blue-200/80 uppercase font-medium tracking-wide block truncate"
                        title={item.label}
                      >
                        {item.label}
                      </span>
                      <span
                        className={`font-bold font-mono text-xs sm:text-[13px] truncate block mt-0.5 ${item.amountClassName}`}
                      >
                        {isDepositHidden ? '₹•••' : formatMoney(item.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="py-2.5 px-3 rounded-2xl bg-black/25 border border-white/10 text-center text-[11px] text-blue-200/70 font-medium">
              No deposit schemes yet
            </div>
          )}

        </div>
      </div>
    </div>
  );
};