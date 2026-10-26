import { defineText } from '@/i18n/text'
import type { WidgetMeta, WidgetParamDefinitions } from '@/types/widget'
import { commonParams } from '../common-params'

export const meta = {
  name: defineText('一天进度', 'Daytime meter'),
  description: defineText(
    '用圆环显示一天的时间进度。',
    'Follow the progress of the day around a circle.',
  ),
  icon: 'day',
  cover: '/covers/daytime-meter.png',
} as const satisfies WidgetMeta

export const params = {
  sun: {
    type: 'color',
    default: '#f59e0b',
    label: defineText('太阳颜色', 'Sun color'),
    description: defineText('时间指示点的颜色。', 'Color of the time indicator.'),
  },
  ...commonParams,
} as const satisfies WidgetParamDefinitions
