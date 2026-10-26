export const SupportedLang = {
  enUS: 'en-US',
  zhCN: 'zh-CN',
} as const
export type SupportedLang = ValueOf<typeof SupportedLang>

const DEFAULT_LANG: SupportedLang = SupportedLang.enUS
export const i18nKey: InjectionKey<{
  lang: SupportedLang
  resource?: JsonObject
}> = Symbol('i18n')

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
      lang => lang.toLowerCase() === language || lang.split('-')[0] === language,
    )
    if (supported) return supported
  }
  return DEFAULT_LANG
}

export default function useI18n() {
  const i18n = inject(i18nKey)
  if (!i18n) throw new Error('The app must provide an i18n instance before rendering.')

  const { lang, resource } = i18n

  function t(key: string) {
    return resource?.[key] || key
  }

  return {
    lang,
    t,
  }
}
