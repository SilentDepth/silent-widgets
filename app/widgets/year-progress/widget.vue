<script lang="ts">
const MONTH_DAYS = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
</script>

<script setup vapor lang="ts">
import { useHead } from '@unhead/vue'
import ClientOnly from '@/components/client-only.vue'
import useI18n from '@/composables/use-i18n'

defineOptions({
  inheritAttrs: false,
})

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

const { t } = useI18n()

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
const progressDays = computed(() =>
  months.value.reduce(
    (days, month) =>
      days +
      match(month.num)
        .with(P.number.lt(nowMonth.value), () => month.days)
        .with(nowMonth.value, () => nowDate.value)
        .otherwise(() => 0),
    0,
  ),
)

if (import.meta.env.PROD) {
  const { resume } = useIntervalFn(
    () => {
      now.value = new Date()
    },
    60_000,
    { immediate: false },
  )
  onMounted(resume)
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
  <client-only>
    <div
      v-bind="$attrs"
      class="h-screen overflow-hidden flex flex-col justify-center text-(--primary-color) dark:text-(--primary-color-dark) text-xs leading-none whitespace-nowrap"
      :style="cssVars"
    >
      <div
        class="h-1 relative"
        :style="{
          '--total': months[1].days === 29 ? 366 : 365,
          '--days': progressDays,
          '--month': nowMonth,
          '--gap': '2px',
        }"
      >
        <div class="flex absolute inset-0" style="gap: var(--gap)">
          <div
            v-for="m of months"
            :key="m.num"
            class="bg-(--secondary-color) dark:bg-(--secondary-color-dark)"
            :style="{ flex: `${m.days} 0 0` }"
          >
            <transition
              appear
              appear-from-class="opacity-0"
              appear-active-class="duration-1000 delay-1000 ease-linear"
            >
              <div
                v-if="m.num === nowMonth"
                class="size-full relative"
                :style="{ width: `${(nowDate / m.days) * 100}%` }"
              >
                <span class="flex flex-col gap-0.5 absolute left-0 bottom-full -translate-y-1">
                  <span>{{ nowYear }}</span>
                  <strong>{{ t(`month.${m.num}`) }}</strong>
                </span>
                <span
                  class="flex flex-col gap-0.5 absolute left-0 top-full w-full text-right translate-y-1"
                >
                  <strong>{{ nowDate }}</strong>
                  <span>{{ t(`weekday.${nowWeekday}`) }}</span>
                </span>
              </div>
            </transition>
          </div>
        </div>
        <transition appear appear-active-class="transition duration-2000 ease-cubic-out">
          <div
            class="overflow-hidden absolute inset-0 widget-track"
            :style="{
              '--w': 'calc(100% - var(--gap) * 11) / var(--total)',
              '--progress': 'calc(var(--w) * var(--days) + (var(--month) - 1) * var(--gap))',
              '--offset': 'calc(100% - var(--progress))',
            }"
          >
            <transition appear appear-active-class="transition duration-2000 ease-cubic-out">
              <div
                class="flex h-full widget-progress"
                :style="{
                  gap: 'var(--gap)',
                }"
              >
                <div
                  v-for="m of months"
                  :key="m.num"
                  class="bg-current"
                  :style="{ flex: `${m.days} 0 0` }"
                />
              </div>
            </transition>
          </div>
        </transition>
      </div>
    </div>
  </client-only>
</template>

<style>
@import 'tailwindcss' source(none);
@source 'widget.vue';

@theme {
  --ease-cubic-out: cubic-bezier(0.215, 0.61, 0.355, 1);
}

.widget-track {
  translate: calc(-1 * var(--offset));

  &.v-enter-from {
    translate: -100%;
  }
}

.widget-progress {
  translate: var(--offset);

  &.v-enter-from {
    translate: 100%;
  }
}
</style>
