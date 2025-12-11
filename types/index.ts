export interface Circle {
  id: number;
  name: string;
  creator: string;
  createdAt: number;
  active: boolean;
  treasuryContract: string | null;
}

export interface Member {
  nickname: string;
  totalOwed: number;
  totalOwing: number;
  active: boolean;
  joinedAt: number;
}

export interface Expense {
  id: number;
  description: string;
  totalAmount: number;
  paidBy: string;
  settled: boolean;
  timestamp: number;
  expiresAt: number | null;
  participantCount: number;
}

export interface Settlement {
  debtor: string;
  creditor: string;
  amount: number;
  timestamp: number;
}

export interface CircleStats {
  totalExpenses: number;
  totalSettled: number;
  memberCount: number;
  treasuryBalance: number;
}

export interface ContractCallOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  network: any;
  anchorMode?: any;
  postConditionMode?: any;
}

export interface QueryOptions {
  enabled?: boolean;
  refetchInterval?: number | false | ((data: any) => number | false);
  staleTime?: number;
  cacheTime?: number;
}