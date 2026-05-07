<script setup vapor lang="ts">
import { useHead } from '@unhead/vue'
import { defineVaporAsyncComponent } from 'vue'
import { fetchResource, lang } from '@/composables/use-i18n'
import { getWidget } from '@/widgets'

const props = defineProps<{
  name: string
  params?: Record<string, string | boolean>
}>()

if (props.params?.lang) {
  lang.value = props.params.lang
}

useHead({
  htmlAttrs: {
    lang: lang.value,
  },
})

const Widget = defineVaporAsyncComponent(() => getWidget(props.name))
</script>

<template>
  <div>
    <component :is="Widget" v-bind="params" />
  </div>
</template>

<style scoped></style>
