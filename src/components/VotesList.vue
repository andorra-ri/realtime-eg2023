<template>
  <section>
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
import type { List } from '/@/types';

const props = defineProps<{
  name: string;
  lists: List[];
}>();

const { message } = useI10n();

const tie = computed(() => isTie(props.lists.slice(0, 2)));
const winnerMargin = computed(() => {
  const [first, second] = props.lists;
  return second ? first.votes - second.votes : 0;
});
</script>

<style lang="scss" scoped>
h3 {
  margin: 0.75rem;
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
    // color: #57cc99;
    background: #229664;
    color: #fff;
    font-size: 0.9rem;
    padding: 0.125rem 0.5rem 0.125rem 0.35rem;

    &.weak { background: #e8a042; }
    &.critic { background: #ef233c; }
  }
}
</style>
