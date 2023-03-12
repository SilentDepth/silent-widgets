<script lang="ts" setup>
const props = defineProps({
  bg: {
    type: String,
    default: '',
  },
  sun: {
    type: String,
    default: '#f59e0b',
  },
})

// Colors

const _bgColors = props.bg.split(',')
const bgColor = _bgColors[0]
const bgColorDark = _bgColors[1] || _bgColors[0]
const cssVars = {
  '--bg-color': bgColor,
  '--bg-color-dark': bgColorDark,
  '--sun-color': props.sun,
}

// Time

let now = $ref(import.meta.env.PROD ? new Date() : new Date(2023, 2, 12, 9))

if (import.meta.env.PROD) {
  setInterval(() => now = new Date(), 6e4)
}

const angle = $computed(() => {
  const nowYear = now.getFullYear()
  const nowMonth = now.getMonth()
  const nowDate = now.getDate()
  const startOfToday = new Date(nowYear, nowMonth, nowDate).getTime()
  const startOfTomorrow = new Date(nowYear, nowMonth, nowDate + 1).getTime()
  return (now.getTime() - startOfToday) / (startOfTomorrow - startOfToday) * 360
})
</script>

<template lang="pug">
div.widget(class="h-screen overflow-hidden grid place-content-center" :style="cssVars")
  div.orbit(class="relative flex flex-col")
    div.day(class="flex-1 border border-b-0 border-solid rounded-t-full")
    div.night(class="flex-1 border border-t-0 border-solid rounded-b-full")
    div(class="absolute bottom-0 inset-x-0 mx-auto w-0 h-1/2 origin-top flex flex-col justify-end items-center" :style="{ transform: `rotate(${angle}deg)` }")
      div.sun(class="rounded-full translate-y-1/2")
</template>

<style scoped>
.widget {
  --sun-size: 10vmin;
  --orbit-size: calc(100vmin - 20px - var(--sun-size));

  background: var(--bg-color);
}

.orbit {
  width: var(--orbit-size);
  height: var(--orbit-size);
}

.day {
  background: var(--bg-color);
  border-color: var(--secondary-color);
}

.night {
  background: var(--bg-color-dark);
  border-color: transparent;
}

.sun {
  width: var(--sun-size);
  height: var(--sun-size);
  background: var(--sun-color);
  box-shadow: 0 0 10px var(--sun-color);
}

@media (prefers-color-scheme: dark) {
  .widget {
    background: var(--bg-color-dark);
  }

  .day {
    border-color: transparent;
  }

  .night {
    border-color: var(--secondary-color-dark);
  }
}
</style>
