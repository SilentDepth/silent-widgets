<script setup vapor lang="ts">
import { useMounted } from '@vueuse/core'

const isMounted = useMounted()
</script>

<template>
  <slot v-if="isMounted" />
  <slot v-else name="fallback" />
</template>
