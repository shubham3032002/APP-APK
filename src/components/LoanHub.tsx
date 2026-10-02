import React, { useState } from 'react';
import {
  Landmark,
  Home,
  ShieldCheck,
  Users,
  Coins,
  Sparkles,
  Printer,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Layers,
  CreditCard,
  Percent,
  TrendingDown,
  FileCheck,
} from 'lucide-react';
import { useBank } from '../context/BankContext';
import { api, ApiError } from '../services/api';
import { BankLoan } from '../types/bank';

// Shape of a single row after we've mapped the raw backend transaction
// into the display format the ledger table/cards expect.
type LedgerDisplayRow = {
  id: string;
  date: string;
  installmentNo: string;
  particulars: string;
  receipt: string;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
  mode: string;
  status: string;
};

export const LoanHub: React.FC = () => {
  const {
    loans,
    accounts,
    totalLoansOutstanding,
    totalMonthlyEMI,
    formatMoney,
    formatIndianWords,
    payLoanEMI,
  } = useBank();

  // Navigation mode: 'grid' (2 cards per row) or 'ledger' (full-page ledger view for selected loan)
  const [activeView, setActiveView] = useState<'grid' | 'ledger'>('grid');
  const [selectedLoanId, setSelectedLoanId] = useState<string>(loans[0]?.id || '');
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<string>('');
  const [payAccountId, setPayAccountId] = useState<string>(accounts[0]?.id || '');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  // Real ledger rows fetched from the backend when a loan card is opened.
  const [ledgerTransactions, setLedgerTransactions] = useState<any[]>([]);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [ledgerError, setLedgerError] = useState<string | null>(null);

  // Harmonious, luxury color themes for society loans.
  // Keyed by the loan's `loanType` (as returned by the backend's
  // resolveLoanType(): 'personal' | 'gold' | 'home' | 'car' | 'education' |
  // 'festival'), NOT by loan.id and NOT by an arbitrary card-order label.
  // loan.id is "SSCODE-ACNO" (e.g. "401-24") and will never match a key
  // here — looking it up by .id was the original bug.
  const loanThemes: Record<
    string,
    {
      cardTheme: string;
      glowColor: string;
      badgeStyle: string;
      accentColor: string;
      marathiTitle: string;
      icon: React.ComponentType<{ className?: string }>;
      shortName: string;
    }
  > = {
    personal: {
      cardTheme: 'from-[#0f172a] via-[#1e1b4b] to-[#312e81]', // Royal Indigo & Midnight Navy
      glowColor: 'bg-indigo-400/20',
      badgeStyle: 'bg-indigo-400/20 text-indigo-200 border-indigo-400/30',
      accentColor: 'text-amber-300',
      marathiTitle: 'जामीनदार वैयक्तिक कर्ज',
      icon: Users,
      shortName: 'Personal Loan',
    },
    gold: {
      cardTheme: 'from-[#451a03] via-[#78350f] to-[#b45309]', // Warm Bronze & Radiant Gold
      glowColor: 'bg-amber-400/20',
      badgeStyle: 'bg-amber-400/20 text-amber-200 border-amber-400/30',
      accentColor: 'text-amber-300',
      marathiTitle: 'सुवर्ण तारण कर्ज',
      icon: Coins,
      shortName: 'Gold Loan',
    },
    home: {
      cardTheme: 'from-[#042f2e] via-[#115e59] to-[#0f766e]', // Deep Forest Teal & Emerald Midnight
      glowColor: 'bg-teal-400/20',
      badgeStyle: 'bg-teal-400/20 text-teal-200 border-teal-400/30',
      accentColor: 'text-teal-300',
      marathiTitle: 'घर / मालमत्ता तारण कर्ज',
      icon: Home,
      shortName: 'Housing Loan',
    },
    festival: {
      cardTheme: 'from-[#4c0519] via-[#881337] to-[#9f1239]', // Deep Regal Wine & Crimson Velvet
      glowColor: 'bg-rose-400/20',
      badgeStyle: 'bg-rose-400/20 text-rose-200 border-rose-400/30',
      accentColor: 'text-rose-300',
      marathiTitle: 'सण आगाऊ कर्ज',
      icon: Sparkles,
      shortName: 'Festival Advance',
    },
    // 'car' and 'education' are valid backend loanType values too, but
    // weren't given bespoke themes originally. They safely fall back to
    // `loanThemes.personal` wherever we look things up below, instead of
    // crashing on `theme.icon` of undefined.
  };

  if (loans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <Landmark className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No Loan Account</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-xs">
          You don't have any active loan accounts with the society yet.
        </p>
      </div>
    );
  }

  const currentSelectedLoan = loans.find((l) => l.id === selectedLoanId) || loans[0];
  const currentTheme = loanThemes[currentSelectedLoan.loanType] || loanThemes.personal;

  // Backend doesn't populate totalPrincipalPaid yet (always returns 0),
  // so derive it here from fields that are already correct: how much of
  // the original principal is no longer outstanding.
  const principalRepaid = Math.max(
    0,
    currentSelectedLoan.originalAmount - currentSelectedLoan.outstandingBalance
  );

  // Open full-page ledger
  const handleOpenLoanLedger = async (loanId: string) => {
    setSelectedLoanId(loanId);
    setActiveView('ledger');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setLedgerLoading(true);
    setLedgerError(null);
    try {
      // Goes through api.loanTransactions() (services/api.ts), which sends the
      // session cookie with the request.
      const data = await api.loanTransactions(loanId);

      if (data.success) {
        setLedgerTransactions(data.transactions || []);
      } else {
        setLedgerError('Failed to load ledger');
        setLedgerTransactions([]);
      }
    } catch (err) {
      console.error('Loan ledger fetch failed:', err);
      if (err instanceof ApiError) {
        if (err.status === 401 || err.status === 419) {
          setLedgerError('Your session has expired. Please log in again.');
        } else if (err.status === 404) {
          setLedgerError('Ledger endpoint not found (404).');
        } else {
          setLedgerError(`Failed to load ledger (HTTP ${err.status}).`);
        }
      } else {
        setLedgerError('Failed to load ledger. Check your connection.');
      }
      setLedgerTransactions([]);
    } finally {
      setLedgerLoading(false);
    }
  };

  // Back to All Loans Grid
  const handleBackToGrid = () => {
    setActiveView('grid');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ---------------------------------------------------------------------
  // Map raw backend transactions (from loanTransactions()) into the
  // display row shape the mobile cards / desktop table render.
  // ---------------------------------------------------------------------

  // Backend sends dates as d/m/Y (e.g. "29/04/2026"); display as
  // DD-Mon-YYYY (e.g. "29-Apr-2026") to match the design.
  const formatLedgerDate = (raw: string): string => {
    if (!raw) return '—';
    const [d, m, y] = raw.split('/');
    if (!d || !m || !y) return raw;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = months[parseInt(m, 10) - 1] ?? m;
    return `${d.padStart(2, '0')}-${monthName}-${y}`;
  };

  const buildDisplayLedger = (rawTx: any[], loan: BankLoan): LedgerDisplayRow[] => {
    if (!rawTx || rawTx.length === 0) return [];

    // Rows with a principal or interest component are real EMI payments;
    // everything else (disbursement, adjustments) is not.
    const isEmiRow = (t: any) => (t.principal || 0) > 0 || (t.interest || 0) > 0;

    // Backend returns rows sorted newest-first. Use that order to number
    // EMIs backwards from the loan's current paid count.
    const emiRows = rawTx.filter(isEmiRow);
    const paidCount = Math.max(0, loan.tenureMonths - loan.remainingMonths);

    return rawTx.map((t) => {
      const emi = isEmiRow(t);
      let installmentNo = 'Sanction & Inflow';
      if (emi) {
        const idx = emiRows.findIndex((e) => e.id === t.id);
        const number = Math.max(1, paidCount - idx);
        installmentNo = `EMI #${number} of ${loan.tenureMonths}`;
      }

      return {
        id: t.id,
        date: formatLedgerDate(t.date),
        installmentNo,
        particulars: t.description || t.merchant || 'Loan transaction',
        receipt: t.referenceNumber || '—',
        emi: t.amount || 0,
        principal: t.principal || 0,
        interest: t.interest || 0,
        balance: t.balanceAfter || 0,
        mode: t.mode === 'CASH_COUNTER' ? 'Cash Counter / NACH' : t.mode || '—',
        status: emi ? 'Paid On-Time' : 'Disbursed',
      };
    });
  };

  const ledgerRows = buildDisplayLedger(ledgerTransactions, currentSelectedLoan);

  const handlePrintLedger = () => {
    window.print();
  };

  const handlePayEMI = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(payAmount) || currentSelectedLoan.emiAmount;
    const res = payLoanEMI({
      loanId: currentSelectedLoan.id,
      fromAccountId: payAccountId,
      amount: amountNum,
    });

    if (res.success) {
      setPaymentSuccessMsg(`EMI Payment of ${formatMoney(amountNum)} completed successfully!`);
      setTimeout(() => {
        setIsPayModalOpen(false);
        setPaymentSuccessMsg(null);
        setPayAmount('');
      }, 1500);
    } else {
      alert(res.error || 'Payment failed. Check your savings balance.');
    }
  };

  return (
    <div className="space-y-4">
      {/* =========================================================================
          VIEW A: ALL LOANS GRID (2 CARDS PER ROW WITH RICH HARMONIOUS COLORS)
         ========================================================================= */}
      {activeView === 'grid' && (
        <div className="space-y-3">
          {/* 2-CARDS PER ROW GRID (COMPACT ON MOBILE, ELEGANT LUXURY HARMONIOUS COLOR COMBINATION) */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {loans.map((loan) => {
              const theme = loanThemes[loan.loanType] || loanThemes.personal;
              const Icon = theme.icon;
              const principalPaidPercent = loan.originalAmount > 0
                ? Math.round(((loan.originalAmount - loan.outstandingBalance) / loan.originalAmount) * 100)
                : 0;

              return (
                <div
                  key={loan.id}
                  onClick={() => handleOpenLoanLedger(loan.id)}
                  className={`group relative overflow-hidden rounded-xl sm:rounded-3xl p-2.5 sm:p-5 text-white transition-all duration-300 cursor-pointer bg-gradient-to-br ${theme.cardTheme} shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] border border-white/20 flex flex-col justify-between`}
                >
                  {/* Subtle Glowing Orb Backdrop */}
                  <div className={`absolute -top-6 -right-6 w-24 sm:w-28 h-24 sm:h-28 rounded-full ${theme.glowColor} blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

                  {/* Top Bar: Icon + Rate Badge */}
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shrink-0 shadow-inner group-hover:rotate-3 transition-transform">
                        <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>

                      {/* Interest Rate Badge */}
                      <span className="text-[8px] sm:text-[10px] font-extrabold bg-black/30 backdrop-blur-md px-1.5 py-0.5 sm:px-2 rounded-full text-white border border-white/20 shrink-0 shadow-2xs">
                        {loan.interestRate}% p.a.
                      </span>
                    </div>

                    {/* Loan Name & Account Number */}
                    <div className="mt-1.5 sm:mt-3 space-y-0.5 sm:space-y-1">
                      <div>
                        <h3 className="text-[11px] sm:text-sm font-black text-white leading-tight truncate group-hover:text-amber-200 transition-colors">
                          {loan.title}
                        </h3>
                        <span className="text-[8px] sm:text-[10px] text-white/70 block truncate">
                          {loan.borrowerName}
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md sm:rounded-lg bg-black/25 backdrop-blur-xs border border-white/15 text-[9px] sm:text-[11px] font-mono text-white/95 font-bold">
                        <span className="text-[8px] uppercase font-sans text-white/60 font-semibold">A/C:</span>
                        <span>{loan.loanNumber}</span>
                      </div>
                    </div>

                    {/* Middle: Big Outstanding Balance Display */}
                    <div className="mt-2 sm:mt-3.5 space-y-0.5">
                      <span className="text-[8px] sm:text-[10px] uppercase font-semibold text-white/70 block truncate">
                        Principal Due
                      </span>
                      <div className="text-xs xs:text-sm sm:text-xl md:text-2xl font-black text-white font-mono tracking-tight truncate">
                        {formatMoney(loan.outstandingBalance)}
                      </div>
                      <div className="text-[8px] sm:text-[10px] text-white/75 font-mono truncate">
                        EMI: ₹{Math.round(loan.emiAmount).toLocaleString('en-IN')}/m
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-1.5 sm:mt-2.5 space-y-0.5 sm:space-y-1">
                      <div className="flex justify-between text-[7.5px] sm:text-[9px] text-white/70 font-semibold">
                        <span>Paid {principalPaidPercent}%</span>
                        <span>{loan.remainingMonths}m left</span>
                      </div>
                      <div className="w-full h-1 sm:h-1.5 rounded-full bg-white/20 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-400 transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(8, principalPaidPercent))}%` }}
                        />
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
          VIEW B: DEDICATED FULL-PAGE LOAN LEDGER VIEW (ON CARD CLICK)
         ========================================================================= */}
      {activeView === 'ledger' && (
        <div className="space-y-4 animate-in fade-in duration-200">

          {/* Top Breadcrumb & Back Navigation Bar */}
          <div className="flex items-center justify-between p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <button
              onClick={handleBackToGrid}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-slate-800" />
              <span>Back to All Loans</span>
            </button>

            {/* Quick Switcher for other loan accounts */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none max-w-full">
                {loans.map((loan) => {
                  // Keyed off `loan.loanType` to match the theme object above, with a
                  // safe `personal` fallback — used only for active/inactive button
                  // styling, NOT for the label text (see below).
                  const thm = loanThemes[loan.loanType] || loanThemes.personal;
                  const isActive = selectedLoanId === loan.id;
                  return (
                    <button
                      key={loan.id}
                      onClick={() => handleOpenLoanLedger(loan.id)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-purple-700 text-white shadow-xs'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span>{loan.title || thm.shortName}</span>
                      <span className={`ml-1 font-mono font-normal ${isActive ? 'text-white/70' : 'text-slate-400'}`}>
                        {loan.loanNumber}
                      </span>
                    </button>
                  );
                })}
              </div>
          </div>

          {/* Account Hero Card with Theme matching the Selected Loan */}
          <div className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 text-white bg-gradient-to-br ${currentTheme.cardTheme} shadow-xl border border-white/20`}>
            {/* Glowing Orb */}
            <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full ${currentTheme.glowColor} blur-2xl pointer-events-none`} />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/25 shadow-inner">
                  {React.createElement(currentTheme.icon, { className: 'w-6 h-6' })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/20">
                      {currentTheme.shortName}
                    </span>
                    <span className="text-xs text-white/80 font-mono">
                      {currentSelectedLoan.loanNumber}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                    {currentSelectedLoan.title}
                  </h2>
                  <p className="text-xs text-white/80 font-mono">
                    Scheme: <strong className="text-white">{currentSelectedLoan.schemeName}</strong> • Rate: <strong className="text-amber-300">{currentSelectedLoan.interestRate}% p.a.</strong>
                  </p>
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/20 text-left sm:text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-white/70 block">
                  Outstanding Principal Due
                </span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono">{formatMoney(currentSelectedLoan.outstandingBalance)}</span>
                <span className="text-[10px] text-white/80 block">Monthly EMI: {formatMoney(currentSelectedLoan.emiAmount)}/mo</span>
              </div>
            </div>

            {/* Repayment Progress Strip */}
            <div className="relative z-10 mt-4 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
              <div className="flex justify-between text-xs text-white/90">
                <span>
                  Principal Repaid: <strong className="text-emerald-300">{formatMoney(principalRepaid)}</strong> of {formatMoney(currentSelectedLoan.originalAmount)}
                </span>
                <span>
                  Remaining: <strong className="text-white font-mono">{currentSelectedLoan.remainingMonths} Months</strong>
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-300 to-emerald-400"
                  style={{
                    width: `${Math.min(100, Math.max(5, (principalRepaid / currentSelectedLoan.originalAmount) * 100))}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Detailed Repayment Ledger Register */}
          <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            {/* Loading state */}
            {ledgerLoading && (
              <div className="py-12 text-center text-sm text-slate-500 font-medium">
                Loading ledger…
              </div>
            )}

            {/* Error state */}
            {!ledgerLoading && ledgerError && (
              <div className="py-12 text-center text-sm text-rose-600 font-semibold">
                {ledgerError}
              </div>
            )}

            {/* Empty state */}
            {!ledgerLoading && !ledgerError && ledgerRows.length === 0 && (
              <div className="py-12 text-center text-sm text-slate-500 font-medium">
                No transactions found for this loan yet.
              </div>
            )}

            {/* Data loaded */}
            {!ledgerLoading && !ledgerError && ledgerRows.length > 0 && (
              <>
                {/* Mobile Cards */}
                <div className="block sm:hidden space-y-2.5">
                  {ledgerRows.map((entry) => (
                    <div key={entry.id} className="p-3.5 rounded-2xl bg-purple-50/40 border border-purple-200/80 space-y-1.5 text-xs">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-bold text-slate-900 block">{entry.installmentNo}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{entry.date} • {entry.receipt}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-slate-900 font-sans block">
                            {entry.emi > 0 ? formatMoney(entry.emi) : '—'}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono">Bal: {formatMoney(entry.balance)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1 border-t border-purple-100">
                        <span>Principal: <strong>{entry.principal > 0 ? formatMoney(entry.principal) : '—'}</strong> | Int: <strong>{entry.interest > 0 ? formatMoney(entry.interest) : '—'}</strong></span>
                        <span className="text-emerald-700 font-semibold">{entry.status}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Installment No. & Particulars</th>
                        <th className="py-2.5 px-3">Receipt / Ref</th>
                        <th className="py-2.5 px-3 text-right">Principal Paid</th>
                        <th className="py-2.5 px-3 text-right">Interest Paid</th>
                        <th className="py-2.5 px-3 text-right">Total EMI</th>
                        <th className="py-2.5 px-3 text-right">Remaining Principal</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ledgerRows.map((entry) => (
                        <tr key={entry.id} className="hover:bg-purple-50/30 transition-colors">
                          <td className="py-3 px-3 font-mono font-semibold text-slate-800 whitespace-nowrap">
                            {entry.date}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900 block">{entry.installmentNo}</span>
                            <span className="text-[10px] text-slate-500">{entry.particulars}</span>
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                            {entry.receipt}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-800 font-sans">
                            {entry.principal > 0 ? formatMoney(entry.principal) : '—'}
                          </td>
                          <td className="py-3 px-3 text-right font-medium text-slate-600 font-sans">
                            {entry.interest > 0 ? formatMoney(entry.interest) : '—'}
                          </td>
                          <td className="py-3 px-3 text-right font-extrabold text-purple-900 font-sans">
                            {entry.emi > 0 ? formatMoney(entry.emi) : '—'}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-rose-700 font-sans">
                            {formatMoney(entry.balance)}
                          </td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>{entry.status}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          EMI PAYMENT MODAL
         ========================================================================= */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-700" />
                <span>Pay Loan EMI / Prepayment</span>
              </h3>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {paymentSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-emerald-900">{paymentSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handlePayEMI} className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-purple-900 block">Selected Loan Account</span>
                  <p className="font-bold text-slate-900 text-sm">{currentSelectedLoan.title}</p>
                  <p className="text-slate-500 font-mono">Loan #{currentSelectedLoan.loanNumber} • EMI: {formatMoney(currentSelectedLoan.emiAmount)}/mo</p>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Payment Amount (₹)</label>
                  <input
                    type="number"
                    value={payAmount || currentSelectedLoan.emiAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold font-mono text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    placeholder={currentSelectedLoan.emiAmount.toString()}
                    required
                  />
                  <p className="text-[10px] text-slate-500">Default is regular monthly EMI amount. You may enter higher for prepayment.</p>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Debit From Account</label>
                  <select
                    value={payAccountId}
                    onChange={(e) => setPayAccountId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.accountNumber}) — Bal: {formatMoney(acc.balance)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs transition-colors cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Pay {formatMoney(parseFloat(payAmount) || currentSelectedLoan.emiAmount)}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};