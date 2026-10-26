import { createHead } from '@unhead/vue/client'
import { createVaporSSRApp as createApp } from 'vue'
import { i18nKey, resolveLanguage } from '@/composables/use-i18n'
import { parseWidgetInit } from '@/utils/widget-utils'
import '@/assets/styles/main.css'
import routes from './routes'

async function main() {
  const { name, params, styleProps } = parseWidgetInit(location.href)
  const lang = resolveLanguage(document.documentElement.lang)

  const route = routes[`/${name}`]
  if (!route) throw new Error('Widget not found')

  const app = createApp(await route.loadComponent(), params)
  app.provide(i18nKey, { lang, resource: await route.loadI18nResources?.(lang) })
  const head = createHead({
    init: [
      {
        htmlAttrs: {
          lang,
          style: Object.entries(styleProps)
            .map(entry => entry.join(':'))
            .join(';'),
        },
      },
    ],
  })
  app.use(head).mount('#root')
}

void main()
