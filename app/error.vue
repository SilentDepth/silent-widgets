<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
const { language } = useSiteLanguage()
</script>

<template>
  <pre>{{
    error.statusCode === 404
      ? language === 'zh-CN'
        ? '页面不存在'
        : 'Page not found'
      : error.message
  }}</pre>
</template>
