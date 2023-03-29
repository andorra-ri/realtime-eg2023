import { computed } from 'vue';
import { apiService } from '/@/services';
import { groupBy, sum, max, isTie } from '/@/utils';
import { useApi } from './api';
import { useLists } from './lists';
import type { Results, List, TerritorialResults, NationalResults } from '/@/types';

const NATIONAL_SEATS = 14;

const assignVacantSeats = (lists: (List & { reminder: number })[]) => {
  const vacants = NATIONAL_SEATS - sum(lists.map(list => list.seats));

  // Group by votes to find tied lists
  const listsByVotes = [...groupBy(lists, 'votes').values()];

  // Second assignation of seats based on reminder
  // Only parties that have seats and reminder are candidates
  // Assignation may fail on tied parties and will be corrected
  const seatsAddition = lists
    .filter(list => list.seats > 0 && list.reminder > 0)
    .sort((a, b) => b.reminder - a.reminder || b.votes - a.votes)
    .reduce((acc, list, i, { length }) => {
      acc[list.id] ??= 0;
      acc[list.id] += Math.floor(vacants / length) + Number(i < vacants % length);
      return acc;
    }, {} as Record<string, number>);

  // Correct seat additions to prevent uneven seat distribution on tied lists
  return listsByVotes.reduce((acc, group) => {
    const seats = group.reduce((min, list) => Math.min(min, seatsAddition[list.id] || 0), Infinity);
    group.forEach(list => { acc[list.id] = seats; });
    return acc;
  }, {} as Record<string, number>);
};

export const useResults = () => {
  const { getList } = useLists();

  const {
    items: results,
    loadItems: updateResults,
    loading,
  } = useApi<Results[]>(apiService.getResults, []);

  const parrishResults = computed<TerritorialResults>(() => {
    const parrishes = results.value.filter(result => result.district !== 'NACIONAL');

    const lists = parrishes
      .reduce((acc, result) => {
        acc[result.district] = result.lists
          .map(({ listId, votes }) => {
            const list = getList(listId);
            return list && { ...list, votes };
          })
          .filter(Boolean) // Safely cast after filtering
          .sort((a, b) => b!.votes - a!.votes) as List[];
        return acc;
      }, {} as Record<string, List[]>);

    // Nominees from first list if it's not tied with second
    const nominees = Object.values(lists)
      .flatMap(_lists => (isTie(_lists.slice(0, 2)) ? [] : _lists[0]?.nominees))
      .filter(Boolean);

    const countings = parrishes.reduce((acc, result) => {
      const { valids, blanks, nulls, participation } = result;
      acc[result.district] = ((valids + blanks + nulls) / participation) || 0;
      return acc;
    }, {} as Record<string, number>);

    const nulls = sum(parrishes.map(result => result.nulls));
    const blanks = sum(parrishes.map(result => result.blanks));
    const abstention = sum(parrishes.map(result => result.abstention));

    return { lists, nominees, blanks, nulls, abstention, countings };
  });

  const nationalResults = computed<NationalResults>(() => {
    const result = results.value.find(({ district }) => district === 'NACIONAL');
    const { lists = [] } = result || {};

    const totalVotes = sum(lists.map(list => list.votes));
    const qe = Math.ceil(totalVotes / NATIONAL_SEATS);

    // First assignation of seats and reminder for each party
    const firstAssignation = lists.map(({ listId, votes }) => {
      const seats = Math.floor(votes / qe);
      const reminder = votes - (qe * seats);
      const list = getList(listId);
      return list && { ...list, votes, seats, reminder };
    }).filter(Boolean) as (List & { reminder: number })[]; // Safely cast after filtering

    const seatsAssignation = assignVacantSeats(firstAssignation);

    const secondAssignation = firstAssignation.map(list => {
      const seats = seatsAssignation[list.id] || 0;
      return { ...list, seats: list.seats + seats };
    });

    const nominees = secondAssignation.flatMap(list => list.nominees.slice(0, list.seats) || []);

    return { ...result, lists: secondAssignation, nominees, totalVotes, qe };
  });

  const nominees = computed(() => [
    ...nationalResults.value.nominees,
    ...parrishResults.value.nominees,
  ]);

  const lastUpdate = computed(() => {
    const dates = results.value.map(result => new Date(result.lastModified).getTime());
    return dates && new Date(max(dates));
  });

  return { parrishResults, nationalResults, nominees, lastUpdate, loading, updateResults };
};
