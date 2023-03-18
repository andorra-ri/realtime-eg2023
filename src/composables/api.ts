import { shallowRef, ref, onMounted } from 'vue';

export const useApi = <T>(getter: () => Promise<T>, initial: T) => {
  const items = shallowRef<T>(initial);
  const loading = ref<boolean>(false);

  const loadItems = async () => {
    loading.value = true;
    items.value = await getter();
    loading.value = false;
  };

  onMounted(loadItems);

  return { items, loadItems, loading };
};
