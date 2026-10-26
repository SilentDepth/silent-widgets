import { resolveLanguage } from '@/composables/use-i18n'
import type { SupportedLang } from '@/composables/use-i18n'
import { parseWidgetParams } from '@/utils/widget-params'
import { loadWidgetI18n } from '@/widgets/i18n'
import { findWidget, loadWidget } from '@/widgets/registry'

export function resolveWidgetRoute(pathname: string) {
  const path = pathname === '/' ? '/' : pathname.replace(/\/$/, '')
  if (path === '/') return { kind: 'index' as const }
  const match = /^\/([^/]+)(\/config)?$/.exec(path)
  if (!match) return null
  const widget = findWidget(match[1])
  if (!widget) return null
  return { kind: match[2] ? ('config' as const) : ('widget' as const), widget }
}

export async function prepareWidget(url: URL, automatic: SupportedLang) {
  const route = resolveWidgetRoute(url.pathname)
  if (!route || route.kind === 'index') return null
  const { widget } = route
  const parsed = parseWidgetParams(widget.params, url.searchParams)
  const language = parsed.values.lang === 'auto' ? automatic : resolveLanguage(parsed.values.lang)
  const [component] = await Promise.all([
    loadWidget(widget.id),
    loadWidgetI18n(widget.id, language),
  ])
  return {
    widget,
    component: markRaw(component),
    values: parsed.values,
    raw: Object.fromEntries(url.searchParams),
  }
}
