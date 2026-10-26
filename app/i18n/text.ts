import type { SupportedLang } from '@/composables/use-i18n'

export type LocalizedText = string | Record<SupportedLang, string>

export function defineText(zhCN: string, enUS: string): Record<SupportedLang, string> {
  return { 'zh-CN': zhCN, 'en-US': enUS }
}

export function localize(text: LocalizedText | undefined, language: SupportedLang): string {
  return typeof text === 'string' ? text : (text?.[language] ?? '')
}
