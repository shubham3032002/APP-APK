import React from 'react';
import { Search, ShieldCheck, Bell } from 'lucide-react';
import { useBank } from '../context/BankContext';

interface BankHeaderProps {
  activeTopTab: string;
  setActiveTopTab: (tab: string) => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
}

export const BankHeader: React.FC<BankHeaderProps> = ({
  activeTopTab,
  setActiveTopTab,
  onOpenProfile,
  onOpenNotifications,
  onOpenSearch,
}) => {
  const { profile, notifications, fixedDeposits, loans } = useBank();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const topTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'accounts', label: 'All Accounts' },
    { id: 'fds', label: `Fixed Deposits (${fixedDeposits.length})` },
    { id: 'loans', label: `Loans (${loans.length})` },
    { id: 'statements', label: 'e-Statements & Ledger' },
  ];

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="w-full bg-white border-b border-orange-100 sticky top-0 z-30 shadow-xs">
      {/* Top Main Bar */}
      <div className="max-w-5xl mx-auto px-4 pt-3 pb-2">
        <div className="flex items-center justify-between gap-3">
          
          {/* Bank Brand Logo with signature orange accent */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => setActiveTopTab('overview')}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF5E0E] to-[#D72B00] text-white shadow-xs font-bold text-base">
              <span className="font-serif font-black text-lg">₹</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900">
                  Nova Bank
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.2 rounded bg-orange-100 text-[#D72B00] border border-orange-200">
                  India
                </span>
              </div>
              <p className="text-[10px] text-slate-500">Scheduled Commercial Bank</p>
            </div>
          </div>

          {/* Right Tools: Search, DICGC Tag & Profile */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-700 bg-orange-50/80 px-2.5 py-1 rounded-full border border-orange-200/70">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium">DICGC Insured ₹5L</span>
            </div>

            <button
              onClick={onOpenSearch}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-orange-50 transition-colors cursor-pointer border border-transparent hover:border-orange-200"
              aria-label="Search"
              title="Search Transactions & Statements"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenNotifications}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-orange-50 transition-colors cursor-pointer border border-transparent hover:border-orange-200 relative"
              aria-label="Notifications"
              title="Notifications & Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E6390A]" />
              )}
            </button>

            {/* Profile Avatar with Initials */}
            <div className="relative">
              <button
                onClick={onOpenProfile}
                className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-200 shadow-xs flex items-center justify-center font-bold text-[#D72B00] text-xs hover:border-[#D72B00] transition-all cursor-pointer"
                title={`${profile.name} • Click for KYC & Account Details`}
              >
                {initials || 'SM'}
              </button>
            </div>
          </div>
        </div>

        {/* Category Navigation Tabs */}
        <nav className="mt-3 overflow-x-auto scrollbar-none flex items-center gap-2 pt-1 border-t border-slate-100">
          {topTabs.map((tab) => {
            const isActive = activeTopTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTopTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF5E0E] to-[#E32B00] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
