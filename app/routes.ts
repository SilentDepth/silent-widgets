import { resolveLanguage } from '@/composables/use-i18n'
import type { SupportedLang } from '@/composables/use-i18n'
import { defineText, localize } from '@/i18n/text'
import { prepareWidget, resolveWidgetRoute } from '@/utils/widget-utils'

export type LoadedPage = NonNullable<Awaited<ReturnType<typeof loadPage>>>
export interface PageView {
  page: LoadedPage
  revision: number
}

export async function loadPage(url: URL, automatic: SupportedLang) {
  const route = resolveWidgetRoute(url.pathname)
  if (!route) return null
  if (route.kind === 'index') {
    return {
      component: (await import('./pages/index/page.vue')).default,
      props: {},
      title: 'Silent Widgets',
      lang: automatic,
      meta: [],
    }
  }
  const prepared = await prepareWidget(url, automatic)
  if (!prepared) return null
  const component =
    route.kind === 'widget'
      ? (await import('./pages/widget/page.vue')).default
      : (await import('./pages/configurator/page.vue')).default
  const { widget } = route
  const lang =
    route.kind === 'config' || prepared.values.lang === 'auto'
      ? automatic
      : resolveLanguage(prepared.values.lang)
  const name = localize(widget.meta.name, lang)
  const title =
    route.kind === 'config' ? localize(defineText(`${name}配置`, `Configure ${name}`), lang) : name
  return {
    component,
    props: { ...prepared, origin: url.origin },
    title: `${title} · Silent Widgets`,
    lang,
    meta: [
      { property: 'og:title', content: `${title} · Silent Widgets` },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: new URL(`/${widget.id}`, url.origin).href },
      { property: 'og:image', content: new URL(widget.meta.cover, url.origin).href },
    ],
  }
}
