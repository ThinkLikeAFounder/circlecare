# CircleCare Contract Test Suite

This directory contains a comprehensive test suite for CircleCare's Clarity 4 smart contracts, ensuring all functionality works correctly and securely.

## Test Structure

```
tests/
├── circle-factory.test.ts      # Factory contract tests
├── circle-treasury.test.ts     # Treasury contract tests
├── integration.test.ts         # Cross-contract integration tests
├── clarity4-features.test.ts   # Clarity 4 specific feature tests
├── security.test.ts           # Security and vulnerability tests
├── helpers/
│   ├── test-utils.ts          # Test utilities and helpers
│   └── mock-data.ts           # Mock data and test fixtures
└── README.md                  # This documentation
```

## Test Categories

### 1. Unit Tests

#### Circle Factory Tests (`circle-factory.test.ts`)
- **Circle Creation**: Basic circle creation, validation, and error handling
- **Information Retrieval**: Getting circle data, member lists, and statistics
- **Member Management**: Adding/removing members, permission checks
- **Edge Cases**: Boundary conditions, special characters, limits

#### Circle Treasury Tests (`circle-treasury.test.ts`)
- **Expense Creation**: Creating expenses with validation and error handling
- **Settlement Operations**: Settling expenses, debt payments, and balance updates
- **Balance Calculations**: Complex multi-expense scenarios and accuracy
- **Treasury Management**: Treasury operations and statistics
- **Time-Based Features**: Expense expiration and time-based logic

### 2. Integration Tests (`integration.test.ts`)
- **End-to-End Workflows**: Complete circle lifecycle from creation to settlement
- **Cross-Contract Interaction**: Factory-Treasury integration and data consistency
- **Multi-User Scenarios**: Concurrent operations and shared circles
- **Time-Based Integration**: Expense lifecycle with time progression
- **Error Recovery**: System resilience and consistency during failures

### 3. Clarity 4 Feature Tests (`clarity4-features.test.ts`)
- **Contract Hash Verification**: `contract-hash?` functionality and security
- **Asset Restriction**: `restrict-assets?` protection against overpayment and attacks
- **Block Time Accuracy**: `stacks-block-time` for expiration and time-based logic
- **ASCII Conversion**: `to-ascii?` for human-readable receipts and data
- **Gas Benchmarking**: Performance monitoring and optimization

### 4. Security Tests (`security.test.ts`)
- **Unauthorized Access**: Prevention of unauthorized operations
- **Reentrancy Protection**: Defense against reentrancy attacks
- **Integer Safety**: Overflow/underflow protection
- **Asset Manipulation**: Prevention of unauthorized transfers
- **Privilege Escalation**: Role-based access control validation
- **Input Validation**: Sanitization and validation of all inputs

## Running Tests

### Prerequisites
```bash
# Install dependencies
npm install

# Ensure Clarinet is installed
clarinet --version
```

### Test Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run with UI interface
npm run test:ui

# Run specific test file
npx vitest circle-factory.test.ts

# Run tests matching pattern
npx vitest --grep "Circle Creation"
```

### Coverage Requirements
- **Lines**: 95% minimum
- **Functions**: 95% minimum
- **Branches**: 90% minimum
- **Statements**: 95% minimum

## Test Utilities

### Helper Functions (`helpers/test-utils.ts`)
- `expectOk()` - Assert successful contract responses
- `expectErr()` - Assert error responses with optional code validation
- `advanceBlocks()` - Simulate time progression in tests
- `getCurrentBlockHeight()` - Get current simnet block height
- `getContractBalance()` - Check contract STX balances

### Mock Data (`helpers/mock-data.ts`)
- **MOCK_CIRCLES** - Predefined circle configurations
- **MOCK_EXPENSES** - Common expense scenarios
- **INVALID_INPUTS** - Invalid data for error testing
- **SECURITY_TEST_DATA** - Security-focused test data

### Test Accounts
```typescript
const TEST_ACCOUNTS = {
  deployer: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  wallet_1: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
  wallet_2: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
  wallet_3: 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC',
  wallet_4: 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND'
};
```

## Writing New Tests

### Test Structure
Follow the AAA pattern (Arrange, Act, Assert):

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Arrange: Set up test state
  });

  it('should do something specific', () => {
    // Arrange: Prepare test data
    const testData = createTestData();
    
    // Act: Execute the operation
    const { result } = simnet.callPublicFn(
      CONTRACTS.FACTORY,
      'function-name',
      [Cl.stringAscii(testData.name)],
      wallet1
    );
    
    // Assert: Verify the outcome
    const value = expectOk(result);
    expect(value).toBeUint(1);
  });
});
```

### Best Practices
1. **Descriptive Names**: Use clear, descriptive test names
2. **Single Responsibility**: Test one thing per test case
3. **Independent Tests**: Each test should be independent
4. **Edge Cases**: Include boundary and error conditions
5. **Documentation**: Comment complex test scenarios
6. **Cleanup**: Use beforeEach/afterEach for setup/teardown

### Error Testing
```typescript
it('should reject invalid input', () => {
  const { result } = simnet.callPublicFn(
    CONTRACTS.FACTORY,
    'create-circle',
    [Cl.stringAscii('')], // Invalid empty name
    wallet1
  );
  
  expectErr(result, ERROR_CODES.ERR_INVALID_INPUT);
});
```

### Time-Based Testing
```typescript
it('should handle expiration correctly', () => {
  // Create expense
  const { result } = simnet.callPublicFn(/* ... */);
  const expenseId = expectOk(result);
  
  // Advance time
  advanceBlocks(simnet, 144001);
  
  // Test expiration
  const { result: expiredResult } = simnet.callReadOnlyFn(
    CONTRACTS.TREASURY,
    'is-expense-expired',
    [Cl.uint(expenseId)],
    wallet1
  );
  expect(expectOk(expiredResult)).toBeBool(true);
});
```

## Gas Cost Monitoring

Tests include gas cost monitoring to ensure efficiency:

```typescript
it('should have reasonable gas costs', () => {
  const { result, events } = simnet.callPublicFn(/* ... */);
  
  expectOk(result);
  
  // Monitor gas usage through events
  expect(events.length).toBeGreaterThan(0);
  
  // Add specific gas cost assertions based on requirements
});
```

## Continuous Integration

Tests are configured for CI/CD with:
- Automated test execution on pull requests
- Coverage reporting and enforcement
- Performance regression detection
- Security vulnerability scanning

## Debugging Tests

### Common Issues
1. **Simnet State**: Tests share simnet state - use beforeEach for cleanup
2. **Block Height**: Time-based tests need proper block advancement
3. **Principal Addresses**: Ensure correct address format and existence
4. **Contract Deployment**: Verify contracts are properly deployed in simnet

### Debug Commands
```bash
# Run single test with verbose output
npx vitest circle-factory.test.ts --reporter=verbose

# Debug specific test
npx vitest --grep "specific test name" --reporter=verbose

# Check coverage for specific file
npx vitest --coverage circle-factory.test.ts
```

## Contributing

When adding new tests:
1. Follow existing patterns and structure
2. Add appropriate documentation
3. Ensure tests pass and maintain coverage
4. Include both positive and negative test cases
5. Update this README if adding new test categories

## Security Considerations

Security tests cover:
- **Authentication**: Proper access control
- **Authorization**: Role-based permissions
- **Input Validation**: Sanitization and bounds checking
- **State Consistency**: Atomic operations and rollback
- **Asset Protection**: Prevent unauthorized transfers
- **Reentrancy**: Protection against recursive calls

These tests help ensure CircleCare contracts are secure and robust against common attack vectors.