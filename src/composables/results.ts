import { computed } from 'vue';
import service from '/@/services/elections.json';
import { groupBy, sum, isTie } from '/@/utils';
import { useApi } from './api';
import { useLists } from './lists';
import type { Results, List } from '/@/types';

const NATIONAL_SEATS = 14;

const assignVacantSeats = (lists: (List & { reminder: number })[]) => {
  const vacants = NATIONAL_SEATS - sum(lists, 'seats');

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
  const {
    items: results,
    loadItems: updateResults,
    loading,
  } = useApi<Results>(service.getResults);

  const { getList } = useLists();

  const parrishResults = computed(() => {
    const lists = results.value
      .filter(result => result.district !== 'NACIONAL')
      .reduce((acc, result) => {
        acc[result.district] = result.lists
          .map(({ listId, votes }) => ({ ...getList(listId), votes }))
          .sort((a, b) => b.votes - a.votes);
        return acc;
      }, {} as Record<string, List[]>);

    // Nominees from first list if it's not tied with second
    const nominees = Object.values(lists)
      .flatMap(_lists => (isTie(_lists.slice(0, 2)) ? [] : _lists[0].nominees))
      .filter(Boolean);

    return { lists, nominees };
  });

  const nationalResults = computed(() => {
    const result = results.value.find(({ district }) => district === 'NACIONAL');
    const lists = result?.lists || [];

    const totalVotes = sum(lists, 'votes');
    const qe = Math.ceil(totalVotes / NATIONAL_SEATS);

    // First assignation of seats and reminder for each party
    const firstAssignation = lists.map(({ listId, votes }) => {
      const seats = Math.floor(votes / qe);
      const reminder = votes - (qe * seats);
      return { ...getList(listId), votes, seats, reminder };
    });

    const seatsAssignation = assignVacantSeats(firstAssignation);

    const secondAssignation = firstAssignation.map(list => {
      const seats = seatsAssignation[list.id] || 0;
      return { ...list, seats: list.seats + seats };
    });

    const nominees = secondAssignation.flatMap(list => list.nominees?.slice(0, list.seats) || []);

    return { lists: secondAssignation, nominees, totalVotes, qe };
  });

  const nominees = computed(() => [
    ...nationalResults.value.nominees,
    ...parrishResults.value.nominees,
  ]);

  const lastUpdate = computed(() => {
    const dates = results.value.map(result => new Date(result.lastModified).getTime());
    return new Date(Math.max(...dates));
  });

  return { parrishResults, nationalResults, nominees, lastUpdate, loading, updateResults };
};
