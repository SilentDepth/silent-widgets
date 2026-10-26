const loaders = import.meta.glob<{ default: Record<string, string> }>('./*/i18n/*.json')
const loaded = new Map<string, Record<string, string>>()
const pending = new Map<string, Promise<Record<string, string>>>()

export function getWidgetI18n(id: string, lang: string) {
  return loaded.get(`${id}/${lang}`)
}

export function loadWidgetI18n(id: string, lang: string) {
  const key = `${id}/${lang}`
  let promise = pending.get(key)
  if (!promise) {
    promise = Promise.resolve(loaders[`./${id}/i18n/${lang}.json`]?.())
      .then(module => {
        const resource = module?.default ?? {}
        loaded.set(key, resource)
        return resource
      })
      .catch(error => {
        pending.delete(key)
        throw error
      })
    pending.set(key, promise)
  }
  return promise
}
