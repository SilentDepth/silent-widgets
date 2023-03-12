<script lang="ts" setup>
import useI18n from '~/composables/use-i18n'
import langs from './lang'

const { t } = useI18n(langs)

const props = defineProps({
  primary: {
    type: String,
    default: '#37352f,#ffffffcf',
  },
  secondary: {
    type: String,
    default: '#37352f29,#ffffff21',
  },
  bg: {
    type: String,
    default: '#ffffff,#191919',
  },
})

// Date

const MONTH_DAYS = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

let now = $ref(import.meta.env.PROD ? new Date() : new Date(2023, 2, 8))
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

// Colors

const primaryColor = props.primary.split(',')
const secondaryColor = props.secondary.split(',')
const bgColor = props.bg.split(',')
const cssVars = {
  '--primary-color': primaryColor[0],
  '--primary-color-dark': primaryColor[1] || primaryColor[0],
  '--secondary-color': secondaryColor[0],
  '--secondary-color-dark': secondaryColor[1] || secondaryColor[0],
  '--bg-color': bgColor[0],
  '--bg-color-dark': bgColor[1] || bgColor[0],
}
</script>

<template lang="pug">
div(class="h-screen overflow-hidden bg-[var(--bg-color)] dark:bg-[var(--bg-color-dark)] text-[var(--primary-color)] dark:text-[var(--primary-color-dark)] text-xs leading-none whitespace-nowrap flex items-center space-x-0.5" :style="cssVars")
  div(
    v-for="m of months"
    :class="['h-1 relative', m.num < nowMonth ? 'bg-[currentColor]' : 'bg-[var(--secondary-color)] dark:bg-[var(--secondary-color-dark)]']"
    :style="{ flex: `${m.days} ${m.days} 0` }"
  )
    template(v-if="m.num === nowMonth")
      span(class="absolute left-0 bottom-full flex flex-col space-y-0.5 mb-1")
        span {{ nowYear }}
        strong {{ t(`month.${m.num}`) }}
      div(class="relative h-full bg-[currentColor]" :style="{ width: nowDate / m.days * 100 + '%' }")
        span(class="absolute left-0 top-full w-full text-right flex flex-col space-y-0.5 mt-1")
          strong {{ nowDate }}
          span {{ t(`weekday.${nowWeekday}`) }}
</template>
