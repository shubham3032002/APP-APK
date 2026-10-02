import React, { useState } from 'react';
import { BankProvider, useBank } from './context/BankContext';
import { BobWorldHeader } from './components/BobWorldHeader';
import { LoginPage } from './components/LoginPage';
import { MemberSharesCard } from './components/MemberSharesCard';
import { DepositSchemesCard } from './components/DepositSchemesCard';
import { MultipleLoansCard } from './components/MultipleLoansCard';
import { MemberSharesHub } from './components/MemberSharesHub';
import { DepositSchemesHub } from './components/DepositSchemesHub';
import { LoanHub } from './components/LoanHub';
import { StatementHub } from './components/StatementHub';
import { KYCModal } from './components/KYCModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { SocietyInfo } from './components/SocietyInfo';

const BankAppContent: React.FC = () => {
  const { memberShares, accounts, fixedDeposits, loans, isAuthenticated, isCheckingAuth } = useBank();
  // Top tabs: accounts (overview), shares, save, borrow, statements, society
  const [activeTopTab, setActiveTopTab] = useState<string>('accounts');

  // Modals state
  const [isKYCOpen, setIsKYCOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Render Login Page if user is unauthenticated
    // While we're checking whether an existing session cookie is still valid,
  // show a simple loading state instead of flashing the login screen.
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E6390A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Render Login Page if user is unauthenticated
  if (!isAuthenticated) {
    return <LoginPage onSuccess={() => setActiveTopTab('accounts')} />;
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-slate-900 font-sans selection:bg-[#E6390A] selection:text-white flex flex-col pb-8">
      
      {/* 1. Header (Logo, Member #, Search, Profile, Category Nav Tabs) */}
      <BobWorldHeader
        activeTopTab={activeTopTab}
        setActiveTopTab={setActiveTopTab}
        onOpenProfile={() => setIsKYCOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSearch={() => setActiveTopTab('statements')}
      />

      {/* 2. Main Body Content */}
      <main className="flex-1 w-full max-w-lg mx-auto pb-6 space-y-4">
        
        {/* TAB 1: ACCOUNTS / OVERVIEW (MEMBER SHARES, DEPOSIT SCHEMES & MULTIPLE LOANS) */}
        {activeTopTab === 'accounts' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            
            {/* 1. Member Share Capital Card (Emerald-Gold) */}
            <MemberSharesCard
              onOpenShareDetails={() => setActiveTopTab('shares')}
              onOpenDividendHistory={() => setActiveTopTab('shares')}
            />

            {/* 2. Deposit Schemes Card (Sapphire Blue: Savings, Pigmy, RD, 2 FDs) */}
            <DepositSchemesCard
              onOpenDepositHub={() => setActiveTopTab('save')}
              onOpenPassbook={() => setActiveTopTab('statements')}
            />

            {/* 3. Multiple Loans Card (Deep Purple: Personal, Gold, Home, Festival) */}
            <MultipleLoansCard
              onOpenLoansHub={() => setActiveTopTab('borrow')}
              onOpenLoanSchedule={() => setActiveTopTab('borrow')}
            />
          </div>
        )}

        {/* TAB 2: SHARES (MEMBER SHARE CERTIFICATE & DIVIDENDS) */}
        {activeTopTab === 'shares' && (
          <div className="px-4 py-4 space-y-4 animate-in fade-in duration-150">
            <MemberSharesHub />
          </div>
        )}

        {/* TAB 3: SAVE (PIGMY, RD, FD DEPOSIT SCHEMES) */}
        {activeTopTab === 'save' && (
          <div className="px-4 py-4 space-y-4 animate-in fade-in duration-150">
            <DepositSchemesHub />
          </div>
        )}

        {/* TAB 4: BORROW (MULTIPLE LOAN ACCOUNTS: PERSONAL, GOLD, PROPERTY, FESTIVAL) */}
        {activeTopTab === 'borrow' && (
          <div className="px-4 py-4 space-y-4 animate-in fade-in duration-150">
            <LoanHub />
          </div>
        )}

        {/* TAB 5: PASSBOOK & STATEMENTS */}
        {activeTopTab === 'statements' && (
          <div className="px-4 py-4 space-y-4 animate-in fade-in duration-150">
            <StatementHub />
          </div>
        )}

        {/* TAB 6: SOCIETY INFO & BYE-LAWS */}
        {activeTopTab === 'society' && <SocietyInfo />}

      </main>

      {/* KYC / Member Profile Modal */}
      <KYCModal isOpen={isKYCOpen} onClose={() => setIsKYCOpen(false)} />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <BankProvider>
      <BankAppContent />
    </BankProvider>
  );
}

export default App;