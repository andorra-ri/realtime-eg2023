import { ref } from 'vue';

export const useTimer = (target: string | number | Date, callback: () => void) => {
  const reached = ref(false);

  const delta = Math.max(new Date(target).getTime() - Date.now(), 1);

  setTimeout(() => {
    reached.value = true;
    callback();
  }, delta);
};
