import React, { useState, useMemo, useEffect } from 'react';
import {
  PiggyBank,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Printer,
  ChevronRight,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeft,
  Layers,
  Wallet,
  Inbox,
} from 'lucide-react';
import { useBank } from '../context/BankContext';
import { api } from '../services/api';

/**
 * Visual theme + iconography per deposit account `type`, as classified by
 * BalanceHubController::resolveDepositType() on the backend:
 *   'pigmy' | 'rd' | 'fd' | 'savings'
 */
const DEPOSIT_THEMES: Record<
  string,
  {
    icon: React.ElementType;
    cardTheme: string;
    glowColor: string;
    accentColor: string;
    categoryLabel: string;
    categoryMarathi: string;
  }
> = {
  savings: {
    icon: Wallet,
    // Deep Midnight Navy & Blue-Gold Sapphire
    cardTheme: 'from-[#0b1b36] via-[#142d57] to-[#1c3f7a]',
    glowColor: 'bg-blue-400/20',
    accentColor: 'text-amber-300',
    categoryLabel: 'Savings Account',
    categoryMarathi: 'बचत खाते',
  },
  pigmy: {
    icon: Coins,
    // Deep Ocean Cerulean & Cyan
    cardTheme: 'from-[#082f49] via-[#0284c7] to-[#0369a1]',
    glowColor: 'bg-cyan-400/20',
    accentColor: 'text-cyan-300',
    categoryLabel: 'Daily Pigmy',
    categoryMarathi: 'दैनिक पिग्मी ठेव',
  },
  rd: {
    icon: PiggyBank,
    // Rich Emerald Jade & Forest Green
    cardTheme: 'from-[#064e3b] via-[#059669] to-[#047857]',
    glowColor: 'bg-emerald-400/20',
    accentColor: 'text-emerald-300',
    categoryLabel: 'Monthly RD',
    categoryMarathi: 'आवर्ती ठेव (RD)',
  },
  fd: {
    icon: Sparkles,
    // Royal Deep Amethyst & Indigo Velvet
    cardTheme: 'from-[#2e1065] via-[#5b21b6] to-[#4338ca]',
    glowColor: 'bg-indigo-400/20',
    accentColor: 'text-purple-300',
    categoryLabel: 'Term FD',
    categoryMarathi: 'मुदत ठेव',
  },
};

const DEFAULT_THEME = DEPOSIT_THEMES.savings;

interface DepositCard {
  id: string;
  type: string;
  category: string;
  categoryMarathi: string;
  name: string;
  shortName: string;
  accountNumber: string;
  schemeCode: string;
  balance: number;
  rate: string;
  badge: string;
  icon: React.ElementType;
  cardTheme: string;
  glowColor: string;
  accentColor: string;
  subInfo: string;
}

export const DepositSchemesHub: React.FC = () => {
  const { accounts, formatMoney } = useBank();

  // Navigation mode: 'grid' (all deposit account cards) or 'ledger' (full-page ledger for selected account)
  const [activeView, setActiveView] = useState<'grid' | 'ledger'>('grid');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [txFilter, setTxFilter] = useState<'all' | 'credit' | 'debit'>('all');

  /**
   * Build one card per REAL deposit account the customer holds — sourced
   * from `accounts` (BalanceHubController::accounts() / dashboard payload),
   * not a hard-coded list of 5. Number of cards == number of deposit
   * accounts the customer actually has.
   */
  const allDepositAccounts: DepositCard[] = useMemo(() => {
    return (accounts || []).map((acc: any) => {
      const theme = DEPOSIT_THEMES[acc.type] || DEFAULT_THEME;

      const badge = acc.maturityDate
        ? `Matures: ${formatMoney(acc.maturityAmount || 0)}`
        : acc.monthlyInstallment
        ? `₹${Number(acc.monthlyInstallment).toLocaleString('en-IN')}/mo Installment`
        : `A/C: ${acc.accountNumber}`;

      const subInfo = acc.maturityDate
        ? `Mat. Date: ${acc.maturityDate}`
        : acc.openedDate
        ? `Opened: ${acc.openedDate}`
        : '';

      return {
        id: acc.id,
        type: acc.type,
        category: theme.categoryLabel,
        categoryMarathi: theme.categoryMarathi,
        name: acc.name,
        shortName: acc.name,
        accountNumber: acc.accountNumber,
        schemeCode: acc.schemeCode,
        balance: acc.balance ?? 0,
        rate: `${acc.interestRate ?? 0}% p.a.`,
        badge,
        icon: theme.icon,
        cardTheme: theme.cardTheme,
        glowColor: theme.glowColor,
        accentColor: theme.accentColor,
        subInfo,
      };
    });
  }, [accounts, formatMoney]);

  const currentSelectedAccount =
    allDepositAccounts.find((a) => a.id === selectedAccountId) || allDepositAccounts[0];

  // Open Ledger on new page
  const handleOpenAccountLedger = (accId: string) => {
    setSelectedAccountId(accId);
    setActiveView('ledger');
    setTxFilter('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to All Deposits Grid
  const handleBackToGrid = () => {
    setActiveView('grid');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Real, UNCAPPED transaction history for the currently selected account,
   * fetched from the dedicated per-account endpoint
   * (BalanceHubController::accountTransactions) rather than the shared
   * dashboard `transactions` feed, which merges every account together and
   * caps out at 50 rows total — that feed can silently omit an account's
   * history entirely if other accounts had more recent/frequent activity.
   *
    * Uses api.accountTransactions() to send the session cookie with the request.
   */
  const [accountTransactions, setAccountTransactions] = useState<any[]>([]);
  const [txLoading, setTxLoading] = useState(false);

  useEffect(() => {
    if (!currentSelectedAccount?.id) return;

    let cancelled = false;
    setTxLoading(true);

    api
      .accountTransactions(currentSelectedAccount.id)
      .then((data) => {
        if (!cancelled) setAccountTransactions(data.transactions || []);
      })
      .catch(() => {
        if (!cancelled) setAccountTransactions([]);
      })
      .finally(() => {
        if (!cancelled) setTxLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentSelectedAccount?.id]);

  const filteredAccountTransactions = accountTransactions.filter(
    (t: any) => txFilter === 'all' || t.type === txFilter
  );

  const handlePrintLedger = () => {
    window.print();
  };

  // ---------------------------------------------------------------------
  // Empty state: customer has no deposit accounts at all
  // ---------------------------------------------------------------------
  if (!allDepositAccounts.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
          <Inbox className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">No Deposit Accounts Found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          We couldn't find any savings, pigmy, RD, or FD accounts linked to your membership yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* =========================================================================
          VIEW A: DEPOSIT CARDS GRID (MAIN PAGE) — one card per real account
         ========================================================================= */}
      {activeView === 'grid' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {allDepositAccounts.map((acc) => {
              const Icon = acc.icon;

              return (
                <div
                  key={acc.id}
                  onClick={() => handleOpenAccountLedger(acc.id)}
                  className={`group relative overflow-hidden rounded-xl sm:rounded-3xl p-2.5 sm:p-5 text-white transition-all duration-300 cursor-pointer bg-gradient-to-br ${acc.cardTheme} shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] border border-white/20 flex flex-col justify-between`}
                >
                  {/* Subtle Glowing Orb Backdrop */}
                  <div className={`absolute -top-6 -right-6 w-24 sm:w-28 h-24 sm:h-28 rounded-full ${acc.glowColor} blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

                  {/* Top Bar: Icon + Rate Badge */}
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shrink-0 shadow-inner group-hover:rotate-3 transition-transform">
                        <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>

                      {/* Interest Rate Badge */}
                      <span className="text-[10px] sm:text-xs font-extrabold bg-black/30 backdrop-blur-md px-2 py-1 rounded-full text-white border border-white/20 shrink-0 shadow-2xs whitespace-nowrap">
                        {acc.rate}
                      </span>
                    </div>

                    {/* Deposit Name & Account Number */}
                    <div className="mt-1.5 sm:mt-3 space-y-0.5 sm:space-y-1">
                      <div>
                        <h3 className="text-[11px] sm:text-sm font-black text-white leading-tight truncate group-hover:text-amber-200 transition-colors">
                          {acc.shortName}
                        </h3>
                       
                      </div>

                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md sm:rounded-lg bg-black/25 backdrop-blur-xs border border-white/15 text-[9px] sm:text-[11px] font-mono text-white/95 font-bold">
                        <span className="text-[8px] uppercase font-sans text-white/60 font-semibold">A/C:</span>
                        <span>{acc.accountNumber}</span>
                      </div>
                    </div>

                    {/* Middle: Big Balance Display */}
                    <div className="mt-2 sm:mt-3.5 space-y-0.5">
                      <span className="text-[8px] sm:text-[10px] uppercase font-semibold text-white/70 block truncate">
                        {acc.type === 'fd' ? 'Principal Deposit' : 'Available Balance'}
                      </span>
                      <div className="text-xs xs:text-sm sm:text-xl md:text-2xl font-black text-white font-mono tracking-tight truncate">
                        {formatMoney(acc.balance)}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Footer: Feature Pill & Action Button */}
                  <div className="mt-2 sm:mt-4 pt-1.5 sm:pt-2.5 border-t border-white/15 flex items-center justify-between gap-1">

                    <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[10px] font-bold text-white bg-white/20 hover:bg-white/30 backdrop-blur-md px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg transition-all shrink-0 border border-white/10 group-hover:border-white/30">
                      <span>Ledger</span>
                      <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW B: DEDICATED FULL-PAGE LEDGER VIEW (ON CARD CLICK)
         ========================================================================= */}
      {activeView === 'ledger' && currentSelectedAccount && (
        <div className="space-y-4 animate-in fade-in duration-200">

          {/* Top Breadcrumb & Back Navigation Bar */}
          <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200 shadow-2xs gap-2">
            <button
              onClick={handleBackToGrid}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-slate-800" />
              <span>Back to All Deposits</span>
            </button>

            {/* Quick Switcher for other deposit accounts the customer holds */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none max-w-full">
              {allDepositAccounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => setSelectedAccountId(acc.id)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedAccountId === acc.id
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {acc.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Account Hero Card with Theme matching the Card */}
          <div className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 text-white bg-gradient-to-br ${currentSelectedAccount.cardTheme} shadow-xl border border-white/20`}>
            {/* Glowing Orb */}
            <div className={`absolute -top-10 -right-10 w-44 h-44 rounded-full ${currentSelectedAccount.glowColor} blur-2xl pointer-events-none`} />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/25 shadow-inner">
                  {React.createElement(currentSelectedAccount.icon, { className: 'w-6 h-6' })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/20">
                      {currentSelectedAccount.category}
                    </span>
                    <span className="text-xs text-white/80 font-mono">
                      {currentSelectedAccount.schemeCode}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                    {currentSelectedAccount.name}
                  </h2>
                  <p className="text-xs text-white/80 font-mono">
                    Account No: <strong className="text-white">{currentSelectedAccount.accountNumber}</strong> • Interest Yield: <strong className="text-emerald-300">{currentSelectedAccount.rate}</strong>
                  </p>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 text-left sm:text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-white/70 block">
                  {currentSelectedAccount.type === 'fd' ? 'Principal Deposit Amount' : 'Current Available Balance'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono">{formatMoney(currentSelectedAccount.balance)}</span>
                <span className="text-[10px] text-white/80 block">{currentSelectedAccount.badge}</span>
              </div>
            </div>
          </div>

          {/* Detailed Ledger Content — driven by REAL, uncapped per-account transactions */}
          <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className={`w-4 h-4 ${currentSelectedAccount.accentColor}`} />
                  <span>Account Ledger</span>
                </h3>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                <button
                  onClick={() => setTxFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    txFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  All ({accountTransactions.length})
                </button>
                <button
                  onClick={() => setTxFilter('credit')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    txFilter === 'credit' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Credits (+)
                </button>
                <button
                  onClick={() => setTxFilter('debit')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    txFilter === 'debit' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Debits (-)
                </button>
              </div>
            </div>

            {txLoading ? (
              <div className="py-10 text-center text-xs text-slate-400">Loading transactions…</div>
            ) : filteredAccountTransactions.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-400">
                No transactions found for this account yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredAccountTransactions.map((t: any) => (
                  <div key={t.id} className="py-3 flex items-center justify-between text-xs hover:bg-slate-50 px-2 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          t.type === 'credit'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {t.type === 'credit' ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 leading-tight">{t.merchant || t.description}</p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          {t.date ? new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'} 
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-sm font-black font-sans block ${
                          t.type === 'credit' ? 'text-emerald-700' : 'text-slate-900'
                        }`}
                      >
                        {t.type === 'credit' ? '+' : '-'}{formatMoney(t.amount)}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Bal: {formatMoney(t.balanceAfter)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};