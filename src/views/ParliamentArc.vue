<template>
  <section class="container">
    <fieldset class="options">
      <label v-for="name in SHOW_OPTIONS" :key="name">
        <input v-model="showBy" :value="name" type="radio">
        <span>{{ message(`arc.${name}`) }}</span>
      </label>
    </fieldset>
    <HalfDonut :data="data" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI10n } from '/@/composables';
import { HalfDonut } from '/@/components';
import { sum, groupBy } from '/@/utils';
import type { Nominee, List } from '/@/types';

const props = defineProps<{
  nominees: Nominee[];
  lists: List[];
}>();

const { message } = useI10n();

const toArc = <T>(
  data: Map<{ name: string, color?: string, order: number }, T>,
  extractor: (item: T) => number,
) => [...data]
    .sort((a, b) => a[0].order - b[0].order)
    .map(([{ name: label, color = '#bbb' }, item]) => {
      const value = extractor(item);
      return { label, value, color };
    });

const votesByList = computed(() => {
  const groupedLists = groupBy(props.lists, list => list);
  return toArc(groupedLists, lists => sum(lists.map(list => list.votes)));
});

const seatsByParty = computed(() => {
  const groupedNominees = groupBy(props.nominees, nominee => nominee.party);
  return toArc(groupedNominees, nominees => nominees.length);
});

const SHOW_OPTIONS = ['votes_list', 'seats_party'] as const;
const showBy = ref<typeof SHOW_OPTIONS[number]>('seats_party');
const data = computed(() => {
  const options = {
    votes_list: votesByList.value,
    seats_party: seatsByParty.value,
  };
  return options[showBy.value];
});
</script>

<style lang="scss">
.options {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin: 1rem;

  input { display: none; }

  span {
    display: block;
    padding: 0.25rem 0;
    color: #888;
    cursor: pointer;
  }

  input:checked + span {
    font-weight: bold;
    color: #333;
    border-bottom: 2px solid currentcolor;
  }
}
</style>
