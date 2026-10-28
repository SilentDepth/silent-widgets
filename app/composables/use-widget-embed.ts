import type { InjectionKey } from 'vue'

export interface WidgetEmbed {
  url: ComputedRef<string>
  disabled: ComputedRef<boolean>
}

export const widgetEmbedKey: InjectionKey<ShallowRef<WidgetEmbed | undefined>> =
  Symbol('widget-embed')

export function useWidgetEmbed(url: ComputedRef<string>, disabled: ComputedRef<boolean>) {
  const target = inject(widgetEmbedKey)
  if (!target) return
  const source = { url, disabled }
  target.value = source
  onUnmounted(() => {
    if (target.value === source) target.value = undefined
  })
}
