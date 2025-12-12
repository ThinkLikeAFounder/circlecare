import { describe, expect, it, beforeEach } from 'vitest';
import { Cl } from '@stacks/transactions';
import { TEST_ACCOUNTS, CONTRACTS, ERROR_CODES, addExpenseArgs, expectOk, expectErr, advanceBlocks } from './helpers/test-utils';
import { MOCK_EXPENSES, INVALID_INPUTS } from './helpers/mock-data';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;
const wallet3 = accounts.get('wallet_3')!;

describe('Circle Treasury Contract', () => {
  let circleId: number;

  beforeEach(() => {
    // Create a circle for testing
    const { result } = simnet.callPublicFn(
      CONTRACTS.FACTORY,
      'create-circle',
      [Cl.stringAscii('Test Circle')],
      wallet1
    );
    circleId = expectOk(result);
  });

  describe('Expense Creation', () => {
    it('should create expense successfully', () => {
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        addExpenseArgs(
          circleId,
          MOCK_EXPENSES.GROCERIES.description,
          MOCK_EXPENSES.GROCERIES.amount,
          MOCK_EXPENSES.GROCERIES.participants
        ),
        wallet1
      );
      
      const expenseId = expectOk(result);
      expect(expenseId).toBeUint(1);
    });

    it('should reject expense with zero amount', () => {
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        addExpenseArgs(
          circleId,
          'Invalid expense',
          INVALID_INPUTS.ZERO_AMOUNT,
          [wallet1]
        ),
        wallet1
      );
      
      expectErr(result, ERROR_CODES.ERR_INVALID_INPUT);
    });

    it('should reject expense with empty description', () => {
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        addExpenseArgs(
          circleId,
          INVALID_INPUTS.EMPTY_STRING,
          MOCK_EXPENSES.GROCERIES.amount,
          MOCK_EXPENSES.GROCERIES.participants
        ),
        wallet1
      );
      
      expectErr(result, ERROR_CODES.ERR_INVALID_INPUT);
    });

    it('should reject expense with empty participants', () => {
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        addExpenseArgs(
          circleId,
          MOCK_EXPENSES.GROCERIES.description,
          MOCK_EXPENSES.GROCERIES.amount,
          INVALID_INPUTS.EMPTY_PARTICIPANTS
        ),
        wallet1
      );
      
      expectErr(result, ERROR_CODES.ERR_INVALID_INPUT);
    });

    it('should set expense expiration correctly', () => {
      // Create expense
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        addExpenseArgs(
          circleId,
          MOCK_EXPENSES.GROCERIES.description,
          MOCK_EXPENSES.GROCERIES.amount,
          MOCK_EXPENSES.GROCERIES.participants
        ),
        wallet1
      );
      const expenseId = expectOk(result);

      // Get expense details
      const { result: expenseResult } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'get-expense',
        [Cl.uint(expenseId)],
        wallet1
      );
      
      const expense = expectOk(expenseResult);
      expect(expense).toBeTuple({
        'circle-id': Cl.uint(circleId),
        amount: Cl.uint(MOCK_EXPENSES.GROCERIES.amount),
        description: Cl.stringAscii(MOCK_EXPENSES.GROCERIES.description),
        payer: Cl.principal(wallet1),
        'created-at': Cl.uint(simnet.blockHeight),
        'expires-at': Cl.some(Cl.uint(simnet.blockHeight + 144000)),
        settled: Cl.bool(false),
        'settled-at': Cl.none()
      });
    });
  });

  describe('Expense Settlement', () => {
    let expenseId: number;

    beforeEach(() => {
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        addExpenseArgs(
          circleId,
          MOCK_EXPENSES.GROCERIES.description,
          MOCK_EXPENSES.GROCERIES.amount,
          MOCK_EXPENSES.GROCERIES.participants
        ),
        wallet1
      );
      expenseId = expectOk(result);
    });

    it('should settle expense successfully', () => {
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'settle-expense',
        [Cl.uint(expenseId)],
        wallet1
      );
      
      expect(expectOk(result)).toBeBool(true);
    });

    it('should reject settlement of already settled expense', () => {
      // Settle first time
      simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'settle-expense',
        [Cl.uint(expenseId)],
        wallet1
      );

      // Try to settle again
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'settle-expense',
        [Cl.uint(expenseId)],
        wallet1
      );
      
      expectErr(result, ERROR_CODES.ERR_ALREADY_SETTLED);
    });

    it('should reject settlement of expired expense', () => {
      // Advance blocks beyond expiration
      advanceBlocks(simnet, 144001);

      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'settle-expense',
        [Cl.uint(expenseId)],
        wallet1
      );
      
      expectErr(result, ERROR_CODES.ERR_EXPIRED);
    });

    it('should reject unauthorized settlement', () => {
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'settle-expense',
        [Cl.uint(expenseId)],
        wallet3 // Not a participant
      );
      
      expectErr(result, ERROR_CODES.ERR_UNAUTHORIZED);
    });
  });

  describe('Balance Calculations', () => {
    it('should calculate member balance correctly', () => {
      // Create expense with 3 participants
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        addExpenseArgs(
          circleId,
          MOCK_EXPENSES.GROCERIES.description,
          MOCK_EXPENSES.GROCERIES.amount, // 15 STX
          [wallet1, wallet2, wallet3]
        ),
        wallet1
      );
      expectOk(result);

      // Check payer balance (should be positive - others owe them)
      const { result: payerBalance } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'calculate-member-balance',
        [Cl.uint(circleId), Cl.principal(wallet1)],
        wallet1
      );
      
      // Payer paid 15 STX but only owes 5 STX (15/3), so balance is +10 STX
      expect(expectOk(payerBalance)).toBeInt(10000000);

      // Check participant balance (should be negative - they owe money)
      const { result: participantBalance } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'calculate-member-balance',
        [Cl.uint(circleId), Cl.principal(wallet2)],
        wallet1
      );
      
      // Participant owes 5 STX (15/3) but paid 0, so balance is -5 STX
      expect(expectOk(participantBalance)).toBeInt(-5000000);
    });

    it('should handle multiple expenses correctly', () => {
      // First expense: wallet1 pays 15 STX for 3 people
      simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        addExpenseArgs(
          circleId,
          'Expense 1',
          15000000,
          [wallet1, wallet2, wallet3]
        ),
        wallet1
      );

      // Second expense: wallet2 pays 9 STX for 3 people
      simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        addExpenseArgs(
          circleId,
          'Expense 2',
          9000000,
          [wallet1, wallet2, wallet3]
        ),
        wallet2
      );

      // Check wallet1 balance
      const { result: wallet1Balance } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'calculate-member-balance',
        [Cl.uint(circleId), Cl.principal(wallet1)],
        wallet1
      );
      
      // wallet1: paid 15, owes 8 (5+3), net = +7 STX
      expect(expectOk(wallet1Balance)).toBeInt(7000000);

      // Check wallet2 balance
      const { result: wallet2Balance } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'calculate-member-balance',
        [Cl.uint(circleId), Cl.principal(wallet2)],
        wallet1
      );
      
      // wallet2: paid 9, owes 8 (5+3), net = +1 STX
      expect(expectOk(wallet2Balance)).toBeInt(1000000);
    });
  });

  describe('Treasury Management', () => {
    it('should get circle treasury balance', () => {
      const { result } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'get-circle-treasury-balance',
        [Cl.uint(circleId)],
        wallet1
      );
      
      // Initial treasury balance should be 0
      expect(expectOk(result)).toBeUint(0);
    });

    it('should get circle statistics', () => {
      // Create an expense first
      simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        addExpenseArgs(
          circleId,
          MOCK_EXPENSES.GROCERIES.description,
          MOCK_EXPENSES.GROCERIES.amount,
          MOCK_EXPENSES.GROCERIES.participants
        ),
        wallet1
      );

      const { result } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'get-circle-stats',
        [Cl.uint(circleId)],
        wallet1
      );
      
      const stats = expectOk(result);
      expect(stats).toBeTuple({
        'total-expenses': Cl.uint(MOCK_EXPENSES.GROCERIES.amount),
        'total-settled': Cl.uint(0),
        'member-count': Cl.uint(3),
        'treasury-balance': Cl.uint(0)
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle non-existent expense queries', () => {
      const { result } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'get-expense',
        [Cl.uint(INVALID_INPUTS.NON_EXISTENT_CIRCLE_ID)],
        wallet1
      );
      
      expectErr(result, ERROR_CODES.ERR_NOT_FOUND);
    });

    it('should handle large expense amounts', () => {
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        addExpenseArgs(
          circleId,
          'Large expense',
          MOCK_EXPENSES.LARGE_EXPENSE.amount,
          MOCK_EXPENSES.LARGE_EXPENSE.participants
        ),
        wallet1
      );
      
      expect(expectOk(result)).toBeUint(1);
    });

    it('should get expense participants correctly', () => {
      // Create expense
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        addExpenseArgs(
          circleId,
          MOCK_EXPENSES.GROCERIES.description,
          MOCK_EXPENSES.GROCERIES.amount,
          MOCK_EXPENSES.GROCERIES.participants
        ),
        wallet1
      );
      const expenseId = expectOk(result);

      // Get participants
      const { result: participantsResult } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'get-expense-participants',
        [Cl.uint(expenseId)],
        wallet1
      );
      
      const participants = expectOk(participantsResult);
      expect(participants).toBeList(
        MOCK_EXPENSES.GROCERIES.participants.map(p => Cl.principal(p))
      );
    });
  });
});