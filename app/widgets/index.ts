import type { JsonObject } from 'type-fest'
import type { VaporComponent } from 'vue'

const widgets = import.meta.glob<{ default: VaporComponent }>('./*/widget.vue')
const i18nResources = import.meta.glob<{ default: JsonObject }>('./*/i18n/*.json')

export async function getWidget(name: string) {
  return (await widgets[`./${name}/widget.vue`]?.())?.default
}

export async function getI18nResource(name: string, lang: string) {
  return (await i18nResources[`./${name}/i18n/${lang}.json`]?.())?.default
}
