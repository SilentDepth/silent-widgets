import type { WidgetMeta, WidgetParamDefinitions } from '@/types/widget'
import { commonParams, primaryParam } from '../common-params'

export const meta = {
  name: '仓库星标',
  englishName: 'Repo stargazers',
  description: '显示 GitHub 仓库的 Star 数量。',
  icon: 'star',
  title: 'SILENT REPO STARGAZERS',
  cover: '/covers/repo-stargazers.png',
} as const satisfies WidgetMeta

export const params = {
  repo: {
    type: 'text',
    default: '',
    required: true,
    label: 'GitHub 仓库',
    description: '使用 owner/name 格式。',
    placeholder: 'owner/name',
    parse(raw) {
      const value = raw.trim()
      return /^[^\s/]+[/][^\s/]+$/.test(value)
        ? { value }
        : { error: '请输入完整的仓库名称，例如 owner/name。' }
    },
  },
  humanize: {
    type: 'boolean',
    default: false,
    label: '简写数量',
    description: '用 K、M、B 简写较大的数量。',
  },
  primary: {
    ...primaryParam,
    default: '',
    allowEmpty: true,
    description: '主要文字颜色。留空时使用默认颜色。',
  },
  star: {
    type: 'color',
    darkVariant: true,
    default: '#fbbf24,#d97706',
    label: '星标颜色',
    description: '星形图标的颜色。',
  },
  ...commonParams,
} as const satisfies WidgetParamDefinitions
