import { describe, it, expect, vi } from 'vitest';
import { StacksTestnet } from '@stacks/network';
import { 
  createCircle, 
  getCircleInfo, 
  getUserCircles,
  addExpense,
  settleDebt,
  getMemberInfo,
  getCircleStats 
} from '../../lib/contracts';

// Mock Stacks functions
vi.mock('@stacks/transactions', () => ({
  makeContractCall: vi.fn(),
  callReadOnlyFunction: vi.fn(),
  principalCV: vi.fn(),
  uintCV: vi.fn(),
  stringAsciiCV: vi.fn(),
  listCV: vi.fn(),
  AnchorMode: { Any: 'any' },
  PostConditionMode: { Deny: 'deny' },
}));

describe('Contract Functions', () => {
  const mockNetwork = new StacksTestnet();
  const mockAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

  describe('createCircle', () => {
    it('should create contract call options for circle creation', async () => {
      const params = {
        name: 'Test Circle',
        creatorNickname: 'TestUser',
        network: mockNetwork,
        senderAddress: mockAddress,
      };

      const result = await createCircle(params);
      expect(result).toBeDefined();
    });
  });

  describe('getCircleInfo', () => {
    it('should call read-only function for circle info', async () => {
      const result = await getCircleInfo(1, mockNetwork);
      expect(result).toBeDefined();
    });
  });

  describe('getUserCircles', () => {
    it('should call read-only function for user circles', async () => {
      const result = await getUserCircles(mockAddress, mockNetwork);
      expect(result).toBeDefined();
    });
  });

  describe('addExpense', () => {
    it('should create contract call options for adding expense', async () => {
      const params = {
        circleId: 1,
        description: 'Test Expense',
        amount: 1000000,
        participants: [mockAddress],
        network: mockNetwork,
        senderAddress: mockAddress,
      };

      const result = await addExpense(params);
      expect(result).toBeDefined();
    });
  });

  describe('settleDebt', () => {
    it('should create contract call options for settling debt', async () => {
      const params = {
        circleId: 1,
        creditor: mockAddress,
        amount: 500000,
        network: mockNetwork,
        senderAddress: mockAddress,
      };

      const result = await settleDebt(params);
      expect(result).toBeDefined();
    });
  });

  describe('getMemberInfo', () => {
    it('should call read-only function for member info', async () => {
      const result = await getMemberInfo(1, mockAddress, mockNetwork);
      expect(result).toBeDefined();
    });
  });

  describe('getCircleStats', () => {
    it('should call read-only function for circle stats', async () => {
      const result = await getCircleStats(1, mockNetwork);
      expect(result).toBeDefined();
    });
  });
});