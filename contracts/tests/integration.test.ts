import { describe, expect, it, beforeEach } from 'vitest';
import { Cl } from '@stacks/transactions';
import { TEST_ACCOUNTS, CONTRACTS, ERROR_CODES, expectOk, expectErr, advanceBlocks } from './helpers/test-utils';
import { MOCK_CIRCLES, MOCK_EXPENSES } from './helpers/mock-data';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;
const wallet3 = accounts.get('wallet_3')!;
const wallet4 = accounts.get('wallet_4')!;

describe('Integration Tests', () => {
  describe('End-to-End Circle Creation to Settlement', () => {
    it('should complete full circle lifecycle', () => {
      // Step 1: Create circle
      const { result: circleResult } = simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'create-circle',
        [Cl.stringAscii(MOCK_CIRCLES.FAMILY.name)],
        wallet1
      );
      const circleId = expectOk(circleResult);

      // Step 2: Add members
      const { result: addMember1 } = simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'add-member',
        [Cl.uint(circleId), Cl.principal(wallet2)],
        wallet1
      );
      expectOk(addMember1);

      const { result: addMember2 } = simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'add-member',
        [Cl.uint(circleId), Cl.principal(wallet3)],
        wallet1
      );
      expectOk(addMember2);

      // Step 3: Create expense
      const { result: expenseResult } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        [
          Cl.uint(circleId),
          Cl.stringAscii(MOCK_EXPENSES.GROCERIES.description),
          Cl.uint(MOCK_EXPENSES.GROCERIES.amount),
          Cl.list([Cl.principal(wallet1), Cl.principal(wallet2), Cl.principal(wallet3)])
        ],
        wallet1
      );
      const expenseId = expectOk(expenseResult);

      // Step 4: Verify balances
      const { result: balance1 } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'calculate-member-balance',
        [Cl.uint(circleId), Cl.principal(wallet1)],
        wallet1
      );
      // wallet1 paid 15 STX but owes 5 STX, so balance is +10 STX
      expect(expectOk(balance1)).toBeInt(10000000);

      const { result: balance2 } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'calculate-member-balance',
        [Cl.uint(circleId), Cl.principal(wallet2)],
        wallet1
      );
      // wallet2 owes 5 STX, balance is -5 STX
      expect(expectOk(balance2)).toBeInt(-5000000);

      // Step 5: Settle debt
      const { result: settleResult } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'settle-debt-stx',
        [
          Cl.uint(circleId),
          Cl.principal(wallet1), // creditor
          Cl.uint(5000000) // 5 STX
        ],
        wallet2
      );
      expectOk(settleResult);

      // Step 6: Verify settlement
      const { result: newBalance2 } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'calculate-member-balance',
        [Cl.uint(circleId), Cl.principal(wallet2)],
        wallet1
      );
      // After settlement, wallet2 balance should be 0
      expect(expectOk(newBalance2)).toBeInt(0);
    });

    it('should handle multiple expenses and settlements', () => {
      // Create circle with multiple members
      const { result: circleResult } = simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'create-circle',
        [Cl.stringAscii('Multi-Expense Circle')],
        wallet1
      );
      const circleId = expectOk(circleResult);

      // Add members
      simnet.callPublicFn(CONTRACTS.FACTORY, 'add-member', [Cl.uint(circleId), Cl.principal(wallet2)], wallet1);
      simnet.callPublicFn(CONTRACTS.FACTORY, 'add-member', [Cl.uint(circleId), Cl.principal(wallet3)], wallet1);

      // Create multiple expenses
      const expenses = [
        { payer: wallet1, amount: 12000000, desc: 'Groceries' },
        { payer: wallet2, amount: 9000000, desc: 'Utilities' },
        { payer: wallet3, amount: 6000000, desc: 'Internet' }
      ];

      const expenseIds = [];
      for (const expense of expenses) {
        const { result } = simnet.callPublicFn(
          CONTRACTS.TREASURY,
          'create-expense',
          [
            Cl.uint(circleId),
            Cl.stringAscii(expense.desc),
            Cl.uint(expense.amount),
            Cl.list([Cl.principal(wallet1), Cl.principal(wallet2), Cl.principal(wallet3)])
          ],
          expense.payer
        );
        expenseIds.push(expectOk(result));
      }

      // Verify total expenses
      const { result: statsResult } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'get-circle-stats',
        [Cl.uint(circleId)],
        wallet1
      );
      const stats = expectOk(statsResult);
      expect(stats).toBeTuple({
        'total-expenses': Cl.uint(27000000), // 12 + 9 + 6 = 27 STX
        'total-settled': Cl.uint(0),
        'member-count': Cl.uint(3),
        'treasury-balance': Cl.uint(0)
      });

      // Calculate expected balances
      // Each person should owe 9 STX (27/3)
      // wallet1: paid 12, owes 9, balance = +3
      // wallet2: paid 9, owes 9, balance = 0
      // wallet3: paid 6, owes 9, balance = -3

      const { result: balance1 } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'calculate-member-balance',
        [Cl.uint(circleId), Cl.principal(wallet1)],
        wallet1
      );
      expect(expectOk(balance1)).toBeInt(3000000);

      const { result: balance3 } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'calculate-member-balance',
        [Cl.uint(circleId), Cl.principal(wallet3)],
        wallet1
      );
      expect(expectOk(balance3)).toBeInt(-3000000);
    });
  });

  describe('Cross-Contract Interaction', () => {
    it('should verify factory-treasury integration', () => {
      // Create circle in factory
      const { result: circleResult } = simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'create-circle',
        [Cl.stringAscii('Integration Test')],
        wallet1
      );
      const circleId = expectOk(circleResult);

      // Verify circle exists in factory
      const { result: circleInfo } = simnet.callReadOnlyFn(
        CONTRACTS.FACTORY,
        'get-circle',
        [Cl.uint(circleId)],
        wallet1
      );
      expectOk(circleInfo);

      // Create expense in treasury for the same circle
      const { result: expenseResult } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        [
          Cl.uint(circleId),
          Cl.stringAscii('Cross-contract expense'),
          Cl.uint(10000000),
          Cl.list([Cl.principal(wallet1)])
        ],
        wallet1
      );
      expectOk(expenseResult);

      // Verify expense exists in treasury
      const { result: expenseInfo } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'get-expense',
        [Cl.uint(1)],
        wallet1
      );
      const expense = expectOk(expenseInfo);
      expect(expense).toBeTuple({
        'circle-id': Cl.uint(circleId)
      });
    });

    it('should handle contract hash verification between contracts', () => {
      // Verify treasury contract from factory
      const { result } = simnet.callReadOnlyFn(
        CONTRACTS.FACTORY,
        'verify-treasury-contract',
        [Cl.principal(`${deployer}.${CONTRACTS.TREASURY}`)],
        wallet1
      );
      
      expectOk(result);
    });

    it('should maintain data consistency across contracts', () => {
      // Create circle
      const { result: circleResult } = simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'create-circle',
        [Cl.stringAscii('Consistency Test')],
        wallet1
      );
      const circleId = expectOk(circleResult);

      // Add member in factory
      simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'add-member',
        [Cl.uint(circleId), Cl.principal(wallet2)],
        wallet1
      );

      // Verify member can create expense in treasury
      const { result: expenseResult } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        [
          Cl.uint(circleId),
          Cl.stringAscii('Member expense'),
          Cl.uint(5000000),
          Cl.list([Cl.principal(wallet1), Cl.principal(wallet2)])
        ],
        wallet2 // Member should be able to create expense
      );
      expectOk(expenseResult);
    });
  });

  describe('Multi-User Scenarios', () => {
    it('should handle concurrent user operations', () => {
      // Multiple users creating circles simultaneously
      const circleResults = [];
      
      circleResults.push(simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'create-circle',
        [Cl.stringAscii('Circle A')],
        wallet1
      ));
      
      circleResults.push(simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'create-circle',
        [Cl.stringAscii('Circle B')],
        wallet2
      ));
      
      circleResults.push(simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'create-circle',
        [Cl.stringAscii('Circle C')],
        wallet3
      ));

      // All should succeed with unique IDs
      expect(expectOk(circleResults[0].result)).toBeUint(1);
      expect(expectOk(circleResults[1].result)).toBeUint(2);
      expect(expectOk(circleResults[2].result)).toBeUint(3);

      // Verify each user owns their circle
      const { result: circles1 } = simnet.callReadOnlyFn(
        CONTRACTS.FACTORY,
        'get-user-circles',
        [Cl.principal(wallet1)],
        wallet1
      );
      expect(expectOk(circles1)).toBeList([Cl.uint(1)]);

      const { result: circles2 } = simnet.callReadOnlyFn(
        CONTRACTS.FACTORY,
        'get-user-circles',
        [Cl.principal(wallet2)],
        wallet1
      );
      expect(expectOk(circles2)).toBeList([Cl.uint(2)]);
    });

    it('should handle complex member interactions', () => {
      // Create overlapping circles with shared members
      const { result: circle1Result } = simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'create-circle',
        [Cl.stringAscii('Shared Circle 1')],
        wallet1
      );
      const circle1Id = expectOk(circle1Result);

      const { result: circle2Result } = simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'create-circle',
        [Cl.stringAscii('Shared Circle 2')],
        wallet2
      );
      const circle2Id = expectOk(circle2Result);

      // Add wallet3 to both circles
      simnet.callPublicFn(CONTRACTS.FACTORY, 'add-member', [Cl.uint(circle1Id), Cl.principal(wallet3)], wallet1);
      simnet.callPublicFn(CONTRACTS.FACTORY, 'add-member', [Cl.uint(circle2Id), Cl.principal(wallet3)], wallet2);

      // wallet3 creates expenses in both circles
      const { result: expense1 } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        [
          Cl.uint(circle1Id),
          Cl.stringAscii('Expense in Circle 1'),
          Cl.uint(6000000),
          Cl.list([Cl.principal(wallet1), Cl.principal(wallet3)])
        ],
        wallet3
      );
      expectOk(expense1);

      const { result: expense2 } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        [
          Cl.uint(circle2Id),
          Cl.stringAscii('Expense in Circle 2'),
          Cl.uint(8000000),
          Cl.list([Cl.principal(wallet2), Cl.principal(wallet3)])
        ],
        wallet3
      );
      expectOk(expense2);

      // Verify separate balances in each circle
      const { result: balance1 } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'calculate-member-balance',
        [Cl.uint(circle1Id), Cl.principal(wallet3)],
        wallet1
      );
      // wallet3 paid 6 STX, owes 3 STX, balance = +3 STX
      expect(expectOk(balance1)).toBeInt(3000000);

      const { result: balance2 } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'calculate-member-balance',
        [Cl.uint(circle2Id), Cl.principal(wallet3)],
        wallet1
      );
      // wallet3 paid 8 STX, owes 4 STX, balance = +4 STX
      expect(expectOk(balance2)).toBeInt(4000000);
    });
  });

  describe('Time-Based Integration', () => {
    it('should handle expense lifecycle with time progression', () => {
      // Create circle and expense
      const { result: circleResult } = simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'create-circle',
        [Cl.stringAscii('Time Test Circle')],
        wallet1
      );
      const circleId = expectOk(circleResult);

      const { result: expenseResult } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        [
          Cl.uint(circleId),
          Cl.stringAscii('Time-based expense'),
          Cl.uint(10000000),
          Cl.list([Cl.principal(wallet1), Cl.principal(wallet2)])
        ],
        wallet1
      );
      const expenseId = expectOk(expenseResult);

      // Verify expense is not expired initially
      const { result: notExpired } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'is-expense-expired',
        [Cl.uint(expenseId)],
        wallet1
      );
      expect(expectOk(notExpired)).toBeBool(false);

      // Settlement should work before expiration
      const { result: settleResult } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'settle-expense',
        [Cl.uint(expenseId)],
        wallet1
      );
      expectOk(settleResult);

      // Create another expense and let it expire
      const { result: expenseResult2 } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        [
          Cl.uint(circleId),
          Cl.stringAscii('Will expire'),
          Cl.uint(5000000),
          Cl.list([Cl.principal(wallet1)])
        ],
        wallet1
      );
      const expenseId2 = expectOk(expenseResult2);

      // Advance time beyond expiration
      advanceBlocks(simnet, 144001);

      // Verify expense is expired
      const { result: expired } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'is-expense-expired',
        [Cl.uint(expenseId2)],
        wallet1
      );
      expect(expectOk(expired)).toBeBool(true);

      // Settlement should fail after expiration
      const { result: expiredSettle } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'settle-expense',
        [Cl.uint(expenseId2)],
        wallet1
      );
      expectErr(expiredSettle, ERROR_CODES.ERR_EXPIRED);
    });
  });

  describe('Error Recovery and Resilience', () => {
    it('should recover from failed operations', () => {
      // Create circle
      const { result: circleResult } = simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'create-circle',
        [Cl.stringAscii('Recovery Test')],
        wallet1
      );
      const circleId = expectOk(circleResult);

      // Attempt invalid operation
      const { result: failResult } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        [
          Cl.uint(circleId),
          Cl.stringAscii(''), // Invalid empty description
          Cl.uint(10000000),
          Cl.list([Cl.principal(wallet1)])
        ],
        wallet1
      );
      expectErr(failResult);

      // Verify system state is not corrupted
      const { result: validResult } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        [
          Cl.uint(circleId),
          Cl.stringAscii('Valid expense'),
          Cl.uint(10000000),
          Cl.list([Cl.principal(wallet1)])
        ],
        wallet1
      );
      expectOk(validResult);
    });

    it('should maintain consistency during partial failures', () => {
      // Create circle
      const { result: circleResult } = simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'create-circle',
        [Cl.stringAscii('Consistency Test')],
        wallet1
      );
      const circleId = expectOk(circleResult);

      // Batch operation with some failures
      const operations = [
        { valid: true, desc: 'Valid 1', amount: 5000000 },
        { valid: false, desc: '', amount: 5000000 }, // Invalid description
        { valid: true, desc: 'Valid 2', amount: 3000000 },
        { valid: false, desc: 'Valid', amount: 0 }, // Invalid amount
        { valid: true, desc: 'Valid 3', amount: 7000000 }
      ];

      let successCount = 0;
      for (const op of operations) {
        const { result } = simnet.callPublicFn(
          CONTRACTS.TREASURY,
          'create-expense',
          [
            Cl.uint(circleId),
            Cl.stringAscii(op.desc),
            Cl.uint(op.amount),
            Cl.list([Cl.principal(wallet1)])
          ],
          wallet1
        );

        if (op.valid) {
          expectOk(result);
          successCount++;
        } else {
          expectErr(result);
        }
      }

      // Verify only valid operations succeeded
      const { result: statsResult } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'get-circle-stats',
        [Cl.uint(circleId)],
        wallet1
      );
      const stats = expectOk(statsResult);
      expect(stats).toBeTuple({
        'total-expenses': Cl.uint(15000000) // 5 + 3 + 7 = 15 STX
      });
    });
  });
});