<template>
  <header class="container header">
    <h1>{{ message('title') }}<em>{{ message('subtitle') }}</em></h1>
    <p>{{ message('caption') }}</p>
    <div class="confidence">
      <p class="note">{{ message('confidence.title') }}</p>
      <SuperTrafficLight
        :national="nationalResults"
        :territorial="parrishResults" />
    </div>
    <p class="note">{{ message('last_update', { time: formatDate(lastUpdate) }) }}</p>
  </header>
  <Parliament
    :nominees="nominees"
    :lists="nationalResults.lists" />
  <Battleground
    :territorial="parrishResults"
    :national="nationalResults" />
  <Coalitions :nominees="nominees" />
  <MainParties :results="nationalResults" />
  <NewParties :results="nationalResults" />
  <NonValidVotes :results="nationalResults" />
  <section class="container">
    <p>{{ message('closure') }}</p>
  </section>
  <footer class="footer">
    <p class="logo"><img src="/@/assets/logo-ari-ca.png"></p>
    <p class="note">{{ message('credits.data') }}</p>
    <p class="note">{{ message('credits.analysis') }} <a href="https://ari.ad/projectes/eg2023" target="blank">https://ari.ad/projectes/eg2023</a></p>
    <p class="note">{{ message('disclaimer') }} <a href="https://www.eleccions.ad" target="blank">https://www.eleccions.ad</a></p>
    <p>2023 &copy; Andorra Recerca + Innovació</p>
  </footer>
  <ToastCenter />
  <p v-if="showNotYetBanner" class="banner info fixed">{{ message('banner.not_yet') }}</p>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI10n, useResults, useCountdown, useTimer } from '/@/composables';
import { SuperTrafficLight } from '/@/components';
import { Parliament, Battleground, Coalitions, MainParties, NewParties, NonValidVotes } from '/@/views';
import config from '/@/config.yaml';

const { message, formatDate } = useI10n();
const { nationalResults, parrishResults, nominees, updateResults, lastUpdate } = useResults();

const showNotYetBanner = computed(() => {
  const parrishCounting = Object.values(parrishResults.value.countings).filter(Boolean).length;
  const nationalCounting = nationalResults.value.totalVotes;
  return !nationalCounting && !parrishCounting;
});

useTimer(config.START_TIME, () => {
  useCountdown(config.TIMEOUT, updateResults);
});
</script>
