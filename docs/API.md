# CircleCare Contract API Reference

## Overview

This document provides a comprehensive reference for all public functions, read-only functions, and data structures in the CircleCare smart contracts.

## Circle Factory Contract

### Public Functions

#### `create-circle`
Creates a new care circle.

**Signature:**
```clarity
(define-public (create-circle (name (string-ascii 50))) 
  (response uint uint))
```

**Parameters:**
- `name`: Circle name (1-50 ASCII characters)

**Returns:**
- Success: `(ok circle-id)` - The ID of the newly created circle
- Error: `(err error-code)` - Error code indicating failure reason

**Error Codes:**
- `u400`: Invalid circle name (empty or too long)
- `u401`: Unauthorized (insufficient permissions)
- `u500`: Internal error during circle creation

**Example Usage:**
```clarity
(contract-call? .circle-factory create-circle "Family Expenses")
```

#### `add-member`
Adds a new member to an existing circle.

**Signature:**
```clarity
(define-public (add-member (circle-id uint) (member principal)) 
  (response bool uint))
```

**Parameters:**
- `circle-id`: ID of the target circle
- `member`: Principal address of the new member

**Returns:**
- Success: `(ok true)` - Member successfully added
- Error: `(err error-code)` - Error code indicating failure reason

**Error Codes:**
- `u404`: Circle not found
- `u401`: Unauthorized (only circle creator can add members)
- `u409`: Member already exists in circle
- `u403`: Maximum members limit reached

#### `remove-member`
Removes a member from a circle.

**Signature:**
```clarity
(define-public (remove-member (circle-id uint) (member principal)) 
  (response bool uint))
```

**Parameters:**
- `circle-id`: ID of the target circle
- `member`: Principal address of the member to remove

**Returns:**
- Success: `(ok true)` - Member successfully removed
- Error: `(err error-code)` - Error code indicating failure reason

**Error Codes:**
- `u404`: Circle or member not found
- `u401`: Unauthorized (only circle creator can remove members)
- `u403`: Cannot remove circle creator

### Read-Only Functions

#### `get-circle`
Retrieves circle information by ID.

**Signature:**
```clarity
(define-read-only (get-circle (circle-id uint)) 
  (response (tuple (name (string-ascii 50)) (creator principal) (members (list 20 principal)) (created-at uint)) uint))
```

**Parameters:**
- `circle-id`: ID of the circle to retrieve

**Returns:**
- Success: Circle data tuple
- Error: `(err u404)` - Circle not found

#### `get-circle-members`
Gets all members of a specific circle.

**Signature:**
```clarity
(define-read-only (get-circle-members (circle-id uint)) 
  (response (list 20 principal) uint))
```

**Parameters:**
- `circle-id`: ID of the target circle

**Returns:**
- Success: List of member principals
- Error: `(err u404)` - Circle not found

#### `is-circle-member`
Checks if a principal is a member of a circle.

**Signature:**
```clarity
(define-read-only (is-circle-member (circle-id uint) (member principal)) 
  (response bool uint))
```

**Parameters:**
- `circle-id`: ID of the circle to check
- `member`: Principal to verify membership

**Returns:**
- Success: `(ok true/false)` - Membership status
- Error: `(err u404)` - Circle not found

## Circle Treasury Contract

### Public Functions

#### `create-expense`
Creates a new expense within a circle.

**Signature:**
```clarity
(define-public (create-expense 
  (circle-id uint) 
  (amount uint) 
  (description (string-ascii 100)) 
  (participants (list 20 principal))) 
  (response uint uint))
```

**Parameters:**
- `circle-id`: ID of the circle for this expense
- `amount`: Expense amount in microSTX
- `description`: Expense description (1-100 ASCII characters)
- `participants`: List of principals who share this expense

**Returns:**
- Success: `(ok expense-id)` - The ID of the newly created expense
- Error: `(err error-code)` - Error code indicating failure reason

**Error Codes:**
- `u400`: Invalid parameters (amount, description, or participants)
- `u401`: Unauthorized (not a circle member)
- `u404`: Circle not found
- `u403`: Participants list contains non-members

#### `settle-expense`
Settles an expense by transferring STX between participants.

**Signature:**
```clarity
(define-public (settle-expense (expense-id uint)) 
  (response bool uint))
```

**Parameters:**
- `expense-id`: ID of the expense to settle

**Returns:**
- Success: `(ok true)` - Expense successfully settled
- Error: `(err error-code)` - Error code indicating failure reason

**Error Codes:**
- `u404`: Expense not found
- `u401`: Unauthorized (only expense creator or participants)
- `u409`: Expense already settled
- `u500`: Settlement calculation or transfer failed

#### `contribute-to-circle`
Adds STX to a circle's treasury.

**Signature:**
```clarity
(define-public (contribute-to-circle (circle-id uint) (amount uint)) 
  (response bool uint))
```

**Parameters:**
- `circle-id`: ID of the target circle
- `amount`: Contribution amount in microSTX

**Returns:**
- Success: `(ok true)` - Contribution successful
- Error: `(err error-code)` - Error code indicating failure reason

**Error Codes:**
- `u404`: Circle not found
- `u401`: Unauthorized (not a circle member)
- `u400`: Invalid amount (zero or negative)

### Read-Only Functions

#### `get-expense`
Retrieves expense information by ID.

**Signature:**
```clarity
(define-read-only (get-expense (expense-id uint)) 
  (response (tuple 
    (circle-id uint) 
    (amount uint) 
    (description (string-ascii 100)) 
    (payer principal) 
    (participants (list 20 principal)) 
    (settled bool) 
    (created-at uint)) uint))
```

**Parameters:**
- `expense-id`: ID of the expense to retrieve

**Returns:**
- Success: Expense data tuple
- Error: `(err u404)` - Expense not found

#### `get-circle-expenses`
Gets all expenses for a specific circle.

**Signature:**
```clarity
(define-read-only (get-circle-expenses (circle-id uint)) 
  (response (list 100 uint) uint))
```

**Parameters:**
- `circle-id`: ID of the target circle

**Returns:**
- Success: List of expense IDs
- Error: `(err u404)` - Circle not found

#### `calculate-balance`
Calculates a member's balance within a circle.

**Signature:**
```clarity
(define-read-only (calculate-balance (circle-id uint) (member principal)) 
  (response int uint))
```

**Parameters:**
- `circle-id`: ID of the target circle
- `member`: Principal to calculate balance for

**Returns:**
- Success: Balance (positive = owed money, negative = owes money)
- Error: `(err u404)` - Circle or member not found

#### `get-circle-treasury`
Gets the total treasury balance for a circle.

**Signature:**
```clarity
(define-read-only (get-circle-treasury (circle-id uint)) 
  (response uint uint))
```

**Parameters:**
- `circle-id`: ID of the target circle

**Returns:**
- Success: Treasury balance in microSTX
- Error: `(err u404)` - Circle not found

## Data Structures

### Circle
```clarity
{
  name: (string-ascii 50),
  creator: principal,
  members: (list 20 principal),
  treasury-balance: uint,
  created-at: uint
}
```

### Expense
```clarity
{
  circle-id: uint,
  amount: uint,
  description: (string-ascii 100),
  payer: principal,
  participants: (list 20 principal),
  settled: bool,
  created-at: uint,
  expires-at: (optional uint)
}
```

### Balance
```clarity
{
  member: principal,
  circle-id: uint,
  amount-owed: uint,
  amount-paid: uint,
  net-balance: int
}
```

## Events

### Circle Events
- `circle-created`: Emitted when a new circle is created
- `member-added`: Emitted when a member joins a circle
- `member-removed`: Emitted when a member leaves a circle

### Expense Events
- `expense-created`: Emitted when a new expense is added
- `expense-settled`: Emitted when an expense is settled
- `contribution-made`: Emitted when STX is added to treasury

## Error Handling

### Common Error Patterns
```clarity
;; Input validation
(asserts! (> (len name) u0) (err u400))

;; Authorization checks
(asserts! (is-eq tx-sender circle-creator) (err u401))

;; Resource existence
(unwrap! (map-get? circles circle-id) (err u404))

;; Business logic validation
(asserts! (not settled) (err u409))
```

### Error Code Reference
- `u400`: Bad Request - Invalid input parameters
- `u401`: Unauthorized - Insufficient permissions
- `u403`: Forbidden - Action not allowed
- `u404`: Not Found - Resource doesn't exist
- `u409`: Conflict - Resource state conflict
- `u500`: Internal Error - Unexpected system error

## Integration Examples

### Frontend Integration
```typescript
import { openContractCall } from '@stacks/connect';
import { uintCV, stringAsciiCV, listCV, principalCV } from '@stacks/transactions';

// Create a new circle
const createCircle = async (name: string) => {
  await openContractCall({
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'circle-factory',
    functionName: 'create-circle',
    functionArgs: [stringAsciiCV(name)],
    onFinish: (data) => console.log('Circle created:', data.txId)
  });
};

// Add expense
const addExpense = async (circleId: number, amount: number, description: string, participants: string[]) => {
  await openContractCall({
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'circle-treasury',
    functionName: 'create-expense',
    functionArgs: [
      uintCV(circleId),
      uintCV(amount),
      stringAsciiCV(description),
      listCV(participants.map(p => principalCV(p)))
    ]
  });
};
```

### CLI Integration
```bash
# Create circle using Clarinet
clarinet console
>> (contract-call? .circle-factory create-circle "Test Circle")

# Check circle details
>> (contract-call? .circle-factory get-circle u1)
```

## Rate Limits and Constraints

### Contract Limits
- Maximum circles per user: 50
- Maximum members per circle: 20
- Maximum expenses per circle: 100
- Maximum description length: 100 characters
- Maximum circle name length: 50 characters

### Gas Considerations
- Circle creation: ~5,000 gas
- Expense creation: ~3,000 gas
- Settlement: ~8,000 gas (varies with participants)
- Member operations: ~2,000 gas

## Security Considerations

### Access Control
- Only circle creators can add/remove members
- Only circle members can create expenses
- Only expense participants can settle expenses

### Input Validation
- All string inputs are sanitized and length-checked
- Numeric inputs are validated for positive values
- Principal addresses are verified for validity

### Reentrancy Protection
- Settlement operations use `restrict-assets?` for protection
- State changes occur before external calls
- Atomic operations prevent partial state updates