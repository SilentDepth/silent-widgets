<script setup lang="ts">
const { language } = useSiteLanguage()
useHead(() => ({ htmlAttrs: { lang: language.value } }))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
