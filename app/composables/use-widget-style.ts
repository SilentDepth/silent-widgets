import { computed } from 'vue'
import { splitColors } from '@/utils/widget-params'
import { commonParams, primaryParam, secondaryParam } from '@/widgets/common-params'

export default function useWidgetStyle(colors: () => Record<string, string>) {
  return computed(() => {
    const values = {
      bg: commonParams.bg.default,
      primary: primaryParam.default,
      secondary: secondaryParam.default,
      ...Object.fromEntries(Object.entries(colors()).filter(([, value]) => value !== '')),
    }
    return Object.fromEntries(
      Object.entries(values).flatMap(([name, value]) => {
        const [light, dark = light] = splitColors(value)
        return [
          [`--${name}-color`, light],
          [`--${name}-color-dark`, dark],
        ]
      }),
    )
  })
}
