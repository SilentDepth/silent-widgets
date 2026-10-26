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
    class="ui-input"
    :type="type"
    :value="modelValue"
    :checked="type === 'checkbox' ? Boolean(modelValue) : undefined"
    @input="update"
  />
</template>

<style scoped>
.ui-input {
  min-width: 0;
  width: 100%;
  min-height: 36px;
  padding: 6px 9px;
  border: 1px solid var(--ui-line);
  border-radius: 5px;
  color: var(--ui-text);
  background: var(--ui-canvas);
  font: inherit;
  &[type='checkbox'] {
    width: 18px;
    min-height: 18px;
    accent-color: var(--ui-accent);
    cursor: pointer;
  }
  &[type='color'] {
    flex: 0 0 36px;
    width: 36px;
    padding: 3px;
    cursor: pointer;
  }
  &[aria-invalid='true'] {
    border-color: var(--ui-error);
  }
  &:focus-visible {
    outline: 2px solid var(--ui-accent);
    outline-offset: 2px;
  }
  &::placeholder {
    color: var(--ui-muted);
    opacity: 1;
  }
}
</style>
