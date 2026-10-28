import { createVaporSSRApp } from 'vue'
import { autoLanguageKey, resolveLanguage } from '@/composables/use-i18n'
import type { SupportedLang } from '@/composables/use-i18n'
import { parseWidgetParams } from '@/utils/widget-params'
import { widgetIdFromPath } from '@/utils/widget-path'
import { loadWidgetI18n } from '@/widgets/i18n'
import { findWidget, loadWidget } from '@/widgets/registry'
import App from './app.vue'

export async function createWidgetApp(url: URL, automatic: SupportedLang) {
  const widget = findWidget(widgetIdFromPath(url.pathname) ?? '')
  if (!widget) throw new Error('Widget not found')
  const { values } = parseWidgetParams(widget.params, Object.fromEntries(url.searchParams))
  const lang = values.lang === 'auto' ? automatic : resolveLanguage(values.lang)
  const [component] = await Promise.all([loadWidget(widget.id), loadWidgetI18n(widget.id, lang)])
  const app = createVaporSSRApp(App, { component, values })
  app.provide(autoLanguageKey, automatic)
  return { app, widget, lang }
}
