import { ref, computed, onMounted } from 'vue';
import { indexate } from '/@/utils';

export const useApi = <T extends { id: string }>(getter: () => Promise<T[]>) => {
  const ITEMS = ref<Record<string, T>>({});
  const loading = ref<boolean>(false);

  const items = computed(() => Object.values(ITEMS.value));

  const getItem = (id: string) => ITEMS.value[id];

  const loadItems = async () => {
    loading.value = true;
    const result = await getter();
    ITEMS.value = indexate(result, 'id');
    loading.value = false;
  };

  onMounted(loadItems);

  return { items, loadItems, getItem, loading };
};
