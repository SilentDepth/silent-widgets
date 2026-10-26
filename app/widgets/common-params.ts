import { defineText } from '@/i18n/text'
import type { WidgetParamDefinitions } from '@/types/widget'

export const commonParams = {
  lang: {
    type: 'locale',
    default: 'auto',
    label: defineText('语言', 'Language'),
    description: defineText('选择小工具的显示语言。', 'Choose the language of the widget.'),
    options: [
      { value: 'auto', label: defineText('自动', 'Automatic') },
      { value: 'zh-CN', label: defineText('简体中文', 'Simplified Chinese') },
      { value: 'en-US', label: defineText('英语', 'English') },
    ],
  },
  bg: {
    type: 'color',
    darkVariant: true,
    default: '#ffffff,#191919',
    label: defineText('背景色', 'Background'),
    description: defineText(
      '浅色和深色模式下的背景颜色。',
      'Background color in light and dark modes.',
    ),
  },
} as const satisfies WidgetParamDefinitions

export const primaryParam = {
  type: 'color',
  darkVariant: true,
  default: '#37352f,#ffffffcf',
  label: defineText('主要颜色', 'Primary color'),
  description: defineText('主要文字和图形的颜色。', 'Color of the main text and graphics.'),
} as const

export const secondaryParam = {
  type: 'color',
  darkVariant: true,
  default: '#37352f29,#ffffff21',
  label: defineText('次要颜色', 'Secondary color'),
  description: defineText('次要文字和图形的颜色。', 'Color of secondary text and graphics.'),
} as const
