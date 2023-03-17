<template>
  <div :class="['seats-stack-bar', { duel }]">
    <div class="seats-stack-bar__marker">14</div>
    <div class="seats-stack-bar__groups">
      <div
        v-for="group, i in groups"
        :key="i"
        :style="`--group-seats:${sumSeats(group)}`"
        class="seats-stack-bar__parties">
        <span
          v-for="[party, nominees] in group"
          :key="party.name"
          :style="`--seats:${nominees.length}; --color:${party.color}`"
          :data-tooltip="party.name"
          class="seats-stack-bar__party">
          {{ nominees.length }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { groupBy, sum } from '../utils';
import type { Party, Nominee, Coalition } from '/@/types';

type PartyCount = [Party, Nominee[]];

const props = defineProps<{
  nominees: Nominee[];
  grouper?: (nominee: Nominee) => Coalition | undefined;
  order?: boolean;
  duel?: boolean;
}>();

const sumSeats = (group: PartyCount[]) => sum(group.map(([, nominees]) => nominees.length));

const groups = computed(() => {
  const PARTY_SORTER = (a: PartyCount, b: PartyCount) => (
    props.order
      ? a[0].order - b[0].order
      : b[1].length - a[1].length
  );

  const groupedNominees = props.grouper
    ? [...groupBy(props.nominees, props.grouper)]
      .filter(([group]) => !!group) // Remove non grouped items (group) es
      .sort(([groupA], [groupB]) => groupA!.order - groupB!.order) // Sort by group order
      .slice(0, props.duel ? 2 : undefined) // Keep only 2 groups if duel
      .map(([, nominees]) => nominees) // Keep only nominees
    : [props.nominees];

  return groupedNominees.map(group => [...groupBy(group, 'party')].sort(PARTY_SORTER));
});
</script>

<style lang="scss" scoped>
.seats-stack-bar {
  position: relative;
  padding-top: 1.5rem;
  max-width: min(90%, 40rem);
  margin: 2rem auto 3rem;

  &__marker {
    position: absolute;
    transform: translate(-50%, 0.25rem);
    left: 50%;
    bottom: 0;
    font-size: 0.9rem;
    color: #0009;
    font-weight: bold;
    text-align: center;
    z-index: 2;
    pointer-events: none;

    &::after {
      display: block;
      content: '';
      background: #0008;
      width: 2px;
      height: 2.5rem;
      margin: 0.25rem auto 0;
    }
  }

  &__groups {
    display: flex;
    height: 2rem;
    background-image: linear-gradient(
      315deg,
      transparent 25%,
      #f3f3f3 25%,
      #f3f3f3 50%,
      transparent 50%,
      transparent 75%,
      #f3f3f3 75%,
      #f3f3f3 100%
    );
    background-size: 6px 6px;

    .duel & { justify-content: space-between; }
  }

  &__parties {
    display: flex;
    flex: 0 0 calc(100% / 28 * var(--group-seats));
  }

  &__party {
    background: var(--color);
    flex: 0 0 calc(100% / var(--group-seats) * var(--seats) - 1px);
    margin-right: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #fff;
  }
}
</style>
