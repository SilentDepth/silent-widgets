<script setup vapor lang="ts">
import type { PropType } from 'vue'
import UiInput from '@/components/ui/input.vue'
import UiSelect from '@/components/ui/select.vue'
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
const values = reactive({ ...props.values })
const parsed = computed(() => parseWidgetParams(definitions, draft))
const hasErrors = computed(() => Object.keys(parsed.value.errors).length > 0)
const finalUrl = computed(() => {
  const url = new URL(`/${props.widget.id}`, props.origin)
  url.search = serializeWidgetParams(definitions, values).toString()
  return url.href
})
const copyStatus = ref<'idle' | 'copied' | 'failed'>('idle')
const manualCopy = ref(false)
let mounted = false
let statusTimer: ReturnType<typeof setTimeout> | undefined

watch(
  parsed,
  result => {
    for (const name of Object.keys(definitions)) {
      if (!result.errors[name]) values[name] = result.values[name]
    }
    copyStatus.value = 'idle'
    manualCopy.value = false
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
  if (hasErrors.value) return
  clearTimeout(statusTimer)
  try {
    await navigator.clipboard.writeText(finalUrl.value)
    copyStatus.value = 'copied'
    manualCopy.value = false
    statusTimer = setTimeout(() => {
      copyStatus.value = 'idle'
    }, 2500)
  } catch {
    copyStatus.value = 'failed'
    manualCopy.value = true
  }
}
function selectAddress(event: FocusEvent) {
  ;(event.target as HTMLInputElement).select()
}
</script>

<template>
  <main class="px-4 pb-12">
    <div class="config-content max-w-xl mx-auto">
      <header class="pt-8 pb-5">
        <a href="/" class="brand-link">Silent Widgets</a>
        <h1 class="sr-only">{{ t('config.title', { widget: l(widget.meta.name) }) }}</h1>
      </header>
      <div class="widget-toolbar">
        <UiSelect
          class="widget-select"
          :aria-label="t('config.select')"
          :model-value="widget.id"
          :disabled="isNavigating"
          @update:model-value="selectWidget"
        >
          <option v-for="item of widgets" :key="item.id" :value="item.id">
            {{ l(item.meta.name) }}
          </option>
        </UiSelect>
        <button
          type="button"
          class="copy-button"
          :disabled="hasErrors || isNavigating"
          aria-describedby="copy-status"
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
            <rect x="8" y="8" width="12" height="13" rx="3" />
            <path d="M16 8V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h2" />
          </svg>
          {{ t(copyStatus === 'copied' ? 'config.copied' : 'config.copy') }}
        </button>
      </div>
      <p class="widget-description">{{ l(widget.meta.description) }}</p>
      <section class="preview rounded-md overflow-hidden" :aria-label="t('config.preview')">
        <div class="absolute inset-0" style="container-type: size">
          <component :is="component" v-bind="values" :no-animation="true" class="size-full" />
        </div>
      </section>
      <p id="copy-status" class="copy-status mt-2" role="status" aria-live="polite">
        {{
          hasErrors
            ? t('config.fixErrors')
            : t(
                copyStatus === 'failed'
                  ? 'config.copyFailed'
                  : copyStatus === 'copied'
                    ? 'config.copied'
                    : 'config.hint',
              )
        }}
      </p>
      <UiInput
        v-if="manualCopy"
        class="mt-2"
        :aria-label="t('config.link')"
        :model-value="finalUrl"
        readonly
        @focus="selectAddress"
      />
      <form
        class="parameter-list mt-4"
        :aria-label="t('config.parameters')"
        :inert="isNavigating"
        @submit.prevent="copyUrl"
      >
        <WidgetParamField
          v-for="(definition, name) of definitions"
          :key="name"
          :name="name"
          :definition="definition"
          v-model="draft[name]"
          :error="parsed.errors[name]"
        />
      </form>
      <p class="embed-help mt-5">{{ t('config.embedHelp') }}</p>
    </div>
  </main>
</template>

<style scoped>
.config-content {
  container-type: inline-size;
  --toolbar-height: 56px;
  --preview-height: min(52.5cqw, 40dvh);
}
.widget-toolbar {
  position: sticky;
  top: 0;
  z-index: 20;
  height: var(--toolbar-height);
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--ui-canvas);
}
.brand-link {
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}
.widget-select {
  flex: 1;
  height: 40px;
  font-size: 18px;
  font-weight: 600;
  border-color: transparent;
  padding-left: 0;
  padding-block: 0;
}
.widget-description,
.embed-help {
  color: var(--ui-muted);
  font-size: 14px;
}
.widget-description {
  margin: 4px 0 20px;
}
.preview {
  position: sticky;
  top: var(--toolbar-height);
  z-index: 10;
  height: var(--preview-height);
  background: var(--ui-canvas);
}
:deep(input),
:deep(select) {
  scroll-margin-top: calc(var(--toolbar-height) + var(--preview-height) + 16px);
}
.copy-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-shrink: 0;
  min-height: 40px;
  white-space: nowrap;
  padding: 7px 10px;
  border: 1px solid var(--ui-line);
  border-radius: 5px;
  background: var(--ui-canvas);
  color: var(--ui-text);
  font-size: 12px;
  cursor: pointer;
}
.copy-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.copy-button:enabled:hover {
  background: var(--ui-surface);
}
.copy-button:focus-visible,
.brand-link:focus-visible {
  outline: 2px solid var(--ui-accent);
  outline-offset: 3px;
}
.copy-status {
  min-height: 22px;
  color: var(--ui-muted);
  font-size: 12px;
}
.parameter-list {
  border: 1px solid var(--ui-line);
  border-radius: 6px;
  overflow: clip;
}
.parameter-list > :deep(.param-field + .param-field) {
  border-top: 1px solid var(--ui-line);
}
</style>
