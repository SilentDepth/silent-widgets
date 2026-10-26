<script setup vapor lang="ts">
defineProps<{ modelValue: string | number }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
function update(event: Event) {
  emit('update:modelValue', (event.target as HTMLSelectElement).value)
}
</script>

<template>
  <select class="ui-select" :value="modelValue" @change="update">
    <slot />
  </select>
</template>

<style scoped>
.ui-select {
  width: 100%;
  min-width: 0;
  min-height: 36px;
  padding: 6px 28px 6px 9px;
  border: 1px solid var(--ui-line);
  border-radius: 5px;
  color: var(--ui-text);
  background: var(--ui-canvas);
  font: inherit;
  &:focus-visible {
    outline: 2px solid var(--ui-accent);
    outline-offset: 2px;
  }
}
</style>
