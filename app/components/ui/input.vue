<script setup vapor lang="ts">
withDefaults(defineProps<{ modelValue?: string | number | boolean; type?: string }>(), {
  type: 'text',
  modelValue: '',
})
const emit = defineEmits<{ 'update:modelValue': [value: string | boolean] }>()
function update(event: Event) {
  const input = event.target as HTMLInputElement
  emit('update:modelValue', input.type === 'checkbox' ? input.checked : input.value)
}
</script>

<template>
  <input
    class="min-w-0 rounded-[5px] border border-(--ui-line) bg-(--ui-canvas) text-(--ui-text) placeholder:text-(--ui-muted) placeholder:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ui-accent) aria-invalid:border-(--ui-error)"
    :class="
      type === 'checkbox'
        ? 'min-h-4.5 w-4.5 cursor-pointer px-2.25 py-1.5 accent-(--ui-accent)'
        : type === 'color'
          ? 'min-h-9 w-9 flex-none basis-9 cursor-pointer p-0.75'
          : 'min-h-9 w-full px-2.25 py-1.5'
    "
    :type="type"
    :value="modelValue"
    :checked="type === 'checkbox' ? Boolean(modelValue) : undefined"
    @input="update"
  />
</template>
