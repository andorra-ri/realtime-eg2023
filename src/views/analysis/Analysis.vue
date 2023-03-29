<template>
  <section class="container">
    <h2>{{ message('analysis.title') }}</h2>
    <p>{{ message('analysis.caption') }}</p>
    <MainParties :results="props.results" />
    <NewParties :results="props.results" />
    <NonValidVotes :results="props.results" />
  </section>
</template>

<script setup lang="ts">
import { useI10n } from '/@/composables';
import MainParties from './MainParties.vue';
import NewParties from './NewParties.vue';
import NonValidVotes from './NonValidVotes.vue';
import type { NationalResults } from '/@/types';

const props = defineProps<{
  results: NationalResults;
}>();

const { message } = useI10n();
</script>
