import type { VaporComponent } from 'vue'
import type { WidgetConfig } from '@/types/widget'

const configs = import.meta.glob<WidgetConfig>('./*/config.ts', { eager: true })
const components = import.meta.glob<{ default: VaporComponent }>('./*/widget.vue')

export const widgets = Object.keys(configs).map(path => {
  const id = path.slice('./'.length, -'/config.ts'.length)
  return {
    id,
    ...configs[path]!,
  }
})

export function findWidget(id: string) {
  return widgets.find(widget => widget.id === id)
}

export async function loadWidget(id: string) {
  const loader = components[`./${id}/widget.vue`]
  if (!loader) throw new Error('Widget not found')
  return (await loader()).default
}

export type WidgetEntry = (typeof widgets)[number]
