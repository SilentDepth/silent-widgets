import type { WidgetMeta, WidgetParamDefinitions } from '@/types/widget'
import { commonParams, primaryParam, secondaryParam } from '../common-params'

export const meta = {
  name: '一年进度',
  englishName: 'Year progress',
  description: '查看今年已经过去多少。',
  icon: 'progress',
  title: 'SILENT YEAR PROGRESS',
  cover: '/covers/year-progress.png',
} as const satisfies WidgetMeta

export const params = {
  primary: { ...primaryParam, description: '已经过时间和日期文字的颜色。' },
  secondary: { ...secondaryParam, description: '未经过时间的颜色。' },
  ...commonParams,
} as const satisfies WidgetParamDefinitions
