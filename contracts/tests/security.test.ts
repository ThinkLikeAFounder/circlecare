import { describe, expect, it, beforeEach } from 'vitest';
import { Cl } from '@stacks/transactions';
import { TEST_ACCOUNTS, CONTRACTS, ERROR_CODES, expectOk, expectErr } from './helpers/test-utils';
import { SECURITY_TEST_DATA, INVALID_INPUTS } from './helpers/mock-data';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const wallet1 = accounts.get('wallet_1')!;
const wallet2 = accounts.get('wallet_2')!;
const wallet3 = accounts.get('wallet_3')!;
const attacker = accounts.get('wallet_4')!;

describe('Security Tests', () => {
  let circleId: number;

  beforeEach(() => {
    // Create circle for testing
    const { result } = simnet.callPublicFn(
      CONTRACTS.FACTORY,
      'create-circle',
      [Cl.stringAscii('Security Test Circle')],
      wallet1
    );
    circleId = expectOk(result);
  });

  describe('Unauthorized Access Prevention', () => {
    it('should prevent non-members from creating expenses', () => {
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        [
          Cl.uint(circleId),
          Cl.stringAscii('Unauthorized expense'),
          Cl.uint(5000000),
          Cl.list([Cl.principal(wallet1)])
        ],
        attacker // Not a member of the circle
      );
      
      expectErr(result, ERROR_CODES.ERR_UNAUTHORIZED);
    });

    it('should prevent non-creators from adding members', () => {
      const { result } = simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'add-member',
        [Cl.uint(circleId), Cl.principal(wallet2)],
        attacker // Not the creator
      );
      
      expectErr(result, ERROR_CODES.ERR_UNAUTHORIZED);
    });

    it('should prevent unauthorized treasury access', () => {
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'withdraw-treasury',
        [Cl.uint(circleId), Cl.uint(1000000)],
        attacker
      );
      
      expectErr(result, ERROR_CODES.ERR_UNAUTHORIZED);
    });

    it('should prevent settlement by non-participants', () => {
      // Create expense first
      const { result: expenseResult } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        [
          Cl.uint(circleId),
          Cl.stringAscii('Test expense'),
          Cl.uint(10000000),
          Cl.list([Cl.principal(wallet1), Cl.principal(wallet2)])
        ],
        wallet1
      );
      const expenseId = expectOk(expenseResult);

      // Try to settle as non-participant
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'settle-expense',
        [Cl.uint(expenseId)],
        attacker
      );
      
      expectErr(result, ERROR_CODES.ERR_UNAUTHORIZED);
    });
  });

  describe('Reentrancy Attack Prevention', () => {
    it('should prevent reentrancy during settlement', () => {
      // Create expense
      const { result: expenseResult } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        [
          Cl.uint(circleId),
          Cl.stringAscii('Reentrancy test'),
          Cl.uint(10000000),
          Cl.list([Cl.principal(wallet1), Cl.principal(wallet2)])
        ],
        wallet1
      );
      const expenseId = expectOk(expenseResult);

      // Attempt reentrancy attack during settlement
      // This would be blocked by restrict-assets? protection
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'settle-expense-with-callback',
        [Cl.uint(expenseId), Cl.principal(`${deployer}.malicious-contract`)],
        wallet1
      );
      
      // Should be protected by Clarity 4 features
      expectErr(result, ERROR_CODES.ERR_UNAUTHORIZED);
    });

    it('should prevent recursive calls during treasury operations', () => {
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'contribute-to-treasury-recursive',
        [Cl.uint(circleId), Cl.uint(5000000)],
        wallet1
      );
      
      // Should prevent recursive calls
      expectErr(result, ERROR_CODES.ERR_INTERNAL_ERROR);
    });
  });

  describe('Integer Overflow/Underflow Protection', () => {
    it('should handle maximum integer values safely', () => {
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        [
          Cl.uint(circleId),
          Cl.stringAscii('Overflow test'),
          Cl.uint(SECURITY_TEST_DATA.OVERFLOW_AMOUNT),
          Cl.list([Cl.principal(wallet1)])
        ],
        wallet1
      );
      
      // Should handle large numbers safely or reject appropriately
      expectErr(result, ERROR_CODES.ERR_INVALID_INPUT);
    });

    it('should prevent negative amounts through underflow', () => {
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        [
          Cl.uint(circleId),
          Cl.stringAscii('Underflow test'),
          Cl.uint(0), // This could cause underflow in calculations
          Cl.list([Cl.principal(wallet1)])
        ],
        wallet1
      );
      
      expectErr(result, ERROR_CODES.ERR_INVALID_INPUT);
    });

    it('should handle balance calculations safely', () => {
      // Create multiple large expenses to test calculation limits
      for (let i = 0; i < 10; i++) {
        simnet.callPublicFn(
          CONTRACTS.TREASURY,
          'create-expense',
          [
            Cl.uint(circleId),
            Cl.stringAscii(`Large expense ${i}`),
            Cl.uint(50000000), // 50 STX each
            Cl.list([Cl.principal(wallet1), Cl.principal(wallet2)])
          ],
          wallet1
        );
      }

      // Check balance calculation doesn't overflow
      const { result } = simnet.callReadOnlyFn(
        CONTRACTS.TREASURY,
        'calculate-member-balance',
        [Cl.uint(circleId), Cl.principal(wallet1)],
        wallet1
      );
      
      // Should return valid balance without overflow
      const balance = expectOk(result);
      expect(balance).toBeInt();
    });
  });

  describe('Asset Manipulation Prevention', () => {
    it('should prevent unauthorized STX transfers', () => {
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'transfer-stx-unauthorized',
        [
          Cl.uint(5000000),
          Cl.principal(attacker),
          Cl.principal(wallet1)
        ],
        attacker
      );
      
      expectErr(result, ERROR_CODES.ERR_UNAUTHORIZED);
    });

    it('should prevent double-spending in settlements', () => {
      // Create expense
      const { result: expenseResult } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        [
          Cl.uint(circleId),
          Cl.stringAscii('Double spend test'),
          Cl.uint(10000000),
          Cl.list([Cl.principal(wallet1), Cl.principal(wallet2)])
        ],
        wallet1
      );
      const expenseId = expectOk(expenseResult);

      // Settle once
      const { result: firstSettle } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'settle-expense',
        [Cl.uint(expenseId)],
        wallet1
      );
      expectOk(firstSettle);

      // Try to settle again (double-spending attempt)
      const { result: secondSettle } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'settle-expense',
        [Cl.uint(expenseId)],
        wallet1
      );
      
      expectErr(secondSettle, ERROR_CODES.ERR_ALREADY_SETTLED);
    });

    it('should validate asset amounts in restrict-assets?', () => {
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'settle-debt-stx',
        [
          Cl.uint(circleId),
          Cl.principal(wallet1),
          Cl.uint(0) // Invalid amount
        ],
        wallet2
      );
      
      expectErr(result, ERROR_CODES.ERR_INVALID_INPUT);
    });
  });

  describe('Privilege Escalation Prevention', () => {
    it('should prevent members from becoming circle creators', () => {
      // Add member first
      simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'add-member',
        [Cl.uint(circleId), Cl.principal(wallet2)],
        wallet1 // Creator adds member
      );

      // Member tries to escalate privileges
      const { result } = simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'transfer-ownership',
        [Cl.uint(circleId), Cl.principal(wallet2)],
        wallet2 // Member tries to become owner
      );
      
      expectErr(result, ERROR_CODES.ERR_UNAUTHORIZED);
    });

    it('should prevent admin function access by regular users', () => {
      const { result } = simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'emergency-pause',
        [Cl.uint(circleId)],
        wallet2 // Not admin
      );
      
      expectErr(result, ERROR_CODES.ERR_UNAUTHORIZED);
    });

    it('should maintain role separation', () => {
      // Member should not be able to remove other members
      simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'add-member',
        [Cl.uint(circleId), Cl.principal(wallet2)],
        wallet1
      );

      simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'add-member',
        [Cl.uint(circleId), Cl.principal(wallet3)],
        wallet1
      );

      // wallet2 tries to remove wallet3
      const { result } = simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'remove-member',
        [Cl.uint(circleId), Cl.principal(wallet3)],
        wallet2
      );
      
      expectErr(result, ERROR_CODES.ERR_UNAUTHORIZED);
    });
  });

  describe('Input Validation and Sanitization', () => {
    it('should reject malicious string inputs', () => {
      for (const maliciousString of SECURITY_TEST_DATA.MALICIOUS_STRINGS) {
        const { result } = simnet.callPublicFn(
          CONTRACTS.FACTORY,
          'create-circle',
          [Cl.stringAscii(maliciousString)],
          wallet1
        );
        
        // Should reject or sanitize malicious inputs
        if (maliciousString.length > 50) {
          expectErr(result, ERROR_CODES.ERR_INVALID_INPUT);
        }
      }
    });

    it('should validate participant list limits', () => {
      const { result } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        [
          Cl.uint(circleId),
          Cl.stringAscii('Too many participants'),
          Cl.uint(10000000),
          Cl.list(SECURITY_TEST_DATA.LARGE_PARTICIPANT_LIST.map(p => Cl.principal(p)))
        ],
        wallet1
      );
      
      expectErr(result, ERROR_CODES.ERR_LIMIT_EXCEEDED);
    });

    it('should validate principal addresses', () => {
      const { result } = simnet.callPublicFn(
        CONTRACTS.FACTORY,
        'add-member',
        [Cl.uint(circleId), Cl.principal(INVALID_INPUTS.INVALID_PRINCIPAL)],
        wallet1
      );
      
      expectErr(result, ERROR_CODES.ERR_INVALID_INPUT);
    });
  });

  describe('State Consistency Protection', () => {
    it('should maintain consistent state during concurrent operations', () => {
      // Simulate concurrent expense creation
      const results = [];
      
      for (let i = 0; i < 5; i++) {
        results.push(simnet.callPublicFn(
          CONTRACTS.TREASURY,
          'create-expense',
          [
            Cl.uint(circleId),
            Cl.stringAscii(`Concurrent expense ${i}`),
            Cl.uint(5000000),
            Cl.list([Cl.principal(wallet1)])
          ],
          wallet1
        ));
      }

      // All should succeed with unique IDs
      for (let i = 0; i < results.length; i++) {
        expect(expectOk(results[i].result)).toBeUint(i + 1);
      }
    });

    it('should prevent state corruption during failures', () => {
      // Create expense that will fail
      const { result: failResult } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        [
          Cl.uint(999), // Non-existent circle
          Cl.stringAscii('Should fail'),
          Cl.uint(5000000),
          Cl.list([Cl.principal(wallet1)])
        ],
        wallet1
      );
      expectErr(failResult);

      // Verify state is not corrupted - next valid operation should work
      const { result: successResult } = simnet.callPublicFn(
        CONTRACTS.TREASURY,
        'create-expense',
        [
          Cl.uint(circleId),
          Cl.stringAscii('Should succeed'),
          Cl.uint(5000000),
          Cl.list([Cl.principal(wallet1)])
        ],
        wallet1
      );
      expectOk(successResult);
    });
  });
});