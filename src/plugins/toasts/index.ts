import type { App, Plugin } from 'vue';
import ToastCenter from './ToastCenter.vue';
import * as toasts from './toasts';
import type { ToastCenterOptions } from './types';

export * from './toasts';

const plugin: Plugin = {
  install(app: App, options?: ToastCenterOptions) {
    toasts.toastsConfig.value = options || {};
    app.component('ToastCenter', ToastCenter);
    app.provide('toasts', toasts);
  },
};

export default plugin;
