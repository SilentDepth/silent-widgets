import { createHead, transformHtmlTemplate } from '@unhead/vue/server'
import { match } from 'arktype'
import { createVaporSSRApp as createApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import indexHtml from '../index.html?raw'
import App from './app.vue'
import assets from './entry-client?assets=client'
import { fetchResource } from '@/composables/use-i18n'
import { parseWidgetInit } from '@/utils/widget-utils'

export default {
  fetch: async (req: Request) => {
    console.log('Request:', req.url)

    const { name, params, styleProps } = parseWidgetInit(req.url, { request: req })
    const lang = match
      .case({ params: { lang: 'string >= 2' } }, ({ params }) => params.lang)
      .case(
        { req: { headers: { 'Accept-Language': 'string >= 2' } } },
        ({ req }) => req.headers['Accept-Language'],
      )
      .default(() => undefined)({ req, params })
    await fetchResource(name, lang)

    const app = createApp(App, { name, params })

    const head = createHead({
      init: [
        {
          htmlAttrs: {
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
        lang
          ? {
              htmlAttrs: {
                lang,
              },
            }
          : undefined,
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
