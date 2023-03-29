<template>
  <div class="container">
    <h2>{{ message('coalitions.title') }}</h2>
    <p>{{ message('coalitions.caption1') }}</p>
    <p>{{ message('coalitions.caption2') }}</p>
    <p class="note">{{ message('coalitions.instructions') }}</p>
    <LeftRightSpectrum :nominees="props.nominees" />
    <CoalitionPlayer :nominees="props.nominees" />
  </div>
</template>

<script setup lang="ts">
import { useI10n } from '/@/composables';
import LeftRightSpectrum from './LeftRightSpectrum.vue';
import CoalitionPlayer from './CoalitionPlayer.vue';
import type { Nominee } from '/@/types';

const props = defineProps<{
  nominees: Nominee[];
}>();

const { message } = useI10n();
</script>
