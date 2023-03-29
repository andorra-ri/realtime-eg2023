<template>
  <section class="container">
    <h2>{{ message('analysis.new_parties.title') }}</h2>
    <p>{{ message('analysis.new_parties.caption') }}</p>
    <PartyRun :results="props.results" />
  </section>
</template>

<script setup lang="ts">
import { useI10n } from '/@/composables';
import { PartyRun } from '/@/components';
import type { NationalResults } from '/@/types';

const props = defineProps<{
  results: NationalResults;
}>();

const { message } = useI10n();
</script>
