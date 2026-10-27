import { resolveLanguage } from '@/composables/use-i18n'
import type { SupportedLang } from '@/composables/use-i18n'
import { defineText, localize } from '@/i18n/text'
import { prepareWidget, resolveWidgetRoute } from '@/utils/widget-utils'

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
  const prepared = await prepareWidget(url, automatic, siteLanguage)
  if (!prepared) return null
  const component =
    route.kind === 'widget'
      ? (await import('./pages/widget/page.vue')).default
      : (await import('./pages/configurator/page.vue')).default
  const { widget } = route
  const lang =
    route.kind === 'config'
      ? siteLanguage
      : prepared.values.lang === 'auto'
        ? automatic
        : resolveLanguage(prepared.values.lang)
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
    props: { ...prepared, origin: url.origin },
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
