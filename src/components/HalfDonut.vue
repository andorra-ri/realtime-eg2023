<template>
  <div class="half-donut">
    <template v-for="{ label, value, color, rotate } in items" :key="label">
      <div
        class="half-donut__arc"
        :style="`--color:${color};--rotate:${rotate};`" />
      <span class="half-donut__label">
        <strong>{{ value }}</strong>
        {{ label }}
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { sum, rescale } from '/@/utils';

type DonutArc = {
  label: string;
  value: number;
  color: string;
  rotate: number;
};

const props = defineProps<{
  data: {
    label: string;
    value: number,
    color: string;
  }[];
}>();

const items = computed(() => {
  const total = sum(props.data.map(item => item.value));
  const { arcs } = props.data.reduce((acc, item) => {
    const rotate = acc.init + rescale(item.value, 0, total, 0, 180);
    acc.arcs.push({ ...item, rotate });
    acc.init = rotate;
    return acc;
  }, { arcs: [], init: 0 } as { arcs: DonutArc[], init: number });
  return arcs.reverse();
});
</script>

<style lang="scss" scoped>
.half-donut {
  --width: clamp(3rem, 15vw, 8rem);

  position: relative;
  width: 100%;
  aspect-ratio: 2 / 1;
  overflow: hidden;

  &::before {
    position: absolute;
    box-sizing: border-box;
    content: '';
    width: 100%;
    height: 100%;
    margin-top: 0.25rem;
    border: var(--width) solid #f8f8f8;
    border-bottom: none;
    border-top-left-radius: 5000px;
    border-top-right-radius: 5000px;
  }

  &::after {
    content: '';
    display: block;
    height: calc(1.25 * var(--width));
    transform: translateX(-50%);
    width: 0.25rem;
    background: currentcolor;
    position: absolute;
    top: 0;
    left: 50%;
    pointer-events: none;
  }

  &__arc {
    position: absolute;
    top: 100%;
    left: 0;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border: var(--width) solid;
    border-top: none;
    border-bottom-left-radius: 5000px;
    border-bottom-right-radius: 5000px;
    transform: rotate(calc(1deg * var(--rotate)));
    transform-origin: 50% 0;
    animation: arc 1s linear forwards;
    color: var(--color);
    box-shadow: 0 0 0 0.125rem #fff;
    z-index: 0;
  }

  &__label {
    position: absolute;
    left: 50%;
    bottom: 0;
    color: #888;
    transform: translateX(-50%);
    display: none;
    text-align: center;
    font-size: 0.85rem;
    z-index: 1;

    strong {
      display: block;
      font-size: clamp(5rem, 15vw, 8rem);
      color: #333;
    }
  }

  &__arc:hover + &__label { display: block; }
}

@keyframes arc {
  0% { transform: rotate(0); };
}
</style>
