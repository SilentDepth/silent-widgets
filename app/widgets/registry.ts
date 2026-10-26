import type { WidgetConfig } from '@/types/widget'

const configs = import.meta.glob<WidgetConfig>('./*/config.ts', { eager: true })
const components = import.meta.glob<{ default: VaporComponent }>('../pages/*/page.vue')

export const widgets = [
  'year-progress',
  'mini-calendar',
  'date-counter',
  'daytime-meter',
  'repo-stargazers',
].map(id => ({
  id,
  ...configs[`./${id}/config.ts`],
}))

export function findWidget(id: string) {
  return widgets.find(widget => widget.id === id)
}

export async function loadWidget(id: string) {
  const loader = components[`../pages/${id}/page.vue`]
  if (!loader) throw new Error('Widget not found')
  return (await loader()).default
}

export type WidgetEntry = (typeof widgets)[number]
