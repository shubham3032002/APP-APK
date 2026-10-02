import React from 'react';
import { Search, Bell, Sparkles, Award, ShieldCheck, LogOut } from 'lucide-react';
import { useBank } from '../context/BankContext';
import logo from '../../assets/images/logo.jpeg';

interface BobWorldHeaderProps {
  activeTopTab: string;
  setActiveTopTab: (tab: string) => void;
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
}

export const BobWorldHeader: React.FC<BobWorldHeaderProps> = ({
  activeTopTab,
  setActiveTopTab,
  onOpenProfile,
  onOpenNotifications,
  onOpenSearch,
}) => {
  const { profile, notifications, memberShares,society, logout } = useBank();
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const societyName = 'रायगड जिल्हा M.U.M.V सहकारी पतसंस्था मर्यादित';

  const topTabs = [
    { id: 'accounts', label: 'Overview' },
    { id: 'shares', label: 'Shares' },
    { id: 'save', label: 'Deposits' },
    { id: 'borrow', label: 'Loans' },
    // { id: 'statements', label: 'Passbook' },
    { id: 'society', label: 'Society' },
  ];

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="w-full bg-white/95 backdrop-blur-md pt-3 pb-1 px-3 sm:px-4 border-b border-orange-100/70 sticky top-0 z-30 shadow-xs">
      <div className="max-w-lg mx-auto">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Logo & Greeting */}
          <div
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group min-w-0 flex-1"
            onClick={() => setActiveTopTab('accounts')}
          >
            <div className="relative shrink-0">
              <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#E6390A] via-[#F1592A] to-[#FF7A45] text-white shadow-md shadow-orange-600/30 group-hover:scale-105 transition-transform overflow-hidden">
                <img
                  src={logo}
                  alt={societyName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // if the logo fails to load, fall back to the "सह" glyph
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <span className="font-serif font-black hidden">सह</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs sm:text-sm font-extrabold tracking-tight text-[#E6390A] truncate">
                  {societyName}
                </span>
                {/* <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                  #{memberShares.memberNumber}
                </span> */}
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 truncate">
                नमस्ते, {profile.name}
              </p>
            </div>
          </div>

          {/* Right Tools: Notification & Avatar */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* <button
              onClick={onOpenNotifications}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100/90 hover:bg-orange-50 text-slate-700 hover:text-[#E6390A] flex items-center justify-center transition-all cursor-pointer border border-slate-200/60 shadow-2xs relative active:scale-95"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E6390A] ring-2 ring-white" />
              )}
            </button> */}

            {/* Avatar */}
            <button
              onClick={onOpenProfile}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-emerald-800 to-teal-900 border-2 border-white shadow-xs flex items-center justify-center font-bold text-white text-[10px] sm:text-xs hover:ring-2 hover:ring-orange-400 transition-all cursor-pointer active:scale-95 shrink-0 ml-0.5"
              title={`${profile.name} • Member #${memberShares.memberNumber}`}
            >
              {initials || 'SM'}
            </button>

            {/* Logout / Exit */}
            <button
              onClick={() => {
                logout();
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100/90 hover:bg-rose-50 text-slate-600 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer border border-slate-200/60 shadow-2xs active:scale-95 shrink-0"
              aria-label="Log Out"
              title="Log Out / Lock Society Account"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Nav Tabs */}
        <nav className="mt-2.5 overflow-x-auto scrollbar-none flex items-center gap-1.5 pb-1">
          {topTabs.map((tab) => {
            const isActive = activeTopTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTopTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center justify-center cursor-pointer select-none active:scale-95 shrink-0 ${
                  isActive
                    ? 'bg-[#E6390A] text-white shadow-xs shadow-orange-600/30 font-bold'
                    : 'bg-slate-100/90 text-slate-600 hover:bg-orange-50 hover:text-[#E6390A]'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
