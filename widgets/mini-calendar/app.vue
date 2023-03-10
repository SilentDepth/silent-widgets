<script lang="ts" setup>
import useSearchParams from '~/composables/use-search-params'

let now = $ref(import.meta.env.PROD ? new Date() : new Date())
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

if (import.meta.env.PROD) {
  setInterval(() => now = new Date(), 60000)
}

const params = useSearchParams({
  primary: '#37352f,#ffffffcf',
  secondary: '#37352f6b,#ffffff47',
  bg: '#ffffff,#191919',
})
const primaryColor = params.primary.split(',')
const secondaryColor = params.secondary.split(',')
const bgColor = params.bg.split(',')
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
div.widget(class="h-screen overflow-hidden0 bg-[var(--bg-color)] dark:bg-[var(--bg-color-dark)] grid place-content-center place-items-center" :style="cssVars")
  div.cell(
    v-for="d of dates"
    :class="['rounded-full', d.today ? 'today box-content grid place-content-center' : '', d.day === 0 || d.day === 6 ? 'bg-[var(--secondary-color)] dark:bg-[var(--secondary-color-dark)]' : 'bg-[var(--primary-color)] dark:bg-[var(--primary-color-dark)]']"
    :style="{ gridColumnStart: d.date === 1 ? d.day + 1 : null }"
  )
    span(v-if="d.today" class="text-[var(--bg-color)] dark:text-[var(--bg-color-dark)]") {{ d.date }}
</template>

<style scoped>
.widget {
  @apply text-sm;
  --cell-size: 24px;
  --dot-size: 8px;
}

@media (max-height: 143px) {
  .widget {
    @apply text-xs;
    --cell-size: 16px;
    --dot-size: 6px;
  }

  .cell.today {
    padding: 2px;
  }
}

.widget {
  grid-template-columns: repeat(7, var(--cell-size));
  grid-auto-rows: var(--cell-size);
}

.cell {
  width: var(--dot-size);
  height: var(--dot-size);
}

.cell.today {
  width: 100%;
  height: 100%;
}
</style>
