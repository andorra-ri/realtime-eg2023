<template>
  <div class="stat">
    <span class="stat__title">{{ props.title }}</span>
    <em class="stat__value">{{ props.current }}{{ props.unit }}</em>
    <p class="stat__em">{{ props.em }}</p>
    <p class="stat__limits">
      <span>
        <i>Min</i>
        {{ limits.min.value }}{{ props.unit }}
        <small>({{ limits.min.year }})</small>
      </span>
      <span>
        <i>Max</i>
        {{ limits.max.value }}{{ props.unit }}
        <small>({{ limits.max.year }})</small>
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  title: string;
  current: number;
  em: string;
  historic: {
    year: number;
    value: number;
  }[];
  unit: string;
}>();

const limits = computed(() => {
  const min = props.historic.reduce((acc, item) => (item.value < acc.value ? item : acc));
  const max = props.historic.reduce((acc, item) => (item.value > acc.value ? item : acc));
  return { min, max };
});
</script>

<style lang="scss">
.stat {
  display: inline-block;
  text-align: center;
  padding: 1rem 1.5rem;

  &__title {
    display: block;
    font-weight: bold;
  }

  &__value {
    font-size: 3rem;
    font-weight: bold;
  }

  &__em {
    margin: 0 0 1rem;
    font-size: 0.8rem;
  }

  &__limits {
    margin: 0;
    display: flex;
    justify-content: space-between;
    gap: 1rem;

    i {
      display: block;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #888;
    }

    small {
      display: block;
      font-size: 0.75rem;
      opacity: 0.5;
    }
  }
}
</style>
