'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { FormField, Input } from '@/components/ui/FormField';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useAddMember } from '@/lib/hooks/useCircles';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { toast } from '@/lib/toast';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  circleId: number;
}

interface MemberForm {
  address: string;
  nickname: string;
}

export function AddMemberModal({ isOpen, onClose, circleId }: AddMemberModalProps) {
  const { handleAsyncError } = useErrorHandler();
  const addMember = useAddMember();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fields, setFieldValue, setFieldTouched, validateAll, reset } = useFormValidation<MemberForm>(
    {
      address: '',
      nickname: '',
    },
    {
      address: { 
        required: true,
        custom: (value: string) => {
          if (!value.startsWith('SP') && !value.startsWith('ST')) {
            return 'Invalid Stacks address format';
          }
          if (value.length !== 41) {
            return 'Stacks address must be 41 characters';
          }
          return null;
        }
      },
      nickname: { required: true, minLength: 2, maxLength: 20 },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { isValid } = validateAll();
    if (!isValid) return;

    setIsSubmitting(true);
    
    const result = await handleAsyncError(
      async () => {
        await addMember.mutateAsync({
          circleId,
          address: fields.address.value,
          nickname: fields.nickname.value,
        });
        
        toast.success('Member added successfully!');
        reset();
        onClose();
      },
      'Add Member'
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
      title="Add New Member"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Stacks Address"
          error={fields.address.touched ? fields.address.error : undefined}
          required
        >
          <Input
            value={fields.address.value}
            onChange={(e) => setFieldValue('address', e.target.value)}
            onBlur={() => setFieldTouched('address')}
            placeholder="SP1ABCD..."
            error={!!fields.address.error}
          />
        </FormField>

        <FormField
          label="Nickname"
          error={fields.nickname.touched ? fields.nickname.error : undefined}
          required
        >
          <Input
            value={fields.nickname.value}
            onChange={(e) => setFieldValue('nickname', e.target.value)}
            onBlur={() => setFieldTouched('nickname')}
            placeholder="Enter a friendly name"
            error={!!fields.nickname.error}
          />
        </FormField>

        <div className="text-sm text-white/60">
          <p>The member will need to accept the invitation to join the circle.</p>
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
            {isSubmitting ? 'Adding...' : 'Add Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}