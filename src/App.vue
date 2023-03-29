<template>
  <header class="container">
    <h1>{{ message('title') }}<em>{{ message('subtitle') }}</em></h1>
    <p>{{ message('caption') }}</p>
    <p class="note">{{ message('last_update', { time: formatDate(lastUpdate) }) }}</p>
  </header>
  <h2>{{ message('arc.title') }}</h2>
  <ParliamentArc
    :nominees="nominees"
    :lists="nationalResults.lists" />
  <Battleground
    :territorial="parrishResults"
    :national="nationalResults" />
  <Coalitions :nominees="nominees" />
  <MainParties :results="nationalResults" />
  <NewParties :results="nationalResults" />
  <NonValidVotes :results="nationalResults" />
</template>

<script setup lang="ts">
import { useI10n, useResults, useCountdown } from '/@/composables';
import { ParliamentArc, Battleground, Coalitions, MainParties, NewParties, NonValidVotes } from '/@/views';
import config from '/@/config.yaml';

const { message, formatDate } = useI10n();
const { nationalResults, parrishResults, nominees, updateResults, lastUpdate } = useResults();

// useCountdown(config.TIMEOUT, updateResults);
</script>
