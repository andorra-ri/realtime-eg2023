<template>
  <header class="container">
    <h1>{{ message('title') }}<em>{{ message('subtitle') }}</em></h1>
    <p class="note">{{ message('last_update', { time: formatDate(lastUpdate) }) }}</p>
  </header>
  <ParliamentArc
    :nominees="nominees"
    :lists="nationalResults.lists" />
  <Battleground :territorial="parrishResults" />
  <Coalitions :nominees="nominees" />
  <Historics :current="nationalResults" />
</template>

<script setup lang="ts">
import { useI10n, useResults, useCountdown } from '/@/composables';
import { ParliamentArc, Battleground, Coalitions, Historics } from '/@/views';
import config from '/@/config.yaml';

const { message, formatDate } = useI10n();
const { nationalResults, parrishResults, nominees, updateResults, lastUpdate } = useResults();

// useCountdown(config.TIMEOUT, updateResults);
</script>
