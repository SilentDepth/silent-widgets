<script setup vapor lang="ts">
defineProps<{ modelValue: string | number }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <select
    class="min-h-9 w-full min-w-0 rounded-[5px] border border-(--ui-line) bg-(--ui-canvas) py-1.5 pr-7 pl-2.25 text-(--ui-text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ui-accent)"
    :value="modelValue"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <slot />
  </select>
</template>
