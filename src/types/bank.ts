export type AccountType = 'checking' | 'savings' | 'investment' | 'credit' | 'fd' | 'loan' | 'pigmy' | 'rd';

export interface MemberShareInfo {
  memberNumber: string; // e.g. "MEM-0482"
  shareFolioNumber: string; // e.g. "SH-9912"
  numberOfShares: number; // e.g. 50 shares
  faceValuePerShare: number; // e.g. ₹100
  totalShareCapital: number; // ₹5,000
  dividendRate: number; // 12.0% p.a.
  lastDividendAmount: number; // ₹600
  lastDividendDate: string; // 15-Jul-2026
  shareClass: string; // "Class A (Voting Shareholder)"
  societyName: string; // "Shree Sahakar Co-operative Credit Society Ltd."
  societyRegNo: string; // "BOM/COOP/CT/8492/2004"
  branchName: string; // "Dadar Main Branch, Mumbai"
  membershipDate: string; // "12-Apr-2018"
  nomineeName: string; // "Pooja Shubham Mokal (Wife - 100%)"
}

export interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  schemeCode?: string; // e.g. "SAV-01", "PIGMY-04", "RD-08"
  routingNumber?: string;
  ifscCode: string;
  micrCode: string;
  branch: string;
  type: AccountType;
  balance: number;
  availableBalance: number;
  currency: string;
  apy?: number;
  creditLimit?: number;
  apr?: number;
  color: string;
  gradient: string;
  isPrimary?: boolean;
  institution?: string;
  lastUpdated?: string;
  upiId?: string;
  cifNumber?: string;
  agentName?: string; // For pigmy daily collection
  agentCode?: string;
  dailyInstallment?: number;
  monthlyInstallment?: number;
}

export interface FixedDeposit {
  id: string;
  depositNumber: string;
  title: string;
  schemeName: string; // e.g. "Dhanvriddhi 3-Yr Term Scheme", "Lakhpati Kanya Scheme"
  schemeCode: string; // e.g. "FD-DHAN-01"
  linkedAccountId: string;
  principalAmount: number;
  interestRate: number; // e.g. 9.25% p.a.
  tenorMonths: number;
  startDate: string;
  maturityDate: string;
  maturityAmount: number;
  accruedInterest: number;
  interestPayout: 'on_maturity' | 'monthly' | 'quarterly';
  autoRenew: boolean;
  taxSaver: boolean;
  status: 'active' | 'matured' | 'closed';
  certificateUrl?: string;
  nominee?: string;
  tdsDeducted?: number;
  form15GStatus?: 'Submitted' | 'Not Applicable' | 'Pending';
}

export interface BankLoan {
  id: string;
  loanNumber: string;
  title: string;
  schemeName: string; // e.g. "Member Personal Surety Loan", "Gold Ornament Loan", "Property Mortgage Loan"
  loanType: 'personal' | 'gold' | 'home' | 'car' | 'education' | 'festival';
  originalAmount: number;
  outstandingBalance: number;
  interestRate: number; // e.g. 11.5% p.a.
  tenureMonths: number;
  remainingMonths: number;
  emiAmount: number;
  nextDueDate: string;
  autoDebitAccountId: string;
  disbursedDate: string;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
  status: 'active' | 'closed';
  collateralDetails?: string; // e.g. "42.5g 22K Hallmarked Gold" or "2 Member Sureties (G. Shinde & A. Pawar)"
  sureties?: string[]; // Co-op society guarantors
  taxDeductionEligible?: string;
}

export type TransactionCategory =
  | 'Income'
  | 'Food & Dining'
  | 'Shopping'
  | 'Housing & Utilities'
  | 'Transportation'
  | 'Entertainment'
  | 'Health & Wellness'
  | 'Investment'
  | 'Transfer'
  | 'Education'
  | 'Travel'
  | 'Bills'
  | 'Loan EMI'
  | 'Fixed Deposit'
  | 'UPI / QR Payment'
  | 'SIP / Mutual Funds'
  | 'Salary & Bonus'
  | 'Pigmy Daily Deposit'
  | 'RD Monthly Deposit'
  | 'Share Dividend Credit'
  | 'Society Cash Counter';

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  accountId: string;
  accountName: string;
  type: 'debit' | 'credit' | 'transfer';
  amount: number;
  balanceAfter: number;
  merchant: string;
  category: TransactionCategory;
  date: string;
  description?: string;
  status: TransactionStatus;
  recipientOrSender?: string;
  referenceNumber: string;
  mode?: 'UPI' | 'NEFT' | 'IMPS' | 'RTGS' | 'NACH' | 'INTEREST' | 'PIGMY_AGENT' | 'CASH_COUNTER' | 'DIVIDEND';
  avatarUrl?: string;
  iconName?: string;
  tags?: string[];
}

export interface BankCard {
  id: string;
  accountId: string;
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
  type: 'debit' | 'credit' | 'virtual';
  network: 'rupay' | 'visa' | 'mastercard';
  isFrozen: boolean;
  spendingLimit: number;
  currentSpend: number;
  billingCycleDay: number;
  gradient: string;
  contactlessEnabled: boolean;
  onlinePaymentsEnabled: boolean;
  internationalPaymentsEnabled: boolean;
  atmWithdrawalsEnabled: boolean;
  rewardsPoints?: number;
  tier?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  color: string;
  iconName: string;
  autoSaveMonthly?: number;
}

export interface ScheduledBill {
  id: string;
  billerName: string;
  category: string;
  amount: number;
  dueDate: string;
  autoPayEnabled: boolean;
  frequency: 'monthly' | 'quarterly' | 'annual';
  status: 'due' | 'paid' | 'overdue';
  iconName: string;
  billerAccountRef: string;
}

export interface BankNotification {
  id: string;
  title: string;
  message: string;
  type: 'transaction' | 'security' | 'reward' | 'system' | 'bill';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  memberSince: string;
  tier: 'Diamond Priority' | 'Premier Elite' | 'Standard Member' | 'Imperia Privileged' | 'Class-A Shareholder';
  kycVerified: boolean;
  panNumber?: string;
  aadhaarStatus?: string;
  cifNumber?: string;
  upiId?: string;
  memberNumber?: string;
}

export interface CurrencyRate {
  code: string;
  symbol: string;
  name: string;
  rateAgainstUSD: number;
}
