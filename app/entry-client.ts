import { createHead } from '@unhead/vue/client'
import { createVaporSSRApp as createApp } from 'vue'
import { autoLanguageKey, resolveLanguage } from '@/composables/use-i18n'
import { pageNavigationKey } from '@/composables/use-page-navigation'
import { createSiteLanguage, siteLanguageKey } from '@/composables/use-site-language'
import '@/assets/styles/main.css'
import App from './app.vue'
import { loadPage } from './routes'
import type { PageView } from './routes'

async function main() {
  const root = document.getElementById('root')!
  const automatic = resolveLanguage(root.dataset.widgetLang)
  const url = new URL(location.href)
  const siteLanguage = createSiteLanguage(resolveLanguage(root.dataset.siteLang ?? automatic))
  const page = await loadPage(url, automatic, siteLanguage.language.value)
  if (!page) return
  const view = shallowReactive<PageView>({ page, revision: 0 })
  const app = createApp(App, { view })
  app.provide(autoLanguageKey, automatic)
  app.provide(siteLanguageKey, siteLanguage)
  app.use(createHead())
  const navigation =
    page.kind !== 'widget'
      ? (await import('./navigation')).createPageNavigation(
          view,
          url,
          automatic,
          root,
          () => siteLanguage.language.value,
        )
      : undefined
  if (navigation) app.provide(pageNavigationKey, navigation)
  app.mount(root)
  navigation?.start()
  if (navigation) {
    app.onUnmount(navigation.dispose)
    import.meta.hot?.dispose(navigation.dispose)
  }
}

void main()
