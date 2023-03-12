import service from '/@/services/elections.json';
import { useApi } from './api';
import type { List } from '/@/types';

export const useLists = () => {
  const {
    items: lists,
    loadItems: loadLists,
    getItem: getList,
    loading,
  } = useApi<List>(service.getLists);

  return { lists, loadLists, getList, loading };
};
