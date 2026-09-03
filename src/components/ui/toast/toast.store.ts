import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  onClick?: () => void;
}

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  onClick?: () => void;
}

interface ToastState {
  toasts: Toast[];
  push: (type: ToastType, message: string, options?: ToastOptions) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (type, message, options) => {
    if (useToastStore.getState().toasts.some((t) => t.message === message)) {
      return;
    }
    const id = crypto.randomUUID();
    set((s) => ({
      toasts: [...s.toasts, { id, type, message, onClick: options?.onClick }],
    }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (m: string, o?: ToastOptions) => useToastStore.getState().push('success', m, o),
  error: (m: string, o?: ToastOptions) => useToastStore.getState().push('error', m, o),
  warning: (m: string, o?: ToastOptions) => useToastStore.getState().push('warning', m, o),
  info: (m: string, o?: ToastOptions) => useToastStore.getState().push('info', m, o),
};
