<template>
  <div :class="['traffic-light', level]">
    <em class="traffic-light__level">
      {{ message(`confidence.${level || 'insufficient'}`) }}
    </em>
    <span class="traffic-light__dot traffic-light__dot--red" />
    <span class="traffic-light__dot traffic-light__dot--orange" />
    <span class="traffic-light__dot traffic-light__dot--green" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI10n } from '/@/composables';
import config from '/@/config.yaml';

const props = defineProps<{
  counting: number;
}>();

const { message } = useI10n();

const level = computed(() => {
  const levels = Object.keys(config.CONFIDENCE_LEVELS);
  return levels.find(key => props.counting > config.CONFIDENCE_LEVELS[key]);
});
</script>

<style lang="scss" scoped>
.traffic-light {
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &__level {
    font-size: 0.75rem;
    text-transform: uppercase;
    opacity: 0.5;
    margin: 0 0.25rem;
  }

  &__dot {
    height: 0.75rem;
    width: 0.75rem;
    background: #efefef;
    border-radius: 0.125rem;
  }

  &.weak &__dot--red { background: #cc3232; }
  &.consolidated &__dot--orange { background: #e7b416; }
  &.strong &__dot--green { background: #99c140; }
}
</style>
