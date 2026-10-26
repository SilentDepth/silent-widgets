import type { WidgetMeta, WidgetParamDefinitions } from '@/types/widget'
import { commonParams, primaryParam, secondaryParam } from '../common-params'

export const meta = {
  name: '迷你日历',
  englishName: 'Mini calendar',
  description: '用紧凑的点阵查看本月日期。',
  icon: 'calendar',
  title: 'SILENT MINI CALENDAR',
  cover: '/covers/mini-calendar.png',
} as const satisfies WidgetMeta

export const params = {
  weekstart: {
    type: 'integer',
    default: 0,
    label: '每周起始日',
    description: '选择日历每一周从哪一天开始。',
    options: [
      { value: 0, label: '星期日' },
      { value: 1, label: '星期一' },
      { value: 2, label: '星期二' },
      { value: 3, label: '星期三' },
      { value: 4, label: '星期四' },
      { value: 5, label: '星期五' },
      { value: 6, label: '星期六' },
    ],
  },
  primary: primaryParam,
  secondary: { ...secondaryParam, default: '#37352f6b,#ffffff47' },
  ...commonParams,
} as const satisfies WidgetParamDefinitions
