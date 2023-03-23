<template>
  <section class="container">
    <h3>{{ message('coalitions.play.title') }}</h3>
    <p class="note">{{ message('coalitions.play.caption') }}</p>
    <SeatsStackBar :nominees="nominees" :grouper="grouper" />
    <fieldset class="coalitions">
      <label v-for="[leaderId, parties] in coalitions" :key="leaderId">
        <input v-model="customCoalition" :value="leaderId" type="checkbox">
        <span class="parties">
          <img v-for="party in parties" :key="party.id" :src="party.logo">
        </span>
      </label>
    </fieldset>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI10n } from '/@/composables';
import { SeatsStackBar } from '/@/components';
import type { Nominee } from '/@/types';
import { groupBy } from '/@/utils';

const props = defineProps<{
  nominees: Nominee[];
}>();

const { message } = useI10n();

const grouper = (nominee: Nominee) => nominee.party.coalitionLeaderId || nominee.party.id;

const coalitions = computed(() => {
  const parties = [...new Set(props.nominees.map(nominee => nominee.party))];
  return groupBy(parties, party => party.coalitionLeaderId || party.id);
});

const customCoalition = ref<string[]>([]);

const nominees = computed(() => {
  const inCoalition = (nominee: Nominee) => customCoalition.value.includes(grouper(nominee));
  return props.nominees.filter(inCoalition);
});
</script>

<style lang="scss" scoped>
.coalitions {
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
  }
}

.parties {
  display: flex;
  gap: 0.5rem;
  filter: grayscale(1) opacity(0.5);
  transition: all 0.3s ease;
  cursor: pointer;

  :hover > &,
  :checked ~ & {
    filter: none;
    transform: scale(1.1);
  }
}
</style>
