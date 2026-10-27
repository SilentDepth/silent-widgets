import type { SupportedLang } from '@/composables/use-i18n'
import { defineText } from './text'
import type { LocalizedText } from './text'

export const LANGUAGE_OPTIONS = [
  { value: 'zh-CN', label: defineText('简体中文', 'Simplified Chinese') },
  { value: 'en-US', label: defineText('英语', 'English') },
] as const satisfies readonly { value: SupportedLang; label: LocalizedText }[]
