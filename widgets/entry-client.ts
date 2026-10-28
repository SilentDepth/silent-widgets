import '@/assets/styles/main.css'
import { resolveLanguage } from '@/composables/use-i18n'
import { createWidgetApp } from './create-app'

const root = document.getElementById('widget-root')!
const { app } = await createWidgetApp(
  new URL(location.href),
  resolveLanguage(root.dataset.language),
)
app.mount(root)

if (import.meta.hot) import.meta.hot.dispose(() => app.unmount())
