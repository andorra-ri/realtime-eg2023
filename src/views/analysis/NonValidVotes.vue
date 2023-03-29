<template>
  <section class="container">
    <h3>{{ message('analysis.no_votes.title') }}</h3>
    <p>{{ message('analysis.no_votes.caption') }}</p>
    <BubbleTimeline :data="abstention" :max="100" unit="%" />
    <p class="note">{{ message('analysis.no_votes.abstention') }}</p>
    <BubbleTimeline :data="blanks" :max="100" unit="%" />
    <p class="note">{{ message('analysis.no_votes.blanks') }}</p>
    <BubbleTimeline :data="nulls" :max="100" unit="%" />
    <p class="note">{{ message('analysis.no_votes.nulls') }}</p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI10n, useHistorics } from '/@/composables';
import { BubbleTimeline } from '/@/components';
import { round, rescale } from '/@/utils';
import type { NationalResults } from '/@/types';

const props = defineProps<{
  results: NationalResults;
}>();

const { message } = useI10n();

const year = new Date().getFullYear();
const historics = useHistorics();

const blanks = computed(() => {
  const { blanks: _blanks = 0, participation = 0 } = props.results;
  const value = round(rescale(_blanks, 0, participation, 0, 100) || 0);
  const current = { year, type: 'BLANK', value };
  return [...historics.blanks.value, current];
});

const nulls = computed(() => {
  const { nulls: _nulls = 0, participation = 0 } = props.results;
  const value = round(rescale(_nulls, 0, participation, 0, 100) || 0);
  const current = { year, type: 'NULL', value };
  return [...historics.nulls.value, current];
});

const abstention = computed(() => {
  const { abstention: _abstention = 0, census = 0 } = props.results;
  const value = round(rescale(_abstention, 0, census, 0, 100) || 0);
  const current = { year, type: 'ABSTENTION', value };
  return [...historics.abstention.value, current];
});
</script>

<style lang="scss">
.tick:last-child {
  font-weight: bold;
  .bubble { background: #0003; }
}
</style>
