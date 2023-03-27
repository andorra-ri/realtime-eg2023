import { apiService } from '/@/services';
import { useApi } from './api';
import type { List } from '/@/types';

export const useLists = () => {
  const {
    items: lists,
    loadItems: loadLists,
    loading,
  } = useApi<List[]>(apiService.getLists, []);

  const getList = (id: string) => lists.value.find(list => list.id === id);

  return { lists, loadLists, getList, loading };
};
