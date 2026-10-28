<script setup vapor lang="ts">
import type { VaporComponent } from 'vue'
import type { WidgetValue } from '@/types/widget'

defineProps<{
  component: VaporComponent
  values: Record<string, WidgetValue>
}>()
</script>

<template>
  <main class="h-dvh w-full overflow-hidden" style="container-type: size">
    <component :is="component" v-bind="values" class="size-full" />
  </main>
</template>
