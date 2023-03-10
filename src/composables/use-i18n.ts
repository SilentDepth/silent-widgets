import { watch } from 'vue'

import useSearchParams from './use-search-params'

const DEFAULT_LANG = 'en-US'

type LangMessages = Record<string, string>
type LangResolver = () => Promise<LangMessages>
let langs = $ref<Record<string, LangResolver>>({})

let _lang = $ref('')
let lang = $computed({
  get: () => _lang,
  set: value => _lang = value in langs ? value : (_lang || DEFAULT_LANG),
})
let langData = $ref<Record<string, string>>({})

watch($$(_lang), async lang => {
  document.documentElement.setAttribute('lang', lang)
  langData = await langs[lang]()
})

function t (key: string): string {
  return langData[key] || key
}

export default function useI18n (langsInit?: Record<string, LangResolver>, langInit?: string) {
  if (langsInit) {
    langs = langsInit
  }

  if (langInit) {
    lang = langInit
  }
  // if `lang` has not been initialized (which means no lang data is loaded),
  // initialize it with the default language
  else if (!lang) {
    lang = resolveDefaultLang()
  }

  return {
    lang,
    t,
  }
}

function resolveDefaultLang () {
  const params = useSearchParams()
  return params.lang || navigator.language
}
