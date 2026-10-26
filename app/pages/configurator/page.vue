<script setup vapor lang="ts">
import type { PropType } from 'vue'
import UiInput from '@/components/ui/input.vue'
import UiSelect from '@/components/ui/select.vue'
import WidgetParamField from '@/components/widget-param-field.vue'
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
const definitions = props.widget.params
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
const copyStatus = ref('')
const manualCopy = ref(false)
let mounted = false
let statusTimer: ReturnType<typeof setTimeout> | undefined

watch(
  parsed,
  result => {
    for (const name of Object.keys(definitions)) {
      if (!result.errors[name]) values[name] = result.values[name]
    }
    copyStatus.value = ''
    manualCopy.value = false
    if (mounted && !hasErrors.value) {
      const url = new URL(finalUrl.value)
      url.pathname += '/config'
      history.replaceState(history.state, '', url)
    }
  },
  { immediate: true },
)
onMounted(() => {
  mounted = true
})
onUnmounted(() => clearTimeout(statusTimer))

function selectWidget(id: string) {
  location.assign(`/${id}/config`)
}
async function copyUrl() {
  if (hasErrors.value) return
  clearTimeout(statusTimer)
  try {
    await navigator.clipboard.writeText(finalUrl.value)
    copyStatus.value = '已复制'
    manualCopy.value = false
    statusTimer = setTimeout(() => {
      copyStatus.value = ''
    }, 2500)
  } catch {
    copyStatus.value = '无法自动复制，请选中下方地址手动复制。'
    manualCopy.value = true
  }
}
function selectAddress(event: FocusEvent) {
  ;(event.target as HTMLInputElement).select()
}
</script>

<template>
  <main class="px-4 pb-12">
    <div class="max-w-xl mx-auto">
      <header class="py-8">
        <a href="/" class="brand-link">Silent Widgets</a>
        <h1 class="sr-only">{{ widget.meta.name }}配置</h1>
        <UiSelect
          class="widget-select mt-5"
          aria-label="选择小工具"
          :model-value="widget.id"
          @update:model-value="selectWidget"
        >
          <option v-for="item of widgets" :key="item.id" :value="item.id">
            {{ item.meta.name }} / {{ item.meta.englishName }}
          </option>
        </UiSelect>
        <p class="widget-description mt-2">{{ widget.meta.description }}</p>
      </header>
      <section
        class="preview aspect-og rounded-md overflow-hidden relative"
        aria-label="小工具预览"
      >
        <div class="absolute inset-0" style="container-type: size">
          <component :is="component" v-bind="values" class="size-full" />
        </div>
        <button
          type="button"
          class="copy-button absolute top-2 right-2"
          :disabled="hasErrors"
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
          {{ copyStatus === '已复制' ? '已复制' : '复制地址' }}
        </button>
      </section>
      <p id="copy-status" class="copy-status mt-2" role="status" aria-live="polite">
        {{
          hasErrors
            ? '请先修正下方参数，再复制地址。'
            : copyStatus || '调整参数即可更新预览，复制地址后可嵌入 Notion。'
        }}
      </p>
      <UiInput
        v-if="manualCopy"
        class="mt-2"
        aria-label="嵌入地址"
        :model-value="finalUrl"
        readonly
        @focus="selectAddress"
      />
      <form class="parameter-list mt-4" aria-label="小工具参数" @submit.prevent="copyUrl">
        <WidgetParamField
          v-for="(definition, name) of definitions"
          :key="name"
          :name="name"
          :definition="definition"
          v-model="draft[name]"
          :error="parsed.errors[name]"
        />
      </form>
      <p class="embed-help mt-5">在 Notion 中添加嵌入块，粘贴复制的地址。</p>
    </div>
  </main>
</template>

<style scoped>
.brand-link {
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}
.widget-select {
  font-size: 20px;
  font-weight: 600;
  border-color: transparent;
  padding-left: 0;
}
.widget-description,
.embed-help {
  color: var(--ui-muted);
  font-size: 14px;
}
.preview {
  box-shadow:
    0 0 0 1px var(--ui-line),
    0 3px 12px #00000008;
}
.copy-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 36px;
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
