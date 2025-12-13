'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useCircleInfo } from '@/lib/hooks/useCircles';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  Users, 
  Plus, 
  DollarSign, 
  Calendar,
  Settings 
} from 'lucide-react';
import { formatSTX, formatDate } from '@/lib/utils';
import { StatCard } from '@/components/circles/StatCard';
import { MemberRow } from '@/components/circles/MemberRow';
import { ExpenseRow } from '@/components/circles/ExpenseRow';
import { BalanceRow } from '@/components/circles/BalanceRow';
import { AddExpenseModal } from '@/components/circles/AddExpenseModal';
import { AddMemberModal } from '@/components/circles/AddMemberModal';
import { SettleDebtModal } from '@/components/circles/SettleDebtModal';

export default function CircleDetailPage() {
  const params = useParams();
  const circleId = parseInt(params.id as string);
  
  const { data: circle, isLoading } = useCircleInfo(circleId);
  
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isSettleOpen, setIsSettleOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner message="Loading circle..." />
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Circle Not Found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            {circle.name}
          </h1>
          <p className="text-white/60">
            Created {formatDate(circle.createdAt)}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setIsAddMemberOpen(true)}>
            <Users className="w-4 h-4 mr-2" />
            Add Member
          </Button>
          <Button onClick={() => setIsAddExpenseOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Users />}
          label="Members"
          value={circle.memberCount}
        />
        <StatCard
          icon={<DollarSign />}
          label="Total Expenses"
          value={formatSTX(circle.totalExpenses || 0)}
        />
        <StatCard
          icon={<Calendar />}
          label="Settlements"
          value={circle.totalSettlements || 0}
        />
        <StatCard
          icon={<DollarSign />}
          label="Your Balance"
          value="0 STX"
          variant="success"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Members Section */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Members</h2>
              <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm">
                {circle.memberCount} members
              </span>
            </div>
            <div className="space-y-3">
              <MemberRow
                nickname="You"
                balance={500000}
                isPositive={false}
              />
              {circle.members?.map((member: any, index: number) => (
                <MemberRow
                  key={index}
                  nickname={member.nickname}
                  balance={member.balance}
                  isPositive={member.balance >= 0}
                />
              ))}
            </div>
          </Card>

          {/* Expenses Section */}
          <Card>
            <h2 className="text-2xl font-bold text-white mb-6">
              Recent Expenses
            </h2>
            <div className="space-y-4">
              {circle.expenses?.map((expense: any, index: number) => (
                <ExpenseRow
                  key={index}
                  description={expense.description}
                  amount={expense.amount}
                  paidBy={expense.paidBy}
                  participants={expense.participants}
                  date={expense.date}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Your Balances */}
          <Card>
            <h3 className="text-xl font-bold text-white mb-4">
              Your Balances
            </h3>
            <div className="space-y-3">
              <BalanceRow
                name="Alice"
                amount={500000}
                type="owe"
                onSettle={() => setIsSettleOpen(true)}
              />
              <BalanceRow
                name="Bob"
                amount={300000}
                type="owed"
              />
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-xl font-bold text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setIsAddExpenseOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setIsSettleOpen(true)}
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Settle Debt
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <Settings className="w-4 h-4 mr-2" />
                Circle Settings
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        circleId={circleId}
      />
      
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        circleId={circleId}
      />
      
      <SettleDebtModal
        isOpen={isSettleOpen}
        onClose={() => setIsSettleOpen(false)}
        circleId={circleId}
      />
    </div>
  );
}