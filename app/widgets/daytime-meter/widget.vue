<script setup vapor lang="ts">
import { useHead } from '@unhead/vue'
import { computed, ref, watchEffect } from 'vue'

const props = defineProps({
  sun: {
    type: String,
    default: '#f59e0b',
  },
})

useHead({
  title: 'SILENT DAYTIME METER',
  meta: [
    { property: 'og:title', content: 'Silent Widgets - Daytime Meter' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://widgets.silent.land/daytime-meter' },
    { property: 'og:image', content: 'https://widgets.silent.land/covers/daytime-meter.png' },
  ],
})

// Time

const now = ref(import.meta.env.PROD ? new Date() : new Date('2023-03-12 09:00:00'))
const angle = computed(() => {
  const nowYear = now.value.getFullYear()
  const nowMonthIdx = now.value.getMonth()
  const nowDate = now.value.getDate()
  const startOfToday = new Date(nowYear, nowMonthIdx, nowDate).getTime()
  const startOfTomorrow = new Date(nowYear, nowMonthIdx, nowDate + 1).getTime()
  return ((now.value.getTime() - startOfToday) / (startOfTomorrow - startOfToday)) * 360
})

if (import.meta.env.PROD) {
  watchEffect(onCleanup => {
    const int = setInterval(() => {
      now.value = new Date()
    }, 60_000)
    onCleanup(() => clearInterval(int))
  })
}

// Colors

const cssVars = {
  '--sun-color': props.sun,
}
</script>

<template>
  <div class="widget h-screen overflow-hidden grid place-content-center" :style="cssVars">
    <div class="orbit relative flex flex-col">
      <div class="day flex-1 border-2 border-b-0 border-solid rounded-t-full"></div>
      <div class="night flex-1 border-2 border-t-0 border-solid rounded-b-full"></div>
      <div
        class="absolute bottom-0 inset-x-0 mx-auto w-0 h-1/2 origin-top flex flex-col justify-end items-center"
        :style="{ transform: `rotate(${angle}deg)` }"
      >
        <div class="sun rounded-full translate-y-1/2"></div>
      </div>
    </div>
  </div>
</template>

<style>
@import 'tailwindcss' source(none);
@source 'widget.vue';

.widget {
  --sun-size: 10vmin;
  --orbit-size: calc(100vmin - 20px - var(--sun-size));

  background: var(--bg-color);

  @media (prefers-color-scheme: dark) {
    background: var(--bg-color-dark);
  }
}

.orbit {
  width: var(--orbit-size);
  height: var(--orbit-size);
}

.day {
  background: var(--bg-color);
  border-color: var(--secondary-color);

  @media (prefers-color-scheme: dark) {
    border-color: transparent;
  }
}

.night {
  background: var(--bg-color-dark);
  border-color: transparent;

  @media (prefers-color-scheme: dark) {
    border-color: var(--secondary-color-dark);
  }
}

.sun {
  width: var(--sun-size);
  height: var(--sun-size);
  background: var(--sun-color);
  box-shadow: 0 0 10px var(--sun-color);
}
</style>
