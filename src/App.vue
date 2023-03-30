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
</template>

<script setup lang="ts">
import { useI10n, useResults, useCountdown } from '/@/composables';
import { SuperTrafficLight } from '/@/components';
import { ParliamentArc, Battleground, Coalitions, MainParties, NewParties, NonValidVotes } from '/@/views';
import config from '/@/config.yaml';

const { message, formatDate } = useI10n();
const { nationalResults, parrishResults, nominees, updateResults, lastUpdate } = useResults();

// useCountdown(config.TIMEOUT, updateResults);
</script>
