<template>
  <section class="container">
    <h2>{{ message('analysis.no_votes.title') }}</h2>
    <p>{{ message('analysis.no_votes.caption') }}</p>
    <div class="no-votes">
      <Card
        v-if="historics.abstention.value.length"
        :title="message('analysis.no_votes.abstention')"
        :em="message('analysis.no_votes.census')"
        :current="abstention"
        :historic="historics.abstention.value"
        unit="%"
        class="abstention" />
      <Card
        v-if="historics.blanks.value.length"
        :title="message('analysis.no_votes.blanks')"
        :em="message('analysis.no_votes.participation')"
        :current="blanks"
        :historic="historics.blanks.value"
        unit="%"
        class="blank" />
      <Card
        v-if="historics.nulls.value.length"
        :title="message('analysis.no_votes.nulls')"
        :em="message('analysis.no_votes.participation')"
        :current="nulls"
        :historic="historics.nulls.value"
        unit="%"
        class="null" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI10n, useHistorics } from '/@/composables';
import { Card } from '/@/components';
import { round, rescale } from '/@/utils';
import type { NationalResults } from '/@/types';

const props = defineProps<{
  results: NationalResults;
}>();

const { message } = useI10n();

const historics = useHistorics();

const blanks = computed(() => {
  const { blanks: _blanks = 0, participation = 0 } = props.results;
  return round(rescale(_blanks, 0, participation, 0, 100) || 0, 2);
});

const nulls = computed(() => {
  const { nulls: _nulls = 0, participation = 0 } = props.results;
  return round(rescale(_nulls, 0, participation, 0, 100) || 0, 2);
});

const abstention = computed(() => {
  const { abstention: _abstention = 0, census = 0 } = props.results;
  return round(rescale(_abstention, 0, census, 0, 100) || 0, 1);
});
</script>

<style>
.no-votes {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 3rem;
  margin: 3rem;
}

.abstention,
.blank,
.null {
  box-shadow: 0 0.5rem 1rem 0 #0002;
}

.abstention {
  background: #ddd;
  border: 1px solid #bbb;
}

.blank {
  border: 1px solid #ddd;
}

.null {
  background: #333;
  color: #fff;
  border: 1px solid #333;
}
</style>
