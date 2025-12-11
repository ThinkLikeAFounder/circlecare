# CircleCare Contract Interaction Layer

This directory contains the complete contract interaction layer for CircleCare, built with TanStack Query for robust state management and caching.

## Architecture

### Core Components

- **`contracts.ts`** - Raw contract interaction functions
- **`stacks.ts`** - Network configuration and utilities
- **`StacksProvider.tsx`** - React context for wallet connection
- **`queryClient.ts`** - TanStack Query configuration
- **`errors.ts`** - Error handling utilities
- **`optimistic.ts`** - Optimistic updates for better UX

### Hooks

- **`hooks/useCircles.ts`** - Circle management operations
- **`hooks/useExpenses.ts`** - Expense and settlement operations
- **`hooks/useTransactionStatus.ts`** - Transaction monitoring

## Usage

### Setup

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StacksProvider } from './lib/StacksProvider';
import { queryClient } from './lib/queryClient';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StacksProvider>
        <YourApp />
      </StacksProvider>
    </QueryClientProvider>
  );
}
```

### Circle Management

```tsx
import { useUserCircles, useCreateCircle } from './lib/hooks/useCircles';

function CircleList() {
  const { data: circles, isLoading } = useUserCircles();
  const createCircle = useCreateCircle();

  const handleCreate = () => {
    createCircle.mutate({
      name: 'My Circle',
      creatorNickname: 'Creator'
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {circles?.map(circle => (
        <div key={circle.id}>{circle.name}</div>
      ))}
      <button onClick={handleCreate}>Create Circle</button>
    </div>
  );
}
```

### Expense Management

```tsx
import { useAddExpense, useMemberInfo } from './lib/hooks/useExpenses';

function ExpenseForm({ circleId }: { circleId: number }) {
  const addExpense = useAddExpense();
  const { data: memberInfo } = useMemberInfo(circleId);

  const handleSubmit = (data: any) => {
    addExpense.mutate({
      circleId,
      description: data.description,
      amount: data.amount,
      participants: data.participants
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Transaction Monitoring

```tsx
import { useTransactionStatus } from './lib/hooks/useTransactionStatus';

function TransactionMonitor({ txId }: { txId: string }) {
  const { data: status, isLoading } = useTransactionStatus(txId);

  if (isLoading) return <div>Checking transaction...</div>;

  return (
    <div>
      Status: {status?.tx_status}
      {status?.tx_status === 'success' && <div>✅ Confirmed!</div>}
    </div>
  );
}
```

## Features

### ✅ Implemented

- **Contract Interactions** - All factory and treasury contract functions
- **React Query Integration** - Caching, background updates, error handling
- **Wallet Connection** - Stacks Connect integration
- **Transaction Monitoring** - Real-time status tracking
- **Error Handling** - Comprehensive error management
- **Optimistic Updates** - Immediate UI feedback
- **TypeScript Support** - Full type safety
- **Testing** - Unit and integration tests

### 🔄 Cache Management

- Automatic cache invalidation on mutations
- Background refetching for fresh data
- Optimistic updates for immediate feedback
- Smart retry logic for failed requests

### 🛡️ Error Handling

- Custom error classes for different error types
- Automatic retry for network errors
- User-friendly error messages
- Rollback support for optimistic updates

### 📊 Performance

- Query deduplication
- Background updates
- Stale-while-revalidate pattern
- Configurable cache times

## Testing

Run the test suite:

```bash
npm test
```

Tests cover:
- Contract function calls
- React Query hooks
- Error handling
- Optimistic updates
- Cache invalidation

## Configuration

### Network Settings

Update `stacks.ts` for different networks:

```typescript
export const FACTORY_CONTRACT = 'YOUR_CONTRACT_ADDRESS.circle-factory';
export const TREASURY_CONTRACT = 'YOUR_CONTRACT_ADDRESS.circle-treasury';
```

### Query Client Options

Customize caching behavior in `queryClient.ts`:

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      cacheTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
```

## Best Practices

1. **Always handle loading states** - Use `isLoading` and `isPending`
2. **Handle errors gracefully** - Display user-friendly error messages
3. **Use optimistic updates** - For better perceived performance
4. **Monitor transactions** - Show progress for blockchain operations
5. **Invalidate caches** - After successful mutations

## Dependencies

- `@stacks/connect` - Wallet connection
- `@stacks/transactions` - Transaction building
- `@stacks/network` - Network configuration
- `@tanstack/react-query` - State management and caching