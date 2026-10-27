<script setup vapor lang="ts">
import { useHead } from '@unhead/vue'
import { autoLanguageKey } from '@/composables/use-i18n'
import { useSiteI18n } from '@/composables/use-site-i18n'
import { useSiteLanguage } from '@/composables/use-site-language'
import { LANGUAGE_OPTIONS } from '@/i18n/languages'

defineProps<{ isHome: boolean }>()
const { lang, t } = useSiteI18n()
const { setLanguage } = useSiteLanguage()
provide(autoLanguageKey, lang)

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
  <div>
    <header class="box-content max-w-4xl px-4 flex items-center justify-between gap-4 mx-auto">
      <span class="flex text-xl text-trim font-brand font-bold whitespace-nowrap overflow-hidden">
        <span class="py-4">&ZeroWidthSpace;</span>
        <a
          v-show="!isHome"
          href="/"
          class="layout-title py-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--ui-accent)"
        >
          SILENT WIDGETS
        </a>
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
      <section
        id="embed"
        class="pt-8 scroll-mt-6 border-y border-(--ui-line) mt-14 max-[600px]:mt-10 bg-amber-50"
        aria-labelledby="embed-title"
      >
        <div class="box-content max-w-4xl px-4 mx-auto">
          <h2 id="embed-title" class="text-base/6 font-semibold">{{ t('home.embed') }}</h2>
          <ol
            class="mt-5 grid list-none grid-cols-3 gap-5 max-[600px]:grid-cols-1 max-[600px]:gap-4.5"
          >
            <li class="flex items-baseline gap-2.5">
              <span
                class="inline-grid size-5.5 shrink-0 place-items-center rounded-sm bg-(--ui-surface) text-xs/normal"
                aria-hidden="true"
                >1</span
              >
              <div>
                <h3 class="text-sm/5.5 font-semibold">{{ t('home.step1.title') }}</h3>
                <p class="mt-1.5 text-[13px]/5.5 text-(--ui-muted) max-[600px]:mt-0.5">
                  {{ t('home.step1.body') }}
                </p>
              </div>
            </li>
            <li class="flex items-baseline gap-2.5">
              <span
                class="inline-grid size-5.5 shrink-0 place-items-center rounded-sm bg-(--ui-surface) text-xs/normal"
                aria-hidden="true"
                >2</span
              >
              <div>
                <h3 class="text-sm/5.5 font-semibold">{{ t('home.step2.title') }}</h3>
                <p class="mt-1.5 text-[13px]/5.5 text-(--ui-muted) max-[600px]:mt-0.5">
                  {{ t('home.step2.body') }}
                </p>
              </div>
            </li>
            <li class="flex items-baseline gap-2.5">
              <span
                class="inline-grid size-5.5 shrink-0 place-items-center rounded-sm bg-(--ui-surface) text-xs/normal"
                aria-hidden="true"
                >3</span
              >
              <div>
                <h3 class="text-sm/5.5 font-semibold">{{ t('home.step3.title') }}</h3>
                <p class="mt-1.5 text-[13px]/5.5 text-(--ui-muted) max-[600px]:mt-0.5">
                  {{ t('home.step3.body', { command: '/embed' }) }}
                </p>
              </div>
            </li>
          </ol>
          <a
            class="mt-2.5 inline-flex min-h-11 items-center gap-1.5 text-[13px]/normal text-(--ui-accent) hover:underline hover:underline-offset-3 focus-visible:rounded-[3px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--ui-accent)"
            href="https://www.notion.com/help/embed-and-connect-other-apps"
            >{{ t('home.notionHelp') }} <span aria-hidden="true">↗</span></a
          >
        </div>
      </section>
    </main>
    <footer class="max-w-4xl pt-7 pb-9 text-xs/5 text-(--ui-muted) mx-auto">
      <span class="font-brand font-bold">SILENT WIDGETS</span>
      <span aria-hidden="true" class="mx-1.5">·</span>
      {{ t('home.footer') }}
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
