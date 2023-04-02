<template>
  <section class="container">
    <h2>{{ message('analysis.title') }}</h2>
    <p>{{ message('analysis.caption') }}</p>
    <div class="bubbles">
      <article v-for="bubble in bubbles" :key="bubble.name">
        <VotesBubble
          :color="bubble.color"
          :current="bubble.current"
          :reference="bubble.reference"
          :max="maxVotes"
          class="bubbles__bubble" />
        <em class="bubbles__name">{{ bubble.name }}</em>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI10n } from '/@/composables';
import { VotesBubble } from '/@/components';
import type { NationalResults } from '/@/types';

const props = defineProps<{
  results: NationalResults;
}>();

const OLD_VOTES: Record<string, number> = {
  recJeO0Mu4TSk8SPf: 6860, // DA
  recX9CRRFH9yLkBFR: 7083, // PS + SDP
};

const { message } = useI10n();

const bubbles = computed(() => {
  const { lists } = props.results;
  return [...lists]
    .sort((a, b) => a.order - b.order)
    .map(({ id, name, votes, parties: [{ color }] }) => {
      const current = votes || 0;
      const reference = OLD_VOTES[id] || 0;
      return { id, name, color, current, reference };
    })
    .filter(bubble => bubble.reference);
});

const maxVotes = computed(() => Math.max(
  ...Object.values(OLD_VOTES),
  ...bubbles.value.map(bubble => bubble.current),
));
</script>

<style lang="scss" scoped>
.bubbles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4rem;
  margin: 4rem 0;
  text-align: center;

  article {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  &__bubble { margin: auto 0; }

  &__name {
    margin-top: 1.5rem;
    color: #888;
    max-width: 13rem;
  }
}
</style>
