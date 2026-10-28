<script setup lang="ts">
import WidgetConfigurator from '@/components/widget-configurator.vue'
import { resolveLanguage } from '@/composables/use-i18n'
import { localize } from '@/i18n/text'
import { parseWidgetParams, serializeWidgetParams } from '@/utils/widget-params'
import { loadWidgetI18n } from '@/widgets/i18n'
import { findWidget, loadWidget } from '@/widgets/registry'

definePageMeta({ layout: 'site' })
const route = useRoute()
const widget = findWidget(String(route.params.widget))
if (!widget) throw createError({ statusCode: 404, statusMessage: 'Page not found' })
const origin = useRequestURL().origin
const { language } = useSiteLanguage()
const defaultDate = `${new Date().getFullYear() + 1}-01-01`
const raw = computed(() => {
  const params = Object.fromEntries(
    Object.entries(route.query).map(([name, value]) => [
      name,
      (Array.isArray(value) ? value.at(-1) : value) ?? '',
    ]),
  )
  if (widget.id === 'date-counter' && params.date === undefined) params.date = defaultDate
  return params
})
const parsed = computed(() => parseWidgetParams(widget.params, raw.value))
const values = computed(() => parsed.value.values)
const errors = computed(() => parsed.value.errors)
const lang = computed(() =>
  values.value.lang === 'auto' ? language.value : resolveLanguage(values.value.lang),
)
const title = computed(() => {
  const name = localize(widget.meta.name, language.value)
  return language.value === 'zh-CN'
    ? `${name}配置 · Silent Widgets`
    : `Configure ${name} · Silent Widgets`
})
useSeoMeta({
  title: () => title.value,
  ogTitle: () => title.value,
  ogType: 'website',
  ogUrl: new URL(`/${widget.id}`, origin).href,
  ogImage: new URL(widget.meta.cover, origin).href,
})
if (import.meta.server) {
  // SSR needs the URL before this page suspends. The visible editor owns it on the client.
  useWidgetEmbed(
    computed(() => {
      const url = new URL(`/${widget.id}`, origin)
      url.search = serializeWidgetParams(widget.params, values.value).toString()
      return url.href
    }),
    computed(() => Object.keys(errors.value).length > 0),
  )
}
const [loadedComponent] = await Promise.all([
  loadWidget(widget.id),
  loadWidgetI18n(widget.id, lang.value),
])
const component = markRaw(loadedComponent)
</script>

<template>
  <WidgetConfigurator
    :widget="widget"
    :component="component"
    :values="values"
    :errors="errors"
    :raw="raw"
    :origin="origin"
  />
</template>
