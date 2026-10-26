import type { WidgetMeta, WidgetParamDefinitions } from '@/types/widget'
import { commonParams, primaryParam, secondaryParam } from '../common-params'

export const meta = {
  name: '日期计数',
  englishName: 'Date counter',
  description: '记录距离某一天还有或已过的天数。',
  icon: 'date',
  title: 'SILENT DATE COUNTER',
  cover: '/covers/date-counter.png',
} as const satisfies WidgetMeta

export const params = {
  date: {
    type: 'date',
    default: '',
    required: true,
    label: '目标日期',
    description: '计算距离这一天还有或已经过去多少天。',
    placeholder: '2026-12-31',
  },
  event: {
    type: 'text',
    default: '',
    label: '事件名称',
    description: '在天数上方显示的文字。',
    placeholder: '例如：旅行出发',
  },
  primary: primaryParam,
  secondary: { ...secondaryParam, default: '#37352fb2,#ffffffab' },
  ...commonParams,
} as const satisfies WidgetParamDefinitions
