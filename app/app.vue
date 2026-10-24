<script setup vapor lang="ts">
import { defineVaporAsyncComponent } from 'vue'
import { getWidget } from '@/widgets'

const props = defineProps<{
  name: string
  params?: Record<string, string | boolean>
}>()

const Widget = defineVaporAsyncComponent(() => getWidget(props.name))
</script>

<template>
  <div>
    <component :is="Widget" v-bind="params" />
  </div>
</template>

<style scoped></style>
