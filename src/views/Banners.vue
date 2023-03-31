<template>
  <p v-if="showNotYet" class="banner info fixed">
    {{ message('banner.not_yet') }}
  </p>
  <p v-if="showNotEnough" class="banner info fixed bottom">
    {{ message('banner.not_enough') }}
  </p>
  <p v-if="showBigProblem" class="banner warning fixed bottom">
    {{ message('banner.big_problem') }}
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI10n } from '/@/composables';
import type { NationalResults, TerritorialResults, Nominee } from '/@/types';

const props = defineProps<{
  national: NationalResults;
  territorial: TerritorialResults;
  nominees: Nominee[];
}>();

const { message } = useI10n();

const PARRISH_COUNT = 7;
const NOMINEE_COUNT = 28;

const parrishCounts = computed(() => Object.values(props.territorial.countings).filter(Boolean));

const showNotYet = computed(() => !props.national.totalVotes && !parrishCounts.value.length);

const showNotEnough = computed(() => (
  !showNotYet.value && (!props.national.totalVotes || parrishCounts.value.length < PARRISH_COUNT)
));

const showBigProblem = computed(() => !showNotYet.value && props.nominees.length < NOMINEE_COUNT);
</script>
