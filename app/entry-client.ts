import { createHead } from '@unhead/vue/client'
import { createVaporSSRApp as createApp } from 'vue'
import { i18nKey, resolveLanguage } from '@/composables/use-i18n'
import { parseWidgetInit } from '@/utils/widget-utils'
import { getWidget } from '@/widgets'
import '@/assets/styles/main.css'

async function main() {
  const { name, params, styleProps } = parseWidgetInit(location.href)
  const lang = resolveLanguage(document.documentElement.lang)

  const widget = await getWidget(name, lang)
  if (!widget) throw new Error('Widget not found')

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
      },
    ],
  })
  app.use(head).mount('#root')
}

void main()
