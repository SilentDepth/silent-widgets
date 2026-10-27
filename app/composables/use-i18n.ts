import { getWidgetI18n, loadWidgetI18n } from '@/widgets/i18n'

export const SupportedLang = { enUS: 'en-US', zhCN: 'zh-CN' } as const
export type SupportedLang = ValueOf<typeof SupportedLang>
const DEFAULT_LANG: SupportedLang = SupportedLang.enUS
export const autoLanguageKey: InjectionKey<MaybeRef<SupportedLang>> = Symbol('auto-language')

export function resolveLanguage(value: unknown): SupportedLang {
  if (typeof value !== 'string') return DEFAULT_LANG
  const preferences = value
    .split(',')
    .map(entry => {
      const [language, ...params] = entry.trim().split(';')
      const quality = params.find(param => param.trim().startsWith('q='))
      return {
        language: language.trim().toLowerCase(),
        quality: quality ? Number(quality.trim().slice(2)) : 1,
      }
    })
    .filter(({ quality }) => quality > 0 && quality <= 1)
    .sort((a, b) => b.quality - a.quality)
  for (const { language } of preferences) {
    const supported = Object.values(SupportedLang).find(
      lang => lang.toLowerCase() === language || lang.split('-')[0] === language.split('-')[0],
    )
    if (supported) return supported
  }
  return DEFAULT_LANG
}

export function useWidgetLanguage(requested: () => string) {
  const automatic = inject(autoLanguageKey, DEFAULT_LANG)
  return computed(() =>
    requested() === 'auto' ? toValue(automatic) : resolveLanguage(requested()),
  )
}

export default function useI18n(id: string, requested: () => string) {
  const lang = useWidgetLanguage(requested)
  const resource = shallowRef(getWidgetI18n(id, lang.value) ?? {})
  let revision = 0
  watch(
    lang,
    async value => {
      const current = ++revision
      const cached = getWidgetI18n(id, value)
      if (cached) {
        resource.value = cached
        return
      }
      try {
        const next = await loadWidgetI18n(id, value)
        if (current === revision) resource.value = next
      } catch {
        if (current === revision) resource.value = getWidgetI18n(id, 'en-US') ?? {}
      }
    },
    { immediate: true },
  )
  onScopeDispose(() => {
    revision++
  })
  return { lang, t: (key: string) => resource.value[key] ?? key }
}
