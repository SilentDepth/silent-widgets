import { computedAsync } from '@vueuse/core'
import type { JsonObject, ValueOf } from 'type-fest'
import { computed, inject, ref, type InjectionKey } from 'vue'
import { getI18nResource } from '@/widgets'

export const SupportedLang = {
  enUS: 'en-US',
  zhCN: 'zh-CN',
} as const
export type SupportedLang = ValueOf<typeof SupportedLang>

const DEFAULT_LANG: SupportedLang = SupportedLang.enUS
export const i18nKey: InjectionKey<ReturnType<typeof createI18n>> = Symbol('i18n')

function isSupportedLang(value: unknown): value is SupportedLang {
  return Object.values(SupportedLang).includes(value as SupportedLang)
}

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

export function createI18n(initialLang: SupportedLang) {
  const currentLang = ref(initialLang)
  const lang = computed({
    get: () => currentLang.value,
    set: (value: string) => {
      currentLang.value = isSupportedLang(value) ? value : DEFAULT_LANG
    },
  })
  const cache = ref<Record<string, Record<string, JsonObject | undefined>>>({})

  async function fetchResource(name: string, language: SupportedLang = lang.value) {
    const resource = await getI18nResource(name, language)
    cache.value[language] ??= {}
    cache.value[language][name] = resource
  }

  return { lang, cache, fetchResource }
}

export default function useI18n(name: string) {
  const i18n = inject(i18nKey)
  if (!i18n) throw new Error('The app must provide an i18n instance before rendering.')

  const { lang, cache } = i18n
  const resource = computedAsync(
    () => getI18nResource(name, lang.value),
    cache.value[lang.value]?.[name],
  )

  function t(key: string) {
    return resource?.value?.[key] || key
  }

  return {
    lang,
    t,
  }
}
