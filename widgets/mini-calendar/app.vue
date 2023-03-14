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
    default: '#37352f6b,#ffffff47',
  },
  bg: {
    type: String,
    default: '#ffffff,#191919',
  },
  weekstart: {
    type: String,
    default: '0',
  },
})

// Date

let now = $ref(import.meta.env.PROD ? new Date() : new Date(2023, 2, 10))
const nowMonth = $computed(() => now.getMonth() + 1)
const nowDate = $computed(() => now.getDate())
const firstWeekday = $computed(() => new Date(now.getFullYear(), now.getMonth(), 1).getDay())
const maxDate = $computed(() => new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate())
const dates = $computed(() => Array.from({ length: maxDate }, (_, idx) => {
  const date = idx + 1
  return {
    date,
    day: (firstWeekday + idx) % 7,
    today: date === nowDate,
  }
}))
const firstDateColStart = $computed(() => (dates[0].day - Number(props.weekstart) + 7) % 7 + 1)

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
div.root(class="h-screen overflow-hidden bg-[var(--bg-color)] dark:bg-[var(--bg-color-dark)] grid place-content-center" :style="cssVars")
  div.widget(class="grid place-items-center")
    div.month(class="col-span-6 justify-self-start") {{ t(`month.${nowMonth}`) }}
    div.dot(
      v-for="d of dates"
      :class="['aspect-square rounded-full', d.today ? 'today leading-none grid place-content-center' : '', d.day === 0 || d.day === 6 ? 'bg-[var(--secondary-color)] dark:bg-[var(--secondary-color-dark)]' : 'bg-[var(--primary-color)] dark:bg-[var(--primary-color-dark)]']"
      :style="{ gridColumnStart: d.date === 1 ? firstDateColStart : null }"
    )
      span(v-if="d.today" class="text-[var(--bg-color)] dark:text-[var(--bg-color-dark)]") {{ d.date }}
</template>

<style lang="scss" scoped>
.root {
  --widget-width: calc(100vw - 2px);
  --widget-height: calc(100vh - 2px);
  --cell-size: min(calc(var(--widget-width) / 7), calc(var(--widget-height) / 6));
  --dot-size: clamp(6px, calc(var(--cell-size) / 3.3), 9999px);
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
