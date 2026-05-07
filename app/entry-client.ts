import { createHead } from '@unhead/vue/client'
import { match } from 'arktype'
import { createVaporSSRApp as createApp } from 'vue'
import App from './app.vue'
import { fetchResource } from '@/composables/use-i18n'
import { parseWidgetInit } from '@/utils/widget-utils'

async function main() {
  const { name, params, styleProps } = parseWidgetInit(location.href, {
    navigator: window.navigator,
  })
  const lang = match
    .case({ params: { lang: 'string >= 2' } }, ({ params }) => params.lang)
    .default(() => navigator.language)({ params })

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
      },
      lang
        ? {
            htmlAttrs: { lang },
          }
        : undefined,
    ],
  })
  app.use(head).mount('#root')
}

void main()
