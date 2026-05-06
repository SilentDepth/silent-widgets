import { computedAsync } from '@vueuse/core'
import type { ValueOf } from 'type-fest'
import { ref, watchEffect } from 'vue'
import { getI18nResource } from '@/widgets'

export const SupportedLang = {
  enUS: 'en-US',
  zhCN: 'zh-CN',
} as const
export type SupportedLang = ValueOf<typeof SupportedLang>

const DEFAULT_LANG = SupportedLang.enUS
export const lang = ref(DEFAULT_LANG)

watchEffect(() => {
  if (!Object.values(SupportedLang).includes(lang.value)) {
    lang.value = DEFAULT_LANG
  }
})

// TODO: Implement `?lang` support
function resolveDefaultLang() {
  return new URL(location.href).searchParams.get('lang') || navigator.language
}

export default function useI18n(name: string) {
  const resource = computedAsync(() => getI18nResource(name, lang.value))

  function t(key: string) {
    return resource?.value?.[key] || key
  }

  return {
    lang,
    t,
  }
}
