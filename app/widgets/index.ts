const widgets = import.meta.glob<{ default: VaporComponent }>('./*/widget.vue')
const i18nResources = import.meta.glob<{ default: JsonObject }>('./*/i18n/*.json')

export async function getWidget(name: string, lang: string) {
  const loadWidget = widgets[`./${name}/widget.vue`]
  if (!loadWidget) return

  const [widget, resource] = await Promise.all([
    loadWidget(),
    i18nResources[`./${name}/i18n/${lang}.json`]?.(),
  ])

  return { component: widget.default, i18nResource: resource?.default }
}
