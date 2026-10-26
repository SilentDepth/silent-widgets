import type { WidgetMeta, WidgetParamDefinitions } from '@/types/widget'
import { commonParams } from '../common-params'

export const meta = {
  name: '一天进度',
  englishName: 'Daytime meter',
  description: '用圆环显示一天的时间进度。',
  icon: 'day',
  title: 'SILENT DAYTIME METER',
  cover: '/covers/daytime-meter.png',
} as const satisfies WidgetMeta

export const params = {
  sun: { type: 'color', default: '#f59e0b', label: '太阳颜色', description: '时间指示点的颜色。' },
  ...commonParams,
} as const satisfies WidgetParamDefinitions
