<script setup vapor lang="ts">
import { widgets } from '@/widgets/registry'
</script>

<template>
  <main class="max-w-xl mx-auto p-4">
    <h1 class="text-3xl font-semibold my-8">Silent Widgets</h1>
    <p>给 Notion 页面添加日历、进度和计数。</p>
    <ul class="mt-8 grid gap-4">
      <li v-for="widget of widgets" :key="widget.id">
        <a :href="`/${widget.id}/config`">{{ widget.meta.name }} →</a>
        <p>{{ widget.meta.description }}</p>
      </li>
    </ul>
  </main>
</template>
