<script setup vapor lang="ts">
import '../widget.css'
import { useWidgetLanguage } from '@/composables/use-i18n'
import useWidgetStyle from '@/composables/use-widget-style'
import { widgetProps } from '@/utils/widget-params'
import { params } from './config'

const QUERY_REPO_STARGAZER_COUNT = `
  query ($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      stargazerCount
    }
  }
`

defineOptions({ inheritAttrs: false })

const props = defineProps(widgetProps(params))
const lang = useWidgetLanguage(() => props.lang)

// Core state

const parts = computed(() => props.repo.split('/'))
const owner = computed(() => parts.value[0] || '???')
const name = computed(() => parts.value[1] || '???')
const missingRepo = computed(() => typeof props.repo !== 'string' || !props.repo)
const shouldHumanize = computed(() => props.humanize)
const loading = ref(false)
const error = ref<unknown>(null)
const stargazerCount = ref(0)
const showRefetch = ref(false)
let mounted = false
let revision = 0
let activeRequest: AbortController | undefined
let refreshTimer: ReturnType<typeof setTimeout> | undefined

const count = computed(() =>
  shouldHumanize.value
    ? humanizeNumber(stargazerCount.value)
    : stargazerCount.value.toLocaleString(lang.value),
)

function cancelPending() {
  revision++
  clearTimeout(refreshTimer)
  activeRequest?.abort()
}

function scheduleRefresh(delay: number) {
  cancelPending()
  error.value = null
  showRefetch.value = false
  stargazerCount.value = 0
  loading.value = mounted && !missingRepo.value
  if (loading.value)
    refreshTimer = setTimeout(() => {
      void load()
    }, delay)
}

watch(
  () => props.repo,
  () => scheduleRefresh(300),
)
onMounted(() => {
  mounted = true
  scheduleRefresh(0)
})
onUnmounted(() => {
  mounted = false
  cancelPending()
})

async function load() {
  if (!mounted || missingRepo.value) return
  const current = ++revision
  const controller = new AbortController()
  activeRequest = controller
  loading.value = true
  error.value = null
  try {
    const response = await fetch('/api/github', {
      method: 'POST',
      signal: controller.signal,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        query: QUERY_REPO_STARGAZER_COUNT,
        variables: { owner: owner.value, name: name.value },
      }),
    })
    const payload = await response.json()
    if (!response.ok || payload.errors)
      throw new Error(payload.errors?.[0]?.message || 'Failed to fetch stargazer count')
    const value = payload.data?.repository?.stargazerCount
    if (!Number.isFinite(value) || value < 0) throw new Error('Invalid stargazer count')
    if (current === revision) stargazerCount.value = value
  } catch (err) {
    if (current === revision && !controller.signal.aborted) error.value = err
  } finally {
    if (current === revision && mounted) {
      loading.value = false
      refreshTimer = setTimeout(() => {
        void load()
      }, 600_000)
    }
  }
}

function refetch() {
  scheduleRefresh(0)
}

function humanizeNumber(num: number): string {
  if (num < 1000) return String(num)
  const units = [
    { label: 'B', scale: 1e9 },
    { label: 'M', scale: 1e6 },
    { label: 'K', scale: 1e3 },
    { label: '', scale: 1 },
  ]
  const unit = units.find(it => num >= it.scale)!
  return Math.floor(num / unit.scale) + unit.label
}

const cssVars = useWidgetStyle(() => ({ bg: props.bg, primary: props.primary, star: props.star }))
</script>

<template>
  <div
    v-bind="$attrs"
    :lang="lang"
    class="silent-widget frame overflow-hidden grid place-content-center"
    :style="cssVars"
  >
    <div class="flex flex-col items-center">
      <div v-if="missingRepo" class="text-sm whitespace-nowrap relative">
        <span>请设置 GitHub 仓库：</span>
        <span class="px-0.5">
          <span
            class="px-0.5 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 rounded-[3px]"
          >
            owner/name
          </span>
        </span>
      </div>
      <template v-else>
        <div class="text-sm leading-none">{{ owner }}</div>
        <div class="mt-0.5 text-sm leading-none font-bold">{{ name }}</div>
        <div
          class="badge mt-1 px-2 py-1 rounded-[3px] grid grid-cols-[auto_auto] place-items-center gap-x-1"
          :class="[
            loading ? 'loading' : error ? 'error' : null,
            !loading && !error && 'cursor-pointer',
          ]"
          @mouseenter="!loading && !error && (showRefetch = true)"
          @mouseleave="showRefetch = false"
          @click="showRefetch && refetch()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="row-start-1 col-start-1 w-5 h-5 fill-current"
            :class="[error && 'col-span-full', showRefetch && 'invisible']"
          >
            <path
              v-if="loading"
              d="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928L12 18.26zm0-2.292l4.247 2.377-.949-4.773 3.573-3.305-4.833-.573L12 5.275l-2.038 4.42-4.833.572 3.573 3.305-.949 4.773L12 15.968z"
            />
            <path
              v-else-if="error"
              d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"
              class="fill-white"
            />
            <path
              v-else
              d="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z"
              class="star"
            />
          </svg>
          <svg
            v-if="loading"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="row-start-1 col-start-2 w-5 h-5 px-2 fill-current"
          >
            <path
              d="M5 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm14 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-7 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
            />
          </svg>
          <span
            v-else-if="!error"
            class="row-start-1 col-start-2 text-lg leading-none"
            :class="showRefetch && 'invisible'"
          >
            {{ count }}
          </span>
          <svg
            v-if="showRefetch"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="row-span-full col-span-full w-5 h-5 fill-current"
          >
            <path
              d="M5.463 4.433A9.961 9.961 0 0 1 12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228l-.997-1.795zm13.074 15.134A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0 0 13.54 5.772l.997 1.795z"
            />
          </svg>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
@reference '../../assets/styles/main.css';
.frame {
  color: var(--primary-color);
  background: var(--bg-color);

  @media (prefers-color-scheme: dark) {
    color: var(--primary-color-dark);
    background: var(--bg-color-dark);
  }
}

.badge {
  color: var(--bg-color);
  background: var(--primary-color);

  @media (prefers-color-scheme: dark) {
    color: var(--bg-color-dark);
    background: var(--primary-color-dark);
  }

  &.error {
    @apply px-8 bg-red-600;
  }
}

.star {
  fill: var(--star-color);

  @media (prefers-color-scheme: dark) {
    fill: var(--star-color-dark);
  }
}
</style>
