<script setup vapor lang="ts">
const isMounted = shallowRef(false)

onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <slot v-if="isMounted" />
  <slot v-else name="fallback" />
</template>
