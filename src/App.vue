<template>
  <header class="container">
    <h1>{{ message('title') }}<em>{{ message('subtitle') }}</em></h1>
    <p class="note">{{ message('last_update', { time: formatDate(lastUpdate) }) }}</p>
  </header>
  <Battleground :results="parrishResults" />
  <Coalitions :nominees="nominees" />
  <Historics :current="nationalResults" />
</template>

<script setup lang="ts">
import { useI10n, useResults } from '/@/composables';
import { Battleground, Coalitions, Historics } from '/@/views';

const { message, formatDate } = useI10n();
const { nationalResults, parrishResults, nominees, lastUpdate } = useResults();
</script>
