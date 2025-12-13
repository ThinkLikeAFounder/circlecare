'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { FormField, Input } from '@/components/ui/FormField';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useAddExpense } from '@/lib/hooks/useExpenses';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { toast } from '@/lib/toast';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  circleId: number;
}

interface ExpenseForm {
  description: string;
  amount: string;
  participants: string[];
}

export function AddExpenseModal({ isOpen, onClose, circleId }: AddExpenseModalProps) {
  const { handleAsyncError } = useErrorHandler();
  const addExpense = useAddExpense();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fields, setFieldValue, setFieldTouched, validateAll, reset } = useFormValidation<ExpenseForm>(
    {
      description: '',
      amount: '',
      participants: [],
    },
    {
      description: { required: true, minLength: 3 },
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
        const values = {
          description: fields.description.value,
          amount: parseFloat(fields.amount.value) * 1000000, // Convert to microSTX
          participants: fields.participants.value,
        };
        
        await addExpense.mutateAsync({
          circleId,
          ...values,
        });
        
        toast.success('Expense added successfully!');
        reset();
        onClose();
      },
      'Add Expense'
    );

    setIsSubmitting(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Expense"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Description"
          error={fields.description.touched ? fields.description.error : undefined}
          required
        >
          <Input
            value={fields.description.value}
            onChange={(e) => setFieldValue('description', e.target.value)}
            onBlur={() => setFieldTouched('description')}
            placeholder="What was this expense for?"
            error={!!fields.description.error}
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
          <p>This expense will be split equally among all circle members.</p>
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
            {isSubmitting ? 'Adding...' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}