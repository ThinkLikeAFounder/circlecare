import { formatSTX } from '@/lib/utils';
import { User } from 'lucide-react';

interface MemberRowProps {
  nickname: string;
  balance: number;
  isPositive: boolean;
}

export function MemberRow({ nickname, balance, isPositive }: MemberRowProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-primary-300" />
        </div>
        <div>
          <p className="font-medium text-white">{nickname}</p>
          <p className="text-sm text-white/60">Member</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : '-'}{formatSTX(Math.abs(balance))}
        </p>
        <p className="text-xs text-white/60">
          {isPositive ? 'Owed' : 'Owes'}
        </p>
      </div>
    </div>
  );
}