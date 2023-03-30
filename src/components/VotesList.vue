<template>
  <section>
    <div class="counting">
      <div class="percent" :style="`--counting:${props.counting}`">
        {{ message('counted') }} <strong>{{ Math.round(props.counting * 100) }}%</strong>
      </div>
      <ConfidenceTrafficLight :counting="props.counting" />
    </div>
    <h3>{{ name }}</h3>
    <table class="rank" :class="{ tie }">
      <thead>
        <tr>
          <th>{{ message('list') }}</th>
          <th>{{ message('votes') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="list, i in props.lists" :key="list.name">
          <td>{{ list.name }}</td>
          <td>{{ list.votes }}</td>
          <td v-if="!tie && i === 0 && !!winnerMargin">
            <strong
              :class="['margin', {
                weak: winnerMargin < 100,
                critic: winnerMargin < 25,
              }]">
              +{{ winnerMargin }}
            </strong>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI10n } from '/@/composables';
import { isTie } from '/@/utils';
import ConfidenceTrafficLight from './ConfidenceTrafficLight.vue';
import type { List } from '/@/types';

const props = defineProps<{
  name: string;
  lists: List[];
  counting: number;
}>();

const { message } = useI10n();

const tie = computed(() => isTie((props.lists || []).slice(0, 2)));
const winnerMargin = computed(() => {
  const [first, second] = props.lists || [];
  return first && second ? first.votes - second.votes : 0;
});
</script>

<style lang="scss" scoped>
.counting {
  display: flex;
  text-align: left;
  margin: 0.5rem;

  .percent {
    font-size: 0.8rem;
    margin-right: auto;
  }
}

h3 {
  margin: 1rem 0.75rem;
  text-align: left;
}

.rank {
  margin: 0.5rem;
  border-collapse: collapse;

  th {
    font-size: 0.75rem;
    opacity: 0.4;
    text-transform: uppercase;
    text-align: left;
    padding: 0.25rem;
  }

  tbody tr { border-top: 1px solid #8883; }

  td {
    padding: 0.5rem 0.25rem;
    opacity: 0.75;
    vertical-align: middle;
  }

  &:not(.tie) tbody tr:first-child td {
    opacity: 1;
    font-weight: bold;
  }

  .margin {
    background: #99c140;
    color: #fff;
    font-size: 0.9rem;
    padding: 0.125rem 0.5rem 0.125rem 0.35rem;

    &.weak { background: #e7b416; }
    &.critic { background: #cc3232; }
  }
}
</style>
