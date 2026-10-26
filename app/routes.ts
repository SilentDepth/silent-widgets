const widgets = import.meta.glob<{ default: VaporComponent }>('./pages/*/page.vue')
const i18nResources = import.meta.glob<{ default: JsonObject }>('./pages/*/i18n/*.json')

interface Route {
  path: string
  loadComponent: () => Promise<VaporComponent>
  loadI18nResources?: (locale: string) => Promise<JsonObject | undefined>
}

export default {
  '/': {
    path: '/',
    loadComponent: () => import('./pages/index/page.vue').then(m => m.default),
  },
  ...Object.fromEntries(
    Object.entries(widgets).map(([modulePath, loader]) => {
      const name = modulePath.slice('./pages/'.length, -'/page.vue'.length)
      const path = `/${name}`
      return [
        path,
        {
          path,
          loadComponent: () => loader().then(m => m.default),
          loadI18nResources: async (locale: string) =>
            (await i18nResources[`./pages/${name}/i18n/${locale}.json`]?.())?.default,
        },
      ]
    }),
  ),
} as Record<string, Route>
