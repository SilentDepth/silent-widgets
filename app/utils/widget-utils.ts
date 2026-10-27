import { findWidget } from '@/widgets/registry'

export function resolveWidgetRoute(pathname: string) {
  const path = pathname === '/' ? '/' : pathname.replace(/\/$/, '')
  if (path === '/') return { kind: 'index' as const }
  const match = /^\/([^/]+)(\/config)?$/.exec(path)
  if (!match) return null
  const widget = findWidget(match[1])
  if (!widget) return null
  return { kind: match[2] ? ('config' as const) : ('widget' as const), widget }
}
