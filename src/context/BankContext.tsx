import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { api, ApiError, DashboardResponse, SocietyResponse } from '../services/api';
import {
  BankAccount,
  BankCard,
  BankLoan,
  BankNotification,
  CurrencyRate,
  FixedDeposit,
  MemberShareInfo,
  SavingsGoal,
  ScheduledBill,
  Transaction,
  TransactionCategory,
  UserProfile,
} from '../types/bank';

export const CURRENCY_RATES: Record<string, CurrencyRate> = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateAgainstUSD: 1.0 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateAgainstUSD: 0.0115 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateAgainstUSD: 0.0106 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateAgainstUSD: 0.0091 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rateAgainstUSD: 0.0154 },
  AED: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rateAgainstUSD: 0.0422 },
};

const EMPTY_PROFILE: UserProfile = {
  id: '',
  name: '',
  email: '',
  phone: '',
  avatar: '',
  memberSince: '',
  tier: 'Standard Member',
  kycVerified: false,
};

const EMPTY_MEMBER_SHARES: MemberShareInfo = {
  memberNumber: '',
  shareFolioNumber: '',
  numberOfShares: 0,
  faceValuePerShare: 0,
  totalShareCapital: 0,
  dividendRate: 0,
  lastDividendAmount: 0,
  lastDividendDate: '',
  shareClass: '',
  societyName: '',
  societyRegNo: '',
  branchName: '',
  membershipDate: '',
  nomineeName: '',
};

interface BankContextType {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  society: SocietyResponse | null;
  memberShares: MemberShareInfo;
  setMemberShares: (shares: MemberShareInfo) => void;
  accounts: BankAccount[];
  selectedAccountId: string | null;
  setSelectedAccountId: (id: string | null) => void;
  transactions: Transaction[];
  cards: BankCard[];
  savingsGoals: SavingsGoal[];
  bills: ScheduledBill[];
  fixedDeposits: FixedDeposit[];
  loans: BankLoan[];
  notifications: BankNotification[];
  isPrivacyMode: boolean;
  setIsPrivacyMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  currency: CurrencyRate;
  setCurrencyCode: (code: string) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;

  // Authentication State
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  authError: string | null;
  isAuthLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isSessionLocked: boolean;
  lockSession: () => void;
  unlockSession: (pin: string) => boolean;

  // Metrics & Totals
  totalSavingsBalance: number;
  totalPigmyBalance: number;
  totalRDBalance: number;
  totalDepositSchemesPrincipal: number;
  totalLoansOutstanding: number;
  totalMonthlyEMI: number;
  totalShareCapital: number;

  // Actions
  formatMoney: (amount: number, customCurrency?: CurrencyRate) => string;
  formatIndianWords: (amount: number) => string;
  convertAmount: (amountBase: number) => number;
  openNewFixedDeposit: (params: {
    title: string;
    schemeName: string;
    principalAmount: number;
    tenorMonths: number;
    interestRate: number;
    interestPayout: 'on_maturity' | 'monthly' | 'quarterly';
    linkedAccountId: string;
    autoRenew: boolean;
    taxSaver: boolean;
    nominee?: string;
  }) => { success: boolean; error?: string; fd?: FixedDeposit };
  liquidateFixedDeposit: (fdId: string, destinationAccountId: string) => { success: boolean; error?: string; payoutAmount?: number };
  payLoanEMI: (params: {
    loanId: string;
    fromAccountId: string;
    amount: number;
    isPrepayment?: boolean;
  }) => { success: boolean; error?: string };
  applyInstantLoan: (params: {
    loanType: 'personal' | 'gold' | 'home' | 'car' | 'education' | 'festival';
    title: string;
    schemeName: string;
    amount: number;
    tenureMonths: number;
    interestRate: number;
    depositToAccountId: string;
  }) => { success: boolean; error?: string; loan?: BankLoan };
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

// Storage keys for Sahakar Co-operative Society
const STORAGE_KEYS = {
  PROFILE: 'sahakar_coop_profile_v1',
  MEMBER_SHARES: 'sahakar_coop_shares_v1',
  ACCOUNTS: 'sahakar_coop_accounts_v1',
  TRANSACTIONS: 'sahakar_coop_transactions_v1',
  CARDS: 'sahakar_coop_cards_v1',
  GOALS: 'sahakar_coop_goals_v1',
  BILLS: 'sahakar_coop_bills_v1',
  FIXED_DEPOSITS: 'sahakar_coop_fds_v1',
  LOANS: 'sahakar_coop_loans_v1',
  NOTIFICATIONS: 'sahakar_coop_notifications_v1',
  PRIVACY_MODE: 'sahakar_coop_privacy_v1',
  CURRENCY: 'sahakar_coop_currency_v1',
  THEME: 'sahakar_coop_theme_v1',
};

export const BankProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : EMPTY_PROFILE;
  });

  const [society, setSociety] = useState<SocietyResponse | null>(null);

  const [memberShares, setMemberShares] = useState<MemberShareInfo>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBER_SHARES);
    return saved ? JSON.parse(saved) : EMPTY_MEMBER_SHARES;
  });

  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [cards, setCards] = useState<BankCard[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CARDS);
    return saved ? JSON.parse(saved) : [];
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    return saved ? JSON.parse(saved) : [];
  });

  const [bills, setBills] = useState<ScheduledBill[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BILLS);
    return saved ? JSON.parse(saved) : [];
  });

  const [fixedDeposits, setFixedDeposits] = useState<FixedDeposit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FIXED_DEPOSITS);
    return saved ? JSON.parse(saved) : [];
  });

  const [loans, setLoans] = useState<BankLoan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOANS);
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<BankNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(false);
  const [currencyCode, setCurrencyCodeState] = useState<string>('INR');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  // Authentication State
  // With session-cookie auth we can't know if we're logged in just by checking
  // local storage — we have to ask the backend. Start as false, then verify
  // on mount by calling /api/me.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isSessionLocked, setIsSessionLocked] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

    // On page load/refresh, ask the backend if our session cookie is still valid.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await api.me();
        if (!cancelled) setIsAuthenticated(true);
        try {
          const dashboardData = await api.dashboard();
          if (!cancelled) hydrateDashboard(dashboardData);
        } catch {
          // dashboard failed, but session is valid — keep local data
        }
      } catch {
        if (!cancelled) setIsAuthenticated(false);
      } finally {
        if (!cancelled) setIsCheckingAuth(false);
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const hydrateDashboard = (data: DashboardResponse) => {
    if (data.profile) {
      setProfile((prev) => ({
        ...prev,
        ...data.profile,
        memberSince: data.profile.memberSince || prev.memberSince,
        tier: 'Class-A Shareholder',
      }));
    }

    if (data.society) {
      setSociety(data.society);
    }

    if (data.shares) {
      setMemberShares((prev) => ({ ...prev, ...data.shares }));
    }

    if (data.accounts?.length) {
      setAccounts(data.accounts.map((account, index) => ({
        id: account.id,
        name: account.name || 'Deposit Account',
        accountNumber: account.accountNumber,
        schemeCode: account.schemeCode,
        ifscCode: 'SHKR0000000',
        micrCode: '',
        branch: 'Shree Sahakar Co-operative Bank',
        type: account.type || 'savings',
        balance: Number(account.balance || 0),
        availableBalance: Number(account.availableBalance ?? account.balance ?? 0),
        currency: 'INR',
        interestRate: Number(account.interestRate || 0),
        monthlyInstallment: Number(account.monthlyInstallment || 0),
        color: index === 0 ? '#0f172a' : '#0284c7',
        gradient: index === 0 ? 'from-slate-800 to-slate-950' : 'from-sky-700 to-blue-900',
        isPrimary: index === 0,
        lastUpdated: 'Live balance',
      })));
    }

    if (data.deposits?.length) {
      setFixedDeposits(data.deposits.map((deposit) => ({
        id: deposit.id,
        depositNumber: deposit.accountNumber,
        title: deposit.name || 'Term Deposit',
        schemeName: deposit.name || 'Deposit Scheme',
        schemeCode: deposit.schemeCode || '',
        linkedAccountId: '',
        principalAmount: Number(deposit.principalAmount || 0),
        interestRate: Number(deposit.interestRate || 0),
        tenorMonths: 0,
        startDate: deposit.openedDate || '',
        maturityDate: deposit.maturityDate || '',
        maturityAmount: Number(deposit.maturityAmount || 0),
        accruedInterest: 0,
        interestPayout: 'on_maturity',
        autoRenew: Boolean(deposit.autoRenew),
        taxSaver: false,
        status: 'active',
      })));
    }

    if (data.loans?.length) {
      setLoans(data.loans.map((loan) => ({
        ...loan,
        originalAmount: Number(loan.originalAmount || 0),
        outstandingBalance: Number(loan.outstandingBalance || 0),
        interestRate: Number(loan.interestRate || 0),
        tenureMonths: Number(loan.tenureMonths || 0),
        remainingMonths: Number(loan.remainingMonths || 0),
        emiAmount: Number(loan.emiAmount || 0),
        autoDebitAccountId: '',
        totalInterestPaid: 0,
        totalPrincipalPaid: 0,
      })));
    }

    if (data.transactions?.length) {
      setTransactions(data.transactions as Transaction[]);
    }
  };

  const login = async (username: string, password: string) => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const result = await api.login(username, password);   // no more api.csrf() before this

      // Login uses the server session cookie for subsequent API requests.
      setIsAuthenticated(true);
      setIsSessionLocked(false);

      setProfile((prev) => ({
        ...prev,
        cifNumber: result.custno || prev.cifNumber,
        memberNumber: result.memno || prev.memberNumber,
      }));
      if (result.memno) {
        setMemberShares((prev) => ({
          ...prev,
          memberNumber: result.memno as string,
        }));
      }

      // The login succeeds even if account data is temporarily unavailable.
      // This prevents an intermittent dashboard request from blocking sign-in.
      try {
        hydrateDashboard(await api.dashboard());
      } catch {
        // Keep any existing local display data and retry after the next login.
      }

      return { success: true };
    } catch (err: any) {
      const message = err?.message || 'Unable to sign in. Please try again.';
      setAuthError(message);
      return { success: false, error: message };
    } finally {
      setIsAuthLoading(false);
    }
  };

   const logout = () => {
    // Best-effort: tell the backend to destroy the session. Don't block the UI on it.
    api.logout().catch(() => {
      // ignore network errors on logout; we clear local auth state regardless
    });
    setIsAuthenticated(false);
    setIsSessionLocked(false);
  };

  const lockSession = () => {
    setIsSessionLocked(true);
  };

  const unlockSession = (pin: string) => {
    if (pin.length === 4) {
      setIsSessionLocked(false);
      return true;
    }
    return false;
  };

  const currency = CURRENCY_RATES[currencyCode] || CURRENCY_RATES.INR;

  const setCurrencyCode = (code: string) => {
    if (CURRENCY_RATES[code]) {
      setCurrencyCodeState(code);
      localStorage.setItem(STORAGE_KEYS.CURRENCY, code);
    }
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBER_SHARES, JSON.stringify(memberShares));
  }, [memberShares]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FIXED_DEPOSITS, JSON.stringify(fixedDeposits));
  }, [fixedDeposits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
  }, [loans]);

  // Derived Totals
  const savingsAcc = accounts.find((a) => a.type === 'savings') || accounts[0];
  const pigmyAcc = accounts.find((a) => a.type === 'pigmy');
  const rdAcc = accounts.find((a) => a.type === 'rd');

  const totalSavingsBalance = savingsAcc?.balance || 0;
  const totalPigmyBalance = pigmyAcc?.balance || 0;
  const totalRDBalance = rdAcc?.balance || 0;

  const totalFDPrincipal = fixedDeposits.reduce((acc, fd) => acc + fd.principalAmount, 0);
  const totalDepositSchemesPrincipal = totalSavingsBalance + totalPigmyBalance + totalRDBalance + totalFDPrincipal;

  const totalLoansOutstanding = loans.reduce((acc, l) => acc + l.outstandingBalance, 0);
  const totalMonthlyEMI = loans.reduce((acc, l) => acc + l.emiAmount, 0);
  const totalShareCapital = memberShares.totalShareCapital;

  const convertAmount = (amountBase: number): number => {
    return amountBase * (currency.rateAgainstUSD / CURRENCY_RATES.INR.rateAgainstUSD);
  };

  const formatMoney = (amount: number, customCurrency?: CurrencyRate): string => {
    const cur = customCurrency || currency;
    const formattedNumber = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(amount);

    return `${cur.symbol}${formattedNumber}`;
  };

  const formatIndianWords = (num: number): string => {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Crore`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} Lakh`;
    }
    if (num >= 1000) {
      return `₹${(num / 1000).toFixed(2)} Thousand`;
    }
    return `₹${num.toFixed(2)}`;
  };

  // Open New FD Scheme
  const openNewFixedDeposit = (params: {
    title: string;
    schemeName: string;
    principalAmount: number;
    tenorMonths: number;
    interestRate: number;
    interestPayout: 'on_maturity' | 'monthly' | 'quarterly';
    linkedAccountId: string;
    autoRenew: boolean;
    taxSaver: boolean;
    nominee?: string;
  }) => {
    const fundingAccount = accounts.find((a) => a.id === params.linkedAccountId) || accounts[0];
    if (fundingAccount.balance < params.principalAmount) {
      return { success: false, error: 'Insufficient balance in funding account' };
    }

    const start = new Date();
    const matDate = new Date();
    matDate.setMonth(matDate.getMonth() + params.tenorMonths);

    const r = params.interestRate / 100;
    const t = params.tenorMonths / 12;
    const estimatedMaturity = params.principalAmount * Math.pow(1 + r / 4, 4 * t);

    const newFD: FixedDeposit = {
      id: `fd_${Date.now()}`,
      depositNumber: `FD-SCH-${Math.floor(1000 + Math.random() * 9000)}`,
      title: params.title,
      schemeName: params.schemeName,
      schemeCode: 'FD-NEW',
      linkedAccountId: fundingAccount.id,
      principalAmount: params.principalAmount,
      interestRate: params.interestRate,
      tenorMonths: params.tenorMonths,
      startDate: start.toISOString().split('T')[0],
      maturityDate: matDate.toISOString().split('T')[0],
      maturityAmount: Math.round(estimatedMaturity),
      accruedInterest: 0,
      interestPayout: params.interestPayout,
      autoRenew: params.autoRenew,
      taxSaver: params.taxSaver,
      status: 'active',
      nominee: params.nominee || profile.name,
      tdsDeducted: 0,
      form15GStatus: 'Submitted',
    };

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === fundingAccount.id
          ? {
              ...acc,
              balance: acc.balance - params.principalAmount,
              availableBalance: acc.availableBalance - params.principalAmount,
            }
          : acc
      )
    );

    setFixedDeposits((prev) => [newFD, ...prev]);

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      accountId: fundingAccount.id,
      accountName: fundingAccount.name,
      type: 'debit',
      amount: params.principalAmount,
      balanceAfter: fundingAccount.balance - params.principalAmount,
      merchant: `Fixed Deposit Scheme: ${params.schemeName}`,
      category: 'Fixed Deposit',
      date: new Date().toISOString(),
      description: `FD CREATION #${newFD.depositNumber}`,
      status: 'completed',
      referenceNumber: `FD-CRE-${Date.now()}`,
      mode: 'INTEREST',
    };

    setTransactions((prev) => [tx, ...prev]);

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch {
      // ignore
    }

    return { success: true, fd: newFD };
  };

  const liquidateFixedDeposit = (fdId: string, destinationAccountId: string) => {
    const fd = fixedDeposits.find((f) => f.id === fdId);
    if (!fd) return { success: false, error: 'Deposit not found' };

    const payoutAmount = fd.principalAmount + fd.accruedInterest;

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === destinationAccountId
          ? {
              ...acc,
              balance: acc.balance + payoutAmount,
              availableBalance: acc.availableBalance + payoutAmount,
            }
          : acc
      )
    );

    setFixedDeposits((prev) => prev.filter((f) => f.id !== fdId));

    return { success: true, payoutAmount };
  };

  const payLoanEMI = (params: {
    loanId: string;
    fromAccountId: string;
    amount: number;
    isPrepayment?: boolean;
  }) => {
    const loan = loans.find((l) => l.id === params.loanId);
    const acc = accounts.find((a) => a.id === params.fromAccountId);

    if (!loan || !acc) return { success: false, error: 'Invalid loan or account' };
    if (acc.balance < params.amount) return { success: false, error: 'Insufficient funds for EMI' };

    setAccounts((prev) =>
      prev.map((a) =>
        a.id === acc.id
          ? {
              ...a,
              balance: a.balance - params.amount,
              availableBalance: a.availableBalance - params.amount,
            }
          : a
      )
    );

    setLoans((prev) =>
      prev.map((l) =>
        l.id === loan.id
          ? {
              ...l,
              outstandingBalance: Math.max(0, l.outstandingBalance - params.amount),
              totalPrincipalPaid: l.totalPrincipalPaid + params.amount,
              remainingMonths: Math.max(0, l.remainingMonths - 1),
            }
          : l
      )
    );

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      accountId: acc.id,
      accountName: acc.name,
      type: 'debit',
      amount: params.amount,
      balanceAfter: acc.balance - params.amount,
      merchant: `${loan.title} EMI Paid`,
      category: 'Loan EMI',
      date: new Date().toISOString(),
      description: `SOCIETY LOAN EMI #${loan.loanNumber}`,
      status: 'completed',
      referenceNumber: `EMI-${Date.now()}`,
      mode: 'NACH',
    };

    setTransactions((prev) => [tx, ...prev]);

    return { success: true };
  };

  const applyInstantLoan = (params: {
    loanType: 'personal' | 'gold' | 'home' | 'car' | 'education' | 'festival';
    title: string;
    schemeName: string;
    amount: number;
    tenureMonths: number;
    interestRate: number;
    depositToAccountId: string;
  }) => {
    const targetAcc = accounts.find((a) => a.id === params.depositToAccountId) || accounts[0];

    const r = params.interestRate / (12 * 100);
    const emi = Math.round(
      (params.amount * r * Math.pow(1 + r, params.tenureMonths)) /
        (Math.pow(1 + r, params.tenureMonths) - 1)
    );

    const newLoan: BankLoan = {
      id: `loan_${Date.now()}`,
      loanNumber: `LN-SOC-${Math.floor(1000 + Math.random() * 9000)}`,
      title: params.title,
      schemeName: params.schemeName,
      loanType: params.loanType,
      originalAmount: params.amount,
      outstandingBalance: params.amount,
      interestRate: params.interestRate,
      tenureMonths: params.tenureMonths,
      remainingMonths: params.tenureMonths,
      emiAmount: emi,
      nextDueDate: '05 Next Month',
      autoDebitAccountId: targetAcc.id,
      disbursedDate: new Date().toISOString().split('T')[0],
      totalPrincipalPaid: 0,
      totalInterestPaid: 0,
      status: 'active',
      collateralDetails: 'Society Member Guarantee / Share Capital Lien',
      sureties: ['Self & 2 Active Member Guarantors'],
      taxDeductionEligible: 'Section 80C Eligible',
    };

    setLoans((prev) => [newLoan, ...prev]);

    setAccounts((prev) =>
      prev.map((a) =>
        a.id === targetAcc.id
          ? {
              ...a,
              balance: a.balance + params.amount,
              availableBalance: a.availableBalance + params.amount,
            }
          : a
      )
    );

    return { success: true, loan: newLoan };
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <BankContext.Provider
      value={{
        profile,
        setProfile,
        society,
        memberShares,
        setMemberShares,
        accounts,
        selectedAccountId,
        setSelectedAccountId,
        transactions,
        cards,
        savingsGoals,
        bills,
        fixedDeposits,
        loans,
        notifications,
        isPrivacyMode,
        setIsPrivacyMode,
        currency,
        setCurrencyCode,
        theme,
        setTheme,

        isAuthenticated,
        isCheckingAuth,
        authError,
        isAuthLoading,
        login,
        logout,
        isSessionLocked,
        lockSession,
        unlockSession,

        totalSavingsBalance,
        totalPigmyBalance,
        totalRDBalance,
        totalDepositSchemesPrincipal,
        totalLoansOutstanding,
        totalMonthlyEMI,
        totalShareCapital,

        formatMoney,
        formatIndianWords,
        convertAmount,
        openNewFixedDeposit,
        liquidateFixedDeposit,
        payLoanEMI,
        applyInstantLoan,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
};