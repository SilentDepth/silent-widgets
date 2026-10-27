import { resolveLanguage } from '@/composables/use-i18n'
import type { SupportedLang } from '@/composables/use-i18n'
import { defineText, localize } from '@/i18n/text'
import { parseWidgetParams } from '@/utils/widget-params'
import { resolveWidgetRoute } from '@/utils/widget-utils'
import { loadWidgetI18n } from '@/widgets/i18n'
import { loadWidget } from '@/widgets/registry'

export type LoadedPage = NonNullable<Awaited<ReturnType<typeof loadPage>>>
export interface PageView {
  page: LoadedPage
  revision: number
}

export async function loadPage(url: URL, automatic: SupportedLang, siteLanguage = automatic) {
  const route = resolveWidgetRoute(url.pathname)
  if (!route) return null
  const layout = route.kind === 'widget' ? null : (await import('./layouts/site.vue')).default
  if (route.kind === 'index') {
    return {
      kind: route.kind,
      origin: url.origin,
      layout,
      component: (await import('./pages/index/page.vue')).default,
      props: {},
      title: 'Silent Widgets',
      lang: siteLanguage,
      meta: [],
    }
  }
  const { widget } = route
  const raw = Object.fromEntries(url.searchParams)
  if (route.kind === 'config' && widget.id === 'date-counter' && raw.date === undefined) {
    raw.date = `${new Date().getFullYear() + 1}-01-01`
  }
  const parsed = parseWidgetParams(widget.params, raw)
  const widgetLanguage =
    parsed.values.lang === 'auto'
      ? route.kind === 'config'
        ? siteLanguage
        : automatic
      : resolveLanguage(parsed.values.lang)
  const [widgetComponent] = await Promise.all([
    loadWidget(widget.id),
    loadWidgetI18n(widget.id, widgetLanguage),
  ])
  const component =
    route.kind === 'widget'
      ? (await import('./pages/widget/page.vue')).default
      : (await import('./pages/configurator/page.vue')).default
  const lang = route.kind === 'config' ? siteLanguage : widgetLanguage
  const name = localize(widget.meta.name, lang)
  const title =
    route.kind === 'config'
      ? defineText(
          `${localize(widget.meta.name, 'zh-CN')}配置 · Silent Widgets`,
          `Configure ${localize(widget.meta.name, 'en-US')} · Silent Widgets`,
        )
      : `${name} · Silent Widgets`
  return {
    kind: route.kind,
    origin: url.origin,
    layout,
    component,
    props: { widget, component: markRaw(widgetComponent), ...parsed, raw, origin: url.origin },
    title,
    lang,
    meta: [
      { property: 'og:title', content: localize(title, lang) },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: new URL(`/${widget.id}`, url.origin).href },
      { property: 'og:image', content: new URL(widget.meta.cover, url.origin).href },
    ],
  }
}
