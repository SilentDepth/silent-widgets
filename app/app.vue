<script setup vapor lang="ts">
import { useHead } from '@unhead/vue'
import type { PageView } from './routes'

const props = defineProps<{ view: PageView }>()

useHead(() => ({
  title: props.view.page.title,
  htmlAttrs: { lang: props.view.page.lang },
  meta: props.view.page.meta,
}))
</script>

<template>
  <component :is="view.page.component" :key="view.revision" v-bind="view.page.props" />
</template>
