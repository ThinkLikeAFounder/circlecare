'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { FormField, Input } from '@/components/ui/FormField';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useSettleDebt } from '@/lib/hooks/useExpenses';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { formatSTX } from '@/lib/utils';
import { toast } from '@/lib/toast';
import { ArrowRight } from 'lucide-react';

interface SettleDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  circleId: number;
}

interface SettlementForm {
  recipient: string;
  amount: string;
}

export function SettleDebtModal({ isOpen, onClose, circleId }: SettleDebtModalProps) {
  const { handleAsyncError } = useErrorHandler();
  const settleDebt = useSettleDebt();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fields, setFieldValue, setFieldTouched, validateAll, reset } = useFormValidation<SettlementForm>(
    {
      recipient: '',
      amount: '',
    },
    {
      recipient: { 
        required: true,
        custom: (value: string) => {
          if (!value.startsWith('SP') && !value.startsWith('ST')) {
            return 'Invalid Stacks address format';
          }
          return null;
        }
      },
      amount: { 
        required: true,
        custom: (value: string) => {
          const num = parseFloat(value);
          if (isNaN(num) || num <= 0) return 'Amount must be a positive number';
          return null;
        }
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid } = validateAll();
    if (!isValid) return;

    setIsSubmitting(true);
    
    const result = await handleAsyncError(
      async () => {
        const amountMicroSTX = parseFloat(fields.amount.value) * 1000000;
        
        await settleDebt.mutateAsync({
          circleId,
          recipient: fields.recipient.value,
          amount: amountMicroSTX,
        });
        
        toast.success('Settlement transaction initiated!');
        reset();
        onClose();
      },
      'Settle Debt'
    );

    setIsSubmitting(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const presetDebts = [
    { name: 'Alice', address: 'SP1ABC...', amount: 5.0 },
    { name: 'Bob', address: 'SP2DEF...', amount: 3.5 },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Settle Debt"
      size="md"
    >
      <div className="space-y-6">
        {/* Quick Settlement Options */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Settle</h3>
          <div className="space-y-2">
            {presetDebts.map((debt, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => {
                  setFieldValue('recipient', debt.address);
                  setFieldValue('amount', debt.amount.toString());
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{debt.name}</p>
                    <p className="text-xs text-white/60">{debt.address}</p>
                  </div>
                </div>
                <p className="font-bold text-red-400">{formatSTX(debt.amount * 1000000)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Custom Settlement</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Recipient Address"
              error={fields.recipient.touched ? fields.recipient.error : undefined}
              required
            >
              <Input
                value={fields.recipient.value}
                onChange={(e) => setFieldValue('recipient', e.target.value)}
                onBlur={() => setFieldTouched('recipient')}
                placeholder="SP1ABCD..."
                error={!!fields.recipient.error}
              />
            </FormField>

            <FormField
              label="Amount (STX)"
              error={fields.amount.touched ? fields.amount.error : undefined}
              required
            >
              <Input
                type="number"
                step="0.000001"
                min="0"
                value={fields.amount.value}
                onChange={(e) => setFieldValue('amount', e.target.value)}
                onBlur={() => setFieldTouched('amount')}
                placeholder="0.00"
                error={!!fields.amount.error}
              />
            </FormField>

            <div className="text-sm text-white/60">
              <p>This will send STX directly to settle your debt in the circle.</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Settling...' : 'Settle Debt'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}