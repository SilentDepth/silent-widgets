import { defineText } from '@/i18n/text'
import type { WidgetMeta, WidgetParamDefinitions } from '@/types/widget'
import { commonParams, primaryParam, secondaryParam } from '../common-params'

export const meta = {
  name: defineText('一年进度', 'Year progress'),
  description: defineText('查看今年已经过去多少。', 'See how much of the year has passed.'),
  icon: 'progress',
  cover: '/covers/year-progress.png',
} as const satisfies WidgetMeta

export const params = {
  primary: {
    ...primaryParam,
    description: defineText(
      '已经过时间和日期文字的颜色。',
      'Color of elapsed time and date labels.',
    ),
  },
  secondary: {
    ...secondaryParam,
    description: defineText('未经过时间的颜色。', 'Color of the remaining time.'),
  },
  ...commonParams,
} as const satisfies WidgetParamDefinitions
