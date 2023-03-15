import { useEffect, useState } from 'react'

type LangMessages = Record<string, string>
type LangResolver = () => Promise<LangMessages>
let langs: Record<string, LangResolver> = {}

const DEFAULT_LANG = 'en-US'

export default function useI18n (langsInit?: Record<string, LangResolver>) {
  const [langData, setLangData] = useState<LangMessages>({})

  useEffect(() => {
    if (langsInit) {
      langs = langsInit
    }
  }, [])

  const [lang, _setLang] = useState('')
  const setLang = (value: string) => _setLang(value in langs ? value : (lang || DEFAULT_LANG))

  useEffect(() => {
    setLang(resolveDefaultLang())
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang)
    langs[lang]?.().then(data => setLangData(data))
  }, [lang])

  const t = (key: string) => {
    return langData[key] || key
  }

  return {
    lang,
    setLang,
    t,
  }
}

function resolveDefaultLang () {
  return new URL(location.href).searchParams.get('lang') || navigator.language
}
