<template>
  <table class="national-table">
    <tbody>
      <tr v-for="list in lists" :key="list.id" class="list">
        <td class="list__name">{{ list.name }}</td>
        <td class="list__seats"><em>{{ list.seats }}</em><i>{{ message('seats') }}</i></td>
        <td class="list__votes"><em>{{ list.votes }}</em><i>{{ message('votes') }}</i></td>
        <td v-if="extended" class="list__votes-seat">
          <em>{{ list.seatsByVotes }}</em><i>{{ message('seats_by_votes') }}</i>
        </td>
        <td class="list__reminder">
          <template v-if="list.seats">
            <em :class="{ benefit: !!list.seatsByReminder }">{{ list.reminder }}</em>
            <i>{{ message('reminder') }}</i>
          </template>
          <template v-else>
            <em class="handicap">{{ list.votes - props.results.qe }}</em>
            <I10n tag="i" path="until_seat"><template #br><br></template></I10n>
          </template>
        </td>
        <td v-if="extended" class="list__votes-reminder">
          <span v-if="list.seats">
            <em :class="{ benefit: list.seatsByReminder }">
              {{ withSymbol(list.seatsByReminder) }}
            </em>
            <i>{{ message('seats_by_reminder') }}</i>
          </span>
        </td>
      </tr>
    </tbody>
    <caption>
      <label class="extend">
        <input v-model="extended" type="checkbox">
        {{ message(extended ? 'less' : 'more') }}
      </label>
    </caption>
  </table>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI10n } from '/@/composables';
import type { NationalResults } from '/@/types';

const props = defineProps<{
  results: NationalResults;
}>();

const { message, I10n } = useI10n();

const lists = computed(() => [...props.results.lists]
  .sort((a, b) => b.votes - a.votes)
  .map(list => {
    const seatsByVotes = Math.floor(list.votes / props.results.qe);
    const seatsByReminder = list.seats - seatsByVotes;
    return { ...list, seatsByVotes, seatsByReminder };
  }));

const withSymbol = (value: number) => {
  const formatter = new Intl.NumberFormat('ca', { signDisplay: 'exceptZero' });
  return formatter.format(value);
};

const extended = ref(false);
</script>

<style lang="scss" scoped>
.national-table {
  margin: 2rem auto 0;
  border: 1px solid #0001;

  caption {
    caption-side: bottom;
    text-align: right;
    padding: 0.5rem;
  }

  .extend {
    cursor: pointer;
    font-weight: bold;

    input { display: none; }
  }
}

.list {
  & + & { border-top: 1px solid #0001; }

  td {
    padding: 0.5rem 1rem;
    text-align: center;
    line-height: 1.1;
    vertical-align: middle;
    background: #fafafa;

    em {
      display: block;
      font-weight: bold;
      font-size: 1.25rem;
    }

    i {
      display: block;
      font-size: 0.6rem;
      text-transform: uppercase;
    }
  }

  &__name {
    background: #fff !important;
    text-align: left !important;
  }

  // stylelint-disable no-descending-specificity
  &__seats {
   border-right: 1px solid #0001;
   background: #fff !important;

    em { font-size: 1.5rem !important; }
  }

  &__reminder em,
  &__votes-reminder em { font-weight: normal !important; }

  .benefit { color: #68a704; }
  .handicap { color: #c1121f; }
}
</style>
