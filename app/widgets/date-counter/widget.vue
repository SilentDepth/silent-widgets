<script setup vapor lang="ts">
import '../widget.css'
import ClientOnly from '@/components/client-only.vue'
import useI18n from '@/composables/use-i18n'
import useWidgetStyle from '@/composables/use-widget-style'
import { widgetProps } from '@/utils/widget-params'
import { params } from './config'

const ERR_NO_DATE = Symbol()
const ERR_INVALID_DATE = Symbol()

defineOptions({ inheritAttrs: false })

const props = defineProps(widgetProps(params))

const { t, lang } = useI18n('date-counter', () => props.lang)

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

const cssVars = useWidgetStyle(() => ({
  bg: props.bg,
  primary: props.primary,
  secondary: props.secondary,
}))
</script>

<template>
  <client-only>
    <div
      v-bind="$attrs"
      :lang="lang"
      class="silent-widget widget overflow-hidden grid place-content-center place-items-center"
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
  </client-only>
</template>

<style scoped>
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
