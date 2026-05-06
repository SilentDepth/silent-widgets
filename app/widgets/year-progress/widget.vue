<script lang="ts">
const MONTH_DAYS = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
</script>

<script setup vapor lang="ts">
import { useHead } from '@unhead/vue'
import { computed, ref, watchEffect } from 'vue'
import useI18n from '@/composables/use-i18n'

const props = defineProps({
  primary: {
    type: String,

    default: '#37352f,#ffffffcf',
  },
  secondary: {
    type: String,
    default: '#37352f29,#ffffff21',
  },
})

useHead({
  title: 'SILENT YEAR PROGRESS',
  meta: [
    { property: 'og:title', content: 'Silent Widgets - Year Progress' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://widgets.silent.land/year-progress' },
    { property: 'og:image', content: 'https://widgets.silent.land/covers/year-progress.png' },
  ],
})

const { t } = useI18n('year-progress')

// Date

const now = ref(new Date())
const nowYear = computed(() => now.value.getFullYear())
const nowMonth = computed(() => now.value.getMonth() + 1)
const nowDate = computed(() => now.value.getDate())
const nowWeekday = computed(() => now.value.getDay())
const months = computed(() => {
  const febDays = new Date(now.value.getFullYear(), 2, 0).getDate()
  return Array.from({ length: 12 }, (_, idx) => ({
    num: idx + 1,
    days: idx === 1 ? febDays : MONTH_DAYS[idx],
  }))
})

if (import.meta.env.PROD) {
  watchEffect(() => {
    const int = setInterval(() => {
      now.value = new Date()
    }, 60_000)
    return () => clearInterval(int)
  })
}

// Colors

const primaryColors = props.primary.split(',')
const secondaryColors = props.secondary.split(',')
const cssVars = {
  '--primary-color': primaryColors[0],
  '--primary-color-dark': primaryColors[1] || primaryColors[0],
  '--secondary-color': secondaryColors[0],
  '--secondary-color-dark': secondaryColors[1] || secondaryColors[0],
}
</script>

<template>
  <div
    class="h-screen overflow-hidden text-(--primary-color) dark:text-(--primary-color-dark) text-xs leading-none whitespace-nowrap flex items-center space-x-0.5"
    :style="cssVars"
  >
    <div
      v-for="m of months"
      :key="m.num"
      :class="`h-1 relative ${m.num < nowMonth ? 'bg-current' : 'bg-(--secondary-color) dark:bg-(--secondary-color-dark)'}`"
      :style="{ flex: `${m.days} ${m.days} 0` }"
    >
      <template v-if="m.num === nowMonth">
        <span class="absolute left-0 bottom-full flex flex-col space-y-0.5 mb-1">
          <span>{{ nowYear }}</span>
          <strong>{{ t(`month.${m.num}`) }}</strong>
        </span>
        <div
          class="relative h-full bg-[currentColor]"
          :style="{ width: (nowDate / m.days) * 100 + '%' }"
        >
          <span class="absolute left-0 top-full w-full text-right flex flex-col space-y-0.5 mt-1">
            <strong>{{ nowDate }}</strong>
            <span>{{ t(`weekday.${nowWeekday}`) }}</span>
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<style>
@import 'tailwindcss' source(none);
@source 'widget.vue';
</style>
