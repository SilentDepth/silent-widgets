import { computedAsync } from '@vueuse/core'
import type { JsonObject, ValueOf } from 'type-fest'
import { computed, ref } from 'vue'
import { getI18nResource } from '@/widgets'

export const SupportedLang = {
  enUS: 'en-US',
  zhCN: 'zh-CN',
} as const
export type SupportedLang = ValueOf<typeof SupportedLang>

const DEFAULT_LANG: SupportedLang = SupportedLang.enUS
const _lang = ref<SupportedLang>(DEFAULT_LANG)
export const lang = computed({
  get: () => _lang.value,
  set: (value: string) => {
    _lang.value = isSupportedLang(value) ? value : DEFAULT_LANG
  },
})

function isSupportedLang(value: unknown): value is SupportedLang {
  return Object.values(SupportedLang).includes(value as SupportedLang)
}

export const cache = ref<Record<string, Record<string, JsonObject>>>({})

export async function fetchResource(name: string, lang: string = _lang.value) {
  const resource = await getI18nResource(name, lang)
  cache.value[lang] ??= {}
  cache.value[lang][name] = resource
}

export default function useI18n(name: string) {
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
