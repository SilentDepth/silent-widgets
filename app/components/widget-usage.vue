<script setup vapor lang="ts">
import { useSiteI18n } from '@/composables/use-site-i18n'

const props = defineProps<{ url: string; disabled?: boolean }>()
const { t } = useSiteI18n()
const iframeCode = computed(() => {
  const src = props.url.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
  return `<iframe\n  src="${src}"\n></iframe>`
})
const copyStatus = ref<'idle' | 'copied' | 'failed'>('idle')
let statusTimer: ReturnType<typeof setTimeout> | undefined

watch(iframeCode, () => {
  clearTimeout(statusTimer)
  copyStatus.value = 'idle'
})
onUnmounted(() => clearTimeout(statusTimer))

function selectUrl(event: Event) {
  if (props.disabled) return
  const element = event.currentTarget as HTMLElement
  const range = document.createRange()
  range.selectNodeContents(element)
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}

async function copyCode() {
  if (props.disabled) return
  clearTimeout(statusTimer)
  const code = iframeCode.value
  try {
    await navigator.clipboard.writeText(code)
    if (code !== iframeCode.value || props.disabled) return
    copyStatus.value = 'copied'
    statusTimer = setTimeout(() => {
      copyStatus.value = 'idle'
    }, 2000)
  } catch {
    copyStatus.value = 'failed'
    window.prompt(t('usage.manualCopy'), code)
  }
}
</script>

<template>
  <section
    id="embed"
    class="mt-14 scroll-mt-6 border-y border-(--ui-line) py-8 max-[600px]:mt-10"
    aria-labelledby="embed-title"
  >
    <div class="mx-auto box-content max-w-4xl px-4">
      <h2 id="embed-title" class="text-[26px]/8 font-semibold max-[600px]:text-[22px]/7">
        {{ t('usage.title') }}
      </h2>
      <p class="mt-2 text-[15px]/6 text-(--ui-muted) max-[600px]:text-sm/6">
        {{ t('usage.description') }}
      </p>
      <div class="mt-7 grid grid-cols-2 gap-x-6 gap-y-7 max-[600px]:grid-cols-1">
        <section class="min-w-0" aria-labelledby="notion-usage-title">
          <h3 id="notion-usage-title" class="flex items-center gap-2 text-[15px]/6 font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              class="size-6 shrink-0"
              aria-hidden="true"
            >
              <!-- Icon from Remix Icon by Remix Design - https://github.com/cyberalien/RemixIcon/blob/master/License -->
              <path
                fill="currentColor"
                d="M6.104 5.91c.584.474.802.438 1.898.365l10.332-.62c.22 0 .037-.22-.036-.256l-1.716-1.24c-.329-.255-.767-.548-1.606-.475l-10.005.73c-.364.036-.437.219-.292.365zm.62 2.408v10.87c0 .585.292.803.95.767l11.354-.657c.657-.036.73-.438.73-.913V7.588c0-.474-.182-.73-.584-.693l-11.866.693c-.438.036-.584.255-.584.73m11.21.583c.072.328 0 .657-.33.694l-.547.109v8.025c-.475.256-.913.401-1.278.401c-.584 0-.73-.182-1.168-.729l-3.579-5.618v5.436l1.133.255s0 .656-.914.656l-2.519.146c-.073-.146 0-.51.256-.583l.657-.182v-7.187l-.913-.073c-.073-.329.11-.803.621-.84l2.702-.182l3.724 5.692V9.886l-.95-.109c-.072-.402.22-.693.585-.73zM4.131 3.429l10.406-.766c1.277-.11 1.606-.036 2.41.547l3.321 2.335c.548.401.731.51.731.948v12.805c0 .803-.292 1.277-1.314 1.35l-12.085.73c-.767.036-1.132-.073-1.534-.584L3.62 17.62c-.438-.584-.62-1.021-.62-1.533V4.705c0-.656.292-1.203 1.132-1.276"
              />
            </svg>
            {{ t('usage.notion.title') }}
          </h3>
          <p class="mt-1.5 text-[13px]/6 text-(--ui-muted)">
            {{ t('usage.notion.description') }}
          </p>
          <div
            class="@container mt-3 min-h-69 rounded-md border border-(--ui-line) pt-6 pr-4 pb-5 [@media(width<=600px)]:min-h-61.25"
          >
            <div class="relative w-max max-w-full">
              <div
                class="flex items-center justify-end gap-0.5 overflow-clip whitespace-nowrap focus-within:outline-2 focus-within:outline-offset-3 focus-within:outline-(--ui-accent)"
              >
                <span
                  role="textbox"
                  aria-readonly="true"
                  :aria-disabled="disabled || undefined"
                  :aria-label="t('usage.widgetUrl')"
                  :tabindex="disabled ? -1 : 0"
                  class="peer flex-none cursor-text ps-4 text-(--ui-muted) underline underline-offset-2 outline-none"
                  @focus="selectUrl"
                  @click="selectUrl"
                  @keydown.enter.prevent="selectUrl"
                  @keydown.space.prevent="selectUrl"
                  >{{ url }}</span
                >
                <span
                  class="paste-caret h-[1.25em] w-[1.5px] flex-none bg-(--ui-muted) peer-focus:invisible"
                  aria-hidden="true"
                />
              </div>
              <div
                class="paste-menu absolute w-53 max-w-[100cqw] rounded-[9px] border border-(--ui-line) bg-(--ui-canvas) select-none"
                aria-hidden="true"
              >
                <div class="px-3 pt-2.5 pb-1 text-xs/5 font-semibold text-(--ui-muted)">
                  {{ t('usage.notion.pasteAs') }}
                </div>
                <div class="opacity-38">
                  <div class="px-3 py-1.75 text-[15px]/5">{{ t('usage.notion.mention') }}</div>
                  <div class="px-3 py-1.75 text-[15px]/5">URL</div>
                  <div class="px-3 py-1.75 text-[15px]/5">{{ t('usage.notion.bookmark') }}</div>
                </div>
                <div class="mx-1 mb-1 rounded bg-(--ui-surface) px-2 py-1.5 text-[15px]/5">
                  {{ t('usage.notion.embed') }}
                </div>
              </div>
            </div>
          </div>
          <a
            class="mt-2 inline-flex min-h-11 items-center text-[13px]/5 text-(--ui-accent) hover:underline hover:underline-offset-3 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(--ui-accent)"
            href="https://www.notion.com/help/embed-and-connect-other-apps"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ t('usage.notion.help') }}
            <svg
              viewBox="0 0 24 24"
              class="size-3.5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </a>
        </section>
        <section class="flex min-w-0 flex-col" aria-labelledby="iframe-usage-title">
          <h3 id="iframe-usage-title" class="flex items-center gap-2 text-[15px]/6 font-semibold">
            <svg
              viewBox="0 0 24 24"
              class="size-6 shrink-0 text-(--ui-muted)"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m8 5-6 7 6 7m8-14 6 7-6 7M14 3l-4 18" />
            </svg>
            {{ t('usage.code.title') }}
          </h3>
          <p class="mt-1.5 text-[13px]/6 text-(--ui-muted)">
            {{ t('usage.code.description') }}
          </p>
          <div
            class="mt-3 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-md border border-(--ui-line) bg-(--ui-surface) max-[600px]:flex-none"
          >
            <div
              class="flex min-h-11 shrink-0 items-center justify-between gap-3 border-b border-(--ui-line) px-4"
            >
              <span class="font-mono text-xs/5 text-(--ui-muted)">HTML</span>
              <button
                type="button"
                :disabled="disabled"
                class="flex min-h-9 cursor-pointer items-center gap-1.5 rounded-sm text-xs/5 text-(--ui-accent) hover:underline hover:underline-offset-3 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-(--ui-accent) disabled:cursor-not-allowed disabled:opacity-50"
                @click="copyCode"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="size-3.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path v-if="copyStatus === 'copied'" d="m5 12 4 4L19 6" />
                  <template v-else>
                    <rect x="8" y="8" width="12" height="13" rx="3" />
                    <path d="M16 8V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h2" />
                  </template>
                </svg>
                <span role="status" aria-live="polite" aria-atomic="true">{{
                  t(
                    copyStatus === 'copied'
                      ? 'usage.codeCopied'
                      : copyStatus === 'failed'
                        ? 'usage.copyFailed'
                        : 'usage.copyCode',
                  )
                }}</span>
              </button>
            </div>
            <pre
              class="min-h-0 flex-1 overflow-x-auto p-4 text-xs/6 text-(--ui-text) focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ui-accent) max-[600px]:py-3 max-[600px]:text-xs/5"
              tabindex="0"
              :aria-label="t('usage.code.title')"
            ><code>{{ iframeCode }}</code></pre>
          </div>
          <div class="mt-2 min-h-11 max-[600px]:hidden" aria-hidden="true" />
        </section>
      </div>
    </div>
  </section>
</template>

<style scoped>
.paste-caret {
  animation: paste-caret-blink 1s step-end infinite;
}

.paste-menu {
  top: calc(100% + 8px);
  left: clamp(0px, 100%, max(0px, calc(100cqw - 212px)));
  box-shadow: 0 6px 18px rgb(0 0 0 / 7%);
}

@keyframes paste-caret-blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .paste-caret {
    animation: none;
  }
}
</style>
