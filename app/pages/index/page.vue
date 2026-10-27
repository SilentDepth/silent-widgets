<script setup vapor lang="ts">
import { useSiteI18n } from '@/composables/use-site-i18n'
import { widgets } from '@/widgets/registry'

const { l, t } = useSiteI18n()
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <section aria-labelledby="page-title">
      <h1 id="page-title" class="home-title text-3xl sm:text-5xl font-brand font-bold">
        SILENT WIDGETS
      </h1>
      <p class="text-base">{{ t('home.tagline') }}</p>
      <p class="text-sm text-(--ui-muted)">{{ t('home.callout') }}</p>
    </section>
    <section class="mt-10 max-[600px]:mt-8" :aria-label="t('home.widgets')">
      <ul class="grid grid-template-widgets gap-4">
        <li v-for="(widget, index) of widgets" :key="widget.id">
          <a
            :href="`/${widget.id}/config`"
            class="flex flex-col gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--ui-accent) group"
          >
            <img
              :src="widget.meta.cover"
              alt=""
              width="1000"
              height="500"
              :loading="index < 2 ? 'eager' : 'lazy'"
              class="aspect-og w-full rounded-md border border-(--ui-line) bg-white object-contain group-hover:border-(--ui-muted)"
            />
            <h2 class="text-base text-trim font-semibold">
              {{ l(widget.meta.name) }}
            </h2>
            <p class="text-sm text-trim text-(--ui-muted)">{{ l(widget.meta.description) }}</p>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.grid-template-widgets {
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}
</style>
