<template>
  <ConfidenceTrafficLight :counting="counting" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ConfidenceTrafficLight from './ConfidenceTrafficLight.vue';
import { sum, rescale, clamp } from '/@/utils';
import type { NationalResults, TerritorialResults } from '../types';
import config from '/@/config.yaml';

const {
  CONFIDENCE_LEVELS: { consolidated, strong },
  hotspots: { THRESHOLDS },
} = config;

const props = defineProps<{
  national: NationalResults;
  territorial: TerritorialResults;
}>();

const counting = computed(() => {
  const { valids = 0, blanks = 0, nulls = 0, participation = 1 } = props.national;
  const national = ((valids + blanks + nulls) / participation) || 0;

  const { CAN, ...territorial } = props.territorial.countings;
  const anyWeak = Object.values(territorial).find(level => level < consolidated);
  const someMaxConsolidated = Object.values(territorial).filter(level => level < strong);
  const anyBurnHotspot = Object.values(props.territorial.lists)
    .find(lists => {
      if (lists.length <= 1) return false;
      const votes = sum(lists.map(list => list.votes));
      const margin = lists[1] ? lists[0].votes - lists[1].votes : 0;
      const threshold = rescale(margin, 0, votes, 0, 1);
      return threshold < THRESHOLDS.burn;
    });

  const maxLevel = !!anyWeak || someMaxConsolidated.length === 3 || !!anyBurnHotspot
    ? strong
    : 1;

  return clamp(national, 0, maxLevel);
});
</script>
