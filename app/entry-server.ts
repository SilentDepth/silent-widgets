import { createHead, transformHtmlTemplate } from '@unhead/vue/server'
import { createVaporSSRApp as createApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createI18n, i18nKey, resolveLanguage } from '@/composables/use-i18n'
import { parseWidgetInit } from '@/utils/widget-utils'
import indexHtml from '../index.html?raw'
import App from './app.vue'
import assets from './entry-client?assets=client'

export default {
  fetch: async (req: Request) => {
    console.log('Request:', req.url)

    const { name, params, styleProps } = parseWidgetInit(req.url)
    const i18n = createI18n(resolveLanguage(params.lang ?? req.headers.get('accept-language')))
    await i18n.fetchResource(name)

    const app = createApp(App, { name, params })
    app.provide(i18nKey, i18n)

    const head = createHead({
      init: [
        {
          htmlAttrs: {
            lang: i18n.lang.value,
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
