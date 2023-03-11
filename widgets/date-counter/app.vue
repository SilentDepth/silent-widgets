<script lang="ts" setup>
import useI18n from '~/composables/use-i18n'
import langs from './lang'

const { t } = useI18n(langs)

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
  bg: {
    type: String,
    default: '#ffffff,#191919',
  },
})

// Date

const date = $computed(() => props.date ? new Date(props.date) : null)

let now = $ref(new Date())
const diff = $computed(() => {
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return date ? Math.round((date.getTime() - startOfNow.getTime()) / 864e5) : null
})
const diffValue = $computed(() => diff == null ? '' : diff === 0 ? t('diff.today') : Math.abs(diff))
const diffLabel = $computed(() => {
  if (diff == null) return ''
  if (diff > 0) return t('diff.is_future')
  if (diff === 0) return t('diff.is_today')
  if (diff < 0) return t('diff.is_past')
})
const unit = $computed(() => diff === 1 ? t('unit.day') : t('unit.day.plural'))

// Colors

const _primaryColors = props.primary.split(',')
const primaryColor = _primaryColors[0]
const primaryColorDark = _primaryColors[1] || _primaryColors[0]
const _secondaryColors = props.secondary.split(',')
const secondaryColor = _secondaryColors[0]
const secondaryColorDark = _secondaryColors[1] || _secondaryColors[0]
const _bgColors = props.bg.split(',')
const bgColor = _bgColors[0]
const bgColorDark = _bgColors[1] || _bgColors[0]
</script>

<template lang="pug">
div.widget(class="h-screen overflow-hidden grid place-content-center place-items-center")
  template(v-if="date")
    div(v-if="event" class="mb-1")
      span.event(class="font-medium") {{ event }}
      span.diff {{ diffLabel }}
    div(class="relative")
      span.value(class="leading-none text-4xl font-medium") {{ diffValue }}
      span.unit(v-if="diff" class="absolute bottom-0 left-full mb-1 ml-1 block leading-none px-1 py-0.5 text-sm font-medium") {{ unit }}
  div(v-else) {{ t('hint.no_date') }}
</template>

<style scoped>
.widget {
  color: v-bind(primaryColor);
  background: v-bind(bgColor);
}

.diff {
  color: v-bind(secondaryColor);
}

.unit {
  color: v-bind(bgColor);
  background: v-bind(secondaryColor);
  border-radius: 3px;
}

@media (prefers-color-scheme: dark) {
  .widget {
    color: v-bind(primaryColorDark);
    background: v-bind(bgColorDark);
  }

  .diff {
    color: v-bind(secondaryColorDark);
  }

  .unit {
    color: v-bind(bgColorDark);
    background: v-bind(secondaryColorDark);
  }
}
</style>
