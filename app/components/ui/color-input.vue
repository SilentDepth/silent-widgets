<script setup vapor lang="ts">
import { useSiteI18n } from '@/composables/use-site-i18n'

const props = defineProps<{
  id: string
  modelValue: string
  label: string
  describedby?: string
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const { t } = useSiteI18n()
const hex = computed(() => {
  const value = props.modelValue.trim()
  if (!/^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(value)) return
  const expanded =
    value.length <= 5
      ? value
          .slice(1)
          .split('')
          .map(char => char + char)
          .join('')
      : value.slice(1)
  return { rgb: `#${expanded.slice(0, 6)}`, alpha: expanded.slice(6) }
})
const opacity = computed(() =>
  hex.value ? Math.round((parseInt(hex.value.alpha || 'ff', 16) / 255) * 100) : '',
)

function setColor(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value + (hex.value?.alpha ?? ''))
}
function setOpacity(event: Event) {
  const input = event.target as HTMLInputElement
  if (!hex.value || !input.value || !input.validity.valid) return
  const alpha = Math.round((input.valueAsNumber / 100) * 255)
    .toString(16)
    .padStart(2, '0')
  emit('update:modelValue', hex.value.rgb + (alpha === 'ff' ? '' : alpha))
}
</script>

<template>
  <div
    class="flex h-9 min-w-0 items-center gap-1 rounded-[5px] border px-1.5 focus-within:border-(--ui-accent)"
    :class="[
      disabled ? 'bg-(--ui-surface)' : 'bg-(--ui-canvas)',
      invalid ? 'border-(--ui-error)' : 'border-(--ui-line)',
    ]"
  >
    <span
      class="color-swatch relative size-5 shrink-0 rounded-[3px] border border-black/15 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-(--ui-accent) dark:border-white/25"
    >
      <span
        class="pointer-events-none absolute inset-0 rounded-[2px]"
        :style="{ backgroundColor: modelValue || 'transparent' }"
      />
      <input
        type="color"
        class="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        :value="hex?.rgb ?? '#37352f'"
        :disabled="disabled"
        :aria-label="t('field.colorPicker', { label })"
        :aria-describedby="describedby"
        @input="setColor"
      />
    </span>
    <input
      :id="id"
      type="text"
      class="size-full min-w-0 bg-transparent font-mono text-[11px] text-(--ui-text) placeholder:font-sans placeholder:text-(--ui-muted) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ui-accent) disabled:cursor-not-allowed disabled:text-(--ui-muted)"
      :value="modelValue"
      :disabled="disabled"
      :placeholder="placeholder"
      :aria-label="label"
      :aria-describedby="describedby"
      :aria-invalid="invalid"
      spellcheck="false"
      autocomplete="off"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span
      class="flex shrink-0 items-center border-l border-(--ui-line) pl-1 text-[11px] text-(--ui-muted)"
    >
      <input
        type="number"
        class="color-opacity w-[3ch] min-w-0 bg-transparent text-right font-mono focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ui-accent) disabled:cursor-not-allowed"
        min="0"
        max="100"
        step="1"
        inputmode="numeric"
        :value="opacity"
        :disabled="disabled || !hex"
        :aria-label="t('field.opacity', { label })"
        :aria-describedby="describedby"
        @input="setOpacity"
      />
      <span aria-hidden="true">%</span>
    </span>
  </div>
</template>

<style scoped>
.color-swatch {
  background: repeating-conic-gradient(#fff 0% 25%, #ccc 0% 50%) 0 0 / 8px 8px;
}
.color-opacity {
  appearance: textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
  }
}
</style>
