import { QueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryClient';
import { Circle, Member, Expense } from '../types';

export class OptimisticUpdates {
  constructor(private queryClient: QueryClient) {}

  // Optimistically add a new circle
  addCircle(userAddress: string, circle: Partial<Circle>) {
    const queryKey = queryKeys.circles(userAddress);
    
    this.queryClient.setQueryData(queryKey, (old: Circle[] = []) => [
      ...old,
      {
        id: Date.now(), // Temporary ID
        name: circle.name || '',
        creator: userAddress,
        createdAt: Date.now(),
        active: true,
        treasuryContract: null,
        ...circle,
      }
    ]);
  }

  // Optimistically update member info
  updateMemberInfo(circleId: number, memberAddress: string, updates: Partial<Member>) {
    const queryKey = queryKeys.member(circleId, memberAddress);
    
    this.queryClient.setQueryData(queryKey, (old: Member | null) => {
      if (!old) return null;
      return { ...old, ...updates };
    });
  }

  // Optimistically add expense
  addExpense(circleId: number, expense: Partial<Expense>) {
    // Update circle stats
    const statsKey = queryKeys.circleStats(circleId);
    this.queryClient.setQueryData(statsKey, (old: any) => {
      if (!old) return old;
      return {
        ...old,
        totalExpenses: old.totalExpenses + (expense.totalAmount || 0),
      };
    });
  }

  // Optimistically settle debt
  settleDebt(circleId: number, memberAddress: string, amount: number) {
    const memberKey = queryKeys.member(circleId, memberAddress);
    
    this.queryClient.setQueryData(memberKey, (old: Member | null) => {
      if (!old) return null;
      return {
        ...old,
        totalOwing: Math.max(0, old.totalOwing - amount),
      };
    });

    // Update circle stats
    const statsKey = queryKeys.circleStats(circleId);
    this.queryClient.setQueryData(statsKey, (old: any) => {
      if (!old) return old;
      return {
        ...old,
        totalSettled: old.totalSettled + amount,
      };
    });
  }

  // Rollback optimistic updates on error
  rollback(queryKeys: string[][]) {
    queryKeys.forEach(key => {
      this.queryClient.invalidateQueries({ queryKey: key });
    });
  }
}