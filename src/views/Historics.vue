<template>
  <section class="container">
    <h2>{{ message('historic.title') }}</h2>
    <p>{{ message('historic.caption') }}</p>
    <section class="container">
      <h3>{{ message('historic.no_votes.title') }}</h3>
      <BubbleTimeline :data="abstention" :max="maxVotes" />
      <p class="note">{{ message('historic.no_votes.abstention') }}</p>
      <BubbleTimeline :data="blanks" :max="maxVotes" />
      <p class="note">{{ message('historic.no_votes.blanks') }}</p>
      <BubbleTimeline :data="nulls" :max="maxVotes" />
      <p class="note">{{ message('historic.no_votes.nulls') }}</p>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI10n, useHistorics } from '/@/composables';
import { BubbleTimeline } from '/@/components';
import { max } from '/@/utils';

const props = defineProps<{
  current: {
    nulls: number;
    blanks: number;
    abstention: number;
  };
}>();

const { message } = useI10n();

const year = new Date().getFullYear();
const historics = useHistorics();

const blanks = computed(() => {
  const current = { year, type: 'BLANK', value: props.current.blanks || 0 };
  return [...historics.blanks.value, current];
});

const nulls = computed(() => {
  const current = { year, type: 'NULL', value: props.current.nulls || 0 };
  return [...historics.nulls.value, current];
});

const abstention = computed(() => {
  const current = { year, type: 'ABSTENTION', value: props.current.abstention || 0 };
  return [...historics.abstention.value, current];
});

const maxVotes = computed(() => {
  const historic = [...blanks.value, ...nulls.value, ...abstention.value];
  return max(historic.map(({ value }) => value));
});
</script>

<style>
.tick:last-child .bubble {
  box-shadow: 0 0 0 1px #888;
}
</style>
