import { computed } from 'vue';
import service from '/@/services/elections.json';
import { groupBy } from '/@/utils';
import { useApi } from './api';
import type { Party } from '/@/types';

export const useParties = () => {
  const {
    items: parties,
    loadItems: loadParties,
    loading,
  } = useApi<Party[]>(service.getParties, []);

  const getParty = (id: string) => parties.value.find(party => party.id === id);

  const coalitions = computed(() => groupBy(
    parties.value,
    party => getParty(party.coalitionLeaderId || party.id),
  ));

  return { parties, coalitions, loadParties, getParty, loading };
};
