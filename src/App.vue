<template>
  <header class="container">
    <h1>{{ message('title') }}<em>{{ message('subtitle') }}</em></h1>
    <p class="note">{{ message('last_update', { time: formatDate(lastUpdate) }) }}</p>
  </header>

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
import { LeftRightSpectrum, CoalitionPlayer } from '/@/views';

const { message, formatDate } = useI10n();
const { nominees, lastUpdate } = useResults();
</script>
