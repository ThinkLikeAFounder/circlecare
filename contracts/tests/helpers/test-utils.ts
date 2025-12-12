import { Cl } from '@stacks/transactions';

export const TEST_ACCOUNTS = {
  deployer: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  wallet_1: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
  wallet_2: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
  wallet_3: 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC',
  wallet_4: 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND',
};

export const CONTRACTS = {
  FACTORY: 'circle-factory',
  TREASURY: 'circle-treasury',
};

export const ERROR_CODES = {
  ERR_UNAUTHORIZED: 401,
  ERR_NOT_FOUND: 404,
  ERR_INVALID_INPUT: 400,
  ERR_ALREADY_EXISTS: 409,
  ERR_LIMIT_EXCEEDED: 413,
  ERR_INTERNAL_ERROR: 500,
};

export function createCircleArgs(name: string, creatorNickname: string = 'creator') {
  return [
    Cl.stringAscii(name),
    Cl.stringAscii(creatorNickname)
  ];
}

export function addExpenseArgs(
  circleId: number,
  description: string,
  amount: number,
  participants: string[]
) {
  return [
    Cl.uint(circleId),
    Cl.stringAscii(description),
    Cl.uint(amount),
    Cl.list(participants.map(p => Cl.principal(p)))
  ];
}

export function settleDebtArgs(circleId: number, creditor: string, amount: number) {
  return [
    Cl.uint(circleId),
    Cl.principal(creditor),
    Cl.uint(amount)
  ];
}

export function expectOk<T>(result: any): T {
  expect(result).toBeOk();
  return result.value;
}

export function expectErr(result: any, expectedCode?: number): number {
  expect(result).toBeErr();
  if (expectedCode !== undefined) {
    expect(result.value).toBeUint(expectedCode);
  }
  return result.value;
}

export function advanceBlocks(simnet: any, blocks: number) {
  for (let i = 0; i < blocks; i++) {
    simnet.mineEmptyBlock();
  }
}

export function getCurrentBlockHeight(simnet: any): number {
  return simnet.blockHeight;
}

export function getContractBalance(simnet: any, contract: string): number {
  return simnet.getAssetsMap().get('STX')?.get(contract) || 0;
}