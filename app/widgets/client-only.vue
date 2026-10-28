<script setup vapor lang="ts">
import { onMounted, shallowRef } from 'vue'

const mounted = shallowRef(false)
onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <slot v-if="mounted" />
  <slot v-else name="fallback" />
</template>
