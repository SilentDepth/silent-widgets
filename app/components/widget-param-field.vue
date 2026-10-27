<script setup vapor lang="ts">
import { useSiteI18n } from '@/composables/use-site-i18n'
import type { LocalizedText } from '@/i18n/text'
import type { WidgetParam } from '@/types/widget'
import { splitColors } from '@/utils/widget-params'
import UiInput from './ui/input.vue'
import UiSelect from './ui/select.vue'

const props = defineProps<{
  name: string
  definition: WidgetParam
  modelValue: string
  error?: LocalizedText
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const { l, t } = useSiteI18n()
const colors = computed(() => splitColors(props.modelValue))
const hasExtraColors = computed(() => colors.value.length > (props.definition.darkVariant ? 2 : 1))
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
  <div
    class="param-field grid items-start gap-x-3.5 gap-y-2.5 p-4 text-[13px] max-[560px]:gap-1.75"
  >
    <div
      class="grid gap-1 pt-1.75 max-[560px]:flex max-[560px]:items-baseline max-[560px]:justify-between max-[560px]:p-0"
    >
      <label :for="id" class="font-[550]">{{ l(definition.label) }}</label>
      <code class="text-[11px] text-(--ui-muted)">{{ name }}</code>
    </div>
    <p :id="`${id}-description`" class="pt-1.75 leading-[1.65] text-(--ui-muted) max-[560px]:p-0">
      {{ l(definition.description) }}
    </p>
    <div class="grid min-w-0 gap-2">
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
        <option
          v-for="option of definition.options"
          :key="option.value"
          :value="option.value"
          :selected="String(option.value) === modelValue"
        >
          {{ l(option.label) }}
        </option>
      </UiSelect>
      <UiInput
        v-else-if="definition.type === 'color' && hasExtraColors"
        :id="id"
        :model-value="modelValue"
        :aria-describedby="descriptionId"
        :aria-invalid="Boolean(error)"
        spellcheck="false"
        @update:model-value="update"
      />
      <template v-else-if="definition.type === 'color'">
        <div class="flex items-center gap-1.5">
          <UiInput
            type="color"
            :aria-label="t('field.lightPicker', { label: l(definition.label) })"
            :model-value="pickerColor(colors[0])"
            @update:model-value="setColor(0, $event)"
          />
          <UiInput
            :id="id"
            :model-value="colors[0]"
            :aria-describedby="descriptionId"
            :aria-invalid="Boolean(error)"
            :placeholder="definition.allowEmpty ? t('field.defaultColor') : '#ffffff'"
            spellcheck="false"
            @update:model-value="setColor(0, $event)"
          />
        </div>
        <template v-if="definition.darkVariant">
          <label class="flex cursor-pointer items-center gap-1.5 text-xs/normal text-(--ui-muted)"
            ><UiInput type="checkbox" :model-value="!hasDark" @update:model-value="toggleDark" />
            {{ t('field.inheritColor') }}</label
          >
          <div v-if="hasDark" class="flex items-center gap-1.5">
            <UiInput
              type="color"
              :aria-label="t('field.darkPicker', { label: l(definition.label) })"
              :model-value="pickerColor(colors[1])"
              @update:model-value="setColor(1, $event)"
            />
            <UiInput
              :model-value="colors[1]"
              :aria-label="t('field.darkValue', { label: l(definition.label) })"
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
        :placeholder="l(definition.placeholder)"
        :aria-required="definition.required"
        :aria-describedby="descriptionId"
        :aria-invalid="Boolean(error)"
        :inputmode="definition.type === 'integer' ? 'numeric' : undefined"
        @update:model-value="update"
      />
      <p v-if="error" :id="`${id}-error`" class="leading-normal text-(--ui-error)">
        {{ l(error) }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.param-field {
  grid-template-columns: 100px 1fr 190px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
}
</style>
