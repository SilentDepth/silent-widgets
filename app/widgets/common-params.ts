import type { WidgetParamDefinitions } from '@/types/widget'

export const commonParams = {
  lang: {
    type: 'locale',
    default: 'auto',
    label: '语言',
    description: '选择小工具的显示语言。',
    options: [
      { value: 'auto', label: '自动' },
      { value: 'zh-CN', label: '简体中文' },
      { value: 'en-US', label: 'English' },
    ],
  },
  bg: {
    type: 'color',
    darkVariant: true,
    default: '#ffffff,#191919',
    label: '背景色',
    description: '浅色和深色模式下的背景颜色。',
  },
} as const satisfies WidgetParamDefinitions

export const primaryParam = {
  type: 'color',
  darkVariant: true,
  default: '#37352f,#ffffffcf',
  label: '主要颜色',
  description: '主要文字和图形的颜色。',
} as const

export const secondaryParam = {
  type: 'color',
  darkVariant: true,
  default: '#37352f29,#ffffff21',
  label: '次要颜色',
  description: '次要文字和图形的颜色。',
} as const
