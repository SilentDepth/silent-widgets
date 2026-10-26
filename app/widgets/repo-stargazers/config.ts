import { defineText } from '@/i18n/text'
import type { WidgetMeta, WidgetParamDefinitions } from '@/types/widget'
import { commonParams, primaryParam } from '../common-params'

export const meta = {
  name: defineText('仓库星标', 'Repo stargazers'),
  description: defineText(
    '显示 GitHub 仓库的 Star 数量。',
    'Show the star count of a GitHub repository.',
  ),
  icon: 'star',
  cover: '/covers/repo-stargazers.png',
} as const satisfies WidgetMeta

export const params = {
  repo: {
    type: 'text',
    default: '',
    required: true,
    label: defineText('GitHub 仓库', 'GitHub repository'),
    description: defineText('使用 owner/name 格式。', 'Use the owner/name format.'),
    placeholder: 'owner/name',
    parse(raw) {
      const value = raw.trim()
      return /^[^\s/]+[/][^\s/]+$/.test(value)
        ? { value }
        : {
            error: defineText(
              '请输入完整的仓库名称，例如 owner/name。',
              'Enter a complete repository name, such as owner/name.',
            ),
          }
    },
  },
  humanize: {
    type: 'boolean',
    default: false,
    label: defineText('简写数量', 'Shorten count'),
    description: defineText('用 K、M、B 简写较大的数量。', 'Use K, M, or B for larger counts.'),
  },
  primary: {
    ...primaryParam,
    default: '',
    allowEmpty: true,
    description: defineText(
      '主要文字颜色。留空时使用默认颜色。',
      'Main text color. Leave empty to use the default.',
    ),
  },
  star: {
    type: 'color',
    darkVariant: true,
    default: '#fbbf24,#d97706',
    label: defineText('星标颜色', 'Star color'),
    description: defineText('星形图标的颜色。', 'Color of the star icon.'),
  },
  ...commonParams,
} as const satisfies WidgetParamDefinitions
