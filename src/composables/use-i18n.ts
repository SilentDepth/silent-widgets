import { watch } from 'vue'

import langs from '../assets/lang'

const DEFAULT_LANG = 'en-US'

let _lang = $ref(DEFAULT_LANG)
export let lang = $computed({
  get: () => _lang,
  set: value => _lang = value in langs ? value : _lang,
})
let langData = $ref<Record<string, string>>({})

lang = navigator.language

watch($$(_lang), async lang => {
  document.documentElement.setAttribute('lang', lang)
  langData = await langs[lang]()
}, { immediate: true })

export function t (key: string): string {
  return langData[key] || key
}
