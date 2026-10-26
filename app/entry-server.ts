import { createHead, transformHtmlTemplate } from '@unhead/vue/server'
import { createVaporSSRApp as createApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { autoLanguageKey, resolveLanguage } from '@/composables/use-i18n'
import { defineText, localize } from '@/i18n/text'
import App from './app.vue'
import assets from './entry-client?assets=client'
import indexHtml from './index.html?raw'
import { loadPage } from './routes'

export default {
  fetch: async (req: Request) => {
    const url = new URL(req.url)
    console.log('Request:', url.pathname)
    const automatic = resolveLanguage(req.headers.get('accept-language'))
    const page = await loadPage(url, automatic)
    if (!page)
      return new Response(localize(defineText('页面不存在', 'Page not found'), automatic), {
        status: 404,
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      })

    const app = createApp(App, { view: { page, revision: 0 } })
    app.provide(autoLanguageKey, automatic)
    const head = createHead({
      init: [
        {
          link: assets.css.map((attrs: { href: string }) => ({ rel: 'stylesheet', ...attrs })),
          script: [{ type: 'module', src: assets.entry }],
        },
      ],
    })
    app.use(head)
    const renderedApp = await renderToString(app)
    const html = transformHtmlTemplate(
      head as Parameters<typeof transformHtmlTemplate>[0],
      indexHtml
        .replace('<div id="root">', `<div id="root" data-widget-lang="${automatic}">`)
        .replace('<!--outlet-->', renderedApp),
    )
    return new Response(html, { headers: { 'Content-Type': 'text/html;charset=utf-8' } })
  },
}
