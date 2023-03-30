import { shallowRef, ref, onMounted } from 'vue';
import { showError } from '/@/plugins/toasts';
import { useI10n } from '/@/composables';

export const useApi = <T>(getter: () => Promise<T>, initial: T) => {
  const items = shallowRef<T>(initial);
  const loading = ref<boolean>(false);

  const { message } = useI10n();

  const loadItems = async () => {
    try {
      loading.value = true;
      items.value = await getter();
    } catch (e) {
      const error = e as Error;
      showError(message(`errors.${error.message}`));
    } finally {
      loading.value = false;
    }
  };

  onMounted(loadItems);

  return { items, loadItems, loading };
};
