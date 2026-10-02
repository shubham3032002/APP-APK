const API_BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers || {}),
  };
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  let body: any = null;

  try {
    body = await res.json();
  } catch {}

  if (!res.ok) {
    throw new ApiError(
      body?.message ||
      `Request failed with status ${res.status}`,
      res.status
    );
  }

  return body as T;
}

export interface SocietyResponse {
  name: string;
  regNo: string;
  regNoMarathi: string;
  address: string;
  location: string;
  contactNo: string;
  email: string;
}

export interface DashboardResponse {
  profile?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    cifNumber?: string;
    memberNumber?: string | null;
    memberSince?: string | null;
    panNumber?: string | null;
    kycVerified?: boolean;
    [key: string]: any;
  };

  society?: SocietyResponse;
  accounts?: any[];

  balances?: {
    total_balance?: number;
    updated_at?: string;
  };

  shares?: {
    memberNumber?: string | null;
    numberOfShares?: number;
    faceValuePerShare?: number;
    totalShareCapital?: number;
    shareFolioNumber?: string;
    membershipDate?: string | null;
    ledger?: any[];
    [key: string]: any;
  };

  loans?: any[];
  deposits?: any[];
  transactions?: any[];
}

// Shape returned by BalanceHubController::accountTransactions() and
// ::loanTransactions() — both endpoints return this same envelope, just
// with a different "transactions" row shape inside (deposit rows vs.
// loan rows with principal/interest breakdown).
export interface AccountLedgerResponse {
  success: boolean;
  accountId: string;
  transactions: any[];
}

export const api = {
  login: async (username: string, password: string) => {
    return request<{ custno: string; memno: string | null }>('/login', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    });
  },

  logout: async () => {
    return request<{ message: string }>('/logout', {
      method: 'POST',
    });
  },

  me: () => request<any>('/me'),

  dashboard: () =>
    request<DashboardResponse>('/dashboard'),

  // Full, uncapped ledger for ONE deposit account (savings/pigmy/RD/FD).
  // id is the "SSCODE-ACNO" key, e.g. "401-24" — matches account.id as
  // returned in DashboardResponse.accounts[].
  accountTransactions: (id: string) =>
    request<AccountLedgerResponse>(
      `/accounts/${encodeURIComponent(id)}/transactions`
    ),

  // Full, uncapped ledger for ONE loan account, grouped by voucher
  // (date + setno) with principal/interest split. id is the
  // "SSCODE-ACNO" key, e.g. "200-1091" — matches loan.id as returned in
  // DashboardResponse.loans[].
  loanTransactions: (id: string) =>
    request<AccountLedgerResponse>(
      `/loans/${encodeURIComponent(id)}/transactions`
    ),
};