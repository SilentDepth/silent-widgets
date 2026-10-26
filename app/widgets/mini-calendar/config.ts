import { defineText } from '@/i18n/text'
import type { WidgetMeta, WidgetParamDefinitions } from '@/types/widget'
import { commonParams, primaryParam, secondaryParam } from '../common-params'

export const meta = {
  name: defineText('迷你日历', 'Mini calendar'),
  description: defineText(
    '用紧凑的点阵查看本月日期。',
    'See the current month in a compact dot calendar.',
  ),
  icon: 'calendar',
  cover: '/covers/mini-calendar.png',
} as const satisfies WidgetMeta

export const params = {
  weekstart: {
    type: 'integer',
    default: 0,
    label: defineText('每周起始日', 'Week starts on'),
    description: defineText(
      '选择日历每一周从哪一天开始。',
      'Choose the first day of each calendar week.',
    ),
    options: [
      { value: 0, label: defineText('星期日', 'Sunday') },
      { value: 1, label: defineText('星期一', 'Monday') },
      { value: 2, label: defineText('星期二', 'Tuesday') },
      { value: 3, label: defineText('星期三', 'Wednesday') },
      { value: 4, label: defineText('星期四', 'Thursday') },
      { value: 5, label: defineText('星期五', 'Friday') },
      { value: 6, label: defineText('星期六', 'Saturday') },
    ],
  },
  primary: primaryParam,
  secondary: { ...secondaryParam, default: '#37352f6b,#ffffff47' },
  ...commonParams,
} as const satisfies WidgetParamDefinitions
