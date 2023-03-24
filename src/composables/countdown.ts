export const useCountdown = (interval: number, callback: () => void) => {
  const countdown = (ms: number) => {
    callback();
    document.documentElement.style.setProperty('--duration', `${ms}ms`);
    setTimeout(() => countdown(ms), ms);
  };

  countdown(interval);
};
