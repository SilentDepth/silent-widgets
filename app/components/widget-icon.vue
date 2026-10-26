<script setup vapor lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'progress'">
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M7 10v4m4-4v4m4-4v4" />
    </template>
    <template v-else-if="name === 'calendar'">
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M8 3v4m8-4v4M4 10h16m-12 4h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
    </template>
    <template v-else-if="name === 'date'">
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M8 3v4m8-4v4M4 10h16m-10 4h4l-2 4" />
    </template>
    <template v-else-if="name === 'day'">
      <circle cx="12" cy="12" r="7" />
      <path d="M12 8v4l3 2M12 2v1m0 18v1M2 12h1m18 0h1" />
    </template>
    <path
      v-else-if="name === 'star'"
      d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"
    />
    <template v-else>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </template>
  </svg>
</template>
