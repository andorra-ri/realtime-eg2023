<template>
  <div class="expander">
    <div class="toggler" @click="toggle">
      <img src="/@/assets/info.svg">
      {{ props.toggler }}
    </div>
    <p v-if="expanded" class="note"><slot /></p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  toggler: string;
}>();

const expanded = ref(false);

const toggle = () => {
  expanded.value = !expanded.value;
};
</script>

<style lang="scss">
.expander {
  .toggler {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    gap: 0.5rem;
    font-weight: bold;
    opacity: 0.75;
    text-align: center;
  }
}
</style>
