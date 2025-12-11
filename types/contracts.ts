/**
 * CircleCare Contract Type Definitions
 * 
 * This file contains TypeScript type definitions for all CircleCare smart contracts,
 * providing type safety for frontend interactions and ensuring consistency between
 * contract interfaces and application code.
 */

// ============================================================================
// Base Types
// ============================================================================

/** Stacks principal address type */
export type Principal = string;

/** Stacks transaction ID */
export type TxId = string;

/** Block height on Stacks blockchain */
export type BlockHeight = number;

/** STX amount in microSTX (1 STX = 1,000,000 microSTX) */
export type MicroSTX = number;

/** Contract response type for success/error handling */
export type ContractResponse<T> = {
  success: boolean;
  data?: T;
  error?: ContractError;
};

/** Standard contract error structure */
export interface ContractError {
  code: number;
  message: string;
  details?: string;
}

// ============================================================================
// Circle Factory Contract Types
// ============================================================================

/** Circle data structure as stored in contract */
export interface Circle {
  /** Unique circle identifier */
  id: number;
  /** Human-readable circle name (max 50 chars) */
  name: string;
  /** Principal address of circle creator */
  creator: Principal;
  /** Block height when circle was created */
  createdAt: BlockHeight;
  /** Current number of members in circle */
  memberCount: number;
  /** Whether circle is active and accepting operations */
  isActive: boolean;
}

/** Member information within a circle */
export interface CircleMember {
  /** Member's principal address */
  address: Principal;
  /** Block height when member joined */
  joinedAt: BlockHeight;
  /** Whether member is active in circle */
  isActive: boolean;
  /** Member's role in circle */
  role: 'creator' | 'member';
}

/** Circle creation parameters */
export interface CreateCircleParams {
  /** Circle name (1-50 ASCII characters) */
  name: string;
}

/** Add member parameters */
export interface AddMemberParams {
  /** Target circle ID */
  circleId: number;
  /** Principal address of new member */
  member: Principal;
}

/** Circle factory contract function signatures */
export interface CircleFactoryContract {
  /** Creates a new care circle */
  createCircle: (params: CreateCircleParams) => Promise<ContractResponse<number>>;
  
  /** Adds a member to existing circle */
  addMember: (params: AddMemberParams) => Promise<ContractResponse<boolean>>;
  
  /** Removes a member from circle */
  removeMember: (params: AddMemberParams) => Promise<ContractResponse<boolean>>;
  
  /** Gets circle information by ID */
  getCircle: (circleId: number) => Promise<ContractResponse<Circle>>;
  
  /** Gets all members of a circle */
  getCircleMembers: (circleId: number) => Promise<ContractResponse<Principal[]>>;
  
  /** Checks if principal is circle member */
  isCircleMember: (circleId: number, member: Principal) => Promise<ContractResponse<boolean>>;
  
  /** Gets all circles created by user */
  getUserCircles: (user: Principal) => Promise<ContractResponse<number[]>>;
  
  /** Gets total number of circles in system */
  getTotalCircles: () => Promise<ContractResponse<number>>;
}

// ============================================================================
// Circle Treasury Contract Types
// ============================================================================

/** Expense data structure as stored in contract */
export interface Expense {
  /** Unique expense identifier */
  id: number;
  /** ID of circle this expense belongs to */
  circleId: number;
  /** Total expense amount in microSTX */
  amount: MicroSTX;
  /** Human-readable expense description */
  description: string;
  /** Principal who initially paid for expense */
  payer: Principal;
  /** Block height when expense was created */
  createdAt: BlockHeight;
  /** Optional expiration block height */
  expiresAt?: BlockHeight;
  /** Whether expense has been settled */
  settled: boolean;
  /** Block height when expense was settled */
  settledAt?: BlockHeight;
}

/** Participant share information for an expense */
export interface ParticipantShare {
  /** Expense ID this share belongs to */
  expenseId: number;
  /** Participant's principal address */
  participant: Principal;
  /** Amount this participant owes in microSTX */
  shareAmount: MicroSTX;
  /** Whether participant has paid their share */
  paid: boolean;
  /** Block height when participant paid */
  paidAt?: BlockHeight;
}

/** Member balance within a circle */
export interface MemberBalance {
  /** Circle ID */
  circleId: number;
  /** Member's principal address */
  member: Principal;
  /** Total amount member owes to circle */
  amountOwed: MicroSTX;
  /** Total amount member has paid */
  amountPaid: MicroSTX;
  /** Net balance (positive = owed money, negative = owes money) */
  netBalance: number;
  /** Last balance update block height */
  lastUpdated: BlockHeight;
}

/** Circle treasury information */
export interface CircleTreasury {
  /** Circle ID */
  circleId: number;
  /** Current STX balance in treasury */
  balance: MicroSTX;
  /** Lifetime contributions to treasury */
  totalContributions: MicroSTX;
  /** Lifetime expenses from treasury */
  totalExpenses: MicroSTX;
  /** Last treasury update block height */
  lastUpdated: BlockHeight;
}

/** Expense creation parameters */
export interface CreateExpenseParams {
  /** Target circle ID */
  circleId: number;
  /** Expense amount in microSTX */
  amount: MicroSTX;
  /** Expense description (max 100 chars) */
  description: string;
  /** List of participants who should share expense */
  participants: Principal[];
}

/** Treasury contribution parameters */
export interface ContributeToTreasuryParams {
  /** Target circle ID */
  circleId: number;
  /** Contribution amount in microSTX */
  amount: MicroSTX;
}

/** Settlement parameters */
export interface SettleExpenseParams {
  /** Expense ID to settle */
  expenseId: number;
}

/** Circle treasury contract function signatures */
export interface CircleTreasuryContract {
  /** Creates a new expense within circle */
  createExpense: (params: CreateExpenseParams) => Promise<ContractResponse<number>>;
  
  /** Settles an expense by processing payments */
  settleExpense: (params: SettleExpenseParams) => Promise<ContractResponse<boolean>>;
  
  /** Contributes STX to circle treasury */
  contributeToTreasury: (params: ContributeToTreasuryParams) => Promise<ContractResponse<boolean>>;
  
  /** Gets expense information by ID */
  getExpense: (expenseId: number) => Promise<ContractResponse<Expense>>;
  
  /** Gets all expenses for a circle */
  getCircleExpenses: (circleId: number) => Promise<ContractResponse<number[]>>;
  
  /** Calculates member's balance within circle */
  calculateMemberBalance: (circleId: number, member: Principal) => Promise<ContractResponse<number>>;
  
  /** Gets circle treasury balance */
  getCircleTreasuryBalance: (circleId: number) => Promise<ContractResponse<MicroSTX>>;
  
  /** Gets participants for specific expense */
  getExpenseParticipants: (expenseId: number) => Promise<ContractResponse<Principal[]>>;
}

// ============================================================================
// Combined Contract Interface
// ============================================================================

/** Complete CircleCare contract interface */
export interface CircleCareContracts {
  /** Circle factory contract for circle management */
  circleFactory: CircleFactoryContract;
  /** Circle treasury contract for expense management */
  circleTreasury: CircleTreasuryContract;
}

// ============================================================================
// Event Types
// ============================================================================

/** Base contract event structure */
export interface ContractEvent {
  /** Event type identifier */
  event: string;
  /** Block height when event occurred */
  blockHeight: BlockHeight;
  /** Transaction ID that triggered event */
  txId: TxId;
}

/** Circle creation event */
export interface CircleCreatedEvent extends ContractEvent {
  event: 'circle-created';
  /** ID of newly created circle */
  circleId: number;
  /** Circle name */
  name: string;
  /** Circle creator principal */
  creator: Principal;
}

/** Member addition event */
export interface MemberAddedEvent extends ContractEvent {
  event: 'member-added';
  /** Circle ID */
  circleId: number;
  /** New member principal */
  member: Principal;
  /** Who added the member */
  addedBy: Principal;
}

/** Expense creation event */
export interface ExpenseCreatedEvent extends ContractEvent {
  event: 'expense-created';
  /** ID of newly created expense */
  expenseId: number;
  /** Circle ID */
  circleId: number;
  /** Expense amount */
  amount: MicroSTX;
  /** Who paid for expense */
  payer: Principal;
}

/** Expense settlement event */
export interface ExpenseSettledEvent extends ContractEvent {
  event: 'expense-settled';
  /** ID of settled expense */
  expenseId: number;
  /** Who initiated settlement */
  settledBy: Principal;
}

/** Treasury contribution event */
export interface TreasuryContributionEvent extends ContractEvent {
  event: 'treasury-contribution';
  /** Circle ID */
  circleId: number;
  /** Contribution amount */
  amount: MicroSTX;
  /** Who made contribution */
  contributor: Principal;
}

/** Union type for all contract events */
export type CircleCareEvent = 
  | CircleCreatedEvent 
  | MemberAddedEvent 
  | ExpenseCreatedEvent 
  | ExpenseSettledEvent 
  | TreasuryContributionEvent;

// ============================================================================
// Error Code Constants
// ============================================================================

/** Contract error codes with descriptions */
export const CONTRACT_ERRORS = {
  /** Bad Request - Invalid input parameters */
  INVALID_INPUT: { code: 400, message: 'Invalid input parameters' },
  /** Unauthorized - Insufficient permissions */
  UNAUTHORIZED: { code: 401, message: 'Unauthorized access' },
  /** Insufficient Funds - Not enough STX */
  INSUFFICIENT_FUNDS: { code: 402, message: 'Insufficient funds' },
  /** Forbidden - Action not allowed */
  FORBIDDEN: { code: 403, message: 'Action forbidden' },
  /** Not Found - Resource doesn't exist */
  NOT_FOUND: { code: 404, message: 'Resource not found' },
  /** Expired - Operation or resource expired */
  EXPIRED: { code: 408, message: 'Resource expired' },
  /** Conflict - Resource already exists */
  ALREADY_EXISTS: { code: 409, message: 'Resource already exists' },
  /** Already Settled - Expense already settled */
  ALREADY_SETTLED: { code: 410, message: 'Expense already settled' },
  /** Limit Exceeded - Operation exceeds limits */
  LIMIT_EXCEEDED: { code: 413, message: 'Limit exceeded' },
  /** Internal Error - Unexpected system error */
  INTERNAL_ERROR: { code: 500, message: 'Internal system error' }
} as const;

// ============================================================================
// Utility Types
// ============================================================================

/** Contract deployment information */
export interface ContractDeployment {
  /** Contract address on Stacks */
  address: Principal;
  /** Contract name */
  name: string;
  /** Network (mainnet/testnet) */
  network: 'mainnet' | 'testnet';
  /** Deployment block height */
  deployedAt: BlockHeight;
  /** Contract version */
  version: string;
}

/** Contract configuration */
export interface ContractConfig {
  /** Circle factory deployment info */
  circleFactory: ContractDeployment;
  /** Circle treasury deployment info */
  circleTreasury: ContractDeployment;
}

/** Transaction options for contract calls */
export interface TransactionOptions {
  /** STX fee for transaction */
  fee?: MicroSTX;
  /** Transaction nonce */
  nonce?: number;
  /** Post conditions for transaction */
  postConditions?: any[];
  /** Sponsored transaction flag */
  sponsored?: boolean;
}

/** Contract call result */
export interface ContractCallResult<T = any> {
  /** Whether call was successful */
  success: boolean;
  /** Transaction ID if successful */
  txId?: TxId;
  /** Result data if successful */
  result?: T;
  /** Error information if failed */
  error?: ContractError;
}