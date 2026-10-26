import { createHead } from '@unhead/vue/client'
import { createVaporSSRApp as createApp } from 'vue'
import { autoLanguageKey, resolveLanguage } from '@/composables/use-i18n'
import '@/assets/styles/main.css'
import { loadPage } from './routes'

async function main() {
  const root = document.getElementById('root')!
  const automatic = resolveLanguage(root.dataset.widgetLang)
  const page = await loadPage(new URL(location.href), automatic)
  if (!page) return
  const app = createApp(page.component, page.props)
  app.provide(autoLanguageKey, automatic)
  app.use(
    createHead({ init: [{ title: page.title, htmlAttrs: { lang: page.lang }, meta: page.meta }] }),
  )
  app.mount(root)
}

void main()
