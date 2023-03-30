<template>
  <ul class="nominees-list">
    <li
      v-for="nominee in nominees"
      :key="nominee.name"
      :data-tooltip="nominee.name"
      :style="`--color:${nominee.party.color}`">
      <img :src="nominee.photo || '/@/assets/avatar-placeholder.jpg'">
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Nominee } from '/@/types';

const props = defineProps<{
  nominees: Nominee[];
}>();

const nominees = computed(() => [...props.nominees].sort((a, b) => a.party.order - b.party.order));
</script>

<style lang="scss" scoped>
.nominees-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(4.5rem, 1fr));
  gap: 0.5rem 1.5rem;

  img {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    object-position: center top;
    border-radius: 0.25rem;
    border: 0.25rem solid var(--color);
  }
}
</style>
