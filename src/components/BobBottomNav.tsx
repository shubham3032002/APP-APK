import React from 'react';
import { Home, CreditCard, MoreHorizontal, QrCode, ArrowLeftRight } from 'lucide-react';

interface BobBottomNavProps {
  activeBottomTab: 'home' | 'upi' | 'cards' | 'more';
  setActiveBottomTab: (tab: 'home' | 'upi' | 'cards' | 'more') => void;
  onOpenScanner: () => void;
}

export const BobBottomNav: React.FC<BobBottomNavProps> = ({
  activeBottomTab,
  setActiveBottomTab,
  onOpenScanner,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-orange-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="max-w-lg mx-auto px-4 h-16 flex items-center justify-between relative">
        
        {/* 1. Home */}
        <button
          onClick={() => setActiveBottomTab('home')}
          className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-all active:scale-95 group"
        >
          <Home
            className={`w-5 h-5 transition-transform group-hover:scale-110 ${
              activeBottomTab === 'home' ? 'text-[#E6390A]' : 'text-slate-500'
            }`}
          />
          <span
            className={`text-[11px] font-semibold mt-1 transition-colors ${
              activeBottomTab === 'home'
                ? 'text-[#E6390A] font-bold'
                : 'text-slate-500 group-hover:text-slate-800'
            }`}
          >
            Home
          </span>
          {activeBottomTab === 'home' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#E6390A] mt-0.5" />
          )}
        </button>

        {/* 2. UPI */}
        <button
          onClick={() => setActiveBottomTab('upi')}
          className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-all active:scale-95 group"
        >
          <div className="relative">
            <ArrowLeftRight
              className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                activeBottomTab === 'upi' ? 'text-[#E6390A]' : 'text-slate-500'
              }`}
            />
            {/* Tricolor dot indicator */}
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-orange-500 ring-1 ring-white" />
          </div>
          <span
            className={`text-[11px] font-semibold mt-1 transition-colors ${
              activeBottomTab === 'upi'
                ? 'text-[#E6390A] font-bold'
                : 'text-slate-500 group-hover:text-slate-800'
            }`}
          >
            UPI
          </span>
          {activeBottomTab === 'upi' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#E6390A] mt-0.5" />
          )}
        </button>

        {/* 3. Center Floating Circular QR / Scan Button */}
        <div className="flex-1 flex justify-center -mt-7">
          <button
            onClick={onOpenScanner}
            className="relative group cursor-pointer"
            title="Scan QR / Passbook Quick Statement"
            aria-label="Scan QR or Passbook"
          >
            {/* Soft glowing ambient ring */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#FF5E0E] to-[#D72B00] opacity-40 blur-sm group-hover:opacity-75 transition-opacity animate-pulse" />
            
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#D73516] via-[#E64417] to-[#FF5E0E] text-white shadow-xl shadow-orange-600/40 flex items-center justify-center border-4 border-white active:scale-95 transition-transform">
              <QrCode className="w-7 h-7 group-hover:scale-110 transition-transform" />
            </div>
          </button>
        </div>

        {/* 4. Cards */}
        <button
          onClick={() => setActiveBottomTab('cards')}
          className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-all active:scale-95 group"
        >
          <CreditCard
            className={`w-5 h-5 transition-transform group-hover:scale-110 ${
              activeBottomTab === 'cards' ? 'text-[#E6390A]' : 'text-slate-500'
            }`}
          />
          <span
            className={`text-[11px] font-semibold mt-1 transition-colors ${
              activeBottomTab === 'cards'
                ? 'text-[#E6390A] font-bold'
                : 'text-slate-500 group-hover:text-slate-800'
            }`}
          >
            Cards
          </span>
          {activeBottomTab === 'cards' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#E6390A] mt-0.5" />
          )}
        </button>

        {/* 5. More */}
        <button
          onClick={() => setActiveBottomTab('more')}
          className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-all active:scale-95 group"
        >
          <MoreHorizontal
            className={`w-5 h-5 transition-transform group-hover:scale-110 ${
              activeBottomTab === 'more' ? 'text-[#E6390A]' : 'text-slate-500'
            }`}
          />
          <span
            className={`text-[11px] font-semibold mt-1 transition-colors ${
              activeBottomTab === 'more'
                ? 'text-[#E6390A] font-bold'
                : 'text-slate-500 group-hover:text-slate-800'
            }`}
          >
            More
          </span>
          {activeBottomTab === 'more' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#E6390A] mt-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};
