<template>
  <div class="container">
    <h2>{{ message('battlegrounds.title') }}</h2>
    <p>{{ message('battlegrounds.caption') }}</p>
    <div class="container">
      <h3>{{ message('battlegrounds.territorial.title') }}</h3>
      <p class="note">{{ message('battlegrounds.territorial.caption') }}</p>
      <section class="columns columns--reverse columns--middle">
        <div>
          <h3>{{ message('battlegrounds.hotspots.title') }}</h3>
          <p class="note">{{ message('battlegrounds.hotspots.caption') }}</p>
          <Hotspots :lists="props.territorial.lists" />
        </div>
        <TerritorialMap
          :lists="props.territorial.lists"
          :countings="props.territorial.countings" />
      </section>
    </div>
    <section class="container">
      <h3>{{ message('battlegrounds.national.title') }}</h3>
      <p class="note">{{ message('battlegrounds.national.caption') }}</p>
      <NationalTable :results="props.national" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI10n } from '/@/composables';
import TerritorialMap from './TerritorialMap.vue';
import Hotspots from './Hotspots.vue';
import NationalTable from './NationalTable.vue';
import type { TerritorialResults, NationalResults } from '/@/types';

const props = defineProps<{
  territorial: TerritorialResults;
  national: NationalResults;
}>();

const { message } = useI10n();
</script>
