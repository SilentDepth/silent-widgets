<script setup vapor lang="ts">
import WidgetUsage from '@/components/widget-usage.vue'
import { autoLanguageKey } from '@/composables/use-i18n'
import { useSiteI18n } from '@/composables/use-site-i18n'
import { useSiteLanguage } from '@/composables/use-site-language'
import { widgetEmbedKey } from '@/composables/use-widget-embed'
import type { WidgetEmbed } from '@/composables/use-widget-embed'
import { LANGUAGE_OPTIONS } from '@/i18n/languages'

const route = useRoute()
const origin = useRequestURL().origin
const isHome = computed(() => route.path === '/')
const { isLoading } = useLoadingIndicator({ throttle: 0 })
const { lang, t } = useSiteI18n()
const { setLanguage } = useSiteLanguage()
provide(autoLanguageKey, lang)
const widgetEmbed = shallowRef<WidgetEmbed>()
provide(widgetEmbedKey, widgetEmbed)
const widgetUrl = computed(() => {
  if (widgetEmbed.value) return widgetEmbed.value.url.value
  const url = new URL('/year-progress', origin)
  url.searchParams.set('lang', lang.value)
  return url.href
})

useHead({
  link: [
    {
      rel: 'preload',
      href: '/fonts/doto-brand.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: 'anonymous',
    },
  ],
})
</script>

<template>
  <div :aria-busy="isLoading || undefined">
    <header class="box-content max-w-4xl px-4 flex items-center justify-between gap-4 mx-auto">
      <span class="flex text-xl text-trim font-brand font-bold whitespace-nowrap overflow-hidden">
        <span class="py-4">&ZeroWidthSpace;</span>
        <NuxtLink
          v-show="!isHome"
          to="/"
          class="layout-title py-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--ui-accent)"
        >
          SILENT WIDGETS
        </NuxtLink>
      </span>
      <div
        class="relative ml-auto grid size-9 shrink-0 place-items-center rounded-[5px] text-(--ui-muted) hover:bg-(--ui-surface) focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-(--ui-accent)"
      >
        <svg
          class="pointer-events-none size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M2 5h12M7 2h1m-3 6 6 6m-7 0 6-6 2-3m10 17-5-11-5 11m2-4h6" />
        </svg>
        <select
          class="absolute inset-0 size-full min-w-0 cursor-pointer text-sm/normal text-(--ui-text) opacity-0"
          :aria-label="t('site.language')"
          :title="t('site.language')"
          :value="lang"
          @change="setLanguage(($event.target as HTMLSelectElement).value)"
        >
          <option
            v-for="option of LANGUAGE_OPTIONS"
            :key="option.value"
            :value="option.value"
            :lang="option.value"
            :selected="lang === option.value"
          >
            {{ option.label[option.value] }}
          </option>
        </select>
      </div>
    </header>
    <main>
      <div class="px-4">
        <slot />
      </div>
      <WidgetUsage :url="widgetUrl" :disabled="widgetEmbed?.disabled.value" />
    </main>
    <footer
      class="box-content mx-auto flex max-w-4xl flex-col items-center gap-2 px-4 pt-7 pb-9 text-center text-xs/5 text-(--ui-muted)"
    >
      <p>{{ t('footer.disclaimer') }}</p>
      <p>
        Made with ❤️ by
        <a
          href="https://silent.land"
          target="_blank"
          rel="noopener noreferrer"
          class="text-(--ui-accent) hover:underline hover:underline-offset-3 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(--ui-accent)"
          >SilentDepth</a
        >
      </p>
      <a
        href="https://github.com/SilentDepth/silent-widgets/issues"
        target="_blank"
        rel="noopener noreferrer"
        class="text-(--ui-accent) hover:underline hover:underline-offset-3 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(--ui-accent)"
        >{{ t('footer.feedback') }}</a
      >
    </footer>
  </div>
</template>

<style>
@font-face {
  font-family: Doto;
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/doto-brand.woff2') format('woff2');
}
</style>
