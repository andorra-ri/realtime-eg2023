<template>
  <section class="container">
    <h3>{{ message('coalitions.play.title') }}</h3>
    <p class="note">{{ message('coalitions.play.caption') }}</p>
    <SeatsStackBar :nominees="nominees" />
    <fieldset class="parties">
      <label v-for="party in parties" :key="party.name">
        <input v-model="coalition" :value="party" type="checkbox">
        <img :src="party.logo">
      </label>
    </fieldset>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI10n } from '/@/composables';
import { SeatsStackBar } from '/@/components';
import type { Nominee, Party } from '/@/types';

const props = defineProps<{
  nominees: Nominee[];
}>();

const { message } = useI10n();

const parties = computed(() => [...new Set(props.nominees.map(nominee => nominee.party))]);

const coalition = ref<Party[]>([]);
const nominees = computed(() => (
  props.nominees.filter(nominee => coalition.value.includes(nominee.party))
));
</script>

<style lang="scss" scoped>
.parties {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem 3rem;
  text-align: center;
  margin: auto;
  max-width: min(90%, 40rem);

  input { display: none; }

  img {
    display: block;
    margin: 0.25rem auto;
    max-height: 1.25rem;
    max-width: 6rem;
    filter: grayscale(1) opacity(0.5);
    transition: all 0.3s ease;
    cursor: pointer;
  }

  :hover > img,
  :checked + img {
    filter: none;
    transform: scale(1.2);
  }
}
</style>
