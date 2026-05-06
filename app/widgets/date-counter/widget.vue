<script setup vapor lang="ts">
import { useHead } from '@unhead/vue'
import { computed, ref, watchEffect } from 'vue'
import useI18n from '@/composables/use-i18n'

const ERR_NO_DATE = Symbol()
const ERR_INVALID_DATE = Symbol()

const props = defineProps({
  date: {
    type: String,
    default: '',
  },
  event: {
    type: String,
    default: '',
  },
  primary: {
    type: String,
    default: '#37352f,#ffffffcf',
  },
  secondary: {
    type: String,
    default: '#37352fb2,#ffffffab',
  },
})

useHead({
  title: 'SILENT DATE COUNTER',
  meta: [
    { property: 'og:title', content: 'Silent Widgets - Date Counter' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://widgets.silent.land/date-counter' },
    { property: 'og:image', content: 'https://widgets.silent.land/covers/date-counter.png' },
  ],
})

const { t } = useI18n('date-counter')

// Date

const targetDate = computed(() => {
  if (!props.date) return ERR_NO_DATE
  const date = new Date(props.date)
  return Number.isNaN(date.getTime()) ? ERR_INVALID_DATE : date
})
const error = computed(() => {
  switch (targetDate.value) {
    case ERR_NO_DATE:
      return t('error.no_date')
    case ERR_INVALID_DATE:
      return t('error.invalid_date')
    default:
      return null
  }
})
const now = ref(new Date())
const diff = computed(() => {
  if (typeof targetDate.value === 'symbol') return null
  const startOfNow = new Date(now.value.getFullYear(), now.value.getMonth(), now.value.getDate())
  return Math.round((targetDate.value.getTime() - startOfNow.getTime()) / 864e5)
})
const diffValue = computed(() => {
  if (diff.value == null) return ''
  return diff.value === 0 ? t('diff.today') : Math.abs(diff.value)
})
const diffLabel = computed(() => {
  if (diff.value == null) return ''
  if (diff.value > 0) return t('diff.is_future')
  if (diff.value === 0) return t('diff.is_today')
  return t('diff.is_past')
})
const unit = computed(() => (diff.value === 1 ? t('unit.day') : t('unit.day.plural')))

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
  <div
    class="widget h-screen overflow-hidden grid place-content-center place-items-center"
    :style="cssVars"
  >
    <div v-if="error">{{ error }}</div>
    <template v-else>
      <div v-if="event" class="mb-1 font-medium">{{ event }}</div>
      <div class="relative whitespace-nowrap">
        <span
          class="diff absolute top-0 right-full mt-1 mr-1 block leading-none text-sm font-medium"
        >
          {{ diffLabel }}
        </span>
        <span class="leading-none text-4xl font-medium">{{ diffValue }}</span>
        <span
          v-if="Boolean(diff)"
          class="unit absolute bottom-0 left-full mb-1 ml-1 block leading-none px-1 py-0.5 text-sm font-medium"
        >
          {{ unit }}
        </span>
      </div>
    </template>
  </div>
</template>

<style>
@import 'tailwindcss' source(none);
@source 'widget.vue';

.widget {
  color: var(--primary-color);
  background: var(--bg-color);

  @media (prefers-color-scheme: dark) {
    color: var(--primary-color-dark);
    background: var(--bg-color-dark);
  }
}

.diff {
  color: var(--secondary-color);

  @media (prefers-color-scheme: dark) {
    color: var(--secondary-color-dark);
  }
}

.unit {
  color: var(--bg-color);
  background: var(--secondary-color);
  border-radius: 3px;

  @media (prefers-color-scheme: dark) {
    color: var(--bg-color-dark);
    background: var(--secondary-color-dark);
  }
}
</style>
