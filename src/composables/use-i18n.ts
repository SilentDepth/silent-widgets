import { watch } from 'vue'

import langs from '../assets/lang'

const DEFAULT_LANG = 'en-US'

let _lang = $ref('')
let lang = $computed({
  get: () => _lang,
  set: value => {
    _lang = value in langs
      ? value
      : _lang
        ? _lang
        : navigator.language in langs
          ? navigator.language
          : DEFAULT_LANG
  },
})
let langData = $ref<Record<string, string>>({})

watch($$(_lang), async lang => {
  document.documentElement.setAttribute('lang', lang)
  langData = await langs[lang]()
})

function t (key: string): string {
  return langData[key] || key
}

export default function useI18n (langInit?: string) {
  if (langInit) {
    lang = langInit
  }
  // if `lang` has not been initialized (which means no lang data is loaded),
  // initialize it with the default resolver
  else if (!lang) {
    lang = ''
  }

  return {
    lang,
    t,
  }
}
