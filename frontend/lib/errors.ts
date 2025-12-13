import { toast } from './toast';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network connection failed') {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class TransactionError extends AppError {
  constructor(message: string, public txId?: string) {
    super(message, 'TRANSACTION_ERROR');
    this.name = 'TransactionError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export function handleError(error: unknown, context?: string): void {
  console.error(`Error in ${context || 'application'}:`, error);

  if (error instanceof ValidationError) {
    toast.error(error.message, 'Validation Error');
  } else if (error instanceof NetworkError) {
    toast.error('Please check your internet connection and try again.', 'Connection Error');
  } else if (error instanceof TransactionError) {
    toast.error(error.message, 'Transaction Failed');
  } else if (error instanceof AppError) {
    toast.error(error.message);
  } else if (error instanceof Error) {
    toast.error('An unexpected error occurred. Please try again.', 'Error');
  } else {
    toast.error('Something went wrong. Please try again.');
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}