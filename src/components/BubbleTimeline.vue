<template>
  <section class="bubbles">
    <span
      v-for="{ x, diameter, year, value } in bubbles"
      :key="year"
      class="tick"
      :style="`--x:${x}%;--diameter:${diameter}px`">
      {{ year }}
      <span
        class="bubble"
        :data-tooltip="`${value} ${message('votes')}`" />
    </span>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { min, max, rescale } from '/@/utils';
import { useI10n } from '/@/composables';

type Bubble = {
  year: number;
  value: number;
};

const props = defineProps<{
  data: Bubble[];
  max?: number;
}>();

const MAX_DIAMETER = 100;

const { message } = useI10n();

const bubbles = computed(() => {
  const dates = props.data.map(bubble => bubble.year);
  const start = min(dates);
  const end = max(dates);
  const total = props.max || max(props.data.map(bubble => bubble.value));
  return [...props.data]
    .sort((a, b) => a.year - b.year)
    .map(({ year, value }) => {
      const x = rescale(year, start, end, 0, 1) * 100;
      const diameter = MAX_DIAMETER * Math.sqrt(value / total);
      return { x, diameter, year, value };
    });
});
</script>

<style lang="scss" scoped>
.bubbles {
  // stylelint-disable value-keyword-case
  height: calc(1px * v-bind(MAX_DIAMETER));
  max-width: min(70%, 27rem);
  margin: 1rem auto;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    top: 50%;
    display: block;
    border-top: 1px solid #8888;
  }

  .tick {
    position: absolute;
    left: var(--x);
    top: 50%;
    padding-top: 10px;
    transform: translateX(-50%);
    font-size: 0.75rem;
    color: #888;

    &::before {
      content: '';
      position: absolute;
      height: 10px;
      top: -4px;
      left: 50%;
      border-right: 1px solid #8888;
    }
  }

  .bubble {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    height: var(--diameter);
    width: var(--diameter);
    background: #0001;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
