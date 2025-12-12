import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}

export function Toast({ type, message, onClose }: ToastProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    info: <AlertCircle className="w-5 h-5 text-blue-400" />,
  };

  const styles = {
    success: 'border-green-400/50',
    error: 'border-red-400/50',
    info: 'border-blue-400/50',
  };

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 bg-neutral-900/95 backdrop-blur-lg border rounded-xl p-4',
        'flex items-center gap-3 shadow-xl max-w-md',
        'animate-slide-up',
        styles[type]
      )}
    >
      {icons[type]}
      <p className="text-white flex-1">{message}</p>
      <button onClick={onClose} className="text-white/60 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
