<script setup vapor lang="ts">
import { onMounted, shallowRef } from 'vue'

const isMounted = shallowRef(false)

onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <slot v-if="isMounted" />
  <slot v-else name="fallback" />
</template>
