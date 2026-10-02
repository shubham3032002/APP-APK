import React, { useState } from 'react';
import {
  Award,
  Printer,
  Sparkles,
  CheckCircle2,
  Coins,
  FileX,
} from 'lucide-react';
import { useBank } from '../context/BankContext';

export const MemberSharesHub: React.FC = () => {
  const { memberShares, formatMoney } = useBank();
  const [activeSubTab, setActiveSubTab] = useState<'overview_ledger' | 'dividend'>('overview_ledger');

  // Comprehensive Share Ledger records (भाग नोंदवही)
  // Backend sends: date, type, noOfShares, credit, debit, runningTotal, runningShares, transferredTo
  const rawLedger = memberShares.ledger ?? [];

  const shareLedgerRecords = rawLedger.map((raw: any, idx: number) => ({
    id: idx,
    date: raw.date ?? '',
    type: raw.type ?? '',
    typeMarathi: raw.type ?? '',
    sharesIssued: Number(raw.noOfShares) || 0,
    amount: (Number(raw.credit) || 0) - (Number(raw.debit) || 0),
    distinctiveFrom: '',
    distinctiveTo: '',
    certificateNo: '',
    resolutionNo: '',
    paymentMode: '',
    runningShares: Number(raw.runningShares) || 0,
    runningTotalCapital: Number(raw.runningTotal) || 0,
    transferredTo: raw.transferredTo ?? null,
  }));

  // Comprehensive Dividend Ledger records (लाभांश खाते)
  const dividendLedgerRecords = [
    {
      year: 'FY 2025-26',
      declaredDate: '10-Jul-2026',
      creditDate: '15-Jul-2026',
      agmNo: '21st AGM',
      rate: '12.0%',
      sharesCount: 50,
      faceValue: 100,
      shareCapitalBase: 5000.0,
      grossAmount: 600.0,
      tdsDeducted: 0.0,
      netAmount: 600.0,
      accountCredited: 'SB-004829',
      status: 'Credited',
      refNumber: 'DIV-2026-SH9912',
      utrNo: 'MAHB26196894210',
    },
    {
      year: 'FY 2024-25',
      declaredDate: '12-Jul-2025',
      creditDate: '20-Jul-2025',
      agmNo: '20th AGM',
      rate: '11.5%',
      sharesCount: 50,
      faceValue: 100,
      shareCapitalBase: 5000.0,
      grossAmount: 575.0,
      tdsDeducted: 0.0,
      netAmount: 575.0,
      accountCredited: 'SB-004829',
      status: 'Credited',
      refNumber: 'DIV-2025-SH9912',
      utrNo: 'MAHB25201489201',
    },
    {
      year: 'FY 2023-24',
      declaredDate: '08-Jul-2024',
      creditDate: '18-Jul-2024',
      agmNo: '19th AGM',
      rate: '10.0%',
      sharesCount: 50,
      faceValue: 100,
      shareCapitalBase: 5000.0,
      grossAmount: 500.0,
      tdsDeducted: 0.0,
      netAmount: 500.0,
      accountCredited: 'SB-004829',
      status: 'Credited',
      refNumber: 'DIV-2024-SH9912',
      utrNo: 'MAHB24199841209',
    },
    {
      year: 'FY 2022-23',
      declaredDate: '15-Jul-2023',
      creditDate: '22-Jul-2023',
      agmNo: '18th AGM',
      rate: '9.5%',
      sharesCount: 40,
      faceValue: 100,
      shareCapitalBase: 4000.0,
      grossAmount: 380.0,
      tdsDeducted: 0.0,
      netAmount: 380.0,
      accountCredited: 'SB-004829',
      status: 'Credited',
      refNumber: 'DIV-2023-SH9912',
      utrNo: 'MAHB23203498112',
    },
  ];

  const totalDividendReceived = dividendLedgerRecords.reduce((acc, curr) => acc + curr.netAmount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* 1. TOP SUMMARY BANNER: TOTAL SHARES & CAPITAL OVERVIEW */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-md space-y-3.5 border border-emerald-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-700/60 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 p-2 flex items-center justify-center text-amber-300 shrink-0">
              <Coins className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-extrabold text-white truncate">
                Member Share Capital (भागभांडवल)
              </h2>
              <p className="text-xs text-emerald-200 truncate font-mono">
                Folio: {memberShares.shareFolioNumber} • Member: #{memberShares.memberNumber}
              </p>
            </div>
          </div>
          {/* <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
            <span className="px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-200 text-[11px] font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Class-A Equity Shareholder</span>
            </span>
          </div> */}
        </div>

        {/* 4-KPI Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="p-3 rounded-2xl bg-black/20 border border-white/10 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block truncate">
              Total Shares Held
            </span>
            <span className="text-xl sm:text-2xl font-black text-white font-sans block">
              {memberShares.numberOfShares} <span className="text-xs font-normal text-emerald-200">Shares</span>
            </span>
          </div>

         <div className="p-3 rounded-2xl bg-black/20 border border-white/10 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block truncate">
              Paid-Up Capital
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-300 font-sans block">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(memberShares.totalShareCapital)}
            </span>
           
          </div>
        </div>
      </div>

      {/* 2. SUB-TAB NAVIGATION */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-emerald-50 border border-emerald-200">
        <button
          onClick={() => setActiveSubTab('overview_ledger')}
          className={`flex-1 py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center truncate ${
            activeSubTab === 'overview_ledger'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-emerald-900 hover:bg-emerald-100'
          }`}
        >
          Share Ledger (भाग नोंदवही)
        </button>

        <button
          onClick={() => setActiveSubTab('dividend')}
          className={`flex-1 py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-center truncate ${
            activeSubTab === 'dividend'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-emerald-900 hover:bg-emerald-100'
          }`}
        >
          Dividend Ledger (लाभांश खाते)
        </button>
      </div>

      {/* 3. SUB-TAB 1: SHARE LEDGER (भाग नोंदवही) */}
      {activeSubTab === 'overview_ledger' && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-emerald-100 shadow-xs space-y-4">
          {/* Mobile Share Ledger Cards */}
          <div className="block sm:hidden space-y-3">
            {shareLedgerRecords.map((record) => (
              <div
                key={record.id}
                className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block leading-tight">
                      {record.type}
                    </span>
                    {/* <span className="text-[10px] text-emerald-800 font-semibold block">
                      {record.typeMarathi}
                    </span> */}
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-bold shrink-0">
                    +{record.sharesIssued} Shares
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl bg-white border border-emerald-100">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Allotment Date</span>
                    <span className="font-semibold text-slate-800">{record.date}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Allotment Capital</span>
                    <span className="font-bold text-emerald-800">{formatMoney(record.amount)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Distinctive Numbers</span>
                    <span className="font-mono text-slate-700">#{record.distinctiveFrom} - #{record.distinctiveTo}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Certificate No</span>
                    <span className="font-mono font-semibold text-slate-800">{record.certificateNo}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-emerald-200/60 font-mono">
                  <span>Res: {record.resolutionNo}</span>
                  <span className="font-bold text-emerald-900">
                    Total: {record.runningShares} Shares ({formatMoney(record.runningTotalCapital)})
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Share Ledger Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Particulars & Scheme</th>
                  <th className="py-2.5 px-3">Distinctive Nos.</th>
                  <th className="py-2.5 px-3">Cert. No. / Res.</th>
                  <th className="py-2.5 px-3 text-right">Shares Added</th>
                  <th className="py-2.5 px-3 text-right">Paid Capital</th>
                  <th className="py-2.5 px-3 text-right">Total Shares</th>
                  <th className="py-2.5 px-3 text-right">Cumulative Capital</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shareLedgerRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-semibold text-slate-800 whitespace-nowrap">
                      {record.date}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900 leading-tight">{record.type}</p>
                      <p className="text-[10px] text-emerald-700">{record.typeMarathi}</p>
                      <p className="text-[10px] text-slate-400">{record.paymentMode}</p>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 whitespace-nowrap">
                      #{record.distinctiveFrom} - #{record.distinctiveTo}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
                      <div className="font-bold text-slate-800">{record.certificateNo}</div>
                      <div className="text-slate-400 text-[10px]">Res: {record.resolutionNo}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-700">
                      +{record.sharesIssued}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 font-sans">
                      {formatMoney(record.amount)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800">
                      {record.runningShares}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-emerald-800 font-sans">
                      {formatMoney(record.runningTotalCapital)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. SUB-TAB 2: DIVIDEND LEDGER (लाभांश खाते) */}
      {activeSubTab === 'dividend' && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-emerald-100 shadow-xs space-y-4">

          {/* No dividend records available yet */}
          <div className="flex flex-col items-center justify-center text-center py-10 px-4 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-400">
              <FileX className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">No data found</p>
            <p className="text-xs text-slate-400 max-w-[220px]">
              No dividend records have been declared for this member yet.
            </p>
          </div>

          {/*
          <div className="block sm:hidden space-y-3">
            {dividendLedgerRecords.map((div, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-200/80 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-emerald-950">{div.year}</span>
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-200/80 text-emerald-900">
                        {div.rate} Declared
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">{div.agmNo} Approval • Declared on {div.declaredDate}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-base font-extrabold text-emerald-700 font-sans block">
                      +{formatMoney(div.netAmount)}
                    </span>
                    <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{div.status}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl bg-white border border-emerald-100">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Shares Base</span>
                    <span className="font-semibold text-slate-800">{div.sharesCount} Shares ({formatMoney(div.shareCapitalBase)})</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Credit Date</span>
                    <span className="font-semibold text-slate-800">{div.creditDate}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Credited Account</span>
                    <span className="font-mono font-semibold text-slate-800">{div.accountCredited}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">TDS Deducted</span>
                    <span className="font-mono text-slate-700 font-bold">₹0.00 (Exempt)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-emerald-200/60 font-mono">
                  <span className="truncate max-w-[150px]">Ref: {div.refNumber}</span>
                  <span className="truncate max-w-[140px]">UTR: {div.utrNo}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Financial Year</th>
                  <th className="py-2.5 px-3">AGM & Rate</th>
                  <th className="py-2.5 px-3">Qualifying Shares</th>
                  <th className="py-2.5 px-3 text-right">Gross Dividend</th>
                  <th className="py-2.5 px-3 text-right">TDS (₹)</th>
                  <th className="py-2.5 px-3 text-right">Net Credited</th>
                  <th className="py-2.5 px-3">Credit Date & Mode</th>
                  <th className="py-2.5 px-3">UTR / Ref Number</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dividendLedgerRecords.map((div, i) => (
                  <tr key={i} className="hover:bg-emerald-50/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {div.year}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full text-[11px]">
                        {div.rate}
                      </span>
                      <div className="text-[10px] text-slate-500 mt-0.5">{div.agmNo}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800">{div.sharesCount} Shares</span>
                      <div className="text-[10px] text-slate-400">Base: {formatMoney(div.shareCapitalBase)}</div>
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-800 font-sans">
                      {formatMoney(div.grossAmount)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-500">
                      ₹0.00
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-emerald-700 font-sans text-sm">
                      +{formatMoney(div.netAmount)}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{div.creditDate}</div>
                      <div className="text-[10px] text-emerald-700 font-mono">To {div.accountCredited}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">
                      <div>{div.utrNo}</div>
                      <div className="text-slate-400">{div.refNumber}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-emerald-200 bg-emerald-50/50 font-bold">
                  <td colSpan={5} className="py-2.5 px-3 text-slate-800 uppercase text-[11px]">
                    Total Cumulative Dividends Earned
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-800 font-extrabold font-sans text-sm">
                    +{formatMoney(totalDividendReceived)}
                  </td>
                  <td colSpan={2} className="py-2.5 px-3 text-slate-500 text-[10px] font-normal">
                    Credited to Member Savings Account
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          */}
        </div>
      )}
    </div>
  );
};