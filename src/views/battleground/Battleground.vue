<template>
  <div class="container">
    <h2>{{ message('battlegrounds.title') }}</h2>
    <p>{{ message('battlegrounds.caption') }}</p>
    <TerritorialMap
      :lists="props.results.lists"
      :countings="props.results.countings" />
  </div>
</template>

<script setup lang="ts">
import { useI10n } from '/@/composables';
import TerritorialMap from './TerritorialMap.vue';
import type { List } from '/@/types';

const props = defineProps<{
  results: {
    lists: Record<string, List[]>;
    countings: Record<string, number>;
  };
}>();

const { message } = useI10n();
</script>
