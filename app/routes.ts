import type { SupportedLang } from '@/composables/use-i18n'
import { prepareWidget, resolveWidgetRoute } from '@/utils/widget-utils'

export async function loadPage(url: URL, automatic: SupportedLang) {
  const route = resolveWidgetRoute(url.pathname)
  if (!route) return null
  if (route.kind === 'index') {
    return {
      component: (await import('./pages/index/page.vue')).default,
      props: {},
      title: 'Silent Widgets',
      lang: 'zh-CN',
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
  return {
    component,
    props: { ...prepared, origin: url.origin },
    title: route.kind === 'widget' ? widget.meta.title : `${widget.meta.name}配置 · Silent Widgets`,
    lang:
      route.kind === 'config'
        ? 'zh-CN'
        : prepared.values.lang === 'auto'
          ? automatic
          : String(prepared.values.lang),
    meta: [
      { property: 'og:title', content: `Silent Widgets - ${widget.meta.englishName}` },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: new URL(`/${widget.id}`, url.origin).href },
      { property: 'og:image', content: new URL(widget.meta.cover, url.origin).href },
    ],
  }
}
