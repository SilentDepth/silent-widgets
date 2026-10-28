<script setup vapor lang="ts">
import { useSiteI18n } from '@/composables/use-site-i18n'
import type { LocalizedText } from '@/i18n/text'
import type { WidgetParam } from '@/types/widget'
import { splitColors } from '@/utils/widget-params'
import UiColorInput from './ui/color-input.vue'
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
const hasExtraColors = computed(
  () =>
    colors.value.length >
    (props.definition.type === 'color' && props.definition.darkVariant ? 2 : 1),
)
const hasDark = computed(() => colors.value.length > 1)
const savedDark = ref<string>()
const id = computed(() => `param-${props.name}`)
const descriptionId = computed(
  () => `${id.value}-description${props.error ? ` ${id.value}-error` : ''}`,
)
function update(value: string | boolean) {
  emit('update:modelValue', String(value))
}
function setColor(index: number, value: string) {
  const next = [...colors.value]
  next[index] = value
  emit('update:modelValue', next.join(','))
}
function toggleDark() {
  if (hasDark.value) {
    savedDark.value = colors.value[1]
    emit('update:modelValue', colors.value[0])
  } else {
    const light = colors.value[0] || '#37352f'
    emit('update:modelValue', `${light},${savedDark.value ?? light}`)
  }
}
</script>

<template>
  <div
    class="relative col-span-full grid min-w-0 grid-cols-subgrid items-start gap-y-1 py-3.5 text-[13px] before:absolute before:-inset-x-3.5 before:top-0 before:border-t before:border-(--ui-line) first:before:hidden @max-[560px]:before:-inset-x-4"
  >
    <div
      class="col-start-1 row-span-2 row-start-1 grid min-w-0 gap-y-1 self-start @max-[560px]:col-span-full"
    >
      <div
        class="text-trim flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1 @max-[560px]:justify-between"
      >
        <label :for="id" class="font-[550]">{{ l(definition.label) }}</label>
        <code class="font-mono text-[11px] text-(--ui-muted) select-all">{{ name }}</code>
      </div>
      <p :id="`${id}-description`" class="text-xs/relaxed text-(--ui-muted)">
        {{ l(definition.description) }}
      </p>
    </div>
    <UiInput
      v-if="definition.type === 'boolean'"
      :id="id"
      class="col-start-3 row-span-2 row-start-1 self-start @max-[560px]:col-start-1 @max-[560px]:row-span-1 @max-[560px]:row-start-3 @max-[560px]:mt-1.5"
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
      class="col-start-3 row-span-2 row-start-1 self-start @max-[560px]:col-start-1 @max-[560px]:row-span-1 @max-[560px]:row-start-3 @max-[560px]:mt-1.5"
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
      class="col-start-2 -col-end-1 row-span-2 row-start-1 self-start @max-[560px]:col-span-full @max-[560px]:row-span-1 @max-[560px]:row-start-3 @max-[560px]:mt-1.5"
      :model-value="modelValue"
      :aria-describedby="descriptionId"
      :aria-invalid="Boolean(error)"
      spellcheck="false"
      @update:model-value="update"
    />
    <div
      v-else-if="definition.type === 'color' && definition.darkVariant"
      class="col-start-2 -col-end-1 row-span-2 row-start-1 grid min-w-0 grid-cols-subgrid gap-y-1.5 self-start @max-[560px]:col-span-full @max-[560px]:row-span-1 @max-[560px]:row-start-3 @max-[560px]:mt-1.5"
    >
      <div class="row-span-2 row-start-1 grid min-w-0 grid-rows-subgrid">
        <label :for="id" class="self-end text-[11px]/normal text-(--ui-muted)">
          {{ t('field.lightMode') }}
        </label>
        <UiColorInput
          :id="id"
          :label="t('field.lightValue', { label: l(definition.label) })"
          :model-value="colors[0]"
          :describedby="descriptionId"
          :invalid="Boolean(error)"
          :placeholder="definition.allowEmpty ? t('field.defaultColor') : '#ffffff'"
          @update:model-value="setColor(0, $event)"
        />
      </div>
      <div class="row-span-2 row-start-1 grid min-w-0 grid-rows-subgrid">
        <div
          class="flex flex-wrap items-baseline justify-between gap-x-1.5 gap-y-1 text-[11px]/normal text-(--ui-muted)"
        >
          <label :for="`${id}-dark`">{{ t('field.darkMode') }}</label>
          <button
            type="button"
            class="ml-auto inline-grid cursor-pointer rounded-[2px] text-right hover:text-(--ui-text) hover:underline hover:underline-offset-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ui-accent)"
            :aria-label="
              t(hasDark ? 'field.inheritColorLabel' : 'field.separateColorLabel', {
                label: l(definition.label),
              })
            "
            :aria-controls="`${id}-dark`"
            @click="toggleDark"
          >
            <span
              class="col-start-1 row-start-1"
              :class="{ invisible: !hasDark }"
              aria-hidden="true"
            >
              {{ t('field.inheritColor') }}
            </span>
            <span
              class="col-start-1 row-start-1"
              :class="{ invisible: hasDark }"
              aria-hidden="true"
            >
              {{ t('field.separateColor') }}
            </span>
          </button>
        </div>
        <UiColorInput
          :id="`${id}-dark`"
          :label="t('field.darkValue', { label: l(definition.label) })"
          :model-value="hasDark ? colors[1] : colors[0]"
          :describedby="descriptionId"
          :invalid="Boolean(error)"
          :disabled="!hasDark"
          :placeholder="definition.allowEmpty ? t('field.defaultColor') : '#ffffff'"
          @update:model-value="setColor(1, $event)"
        />
      </div>
    </div>
    <UiColorInput
      v-else-if="definition.type === 'color'"
      :id="id"
      class="col-start-3 row-span-2 row-start-1 self-start @max-[560px]:col-start-1 @max-[560px]:row-span-1 @max-[560px]:row-start-3 @max-[560px]:mt-1.5"
      :label="l(definition.label)"
      :model-value="colors[0]"
      :describedby="descriptionId"
      :invalid="Boolean(error)"
      :placeholder="definition.allowEmpty ? t('field.defaultColor') : '#ffffff'"
      @update:model-value="setColor(0, $event)"
    />
    <UiInput
      v-else
      :id="id"
      class="row-span-2 row-start-1 self-start @max-[560px]:row-span-1 @max-[560px]:row-start-3 @max-[560px]:mt-1.5"
      :class="
        definition.type === 'text'
          ? 'col-start-2 -col-end-1 @max-[560px]:col-span-full'
          : 'col-start-3 @max-[560px]:col-start-1'
      "
      :type="definition.type === 'date' ? 'date' : 'text'"
      :model-value="modelValue"
      :placeholder="l(definition.placeholder)"
      :aria-required="definition.required"
      :aria-describedby="descriptionId"
      :aria-invalid="Boolean(error)"
      :inputmode="definition.type === 'integer' ? 'numeric' : undefined"
      @update:model-value="update"
    />
    <p
      v-if="error"
      :id="`${id}-error`"
      class="col-start-2 -col-end-1 row-start-3 leading-normal text-(--ui-error) @max-[560px]:col-span-full @max-[560px]:row-start-4"
    >
      {{ l(error) }}
    </p>
  </div>
</template>
