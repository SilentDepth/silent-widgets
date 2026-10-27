import { defineText } from './text'

export const siteMessages = {
  'site.language': defineText('界面语言', 'Site language'),
  'home.tagline': defineText(
    '给 Notion 页面添加日历、进度和计数。',
    'Calendars, progress bars, and counters for your Notion pages.',
  ),
  'home.callout': defineText(
    '选择小工具，调整参数，再把地址嵌入 Notion。',
    'Choose a widget, make it yours, and embed the link in Notion.',
  ),
  'home.widgets': defineText('小工具', 'Widgets'),
  'home.embed': defineText('放进 Notion', 'Add to Notion'),
  'home.step1.title': defineText('选择小工具', 'Choose a widget'),
  'home.step1.body': defineText(
    '从首页挑选需要的小工具。',
    'Choose the widget you need on the home page.',
  ),
  'home.step2.title': defineText('调整并复制', 'Customize and copy'),
  'home.step2.body': defineText(
    '预览效果，点击“复制地址”。',
    'Preview your changes, then select “Copy link”.',
  ),
  'home.step3.title': defineText('添加嵌入块', 'Create an embed'),
  'home.step3.body': defineText(
    '在 Notion 输入 {command}，粘贴地址。',
    'Type {command} in Notion and paste the link.',
  ),
  'home.notionHelp': defineText('查看 Notion 嵌入说明', 'Read the Notion embed guide'),
  'home.footer': defineText(
    '简单的小工具，放在你的页面里。',
    'Simple widgets, right on your page.',
  ),
  'config.title': defineText('{widget}配置', 'Configure {widget}'),
  'config.select': defineText('选择小工具', 'Choose a widget'),
  'config.preview': defineText('小工具预览', 'Widget preview'),
  'config.copy': defineText('复制地址', 'Copy link'),
  'config.copied': defineText('已复制', 'Copied'),
  'config.copyFailed': defineText('复制失败', 'Copy failed'),
  'config.manualCopy': defineText(
    '无法自动复制，请手动复制以下地址。',
    'Could not copy automatically. Copy the link below manually.',
  ),
  'config.fixErrors': defineText(
    '请先修正下方参数，再复制地址。',
    'Fix the highlighted fields before copying the link.',
  ),
  'config.parameters': defineText('小工具参数', 'Widget settings'),
  'field.lightPicker': defineText('{label}浅色色板', '{label}: light mode color picker'),
  'field.darkPicker': defineText('{label}深色色板', '{label}: dark mode color picker'),
  'field.darkValue': defineText('{label}深色值', '{label}: dark mode value'),
  'field.defaultColor': defineText('默认颜色', 'Default color'),
  'field.inheritColor': defineText('深色模式沿用浅色', 'Use light color in dark mode'),
} as const
