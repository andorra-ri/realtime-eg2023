<template>
  <section class="container">
    <h3>{{ message('analysis.new_parties.title') }}</h3>
    <p class="note">{{ message('analysis.new_parties.caption') }}</p>
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
