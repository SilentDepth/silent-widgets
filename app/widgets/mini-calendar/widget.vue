<script setup vapor lang="ts">
import { useHead } from '@unhead/vue'
import { computed, ref, watchEffect } from 'vue'
import useI18n from '@/composables/use-i18n'

const props = defineProps({
  weekstart: {
    type: String,
    default: '0',
  },
  primary: {
    type: String,
    default: '#37352f,#ffffffcf',
  },
  secondary: {
    type: String,
    default: '#37352f6b,#ffffff47',
  },
})

useHead({
  title: 'SILENT MINI CALENDAR',
  meta: [
    { property: 'og:title', content: 'Silent Widgets - Mini Calendar' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://widgets.silent.land/mini-calendar' },
    { property: 'og:image', content: 'https://widgets.silent.land/covers/mini-calendar.png' },
  ],
})

const { t } = useI18n('mini-calendar')

// Date

const now = ref(import.meta.env.PROD ? new Date() : new Date('2023-03-10'))
const nowYear = computed(() => now.value.getFullYear())
const nowMonthIdx = computed(() => now.value.getMonth())
const nowMonth = computed(() => nowMonthIdx.value + 1)
const nowDate = computed(() => now.value.getDate())
const firstWeekday = computed(() => new Date(nowYear.value, nowMonthIdx.value, 1).getDay())
const maxDate = computed(() => new Date(nowYear.value, nowMonthIdx.value + 1, 0).getDate())
const dates = computed(() =>
  Array.from({ length: maxDate.value }, (_, idx) => {
    const date = idx + 1
    return {
      date,
      day: (firstWeekday.value + idx) % 7,
      today: date === nowDate.value,
    }
  }),
)
const firstDateColStart = computed(
  () => ((dates.value[0].day - Number(props.weekstart) + 7) % 7) + 1,
)

if (import.meta.env.PROD) {
  watchEffect(onCleanup => {
    const int = setInterval(() => {
      now.value = new Date()
    }, 60_000)
    onCleanup(() => clearInterval(int))
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
  <div class="root h-screen overflow-hidden grid place-content-center" :style="cssVars">
    <div class="widget grid place-items-center">
      <div class="month col-span-6 justify-self-start">{{ t(`month.${nowMonth}`) }}</div>
      <div
        v-for="d of dates"
        :key="d.date"
        class="dot aspect-square rounded-full"
        :class="[
          d.today && 'today leading-none grid place-content-center',
          d.day === 0 || d.day === 6
            ? 'bg-[var(--secondary-color)] dark:bg-[var(--secondary-color-dark)]'
            : 'bg-[var(--primary-color)] dark:bg-[var(--primary-color-dark)]',
        ]"
        :style="{ gridColumnStart: d.date === 1 ? firstDateColStart : undefined }"
      >
        <span v-if="d.today" class="text-[var(--bg-color)] dark:text-[var(--bg-color-dark)]">
          {{ d.date }}
        </span>
      </div>
    </div>
  </div>
</template>

<style>
@import 'tailwindcss' source(none);
@source 'widget.vue';

.root {
  --widget-width: calc(100vw - 2px);
  --widget-height: calc(100vh - 2px);
  --cell-size: min(calc(var(--widget-width) / 7), calc(var(--widget-height) / 6));
  --dot-size: clamp(6px, calc(var(--cell-size) / 3.3), 9999px);

  background: var(--bg-color);
  color: var(--primary-color);

  @media (prefers-color-scheme: dark) {
    background: var(--bg-color-dark);
    color: var(--primary-color-dark);
  }
}

.widget {
  font-size: clamp(12px, calc(var(--cell-size) / 1.7), 9999px);
  grid-template-columns: repeat(7, var(--cell-size));
  grid-template-rows: repeat(6, var(--cell-size));
}

.month {
  padding-left: calc((var(--cell-size) - var(--dot-size)) / 2);
}

.dot {
  width: var(--dot-size);

  &.today {
    width: 100%;
  }
}
</style>
