<script setup vapor lang="ts">
import type { WidgetParam } from '@/types/widget'
import { splitColors } from '@/utils/widget-params'
import UiInput from './ui/input.vue'
import UiSelect from './ui/select.vue'

const props = defineProps<{
  name: string
  definition: WidgetParam
  modelValue: string
  error?: string
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const colors = computed(() => splitColors(props.modelValue))
const hasDark = computed(() => Boolean(colors.value[1]))
const id = computed(() => `param-${props.name}`)
const descriptionId = computed(
  () => `${id.value}-description${props.error ? ` ${id.value}-error` : ''}`,
)
function update(value: string | boolean) {
  emit('update:modelValue', String(value))
}
function setColor(index: number, value: string | boolean) {
  const next = [...colors.value]
  next[index] = String(value)
  emit('update:modelValue', next.join(','))
}
function toggleDark(inherit: string | boolean) {
  emit(
    'update:modelValue',
    inherit ? colors.value[0] : `${colors.value[0]},${colors.value[0] || '#ffffff'}`,
  )
}
function pickerColor(value = '') {
  if (/^#[\da-f]{6}([\da-f]{2})?$/i.test(value)) return value.slice(0, 7)
  if (/^#[\da-f]{3,4}$/i.test(value)) {
    return `#${value
      .slice(1, 4)
      .split('')
      .map(char => char + char)
      .join('')}`
  }
  return '#37352f'
}
</script>

<template>
  <div class="param-field">
    <div class="field-heading">
      <label :for="id">{{ definition.label }}</label>
      <code>{{ name }}</code>
    </div>
    <p :id="`${id}-description`" class="description">{{ definition.description }}</p>
    <div class="field-control">
      <UiInput
        v-if="definition.type === 'boolean'"
        :id="id"
        type="checkbox"
        :model-value="modelValue === 'true' || modelValue === ''"
        :aria-describedby="descriptionId"
        @update:model-value="update"
      />
      <UiSelect
        v-else-if="
          definition.type === 'locale' || (definition.type === 'integer' && definition.options)
        "
        :id="id"
        :model-value="modelValue"
        :aria-describedby="descriptionId"
        :aria-invalid="Boolean(error)"
        @update:model-value="update"
      >
        <option v-for="option of definition.options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </UiSelect>
      <template v-else-if="definition.type === 'color'">
        <div class="color-input">
          <UiInput
            type="color"
            :aria-label="`${definition.label}浅色色板`"
            :model-value="pickerColor(colors[0])"
            @update:model-value="setColor(0, $event)"
          />
          <UiInput
            :id="id"
            :model-value="colors[0]"
            :aria-describedby="descriptionId"
            :aria-invalid="Boolean(error)"
            :placeholder="definition.allowEmpty ? '默认颜色' : '#ffffff'"
            spellcheck="false"
            @update:model-value="setColor(0, $event)"
          />
        </div>
        <template v-if="definition.darkVariant">
          <label class="inherit-color"
            ><UiInput
              type="checkbox"
              :model-value="!hasDark"
              @update:model-value="toggleDark"
            />深色模式沿用浅色</label
          >
          <div v-if="hasDark" class="color-input">
            <UiInput
              type="color"
              :aria-label="`${definition.label}深色色板`"
              :model-value="pickerColor(colors[1])"
              @update:model-value="setColor(1, $event)"
            />
            <UiInput
              :model-value="colors[1]"
              :aria-label="`${definition.label}深色值`"
              :aria-describedby="descriptionId"
              :aria-invalid="Boolean(error)"
              spellcheck="false"
              @update:model-value="setColor(1, $event)"
            />
          </div>
        </template>
      </template>
      <UiInput
        v-else
        :id="id"
        :model-value="modelValue"
        :placeholder="definition.placeholder"
        :aria-required="definition.required"
        :aria-describedby="descriptionId"
        :aria-invalid="Boolean(error)"
        :inputmode="definition.type === 'integer' ? 'numeric' : undefined"
        @update:model-value="update"
      />
      <p v-if="error" :id="`${id}-error`" class="field-error">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.param-field {
  display: grid;
  grid-template-columns: 100px 1fr 190px;
  gap: 10px 14px;
  padding: 16px;
  align-items: start;
  font-size: 13px;
}
.field-heading {
  display: grid;
  gap: 4px;
  padding-top: 7px;
}
.field-heading label {
  font-weight: 550;
}
.field-heading code {
  color: var(--ui-muted);
  font-size: 11px;
}
.description {
  color: var(--ui-muted);
  line-height: 1.65;
  padding-top: 7px;
}
.field-control {
  min-width: 0;
  display: grid;
  gap: 8px;
}
.color-input {
  display: flex;
  gap: 6px;
  align-items: center;
}
.inherit-color {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--ui-muted);
  font-size: 12px;
  cursor: pointer;
}
.field-error {
  color: var(--ui-error);
  line-height: 1.5;
}
@media (max-width: 560px) {
  .param-field {
    grid-template-columns: 1fr;
    gap: 7px;
  }
  .field-heading {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 0;
  }
  .description {
    padding: 0;
  }
}
</style>
