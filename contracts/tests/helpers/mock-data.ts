import { TEST_ACCOUNTS } from './test-utils';

export const MOCK_CIRCLES = {
  FAMILY: {
    name: 'Family Expenses',
    creator: TEST_ACCOUNTS.wallet_1,
    members: [TEST_ACCOUNTS.wallet_1, TEST_ACCOUNTS.wallet_2, TEST_ACCOUNTS.wallet_3]
  },
  ROOMMATES: {
    name: 'Roommate Bills',
    creator: TEST_ACCOUNTS.wallet_2,
    members: [TEST_ACCOUNTS.wallet_2, TEST_ACCOUNTS.wallet_3, TEST_ACCOUNTS.wallet_4]
  },
  VACATION: {
    name: 'Vacation Fund',
    creator: TEST_ACCOUNTS.wallet_1,
    members: [TEST_ACCOUNTS.wallet_1, TEST_ACCOUNTS.wallet_2]
  }
};

export const MOCK_EXPENSES = {
  GROCERIES: {
    description: 'Weekly groceries',
    amount: 15000000, // 15 STX in microSTX
    participants: [TEST_ACCOUNTS.wallet_1, TEST_ACCOUNTS.wallet_2, TEST_ACCOUNTS.wallet_3]
  },
  UTILITIES: {
    description: 'Monthly utilities',
    amount: 25000000, // 25 STX
    participants: [TEST_ACCOUNTS.wallet_2, TEST_ACCOUNTS.wallet_3, TEST_ACCOUNTS.wallet_4]
  },
  DINNER: {
    description: 'Group dinner',
    amount: 8000000, // 8 STX
    participants: [TEST_ACCOUNTS.wallet_1, TEST_ACCOUNTS.wallet_2]
  },
  LARGE_EXPENSE: {
    description: 'Large shared expense',
    amount: 100000000, // 100 STX
    participants: [TEST_ACCOUNTS.wallet_1, TEST_ACCOUNTS.wallet_2, TEST_ACCOUNTS.wallet_3, TEST_ACCOUNTS.wallet_4]
  }
};

export const INVALID_INPUTS = {
  EMPTY_STRING: '',
  LONG_STRING: 'a'.repeat(101), // Exceeds 100 char limit
  ZERO_AMOUNT: 0,
  NEGATIVE_AMOUNT: -1000000,
  EMPTY_PARTICIPANTS: [],
  INVALID_PRINCIPAL: 'invalid-address',
  NON_EXISTENT_CIRCLE_ID: 999999
};

export const SECURITY_TEST_DATA = {
  OVERFLOW_AMOUNT: Number.MAX_SAFE_INTEGER,
  LARGE_PARTICIPANT_LIST: Array(25).fill(TEST_ACCOUNTS.wallet_1), // Exceeds 20 limit
  MALICIOUS_STRINGS: [
    '<script>alert("xss")</script>',
    '../../etc/passwd',
    'DROP TABLE circles;',
    '\x00\x01\x02'
  ]
};