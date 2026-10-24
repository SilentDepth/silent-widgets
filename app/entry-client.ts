import { createHead } from '@unhead/vue/client'
import { createVaporSSRApp as createApp } from 'vue'
import { createI18n, i18nKey, resolveLanguage } from '@/composables/use-i18n'
import { parseWidgetInit } from '@/utils/widget-utils'
import App from './app.vue'

async function main() {
  const { name, params, styleProps } = parseWidgetInit(location.href)
  const i18n = createI18n(resolveLanguage(document.documentElement.lang))

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
      },
    ],
  })
  app.use(head).mount('#root')
}

void main()
