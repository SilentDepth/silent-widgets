import { defineText } from '@/i18n/text'
import type { WidgetMeta, WidgetParamDefinitions } from '@/types/widget'
import { commonParams, primaryParam, secondaryParam } from '../common-params'

export const meta = {
  name: defineText('日期计数', 'Date counter'),
  description: defineText(
    '记录距离某一天还有或已过的天数。',
    'Count the days until or since a date.',
  ),
  icon: 'date',
  cover: '/covers/date-counter.png',
} as const satisfies WidgetMeta

export const params = {
  date: {
    type: 'date',
    default: '',
    required: true,
    label: defineText('目标日期', 'Target date'),
    description: defineText(
      '计算距离这一天还有或已经过去多少天。',
      'Count the days until or since this date.',
    ),
    placeholder: '2026-12-31',
  },
  event: {
    type: 'text',
    default: '',
    label: defineText('事件名称', 'Event name'),
    description: defineText('在天数上方显示的文字。', 'Text shown above the day count.'),
    placeholder: defineText('例如：旅行出发', 'For example: My next trip'),
  },
  primary: primaryParam,
  secondary: { ...secondaryParam, default: '#37352fb2,#ffffffab' },
  ...commonParams,
} as const satisfies WidgetParamDefinitions
