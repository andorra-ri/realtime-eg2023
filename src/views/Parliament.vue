<template>
  <section class="container">
    <h2>{{ message('parliament.title') }}</h2>
    <fieldset class="options">
      <label v-for="name in SHOW_OPTIONS" :key="name">
        <input v-model="showBy" :value="name" type="radio">
        <span>{{ message(`parliament.${name}`) }}</span>
      </label>
      <label>
        <input v-model="showBy" value="nominees" type="radio">
        <span>{{ message('parliament.nominees') }}</span>
      </label>
    </fieldset>
    <NomineesList v-if="showBy === 'nominees'" :nominees="nominees" />
    <HalfDonut v-else :data="data" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI10n } from '/@/composables';
import { HalfDonut, NomineesList } from '/@/components';
import { sum, indexate, groupBy } from '/@/utils';
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

const seatsByCoalition = computed(() => {
  const coalitions = indexate(props.nominees.map(nominee => {
    const name = nominee.party.coalitionName || nominee.party.name;
    return { ...nominee.party, name };
  }), 'id');
  const groupedSeats = groupBy(props.nominees, nominee => {
    const id = nominee.party.coalitionLeaderId || nominee.party.id;
    return coalitions[id];
  });
  return toArc(groupedSeats, nominees => nominees.length);
});

const SHOW_OPTIONS = ['votes_list', 'seats_coalition', 'seats_party'] as const;
const showBy = ref<typeof SHOW_OPTIONS[number] | 'nominees'>('seats_party');
const data = computed(() => {
  const options = {
    votes_list: votesByList.value,
    seats_coalition: seatsByCoalition.value,
    seats_party: seatsByParty.value,
  };
  return showBy.value !== 'nominees' ? options[showBy.value] : [];
});
</script>

<style lang="scss">
.options {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem auto 3rem;

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
