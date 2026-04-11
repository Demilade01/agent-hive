import { toast as sonnerToast } from 'sonner';

type ToastId = string | number;

interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export const toast = {
  success: (message: string, description?: string, options?: ToastOptions) => {
    return sonnerToast.success(message, {
      description,
      ...options,
    });
  },

  error: (message: string, description?: string, options?: ToastOptions) => {
    return sonnerToast.error(message, {
      description,
      ...options,
    });
  },

  info: (message: string, description?: string, options?: ToastOptions) => {
    return sonnerToast.info(message, {
      description,
      ...options,
    });
  },

  loading: (message: string, options?: ToastOptions) => {
    return sonnerToast.loading(message, {
      ...options,
    });
  },

  dismiss: (toastId?: ToastId) => {
    if (toastId) {
      sonnerToast.dismiss(toastId);
    } else {
      sonnerToast.dismiss();
    }
  },

  promise: async <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return sonnerToast.promise(promise, messages);
  },
};
