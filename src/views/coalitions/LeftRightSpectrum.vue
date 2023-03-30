<template>
  <section class="container">
    <I10n tag="h3" path="coalitions.left_right.title">
      <template #vs><em>vs</em></template>
    </I10n>
    <SeatsStackBar
      :nominees="props.nominees"
      :grouper="grouper"
      duel
      order />
  </section>
</template>

<script setup lang="ts">
import { useI10n } from '/@/composables';
import { SeatsStackBar } from '/@/components';
import type { Nominee, Coalition } from '/@/types';

const props = defineProps<{
  nominees: Nominee[];
}>();

const { I10n } = useI10n();

const SPECTRUM: Record<string, Coalition> = {
  LEFT: { name: 'Progressistes', order: 0 },
  RIGHT: { name: 'Conservadors', order: 1 },
};

const grouper = (nominee: Nominee) => nominee.party.groups?.map(group => SPECTRUM[group])[0];
</script>

<style scoped>
.container { margin-bottom: 5rem !important; }
</style>
