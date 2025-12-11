export class ContractError extends Error {
  constructor(
    message: string,
    public code?: number,
    public txId?: string
  ) {
    super(message);
    this.name = 'ContractError';
  }
}

export class WalletError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WalletError';
  }
}

export function handleContractError(error: any): ContractError {
  if (error instanceof ContractError) {
    return error;
  }
  
  // Handle Stacks transaction errors
  if (error?.reason) {
    return new ContractError(error.reason, error.code, error.txid);
  }
  
  // Handle network errors
  if (error?.message?.includes('fetch')) {
    return new ContractError('Network error: Unable to connect to Stacks network');
  }
  
  // Handle wallet connection errors
  if (error?.message?.includes('wallet') || error?.message?.includes('connect')) {
    throw new WalletError(error.message);
  }
  
  return new ContractError(error?.message || 'Unknown contract error');
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ContractError || error instanceof WalletError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}