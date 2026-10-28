import { resolveLanguage, SupportedLang } from './use-i18n'

export function useSiteLanguage() {
  const automatic = useState('automatic-language', () =>
    resolveLanguage(useRequestHeader('accept-language')),
  )
  const cookie = useCookie<string | undefined>('silent-widgets-language', {
    path: '/',
    maxAge: 31_536_000,
    sameSite: 'lax',
    secure: useRequestURL().protocol === 'https:',
  })
  // Keep the current selection shared even when the browser rejects cookie writes.
  const selection = useState<SupportedLang | undefined>('site-language', () => {
    const value = cookie.value
    return value === SupportedLang.enUS || value === SupportedLang.zhCN ? value : undefined
  })
  const language = computed(() => selection.value ?? automatic.value)
  return {
    language,
    setLanguage(value: string) {
      if (value === SupportedLang.enUS || value === SupportedLang.zhCN) {
        selection.value = value
        cookie.value = value
      }
    },
  }
}
