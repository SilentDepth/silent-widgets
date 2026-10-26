import { createHead } from '@unhead/vue/client'
import { createVaporSSRApp as createApp } from 'vue'
import { autoLanguageKey, resolveLanguage } from '@/composables/use-i18n'
import { pageNavigationKey } from '@/composables/use-page-navigation'
import { resolveWidgetRoute } from '@/utils/widget-utils'
import '@/assets/styles/main.css'
import App from './app.vue'
import { loadPage } from './routes'
import type { PageView } from './routes'

async function main() {
  const root = document.getElementById('root')!
  const automatic = resolveLanguage(root.dataset.widgetLang)
  const url = new URL(location.href)
  const page = await loadPage(url, automatic)
  if (!page) return
  const view = shallowReactive<PageView>({ page, revision: 0 })
  const app = createApp(App, { view })
  app.provide(autoLanguageKey, automatic)
  app.use(createHead())
  const navigation =
    resolveWidgetRoute(url.pathname)?.kind !== 'widget'
      ? (await import('./navigation')).createPageNavigation(view, url, automatic, root)
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
