import { create } from 'zustand';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          ...toast,
          id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          duration: toast.duration ?? 5000,
        },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearAll: () => set({ toasts: [] }),
}));

// Helper functions for common toast types
export const toast = {
  success: (message: string, title?: string) =>
    useToast.getState().addToast({ type: 'success', message, title }),
  error: (message: string, title?: string) =>
    useToast.getState().addToast({ type: 'error', message, title }),
  info: (message: string, title?: string) =>
    useToast.getState().addToast({ type: 'info', message, title }),
  warning: (message: string, title?: string) =>
    useToast.getState().addToast({ type: 'warning', message, title }),
};