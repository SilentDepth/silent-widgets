<script lang="ts" setup>
import { t } from './composables/use-i18n'

const MONTH_DAYS = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

let now = $ref(import.meta.env.DEV ? new Date(2023, 2, 20) : new Date())
const months = $computed(() => {
  const febDays = new Date(now.getFullYear(), 2, 0).getDate()
  return Array.from({ length: 12 }, (_, idx) => ({
    num: idx + 1,
    days: idx === 1 ? febDays : MONTH_DAYS[idx],
  }))
})
const nowYear = $computed(() => now.getFullYear())
const nowMonth = $computed(() => now.getMonth() + 1)
const nowDate = $computed(() => now.getDate())
const nowWeekday = $computed(() => now.getDay())

if (import.meta.env.PROD) {
  setInterval(() => now = new Date(), 60000)
}
</script>

<template lang="pug">
div(class="h-screen overflow-hidden text-xs leading-none whitespace-nowrap flex items-center space-x-0.5")
  div(v-for="m of months" :class="['h-1 relative', m.num < nowMonth ? 'bg-[currentColor]' : 'bg-[var(--inactive-color)]']" :style="{ flex: `${m.days} ${m.days} 0` }")
    template(v-if="m.num === nowMonth")
      span(class="absolute left-0 bottom-full flex flex-col space-y-0.5 mb-1")
        span {{ nowYear }}
        strong {{ t(`month.${m.num}`) }}
      div(class="relative h-full bg-[currentColor]" :style="{ width: nowDate / m.days * 100 + '%' }")
        span(class="absolute left-0 top-full w-full text-right flex flex-col space-y-0.5 mt-1")
          strong {{ nowDate }}
          span {{ t(`weekday.${nowWeekday}`) }}
</template>
