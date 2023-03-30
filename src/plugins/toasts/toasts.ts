import { ref, readonly } from 'vue';
import type { Toast, ToastOptions, ToastCenterOptions, ToastContext, CatchOptions } from './types';

/* Rely on context hoisting */
/* eslint-disable no-use-before-define */

const toasts = ref<Record<string, Toast>>({});
export default readonly(toasts);

export const toastsConfig = ref<ToastCenterOptions>({});

export const showToast = (message: string, options?: ToastOptions): Toast => {
  const id = Math.random().toString(36).substring(2);
  const {
    timeout,
    type,
    onClose,
    onClick,
    closeable,
    clickable,
  } = { ...toastsConfig.value, ...options };

  const remove = () => {
    if (toasts.value[id]) {
      onClose?.(toasts.value[id], context);
      delete toasts.value[id];
    }
  };

  const close = closeable || onClose ? remove : undefined;
  const click = clickable || onClick ? () => onClick?.(toasts.value[id], context) : undefined;

  const toast: Toast = { id, message, type, click, close };
  toasts.value[id] = toast;

  if (timeout) setTimeout(() => remove(), timeout);

  return toast;
};

export const showError = (message: string, options?: ToastOptions) => (
  showToast(message, { ...options, type: 'error' })
);

export const showSuccess = (message: string, options?: ToastOptions) => (
  showToast(message, { ...options, type: 'success' })
);

export const showInfo = (message: string, options?: ToastOptions) => (
  showToast(message, { ...options, type: 'info' })
);

export const showWarning = (message: string, options?: ToastOptions) => (
  showToast(message, { ...options, type: 'warning' })
);

/* Rely on hoisting */
const context: ToastContext = { showToast, showError, showSuccess, showWarning, showInfo };

export const catchToast = <T extends any[], R>(
  callback: (...attrs: T) => Promise<R>,
  options?: CatchOptions,
) => {
  const { errorFormat, silent = true, ...rest } = { ...toastsConfig.value, ...options };
  return (...attrs: T) => callback(...attrs).catch((error: Error) => {
    const message = errorFormat?.(error) || error.message;
    showError(message, rest);
    if (!silent) throw error;
    return false;
  });
};
