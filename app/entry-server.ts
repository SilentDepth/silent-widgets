import { createHead, transformHtmlTemplate } from '@unhead/vue/server'
import { createVaporSSRApp as createApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { i18nKey, resolveLanguage } from '@/composables/use-i18n'
import { parseWidgetInit } from '@/utils/widget-utils'
import { getWidget } from '@/widgets'
import assets from './entry-client?assets=client'
import indexHtml from './index.html?raw'

export default {
  fetch: async (req: Request) => {
    console.log('Request:', req.url)

    const { name, params, styleProps } = parseWidgetInit(req.url)
    const lang = resolveLanguage(params.lang ?? req.headers.get('accept-language'))
    const widget = await getWidget(name, lang)
    if (!widget) return new Response('Widget not found', { status: 404 })

    const app = createApp(widget.component, params)
    app.provide(i18nKey, { lang, resource: widget.i18nResource })

    const head = createHead({
      init: [
        {
          htmlAttrs: {
            lang,
            style: Object.entries(styleProps)
              .map(entry => entry.join(':'))
              .join(';'),
          },
          title: 'Silent Widgets',
          link: [
            ...assets.css.map((attrs: any) => ({ rel: 'stylesheet', ...attrs })),
            ...assets.js.map((attrs: any) => ({ rel: 'modulepreload', ...attrs })),
          ],
          script: [{ type: 'module', src: assets.entry }],
        },
      ],
    })
    app.use(head)

    const renderedApp = await renderToString(app)
    const html = transformHtmlTemplate(
      // @unhead/vue/server's beta types return VueHeadClient here, but runtime creates a server head.
      head as Parameters<typeof transformHtmlTemplate>[0],
      indexHtml.replace('<!--outlet-->', renderedApp),
    )

    return new Response(html, {
      headers: { 'Content-Type': 'text/html;charset=utf-8' },
    })
  },
}
