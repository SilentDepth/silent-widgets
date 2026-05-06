<script setup vapor lang="ts">
import { useHead } from '@unhead/vue'
import { computedAsync } from '@vueuse/core'
import { lang } from '@/composables/use-i18n'
import { getWidget } from '@/widgets'

const props = defineProps<{ name: string }>()

useHead({
  htmlAttrs: {
    lang: lang.value,
  },
})

const Widget = computedAsync(() => getWidget(props.name))
</script>

<template>
  <div>
    <component :is="Widget" />
  </div>
</template>

<style scoped></style>
