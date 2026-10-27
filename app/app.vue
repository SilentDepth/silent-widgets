<script setup vapor lang="ts">
import { useHead } from '@unhead/vue'
import { useSiteLanguage } from '@/composables/use-site-language'
import { localize } from '@/i18n/text'
import type { PageView } from './routes'

const props = defineProps<{ view: PageView }>()

const { language } = useSiteLanguage()
const title = computed(() => localize(props.view.page.title, language.value))
useHead(() => ({
  title: title.value,
  htmlAttrs: { lang: props.view.page.kind === 'widget' ? props.view.page.lang : language.value },
  meta: props.view.page.meta.map(meta =>
    meta.property === 'og:title' ? { ...meta, content: title.value } : meta,
  ),
}))
</script>

<template>
  <component v-if="view.page.layout" :is="view.page.layout" :is-home="view.page.kind === 'index'">
    <component :is="view.page.component" :key="view.revision" v-bind="view.page.props" />
  </component>
  <component v-else :is="view.page.component" :key="view.revision" v-bind="view.page.props" />
</template>
