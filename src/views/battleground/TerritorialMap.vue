<template>
  <section>
    <div ref="tooltip" class="tooltip">
      <VotesList
        v-if="props.lists && activeParrish"
        :name="message(`parrishes.${activeParrish}`)"
        :lists="props.lists[activeParrish]"
        :counting="props.countings[activeParrish]" />
    </div>
    <ParrishMap class="map" @hover="handleTooltip" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI10n } from '/@/composables';
import { ParrishMap, VotesList } from '/@/components';
import { isTie } from '/@/utils';
import type { List } from '/@/types';

type SvgEvent = {
  element: SVGElement;
  x: number;
  y: number;
};

const props = defineProps<{
  lists: Record<string, List[]>;
  countings: Record<string, number>;
}>();

const { message } = useI10n();

const colors = computed(() => {
  const UNASSIGNED_COLOR = '#f4f4f4';
  return Object.entries(props.lists).reduce((acc, [parrish, lists]) => {
    const winner = !isTie(lists.slice(0, 2)) && lists[0]?.votes ? lists[0] : undefined;
    acc[parrish] = winner?.color || UNASSIGNED_COLOR;
    return acc;
  }, {} as Record<string, string>);
});

const tooltip = ref<HTMLElement>();
const activeParrish = ref<string>();

const handleTooltip = (event: SvgEvent | undefined) => {
  if (!tooltip.value) return;
  if (event) {
    const { element, x, y } = event;
    [activeParrish.value] = element.classList;
    const { clientHeight } = document.documentElement;
    tooltip.value.style.display = 'block';
    tooltip.value.style.left = `${x}px`;
    tooltip.value.style.top = `${y}px`;
    tooltip.value.classList.toggle('up', y > clientHeight / 2);
  } else {
    activeParrish.value = undefined;
    tooltip.value.style.display = 'none';
  }
};
</script>

<style lang="scss">
.tooltip {
  position: fixed;
  pointer-events: none;
  transform: translate(-50%, 1rem);
  background: #fff;
  border: 1px solid #0002;
  padding: 0.5rem;
  max-width: 23rem;
  box-shadow: 0 0 1rem 0 #0001;
  display: none;

  &.up { transform: translate(-50%, calc(-100% - 1rem)); }
}

.map {
  display: block;
  max-width: min(80vw, 25rem);
  margin: 2rem auto;
  stroke: #ddd;
  fill: #f4f4f4;

  .CAN { fill: v-bind('colors.CAN'); }
  .ENC { fill: v-bind('colors.ENC'); }
  .ORD { fill: v-bind('colors.ORD'); }
  .LM { fill: v-bind('colors.LM'); }
  .ALV { fill: v-bind('colors.ALV'); }
  .SJL { fill: v-bind('colors.SJL'); }
  .EE { fill: v-bind('colors.EE'); }
}
</style>
