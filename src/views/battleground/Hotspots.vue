<template>
  <ul class="hotspots" :data-calm="message('battlegrounds.hotspots.calm')">
    <li v-for="hotspot in hotspots" :key="hotspot.parrish" :class="['hotspot', hotspot.emoji]">
      <span :class="['hotspot__emoji', hotspot.emoji]">
        {{ hotspot.emoji }}
      </span>
      <span class="hotspot__name">
        {{ message(`parrishes.${hotspot.parrish}`) }}
      </span>
      <span class="hotspot__margin">
        +{{ hotspot.margin }} {{ message('votes') }}
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI10n } from '/@/composables';
import { sum, rescale } from '/@/utils';
import type { List } from '/@/types';
import config from '/@/config.yaml';

const props = defineProps<{
  lists: Record<string, List[]>;
  countings: Record<string, number>;
}>();

const { THRESHOLDS } = config.hotspots;

const { message } = useI10n();

const hotspots = computed(() => Object.entries(props.lists)
  .map(([parrish, lists]) => {
    const total = sum(lists.map(list => list.votes));
    const margin = lists[1] ? lists[0].votes - lists[1].votes : NaN;
    const percent = rescale(margin, 0, total, 0, 1);
    const emoji = percent < THRESHOLDS.burn ? '🔥' : '🍿';
    return { parrish, percent, margin, emoji };
  })
  .filter(({ parrish, percent, margin }) => {
    const counted = props.countings[parrish];
    return !Number.isNaN(margin) && percent < THRESHOLDS.hot && counted < 1;
  })
  .sort((a, b) => a.percent - b.percent));
</script>

<style lang="scss" scoped>
.hotspots {
  display: block;
  margin: 1rem;

  &:empty::before {
    content: attr(data-calm);
    display: block;
    text-align: center;
    padding: 1rem;
    color: #888;
  }
}

.hotspot {
  position: relative;
  padding: 0.75rem 1rem;
  background: #8881;
  margin: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.25rem;

  /*
  &.🔥 { background: #faa30744; }
  &.🍿 { background: #f9c74f33; }
  */

  &__name {
    font-size: 0.9rem;
    text-transform: uppercase;
  }

  &__margin {
    margin-left: auto;
    font-weight: bold;
    white-space: nowrap;
  }

  &__emoji {
    font-size: 1.25rem;
    margin: -0.125rem 0;

    &.🔥 { animation: shake 1s infinite; }
    &.🍿 { animation: bounce 1s infinite; }
  }
}

@keyframes shake {
  0% { transform: translate(0, 0) rotate(0deg); }
  5% { transform: translate(1px, 1px) rotate(5deg); }
  10% { transform: translate(0, 0) rotate(0deg); }
  15% { transform: translate(-1px, 1px) rotate(-5deg); }
  20% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(1px, 1px) rotate(5deg); }
  30% { transform: translate(0, 0) rotate(0deg); }
  35% { transform: translate(-1px, 1px) rotate(-5deg); }
  40% { transform: translate(0, 0) rotate(0deg); }
}

@keyframes bounce {
  0%, 10%, 25%, 40%, 50% {
    transition-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    transform: translate3d(0,0,0);
    transform-style: preserve-3d;
  }

  20%, 23% {
    transition-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
    transform: translate3d(0, -3px, 0);
    transform-style: preserve-3d;
  }

  35% {
    transition-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
    transform: translate3d(0, -1px, 0) rotate(10deg);
    transform-style: preserve-3d;
  }

  45% {
    transform: translate3d(0, -4px, 0) rotate(-20deg);
    transform-style: preserve-3d;
  }
}
</style>
