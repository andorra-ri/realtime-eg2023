<template>
  <div class="bubble">
    <div class="projection" />
    <em>{{ label }}</em>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const MAX_DIAMETER = 200;

const props = defineProps<{
  current: number;
  reference: number;
  color: string;
  max: number;
}>();

const current = computed(() => MAX_DIAMETER * Math.sqrt(props.current / props.max));
const reference = computed(() => MAX_DIAMETER * Math.sqrt(props.reference / props.max));
const label = computed(() => {
  const formatter = new Intl.NumberFormat('ca', { signDisplay: 'exceptZero' });
  return formatter.format(props.current - props.reference);
});

</script>

<style lang="scss" scoped>
.bubble {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(1px * v-bind(current));
  width: calc(1px * v-bind(current));
  border-radius: 50%;
  background: v-bind('$props.color');
  line-height: 1;
  color: #fff;
  font-weight: bold;
  text-align: center;
  pointer-events: none;

  em { font-size: 1em; }

  small {
    font-weight: normal;
    opacity: 0.75;
    font-size: 0.9em;
    display: block;
  }

  .projection {
    all: inherit;
    background: transparent;
    position: absolute;
    border: 2px dashed #000;
    height: calc(1px * v-bind(reference));
    width: calc(1px * v-bind(reference));
    pointer-events: all;

    span {
      position: absolute;
      bottom: 100%;
      margin: 0.5rem;
      background: #333;
      padding: 0.5rem 0.75rem;
      display: none;

      em { font-size: 1rem; }
      small { font-size: 0.65rem; }
    }

    &:hover span { display: block; }
  }
}
</style>
