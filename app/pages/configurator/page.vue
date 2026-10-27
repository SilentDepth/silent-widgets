<script setup vapor lang="ts">
import type { PropType } from 'vue'
import WidgetParamField from '@/components/widget-param-field.vue'
import { usePageNavigation } from '@/composables/use-page-navigation'
import { useSiteI18n } from '@/composables/use-site-i18n'
import type { WidgetValue } from '@/types/widget'
import { parseWidgetParams, serializeParam, serializeWidgetParams } from '@/utils/widget-params'
import { widgets } from '@/widgets/registry'
import type { WidgetEntry } from '@/widgets/registry'

const props = defineProps({
  widget: { type: Object as PropType<WidgetEntry>, required: true },
  component: { type: Object as PropType<VaporComponent>, required: true },
  values: { type: Object as PropType<Record<string, WidgetValue>>, required: true },
  raw: { type: Object as PropType<Record<string, string>>, required: true },
  origin: { type: String, required: true },
})
const { l, t } = useSiteI18n()
const definitions = props.widget.params
const { navigate, replaceUrl, isNavigating } = usePageNavigation()
const initial = parseWidgetParams(definitions, props.raw)
const draft = reactive(
  Object.fromEntries(
    Object.entries(definitions).map(([name, definition]) => [
      name,
      initial.errors[name]
        ? (props.raw[name] ?? '')
        : serializeParam(definition, initial.values[name]),
    ]),
  ),
)
function updateParam(name: string, value: string) {
  draft[name] = value
}
const values = reactive({ ...props.values })
const parsed = computed(() => parseWidgetParams(definitions, draft))
const hasErrors = computed(() => Object.keys(parsed.value.errors).length > 0)
const finalUrl = computed(() => {
  const url = new URL(`/${props.widget.id}`, props.origin)
  url.search = serializeWidgetParams(definitions, values).toString()
  return url.href
})
const copyStatus = ref<'idle' | 'copied' | 'failed'>('idle')
let mounted = false
let statusTimer: ReturnType<typeof setTimeout> | undefined

watch(
  parsed,
  result => {
    for (const name of Object.keys(definitions)) {
      if (!result.errors[name]) values[name] = result.values[name]
    }
    clearTimeout(statusTimer)
    copyStatus.value = 'idle'
    if (mounted && !hasErrors.value) {
      const url = new URL(finalUrl.value)
      url.pathname += '/config'
      replaceUrl(url)
    }
  },
  { immediate: true },
)
onMounted(() => {
  mounted = true
})
onUnmounted(() => clearTimeout(statusTimer))

function selectWidget(id: string) {
  navigate(`/${id}/config`)
}
async function copyUrl() {
  if (hasErrors.value || isNavigating.value) return
  clearTimeout(statusTimer)
  const url = finalUrl.value
  try {
    await navigator.clipboard.writeText(url)
    clearTimeout(statusTimer)
    copyStatus.value = 'copied'
    statusTimer = setTimeout(() => {
      copyStatus.value = 'idle'
    }, 2000)
  } catch {
    copyStatus.value = 'failed'
    window.prompt(t('config.manualCopy'), url)
  }
}
</script>

<template>
  <div class="config-content @container mx-auto max-w-xl">
    <h1 class="sr-only">{{ t('config.title', { widget: l(widget.meta.name) }) }}</h1>
    <div
      class="sticky top-0 z-20 flex h-(--toolbar-height) items-center justify-between gap-3 bg-(--ui-canvas)"
    >
      <div class="relative min-w-0">
        <select
          class="h-9 w-full min-w-0 appearance-none rounded-[5px] border-0 bg-(--ui-canvas) p-0 pr-5 text-lg font-semibold text-(--ui-text) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ui-accent)"
          :aria-label="t('config.select')"
          :value="widget.id"
          :disabled="isNavigating"
          @change="selectWidget(($event.target as HTMLSelectElement).value)"
        >
          <option
            v-for="item of widgets"
            :key="item.id"
            :value="item.id"
            :selected="item.id === widget.id"
          >
            {{ l(item.meta.name) }}
          </option>
        </select>
        <svg
          viewBox="0 0 24 24"
          class="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2 text-(--ui-text)"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      <button
        type="button"
        :disabled="hasErrors || isNavigating"
        :title="hasErrors ? t('config.fixErrors') : undefined"
        class="flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-[5px] border border-(--ui-line) bg-(--ui-canvas) px-2.5 py-1.75 text-xs/normal whitespace-nowrap text-(--ui-text) focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(--ui-accent) enabled:hover:bg-(--ui-surface) disabled:cursor-not-allowed disabled:opacity-55"
        @click="copyUrl"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          class="size-4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
        >
          <path
            v-if="copyStatus === 'copied'"
            d="m5 12 4 4L19 6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <template v-else>
            <rect x="8" y="8" width="12" height="13" rx="3" />
            <path d="M16 8V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h2" />
          </template>
        </svg>
        <span role="status" aria-live="polite" aria-atomic="true">
          {{
            t(
              copyStatus === 'copied'
                ? 'config.copied'
                : copyStatus === 'failed'
                  ? 'config.copyFailed'
                  : 'config.copy',
            )
          }}
        </span>
      </button>
    </div>
    <p class="mt-1 mb-5 text-sm/normal text-(--ui-muted)">
      {{ l(widget.meta.description) }}
    </p>
    <section
      class="sticky top-(--toolbar-height) z-10 h-(--preview-height) overflow-hidden rounded-md bg-(--ui-canvas) @max-[560px]:-mx-4 @max-[560px]:rounded-none"
      :aria-label="t('config.preview')"
    >
      <div class="@container-size absolute inset-0">
        <component :is="component" v-bind="values" :no-animation="true" class="size-full" />
      </div>
    </section>
    <form
      class="mt-4 grid grid-cols-[minmax(0,1.2fr)_repeat(2,minmax(0,1fr))] gap-x-3 rounded-md border border-(--ui-line) px-3.5 @max-[560px]:-mx-4 @max-[560px]:grid-cols-2 @max-[560px]:rounded-none @max-[560px]:border-x-0 @max-[560px]:px-4"
      :aria-label="t('config.parameters')"
      :inert="isNavigating"
      @submit.prevent="copyUrl"
    >
      <WidgetParamField
        v-for="(definition, name) of definitions"
        :key="name"
        :name="name"
        :definition="definition"
        :model-value="draft[name]"
        @update:model-value="updateParam(name, $event)"
        :error="parsed.errors[name]"
      />
    </form>
  </div>
</template>

<style scoped>
.config-content {
  --toolbar-height: calc(var(--spacing) * 9);
  --preview-height: min(52.5cqw, 40dvh);
}
:deep(input),
:deep(select) {
  scroll-margin-top: calc(var(--toolbar-height) + var(--preview-height) + 16px);
}
</style>
