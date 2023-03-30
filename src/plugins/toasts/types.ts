/* Rely on context hoisting */
/* eslint-disable no-use-before-define */

export type ToastType = 'error' | 'success' | 'info' | 'warning';

export type Toast = {
  id: string;
  message: string;
  type?: ToastType;
  clickable?: boolean;
  closeable?: boolean;
  click?: () => void;
  close?: () => void;
};

export type ToastCenterOptions = {
  timeout?: number;
  type?: ToastType;
  clickable?: boolean;
  closeable?: boolean;
  errorFormat?: (error: Error) => string;
  onClick?: (toast: Toast, context: ToastContext) => void;
  onClose?: (toast: Toast, context: ToastContext) => void;
  position?: 'topright' | 'top' | 'topright' | 'bottomleft' | 'bottom' | 'bottomright';
};

export type ToastOptions = Omit<ToastCenterOptions, 'position'>;

type ShowToast = (message: string, options?: ToastOptions) => Toast;
export type ToastContext = {
  showToast: ShowToast;
} & Record<`show${Capitalize<ToastType>}`, ShowToast>;

export type CatchOptions = {
  format?: (error: Error) => string;
  silent?: boolean;
} & ToastOptions;
