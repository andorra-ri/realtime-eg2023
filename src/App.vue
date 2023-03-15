<template>
  <header class="container">
    <h1>{{ message('title') }}<em>{{ message('subtitle') }}</em></h1>
    <p class="note">{{ message('last_update', { time: formatDate(lastUpdate) }) }}</p>
  </header>

  <!-- Battleground -->
  <div class="container">
    <h2>{{ message('battlegrounds.title') }}</h2>
    <p>{{ message('battlegrounds.caption') }}</p>
    <Battleground :results="parrishResults.lists" />
  </div>

  <!-- Coalitions -->
  <div class="container">
    <h2>{{ message('coalitions.title') }}</h2>
    <p>{{ message('coalitions.caption') }}</p>
    <LeftRightSpectrum :nominees="nominees" />
    <CoalitionPlayer :nominees="nominees" />
  </div>
</template>

<script setup lang="ts">
import { useI10n, useResults } from '/@/composables';
import { Battleground, LeftRightSpectrum, CoalitionPlayer } from '/@/views';

const { message, formatDate } = useI10n();
const { parrishResults, nominees, lastUpdate } = useResults();
</script>
