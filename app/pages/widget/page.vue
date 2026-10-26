<script setup vapor lang="ts">
import type { PropType } from 'vue'
import type { WidgetValue } from '@/types/widget'

defineProps({
  component: { type: Object as PropType<VaporComponent>, required: true },
  values: { type: Object as PropType<Record<string, WidgetValue>>, required: true },
})
defineOptions({ inheritAttrs: false })
</script>

<template>
  <main class="h-dvh w-full overflow-hidden" style="container-type: size">
    <component :is="component" v-bind="values" class="size-full" />
  </main>
</template>
