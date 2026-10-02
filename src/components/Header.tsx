import React, { useState } from 'react';
import {
  Bell,
  Eye,
  EyeOff,
  ChevronDown,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { CURRENCY_RATES, useBank } from '../context/BankContext';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenTransfer: () => void;
  onOpenDeposit: () => void;
  onOpenStatement: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenStatement,
  searchQuery,
  setSearchQuery,
}) => {
  const {
    profile,
    isPrivacyMode,
    setIsPrivacyMode,
    currency,
    setCurrencyCode,
    notifications,
  } = useBank();

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Bank Logo & Brand - Clean & Simple */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 font-bold text-sm text-slate-200">
              NB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-base sm:text-lg text-white">
                  NOVA BANK
                </span>
                <span className="hidden md:inline-flex text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  India • Scheduled Bank
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal hidden sm:block">
                Regulated by RBI • DICGC Insured up to ₹5 Lakhs
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search UPI, UTR, Ref #..."
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white bg-slate-700 px-1.5 py-0.5 rounded"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Controls: Privacy, Currency, Notifications, Profile */}
          <div className="flex items-center gap-2">
            
            {/* Balance Privacy Toggle */}
            <button
              onClick={() => setIsPrivacyMode((prev) => !prev)}
              title={isPrivacyMode ? 'Reveal Balances' : 'Hide / Mask Balances'}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            >
              {isPrivacyMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {isPrivacyMode ? 'Privacy On' : 'Hide Balance'}
              </span>
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
              >
                <span className="font-mono font-bold text-slate-200">{currency.symbol}</span>
                <span>{currency.code}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isCurrencyOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsCurrencyOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                      Select Currency
                    </div>
                    <div className="py-1 max-h-60 overflow-y-auto">
                      {Object.values(CURRENCY_RATES).map((curr) => (
                        <button
                          key={curr.code}
                          onClick={() => {
                            setCurrencyCode(curr.code);
                            setIsCurrencyOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all cursor-pointer ${
                            currency.code === curr.code
                              ? 'bg-slate-800 text-white font-bold'
                              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 text-center font-mono font-bold text-slate-400">
                              {curr.symbol}
                            </span>
                            <span>{curr.name}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {curr.code}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
              title="Banking Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-slate-700 border border-slate-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile / Persona Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-1.5 pr-2 sm:pr-3 py-1 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all text-left cursor-pointer"
              >
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-7 h-7 rounded-md object-cover border border-slate-700"
                />
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                    {profile.name}
                    <ShieldCheck className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal leading-none">
                    {profile.tier}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400 ml-1 hidden sm:block" />
              </button>

              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-76 rounded-xl bg-slate-900 border border-slate-800 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 text-white">
                    <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800 border border-slate-700 mb-2">
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold truncate">{profile.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{profile.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-300 bg-slate-700 px-1.5 py-0.2 rounded font-mono">
                            PAN: {profile.panNumber || '-'}
                          </span>
                          <span className="text-[9px] text-emerald-400 font-semibold">
                            e-KYC Verified
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 mb-2.5 text-[11px] space-y-1 text-slate-400">
                      <div className="flex justify-between">
                        <span>UPI ID:</span>
                        <span className="font-mono text-slate-200 font-semibold">{profile.upiId || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Customer ID (CIF):</span>
                        <span className="font-mono text-slate-200">{profile.cifNumber || '-'}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-800 my-2 pt-2 space-y-1">
                      <button
                        onClick={() => {
                          onOpenStatement();
                          setIsProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
                      >
                        <span>Download Full e-Statement</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
