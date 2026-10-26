import { siteMessages } from '@/i18n/site'
import { localize } from '@/i18n/text'
import type { LocalizedText } from '@/i18n/text'
import { autoLanguageKey, SupportedLang } from './use-i18n'

export function useSiteI18n() {
  const lang = inject(autoLanguageKey, SupportedLang.enUS)
  const l = (text: LocalizedText | undefined) => localize(text, lang)
  function t(key: keyof typeof siteMessages, values: Record<string, string | number> = {}) {
    return l(siteMessages[key]).replace(/\{(\w+)\}/g, (match, name: string) =>
      values[name] === undefined ? match : String(values[name]),
    )
  }
  return { lang, l, t }
}
