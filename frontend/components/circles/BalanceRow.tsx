import { formatSTX } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface BalanceRowProps {
  name: string;
  amount: number;
  type: 'owe' | 'owed';
  onSettle?: () => void;
}

export function BalanceRow({ name, amount, type, onSettle }: BalanceRowProps) {
  const isOwe = type === 'owe';
  
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${
          isOwe ? 'bg-red-500/20' : 'bg-green-500/20'
        }`}>
          {isOwe ? (
            <ArrowRight className="w-4 h-4 text-red-400" />
          ) : (
            <ArrowLeft className="w-4 h-4 text-green-400" />
          )}
        </div>
        <div>
          <p className="font-medium text-white">{name}</p>
          <p className="text-xs text-white/60">
            {isOwe ? 'You owe' : 'Owes you'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <p className={`font-bold ${
          isOwe ? 'text-red-400' : 'text-green-400'
        }`}>
          {formatSTX(amount)}
        </p>
        {isOwe && onSettle && (
          <Button
            size="sm"
            variant="outline"
            onClick={onSettle}
          >
            Settle
          </Button>
        )}
      </div>
    </div>
  );
}