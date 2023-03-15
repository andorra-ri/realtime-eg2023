<template>
  <header class="container">
    <h1>{{ message('title') }}<em>{{ message('subtitle') }}</em></h1>
    <p class="note">{{ message('last_update', { time: formatDate(lastUpdate) }) }}</p>
  </header>
</template>

<script setup lang="ts">
import { useI10n, useResults } from '/@/composables';

const { message, formatDate } = useI10n();
const { lastUpdate } = useResults();
</script>
