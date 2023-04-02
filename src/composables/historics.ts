import { computed } from 'vue';
import { jsonService } from '/@/services';
import { useApi } from './api';
import type { Historic } from '/@/types';

export const useHistorics = () => {
  const { items, loading } = useApi<Historic[]>(jsonService.getHistorics, []);

  const nulls = computed(() => items.value.filter(({ type }) => type === 'NULL'));
  const blanks = computed(() => items.value.filter(({ type }) => type === 'BLANK'));
  const abstention = computed(() => items.value.filter(({ type }) => type === 'ABSTENTION'));

  return { nulls, blanks, abstention, loading };
};
