import { SupportedLang } from './use-i18n'

const LANGUAGE_COOKIE = 'silent-widgets-language'

export function resolveSiteLanguage(cookie: string | null, fallback: SupportedLang): SupportedLang {
  const value = cookie
    ?.split(';')
    .map(part => part.trim())
    .find(part => part.startsWith(`${LANGUAGE_COOKIE}=`))
    ?.slice(LANGUAGE_COOKIE.length + 1)
  return value === SupportedLang.enUS || value === SupportedLang.zhCN ? value : fallback
}

export function createSiteLanguage(initial: SupportedLang) {
  const language = shallowRef(initial)
  return {
    language: readonly(language),
    setLanguage(value: string) {
      if (value !== SupportedLang.enUS && value !== SupportedLang.zhCN) return
      language.value = value
      try {
        document.cookie = `${LANGUAGE_COOKIE}=${value}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
      } catch {
        // Keep the selection for this visit when the browser blocks cookies.
      }
    },
  }
}

export const siteLanguageKey: InjectionKey<ReturnType<typeof createSiteLanguage>> =
  Symbol('site-language')

export function useSiteLanguage() {
  const context = inject(siteLanguageKey)
  if (!context) throw new Error('Site language is not provided')
  return context
}
