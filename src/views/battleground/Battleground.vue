<template>
  <div class="container">
    <h2>{{ message('battlegrounds.title') }}</h2>
    <p>{{ message('battlegrounds.caption') }}</p>
    <div class="container columns columns--reverse columns--middle">
      <div>
        <h3>{{ message('battlegrounds.hotspots.title') }}</h3>
        <p class="note">{{ message('battlegrounds.hotspots.caption') }}</p>
        <Hotspots :lists="props.results.lists" />
      </div>
      <TerritorialMap
        :lists="props.results.lists"
        :countings="props.results.countings" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI10n } from '/@/composables';
import TerritorialMap from './TerritorialMap.vue';
import Hotspots from './Hotspots.vue';
import type { List } from '/@/types';

const props = defineProps<{
  results: {
    lists: Record<string, List[]>;
    countings: Record<string, number>;
  };
}>();

const { message } = useI10n();
</script>
