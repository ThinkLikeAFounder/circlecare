import { formatSTX, formatDate } from '@/lib/utils';
import { Receipt, Users } from 'lucide-react';

interface ExpenseRowProps {
  description: string;
  amount: number;
  paidBy: string;
  participants: number;
  date: number;
}

export function ExpenseRow({ 
  description, 
  amount, 
  paidBy, 
  participants, 
  date 
}: ExpenseRowProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-accent-500/20 rounded-full flex items-center justify-center">
          <Receipt className="w-5 h-5 text-accent-300" />
        </div>
        <div>
          <p className="font-medium text-white">{description}</p>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <span>Paid by {paidBy}</span>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{participants} people</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-white">{formatSTX(amount)}</p>
        <p className="text-xs text-white/60">{formatDate(date)}</p>
      </div>
    </div>
  );
}