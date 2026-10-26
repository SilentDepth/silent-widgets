<script setup vapor lang="ts">
import '../widget.css'
import ClientOnly from '@/components/client-only.vue'
import { useWidgetLanguage } from '@/composables/use-i18n'
import useWidgetStyle from '@/composables/use-widget-style'
import { widgetProps } from '@/utils/widget-params'
import { params } from './config'

defineOptions({ inheritAttrs: false })

const props = defineProps(widgetProps(params))
const lang = useWidgetLanguage(() => props.lang)

// Time

const now = ref(new Date())
const angle = computed(() => {
  const nowYear = now.value.getFullYear()
  const nowMonthIdx = now.value.getMonth()
  const nowDate = now.value.getDate()
  const startOfToday = new Date(nowYear, nowMonthIdx, nowDate).getTime()
  const startOfTomorrow = new Date(nowYear, nowMonthIdx, nowDate + 1).getTime()
  return ((now.value.getTime() - startOfToday) / (startOfTomorrow - startOfToday)) * 360
})

{
  const { resume } = useIntervalFn(
    () => {
      now.value = new Date()
    },
    60_000,
    { immediate: false },
  )
  onMounted(resume)
}

const cssVars = useWidgetStyle(() => ({ bg: props.bg, sun: props.sun }))
</script>

<template>
  <client-only>
    <div
      v-bind="$attrs"
      :lang="lang"
      class="silent-widget widget overflow-hidden grid place-content-center"
      :style="cssVars"
    >
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
  </client-only>
</template>

<style scoped>
.widget {
  --sun-size: 10cqmin;
  --orbit-size: calc(100cqmin - 20px - var(--sun-size));

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
