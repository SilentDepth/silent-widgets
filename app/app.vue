<script setup vapor lang="ts">
import { useHead } from '@unhead/vue'
import { computedAsync } from '@vueuse/core'
import { lang } from '@/composables/use-i18n'
import { getWidget } from '@/widgets'

const props = defineProps<{ name: string }>()
const searchParams = new URL(location.href).searchParams
const widgetProps = normalizeParams(Object.fromEntries(searchParams.entries()))

lang.value = searchParams.get('lang') || navigator.language

if (typeof widgetProps.bg === 'string' && widgetProps.bg) {
  const colors = widgetProps.bg.split(',')
  document.documentElement.style.setProperty('--bg-color', colors[0])
  document.documentElement.style.setProperty('--bg-color-dark', colors[1] || colors[0])
}

useHead({
  htmlAttrs: {
    lang: lang.value,
  },
})

const Widget = computedAsync(() => getWidget(props.name))

function normalizeParams(params: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, value === '' ? true : value]),
  ) as Record<string, string | boolean>
}
</script>

<template>
  <div>
    <component :is="Widget" v-bind="widgetProps" />
  </div>
</template>

<style scoped></style>
