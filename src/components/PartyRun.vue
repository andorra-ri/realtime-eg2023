<template>
  <div class="run-container">
    <ul class="run">
      <li class="run__qe" :style="`--x:${qe}`">
        <em>{{ props.results.qe }}</em>
        {{ message('analysis.new_parties.threshold') }}
      </li>
      <li
        v-for="list in lists"
        :key="list.id"
        :style="`--x:${list.x}`"
        class="run__party">
        <div :data-tooltip="list.name">
          <img :src="list.parties[0].logo">
          <span class="votes">
            <em>{{ list.votes }}</em>
            {{ message('votes') }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI10n } from '/@/composables';
import { min, max, rescale } from '/@/utils';
import type { NationalResults } from '/@/types';

const MIN = 5;
const MAX = 100 - MIN;

const props = defineProps<{
  results: NationalResults;
}>();

const { message } = useI10n();

const newLists = computed(() => props.results.lists.filter(list => list.parties[0].groups?.includes('NEW')));

const limits = computed(() => {
  const votes = [...newLists.value.map(list => list.votes), props.results.qe];
  return { min: min(votes), max: max(votes) };
});

const qe = computed(() => rescale(props.results.qe, limits.value.min, limits.value.max, MIN, MAX));
const lists = computed(() => newLists.value.map(list => {
  const x = rescale(list.votes, limits.value.min, limits.value.max, MIN, MAX);
  return { ...list, x };
}));
</script>

<style lang="scss" scoped>
.run {
  --bar-height: 1rem;

  display: block;
  position: relative;
  height: var(--bar-height);
  background-image: linear-gradient(
    315deg,
    transparent 25%,
    #e3e3e3 25%,
    #e3e3e3 50%,
    transparent 50%,
    transparent 75%,
    #e3e3e3 75%,
    #e3e3e3 100%
  );
  background-size: 6px 6px;
  max-width: 30rem;
  margin: 5rem auto 7rem;

  &-container { padding: 1px; }

  &__qe,
  &__party {
    position: absolute;
    top: 0;
    left: calc(1% * var(--x));
    transform: translate(-50%, -0.25rem);
    text-align: center;

    &::before {
      content: '';
      display: block;
      height: calc(var(--bar-height) + 1rem);
      width: 0;
      margin: auto;
      border-left: 2px solid #333;
    }

    img {
      max-height: 3rem;
      max-width: 5rem;
    }

    .votes {
      display: block;
      font-size: 0.75rem;
      color: #888;
      text-transform: uppercase;
    }

    em {
      display: block;
      color: #333;
      font-size: 1.125rem;
      font-weight: bold;
    }
  }

  &__qe {
    display: flex;
    flex-direction: column-reverse;
    font-size: 0.65rem;
    text-transform: uppercase;
    transform: translate(-50%, calc(-100% + var(--bar-height) + 0.25rem));
    max-width: 6rem;

    em { font-size: 1.7rem; }
  }
}
</style>
