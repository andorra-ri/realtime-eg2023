<template>
  <ul :class="`toasts-center toasts-center--${toastsConfig.position}`">
    <li v-for="(toast, id) in toasts" :key="id">
      <div :data-toast="id" :class="classes(toast)" @click="onClick(toast)">
        <slot :toast="toast">{{ toast.message }}</slot>
        <button
          v-if="toast.close"
          class="toast__close"
          @click="toast.close?.()">
          &times;
        </button>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import toasts, { toastsConfig } from './toasts';
import type { Toast } from './types';

const classes = (toast: Toast) => [
  'toast',
  `toast--${toast.type}`,
  { 'toast--clickable': !!toast.click },
];

const onClick = (toast: Toast) => toast.click?.();
</script>

<style lang="scss" scoped>
.toasts-center {
  list-style: none;
  position: fixed;
  z-index: 5;
  margin: 0;
  padding: 0.5em;

  &--topleft,
  &--top,
  &--topright { top: 0; }

  &--topleft,
  &--bottomleft { left: 0; }

  &--topright,
  &--bottomright {
    right: 0;
    text-align: right;
  }

  &--top,
  &--bottom {
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }

  &--bottomleft,
  &--bottom,
  &--bottomright { bottom: 0; }

  .toast {
    display: inline-flex;
    align-items: center;
    gap: var(--toast-padding, 0.75em);
    padding: var(--toast-padding, 0.75em);
    margin: 2px;
    background: var(--toast-color, #e1e1e1);
    color: var(--toast-text, #6c6c6c);
    border: var(--toast-border, 1px solid currentcolor);
    border-radius: var(--toast-radius, 2px);
    max-width: var(--toast-maxwidth, 40ch);
    box-sizing: border-box;
    text-align: left;

    &--error {
      background: var(--toast-error-color, #f8e4e3);
      color: var(--toast-error-text, #984a4a);
    }

    &--success {
      background: var(--toast-color-success, #e3f8e7);
      color: var(--toast-error-text, #579156);
    }

    &--info {
      background: var(--toast-color-info, #d8e3fb);
      color: var(--toast-error-text, #566591);
    }

    &--warning {
      background: var(--toast-color-warning, #fdf7df);
      color: var(--toast-error-text, #b7a047);
    }

    &--clickable { cursor: pointer; }

    &__close {
      all: unset;
      cursor: pointer;
    }
  }
}
</style>
