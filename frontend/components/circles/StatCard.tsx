import { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function StatCard({ icon, label, value, variant = 'default' }: StatCardProps) {
  const variantStyles = {
    default: 'text-white',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-primary-500/20 ${variantStyles[variant]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-white/60">{label}</p>
          <p className={`text-2xl font-bold ${variantStyles[variant]}`}>
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}